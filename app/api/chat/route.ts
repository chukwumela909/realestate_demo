import { NextRequest } from "next/server";
import type {
  ChatCompletionMessageParam,
  ChatCompletionMessageToolCall,
} from "openai/resources/chat/completions";

import { CHAT_MODEL, openai } from "../../lib/openai";
import { prisma } from "../../lib/prisma";
import { ensureSeeded } from "../../lib/seed";
import { getOrCreateSession } from "../../lib/session";
import { SYSTEM_PROMPT } from "../../lib/systemPrompt";
import { TOOLS, runTool } from "../../lib/tools";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_TOOL_ROUNDS = 5;

type SseEvent =
  | { type: "delta"; text: string }
  | { type: "card"; propertyId: string }
  | { type: "tool_call"; name: string }
  | { type: "tool_done"; name: string }
  | { type: "done" }
  | { type: "error"; message: string };

function sse(event: SseEvent) {
  return `data: ${JSON.stringify(event)}\n\n`;
}

export async function POST(req: NextRequest) {
  await ensureSeeded();

  const session = await getOrCreateSession();

  let body: { message?: string };
  try {
    body = await req.json();
  } catch {
    return new Response("Bad request", { status: 400 });
  }
  const userMessage = (body.message ?? "").trim();
  if (!userMessage) return new Response("Empty message", { status: 400 });

  if (!process.env.OPENAI_API_KEY) {
    return new Response("Missing OPENAI_API_KEY", { status: 500 });
  }

  // Persist the user message
  await prisma.message.create({
    data: { sessionId: session.id, role: "user", content: userMessage },
  });

  // Load full transcript and build OpenAI message history
  const stored = await prisma.message.findMany({
    where: { sessionId: session.id },
    orderBy: { createdAt: "asc" },
  });

  const history: ChatCompletionMessageParam[] = [
    { role: "system", content: SYSTEM_PROMPT },
  ];

  for (const m of stored) {
    if (m.role === "user") {
      history.push({ role: "user", content: m.content });
    } else if (m.role === "assistant") {
      // assistant messages may carry tool_calls we re-emit
      if (m.toolCallId && m.toolName) {
        history.push({
          role: "assistant",
          content: m.content || "",
          tool_calls: [
            {
              id: m.toolCallId,
              type: "function",
              function: {
                name: m.toolName,
                arguments: m.toolInput || "{}",
              },
            },
          ],
        });
      } else {
        history.push({ role: "assistant", content: m.content });
      }
    } else if (m.role === "tool") {
      history.push({
        role: "tool",
        tool_call_id: m.toolCallId ?? "",
        content: m.content,
      });
    }
  }

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const encoder = new TextEncoder();
      const send = (e: SseEvent) => controller.enqueue(encoder.encode(sse(e)));

      try {
        let round = 0;
        while (round < MAX_TOOL_ROUNDS) {
          round++;

          const completion = await openai.chat.completions.create({
            model: CHAT_MODEL,
            messages: history,
            tools: TOOLS,
            stream: true,
            temperature: 0.7,
          });

          let assistantText = "";
          const toolCallAccum: Record<
            number,
            {
              id: string;
              name: string;
              args: string;
            }
          > = {};

          for await (const chunk of completion) {
            const delta = chunk.choices[0]?.delta;
            if (!delta) continue;

            if (delta.content) {
              assistantText += delta.content;
              send({ type: "delta", text: delta.content });
            }

            if (delta.tool_calls) {
              for (const tc of delta.tool_calls) {
                const idx = tc.index;
                if (!toolCallAccum[idx]) {
                  toolCallAccum[idx] = { id: "", name: "", args: "" };
                }
                if (tc.id) toolCallAccum[idx].id = tc.id;
                if (tc.function?.name)
                  toolCallAccum[idx].name = tc.function.name;
                if (tc.function?.arguments)
                  toolCallAccum[idx].args += tc.function.arguments;
              }
            }
          }

          const toolCalls = Object.values(toolCallAccum).filter((t) => t.name);

          // Persist + emit assistant turn
          if (assistantText && toolCalls.length === 0) {
            await prisma.message.create({
              data: {
                sessionId: session.id,
                role: "assistant",
                content: assistantText,
              },
            });
            send({ type: "done" });
            controller.close();
            return;
          }

          if (toolCalls.length === 0) {
            // no text and no tool calls — defensive end
            send({ type: "done" });
            controller.close();
            return;
          }

          // Persist assistant message that holds the tool_calls.
          // OpenAI requires tool_calls be returned as a single assistant message
          // with possibly multiple tool_calls — we serialize each call as its own
          // assistant row for simplicity (re-emit needs only the first per turn).
          // Build the tool_calls array for the next OpenAI call:
          const openaiToolCalls: ChatCompletionMessageToolCall[] =
            toolCalls.map((t) => ({
              id: t.id,
              type: "function",
              function: { name: t.name, arguments: t.args || "{}" },
            }));

          history.push({
            role: "assistant",
            content: assistantText || "",
            tool_calls: openaiToolCalls,
          });

          // Persist the assistant message + a row per tool call
          await prisma.message.create({
            data: {
              sessionId: session.id,
              role: "assistant",
              content: assistantText || "",
              toolName: toolCalls[0].name,
              toolCallId: toolCalls[0].id,
              toolInput: toolCalls[0].args || "{}",
            },
          });

          // Execute each tool, persist + emit signals + push result back to history
          for (const tc of toolCalls) {
            send({ type: "tool_call", name: tc.name });

            let parsedArgs: Record<string, unknown> = {};
            try {
              parsedArgs = tc.args ? JSON.parse(tc.args) : {};
            } catch {
              parsedArgs = {};
            }

            const { result, uiCard } = await runTool(
              tc.name,
              parsedArgs,
              session.id,
            );

            const resultText = JSON.stringify(result);

            await prisma.message.create({
              data: {
                sessionId: session.id,
                role: "tool",
                content: resultText,
                toolName: tc.name,
                toolCallId: tc.id,
                toolInput: tc.args || "{}",
              },
            });

            history.push({
              role: "tool",
              tool_call_id: tc.id,
              content: resultText,
            });

            if (uiCard) send({ type: "card", propertyId: uiCard.propertyId });
            send({ type: "tool_done", name: tc.name });
          }

          // loop: model gets tool results, may write prose or call more tools
        }

        // Hit max rounds
        send({
          type: "error",
          message: "I lost the thread. Try asking again.",
        });
        controller.close();
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Unexpected error";
        console.error("[chat] error:", message);
        send({ type: "error", message });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
