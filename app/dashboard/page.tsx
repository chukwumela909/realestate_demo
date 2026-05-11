import { prisma } from "../lib/prisma";
import ConversationsList, { ConversationRow } from "./ConversationsList";

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

  const rows: ConversationRow[] = sessions.map((s) => {
    const turns = s.messages.filter(
      (m) => m.role === "user" || m.role === "assistant",
    );
    const userTurnCount = turns.filter((m) => m.role === "user").length;
    const lastUserMsg = [...turns]
      .reverse()
      .find((m) => m.role === "user");
    const label =
      s.name || s.email || s.phone || `Anonymous · ${s.id.slice(2, 8)}`;

    return {
      id: s.id,
      label,
      isLead: s.isLead,
      lastUserMessage: lastUserMsg?.content ?? "-",
      topInterests: s.interests.slice(0, 3).map((i) => i.property.name),
      userTurnCount,
      updatedAtLabel: formatRelative(s.updatedAt),
    };
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

      <ConversationsList initial={rows} />
    </div>
  );
}
