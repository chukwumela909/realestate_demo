import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "../../../lib/prisma";
import DeleteConversationButton from "./DeleteConversationButton";

export const dynamic = "force-dynamic";

export default async function ConversationDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await prisma.session.findUnique({
    where: { id },
    include: {
      messages: { orderBy: { createdAt: "asc" } },
      interests: {
        include: { property: true },
        orderBy: { count: "desc" },
      },
    },
  });

  if (!session) notFound();

  const label =
    session.name || session.email || session.phone || `Anonymous · ${session.id.slice(2, 8)}`;

  // Read welcomeEmailSentAt via raw query (field added in a recent migration).
  const emailRow = await prisma.$queryRaw<
    { welcomeEmailSentAt: Date | string | null }[]
  >`SELECT welcomeEmailSentAt FROM Session WHERE id = ${id} LIMIT 1`;
  const rawSentAt = emailRow[0]?.welcomeEmailSentAt ?? null;
  const welcomeSentAt = rawSentAt
    ? rawSentAt instanceof Date
      ? rawSentAt
      : new Date(rawSentAt)
    : null;

  return (
    <div className="grid grid-cols-12 min-h-screen">
      {/* Transcript column */}
      <div className="col-span-12 lg:col-span-8 border-r border-hairline">
        <div className="px-8 lg:px-12 py-10">
          <Link
            href="/dashboard"
            className="text-[11px] font-mono tracking-[0.2em] uppercase text-ink-muted hover:text-ink transition-colors"
          >
            ← Conversations
          </Link>

          <header className="mt-6 mb-10 flex items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {session.isLead && (
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-accent"
                    aria-label="Lead"
                  />
                )}
                <h1 className="font-serif text-[32px] lg:text-[40px] leading-tight text-ink">
                  {label}
                </h1>
              </div>
              <div className="text-[11px] font-mono tracking-[0.18em] uppercase text-ink-muted">
                Session {session.id.slice(0, 12)}…
              </div>
            </div>
            <div className="text-right text-[11px] font-mono tracking-[0.06em] text-ink-muted">
              <div>Started {session.createdAt.toLocaleString()}</div>
              <div>Updated {session.updatedAt.toLocaleString()}</div>
              <div className="mt-3">
                <DeleteConversationButton id={session.id} label={label} />
              </div>
            </div>
          </header>

          <div className="border-t border-hairline pt-8 flex flex-col gap-6">
            {session.messages.length === 0 && (
              <p className="font-serif italic text-ink-soft">No messages yet.</p>
            )}

            {session.messages.map((m) => {
              if (m.role === "user") {
                return (
                  <div key={m.id} className="self-start max-w-[75%]">
                    <div className="text-[10px] font-mono tracking-[0.18em] uppercase text-ink-muted mb-1">
                      Visitor · {m.createdAt.toLocaleTimeString()}
                    </div>
                    <div className="bg-canvas-deep px-3 py-2 text-[14px] text-ink whitespace-pre-wrap font-sans">
                      {m.content}
                    </div>
                  </div>
                );
              }
              if (m.role === "assistant" && !m.toolCallId) {
                return (
                  <div key={m.id} className="self-start max-w-[75%]">
                    <div className="text-[10px] font-mono tracking-[0.18em] uppercase text-ink-muted mb-1">
                      Sales agent · {m.createdAt.toLocaleTimeString()}
                    </div>
                    <p className="font-serif text-[15px] leading-[1.55] text-ink whitespace-pre-wrap">
                      {m.content}
                    </p>
                  </div>
                );
              }
              if (m.role === "assistant" && m.toolCallId) {
                // tool invocation by the assistant
                return (
                  <div key={m.id} className="self-start text-[11px] font-mono text-ink-muted">
                    → called <span className="text-ink">{m.toolName}</span>
                    {m.toolInput && m.toolInput !== "{}" && (
                      <span className="text-ink-soft"> {m.toolInput}</span>
                    )}
                  </div>
                );
              }
              if (m.role === "tool") {
                let preview = m.content;
                try {
                  const parsed = JSON.parse(m.content);
                  preview = JSON.stringify(parsed).slice(0, 140);
                } catch {
                  preview = m.content.slice(0, 140);
                }
                return (
                  <div key={m.id} className="self-start text-[11px] font-mono text-ink-muted ml-4">
                    ← <span className="text-ink">{m.toolName}</span>
                    <span className="text-ink-soft"> {preview}{preview.length >= 140 ? "…" : ""}</span>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      </div>

      {/* Sidebar — contact + interests */}
      <aside className="hidden lg:flex lg:col-span-4 flex-col bg-canvas-deep/30">
        <div className="px-8 py-10 border-b border-hairline">
          <div className="text-[11px] font-mono tracking-[0.2em] uppercase text-ink-muted mb-3">
            Contact
          </div>
          {session.name || session.email || session.phone ? (
            <dl className="flex flex-col gap-3 text-[14px]">
              {session.name && (
                <div>
                  <dt className="text-[11px] font-mono uppercase text-ink-muted">
                    Name
                  </dt>
                  <dd className="font-serif text-ink">{session.name}</dd>
                </div>
              )}
              {session.email && (
                <div>
                  <dt className="text-[11px] font-mono uppercase text-ink-muted">
                    Email
                  </dt>
                  <dd className="font-mono text-ink break-all">
                    {session.email}
                  </dd>
                </div>
              )}
              {session.phone && (
                <div>
                  <dt className="text-[11px] font-mono uppercase text-ink-muted">
                    Phone
                  </dt>
                  <dd className="font-mono text-ink">{session.phone}</dd>
                </div>
              )}
            </dl>
          ) : (
            <p className="font-serif italic text-[14px] text-ink-soft">
              No contact captured yet.
            </p>
          )}

          {welcomeSentAt && (
            <div className="mt-5 pt-4 border-t border-hairline flex items-center gap-2 text-[12px] font-mono tracking-[0.06em] text-ink-muted">
              <span className="text-accent">✓</span>
              <span>Welcome email sent</span>
              <span className="text-hairline-strong">·</span>
              <span>{welcomeSentAt.toLocaleString()}</span>
            </div>
          )}
        </div>

        <div className="px-8 py-10">
          <div className="text-[11px] font-mono tracking-[0.2em] uppercase text-ink-muted mb-3">
            Properties touched
          </div>
          {session.interests.length === 0 ? (
            <p className="font-serif italic text-[14px] text-ink-soft">
              None yet.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {session.interests.map((i) => (
                <li key={i.id} className="flex items-center justify-between gap-2 text-[14px]">
                  <span className="font-serif text-ink truncate">
                    {i.property.name}
                  </span>
                  <span className="text-[11px] font-mono text-ink-muted">
                    ×{i.count}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
}
