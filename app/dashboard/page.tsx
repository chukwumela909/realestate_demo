import Link from "next/link";
import { prisma } from "../lib/prisma";

export const dynamic = "force-dynamic";

function formatRelative(d: Date) {
  const now = Date.now();
  const diff = now - d.getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d ago`;
  return d.toLocaleDateString();
}

export default async function ConversationsPage() {
  const sessions = await prisma.session.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      messages: { orderBy: { createdAt: "asc" } },
      interests: { include: { property: true }, orderBy: { count: "desc" } },
    },
    take: 100,
  });

  return (
    <div className="px-8 lg:px-12 py-10 lg:py-14">
      <header className="mb-10 flex items-end justify-between">
        <div>
          <div className="text-[11px] font-mono tracking-[0.2em] uppercase text-ink-muted mb-2">
            N° 01 — Desk
          </div>
          <h1 className="font-serif text-[44px] lg:text-[52px] leading-[1.05] text-ink">
            Conversations
          </h1>
        </div>
        <div className="text-[11px] font-mono tracking-[0.18em] uppercase text-ink-muted">
          {sessions.length} session{sessions.length === 1 ? "" : "s"}
        </div>
      </header>

      {sessions.length === 0 ? (
        <div className="border border-hairline px-8 py-16 text-center">
          <p className="font-serif italic text-[20px] text-ink-soft">
            No conversations yet. The first visitor will appear here.
          </p>
        </div>
      ) : (
        <div className="border-t border-hairline">
          {sessions.map((s) => {
            const turns = s.messages.filter(
              (m) => m.role === "user" || m.role === "assistant",
            );
            const userTurnCount = turns.filter((m) => m.role === "user").length;
            const lastUserMsg = [...turns]
              .reverse()
              .find((m) => m.role === "user");
            const topInterests = s.interests.slice(0, 3);
            const label =
              s.name ||
              s.email ||
              s.phone ||
              `Anonymous · ${s.id.slice(2, 8)}`;

            return (
              <Link
                key={s.id}
                href={`/dashboard/conversations/${s.id}`}
                className="block border-b border-hairline py-5 px-2 -mx-2 hover:bg-canvas-deep/40 transition-colors group"
              >
                <div className="grid grid-cols-12 gap-4 items-baseline">
                  <div className="col-span-12 md:col-span-4 flex items-center gap-2 min-w-0">
                    {s.isLead && (
                      <span
                        className="inline-block h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0"
                        aria-label="Lead"
                      />
                    )}
                    <span className="font-serif text-[18px] text-ink truncate group-hover:text-accent transition-colors">
                      {label}
                    </span>
                  </div>

                  <div className="col-span-12 md:col-span-5 min-w-0">
                    <p className="font-serif italic text-[14px] text-ink-soft line-clamp-1">
                      {lastUserMsg?.content ?? "—"}
                    </p>
                    {topInterests.length > 0 && (
                      <div className="mt-1 flex items-center gap-2 text-[11px] font-mono text-ink-muted">
                        <span>Interested:</span>
                        <span className="text-ink truncate">
                          {topInterests.map((i) => i.property.name).join(", ")}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="col-span-6 md:col-span-2 text-[11px] font-mono tracking-[0.06em] text-ink-muted">
                    {userTurnCount} turn{userTurnCount === 1 ? "" : "s"}
                  </div>

                  <div className="col-span-6 md:col-span-1 text-right text-[11px] font-mono tracking-[0.06em] text-ink-muted">
                    {formatRelative(s.updatedAt)}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
