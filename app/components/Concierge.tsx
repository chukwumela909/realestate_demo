"use client";

import { useEffect, useRef, useState } from "react";
import PropertyCardInline, { type PropertyDetail } from "./PropertyCardInline";
import PropertyModal from "./PropertyModal";

type Block =
  | { kind: "text"; text: string }
  | { kind: "card"; propertyId: string };

type Turn = {
  id: string;
  role: "concierge" | "you";
  blocks: Block[];
  thinkingTool?: string | null;
};

const SUGGESTED = [
  "Somewhere quiet, near water, under $5M",
  "A modernist with original details",
  "Walking distance to a good bookstore",
];

const RING_IDLE = 18;
const RING_NEAR = 7;
const PROXIMITY_RADIUS = 220;

export default function Concierge() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [modal, setModal] = useState<{
    data: PropertyDetail;
    rect: DOMRect | null;
  } | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const ringRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 200);
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [turns, streaming]);

  // cursor-aware ring
  useEffect(() => {
    const button = buttonRef.current;
    const ring = ringRef.current;
    if (!button || !ring) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let lastTs = 0;
    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastTs < 60) return;
      lastTs = now;
      const rect = button.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
      if (dist > PROXIMITY_RADIUS * 1.4) {
        ring.style.setProperty("--ring-duration", `${RING_IDLE}s`);
        return;
      }
      const t = Math.max(0, Math.min(1, 1 - dist / PROXIMITY_RADIUS));
      const dur = RING_IDLE - (RING_IDLE - RING_NEAR) * t;
      ring.style.setProperty("--ring-duration", `${dur.toFixed(2)}s`);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || streaming) return;

    const userId = "u_" + Date.now();
    const conciergeId = "c_" + Date.now();
    setInput("");
    setErrorMsg(null);

    setTurns((t) => [
      ...t,
      { id: userId, role: "you", blocks: [{ kind: "text", text: trimmed }] },
      { id: conciergeId, role: "concierge", blocks: [] },
    ]);
    setStreaming(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      if (!res.ok || !res.body) {
        const errText = await res.text().catch(() => "");
        throw new Error(errText || `HTTP ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";
        for (const block of events) {
          const line = block.trim();
          if (!line.startsWith("data:")) continue;
          const json = line.slice(5).trim();
          if (!json) continue;

          let evt: {
            type: string;
            text?: string;
            propertyId?: string;
            name?: string;
            message?: string;
          };
          try {
            evt = JSON.parse(json);
          } catch {
            continue;
          }

          if (evt.type === "delta" && evt.text) {
            const piece = evt.text;
            setTurns((prev) =>
              prev.map((t) => {
                if (t.id !== conciergeId) return t;
                const last = t.blocks[t.blocks.length - 1];
                if (last && last.kind === "text") {
                  return {
                    ...t,
                    blocks: [
                      ...t.blocks.slice(0, -1),
                      { kind: "text", text: last.text + piece },
                    ],
                    thinkingTool: null,
                  };
                }
                return {
                  ...t,
                  blocks: [...t.blocks, { kind: "text", text: piece }],
                  thinkingTool: null,
                };
              }),
            );
          } else if (evt.type === "card" && evt.propertyId) {
            const pid = evt.propertyId;
            setTurns((prev) =>
              prev.map((t) =>
                t.id === conciergeId
                  ? {
                      ...t,
                      blocks: [...t.blocks, { kind: "card", propertyId: pid }],
                      thinkingTool: null,
                    }
                  : t,
              ),
            );
          } else if (evt.type === "tool_call" && evt.name) {
            setTurns((prev) =>
              prev.map((t) =>
                t.id === conciergeId ? { ...t, thinkingTool: evt.name! } : t,
              ),
            );
          } else if (evt.type === "tool_done") {
            setTurns((prev) =>
              prev.map((t) =>
                t.id === conciergeId ? { ...t, thinkingTool: null } : t,
              ),
            );
          } else if (evt.type === "error" && evt.message) {
            setErrorMsg(evt.message);
          }
        }
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong.";
      setErrorMsg(msg);
    } finally {
      setStreaming(false);
    }
  }

  function openModal(data: PropertyDetail, rect: DOMRect | null) {
    setModal({ data, rect });
  }

  return (
    <>
      {/* Closed state */}
      <button
        ref={buttonRef}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close concierge" : "Open concierge"}
        className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 z-50 group"
      >
        <span className="sr-only">Concierge</span>
        <span
          className={`absolute right-full mr-4 top-1/2 -translate-y-1/2 whitespace-nowrap font-serif italic text-[15px] text-ink transition-opacity duration-500
            ${open ? "opacity-0" : "opacity-0 group-hover:opacity-100"}`}
        >
          Concierge
        </span>

        <span className="relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-ink text-canvas shadow-[0_8px_30px_-8px_rgba(0,0,0,0.4)] transition-transform duration-500 group-hover:scale-[1.04] group-active:scale-[0.96]">
          <span
            ref={ringRef}
            className="pointer-events-none absolute inset-[-6px] rounded-full border border-dashed border-ink/40 animate-spin-slow"
            aria-hidden
          />
          <span
            className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-accent animate-pulse-soft"
            aria-hidden
          />
          <span
            className={`font-serif text-[22px] leading-none transition-transform duration-500 ${
              open ? "rotate-90" : "rotate-0"
            }`}
          >
            {open ? "×" : "✦"}
          </span>
        </span>
      </button>

      {/* Open state */}
      {open && (
        <div
          className="fixed bottom-24 right-6 lg:bottom-28 lg:right-10 z-40 w-[calc(100vw-3rem)] sm:w-[420px] h-[min(640px,calc(100vh-9rem))] bg-canvas border border-hairline-strong shadow-[0_24px_60px_-20px_rgba(0,0,0,0.35)] flex flex-col animate-scale-in origin-bottom-right"
          role="dialog"
          aria-label="Concierge"
        >
          {/* header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-hairline">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-accent" aria-hidden />
              <span className="font-serif italic text-[16px] text-ink">
                Concierge
              </span>
            </div>
            <span className="text-[10px] font-mono tracking-[0.18em] uppercase text-ink-muted">
              MAISON
            </span>
          </div>

          {/* messages */}
          <div
            ref={scrollRef}
            className="no-scrollbar flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-5"
          >
            {turns.length === 0 ? (
              <>
                <p
                  className="font-serif italic text-[24px] leading-[1.25] text-ink animate-fade-up"
                  style={{ animationDelay: "120ms" }}
                >
                  What kind of life are you imagining?
                </p>
                <div className="mt-2 flex flex-col gap-2">
                  <div
                    className="text-[10px] font-mono tracking-[0.2em] uppercase text-ink-muted mb-1 animate-fade-up"
                    style={{ animationDelay: "240ms" }}
                  >
                    Try
                  </div>
                  {SUGGESTED.map((s, i) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      disabled={streaming}
                      className="text-left text-[14px] font-mono leading-relaxed text-ink-soft hover:text-ink hover:bg-canvas-deep/60 disabled:opacity-50 px-2 py-1.5 -mx-2 transition-colors duration-300 flex items-start gap-2 animate-fade-up"
                      style={{ animationDelay: `${320 + i * 80}ms` }}
                    >
                      <span className="text-accent mt-px">▸</span>
                      <span>{s}</span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              turns.map((t) =>
                t.role === "concierge" ? (
                  <div key={t.id} className="flex flex-col gap-2 animate-fade-up">
                    {t.blocks.length === 0 && t.thinkingTool && (
                      <ThinkingDots label={t.thinkingTool} />
                    )}
                    {t.blocks.map((b, i) =>
                      b.kind === "text" ? (
                        <p
                          key={i}
                          className="font-serif text-[16px] leading-[1.55] text-ink whitespace-pre-wrap"
                        >
                          {b.text}
                        </p>
                      ) : (
                        <PropertyCardInline
                          key={i}
                          propertyId={b.propertyId}
                          onOpen={openModal}
                        />
                      ),
                    )}
                    {t.blocks.length > 0 && t.thinkingTool && (
                      <ThinkingDots label={t.thinkingTool} />
                    )}
                  </div>
                ) : (
                  <div
                    key={t.id}
                    className="self-end max-w-[80%] animate-fade-up"
                  >
                    <div className="bg-ink text-canvas px-3 py-2 text-[14px] leading-snug whitespace-pre-wrap">
                      {t.blocks[0]?.kind === "text" ? t.blocks[0].text : ""}
                    </div>
                  </div>
                ),
              )
            )}

            {streaming && turns[turns.length - 1]?.blocks.length === 0 && (
              <ThinkingDots />
            )}

            {errorMsg && (
              <div className="text-[12px] font-mono text-accent border border-accent/40 px-3 py-2">
                {errorMsg}
              </div>
            )}
          </div>

          {/* input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="border-t border-hairline px-5 py-4 flex items-center gap-3"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={streaming}
              placeholder="Tell me what you're looking for…"
              className="flex-1 bg-transparent text-[14px] text-ink placeholder:text-ink-muted placeholder:italic placeholder:font-serif focus:outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || streaming}
              className="text-[12px] font-mono tracking-[0.18em] uppercase text-ink hover:text-accent disabled:text-ink-muted transition-colors duration-300"
            >
              Send →
            </button>
          </form>
        </div>
      )}

      {modal && (
        <PropertyModal
          data={modal.data}
          originRect={modal.rect}
          onClose={() => setModal(null)}
          onAsk={(prompt) => {
            setOpen(true);
            setTimeout(() => send(prompt), 100);
          }}
        />
      )}
    </>
  );
}

function ThinkingDots({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 text-ink-muted">
      <div className="flex items-center gap-1.5">
        <span
          className="h-1.5 w-1.5 rounded-full bg-ink-muted animate-pulse-soft"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="h-1.5 w-1.5 rounded-full bg-ink-muted animate-pulse-soft"
          style={{ animationDelay: "200ms" }}
        />
        <span
          className="h-1.5 w-1.5 rounded-full bg-ink-muted animate-pulse-soft"
          style={{ animationDelay: "400ms" }}
        />
      </div>
      {label && (
        <span className="text-[10px] font-mono tracking-[0.2em] uppercase">
          {label.replace(/_/g, " ")}
        </span>
      )}
    </div>
  );
}
