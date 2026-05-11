import Link from "next/link";
import { prisma } from "../lib/prisma";
import ConversationsList, { ConversationRow } from "./ConversationsList";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 25;

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

function parsePage(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  const page = raw ? Number.parseInt(raw, 10) : 1;
  return Number.isFinite(page) && page > 0 ? page : 1;
}

function formatPercent(part: number, total: number) {
  if (total === 0) return "0%";
  return `${Math.round((part / total) * 100)}%`;
}

function pageHref(page: number) {
  return page <= 1 ? "/dashboard" : `/dashboard?page=${page}`;
}

export default async function ConversationsPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string | string[] }>;
}) {
  const params = await searchParams;
  const requestedPage = parsePage(params?.page);

  const [totalConversations, leadsCaptured, topInterest] = await Promise.all([
    prisma.session.count(),
    prisma.session.count({ where: { isLead: true } }),
    prisma.interest.groupBy({
      by: ["propertyId"],
      _sum: { count: true },
      orderBy: { _sum: { count: "desc" } },
      take: 1,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalConversations / PAGE_SIZE));
  const currentPage = Math.min(requestedPage, totalPages);

  const topPropertyId = topInterest[0]?.propertyId;
  const topProperty = topPropertyId
    ? await prisma.property.findUnique({ where: { id: topPropertyId } })
    : null;

  const sessions = await prisma.session.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      messages: { orderBy: { createdAt: "asc" } },
      interests: { include: { property: true }, orderBy: { count: "desc" } },
    },
    skip: (currentPage - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  const rows: ConversationRow[] = sessions.map((s) => {
    const turns = s.messages.filter(
      (m) => m.role === "user" || m.role === "assistant",
    );
    const userTurnCount = turns.filter((m) => m.role === "user").length;
    const lastUserMsg = [...turns].reverse().find((m) => m.role === "user");
    const label =
      s.name || s.email || s.phone || `Anonymous - ${s.id.slice(2, 8)}`;

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
            No. 01 - Desk
          </div>
          <h1 className="font-serif text-[44px] lg:text-[52px] leading-[1.05] text-ink">
            Conversations
          </h1>
        </div>
        <div className="text-[11px] font-mono tracking-[0.18em] uppercase text-ink-muted">
          {totalConversations} session
          {totalConversations === 1 ? "" : "s"}
        </div>
      </header>

      <MetricStrip
        totalConversations={totalConversations}
        leadsCaptured={leadsCaptured}
        leadRate={formatPercent(leadsCaptured, totalConversations)}
        topPropertyName={topProperty?.name ?? "None yet"}
        topPropertyCount={topInterest[0]?._sum.count ?? 0}
      />

      <ConversationsList
        key={`${currentPage}:${rows.map((row) => row.id).join(",")}`}
        initial={rows}
      />

      {totalConversations > 0 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          totalConversations={totalConversations}
        />
      )}
    </div>
  );
}

function MetricStrip({
  totalConversations,
  leadsCaptured,
  leadRate,
  topPropertyName,
  topPropertyCount,
}: {
  totalConversations: number;
  leadsCaptured: number;
  leadRate: string;
  topPropertyName: string;
  topPropertyCount: number;
}) {
  const metrics = [
    { label: "Conversations", value: totalConversations.toLocaleString() },
    { label: "Leads captured", value: leadsCaptured.toLocaleString() },
    { label: "Lead rate", value: leadRate },
    {
      label: "Top interest",
      value: topPropertyName,
      detail:
        topPropertyCount > 0
          ? `${topPropertyCount.toLocaleString()} touch${
              topPropertyCount === 1 ? "" : "es"
            }`
          : undefined,
    },
  ];

  return (
    <section className="mb-10 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 border-y border-hairline">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="py-5 sm:px-5 border-b sm:border-r sm:border-b-0 border-hairline last:border-b-0 sm:last:border-r-0"
        >
          <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-ink-muted">
            {metric.label}
          </div>
          <div className="mt-3 font-serif text-[26px] leading-tight text-ink truncate">
            {metric.value}
          </div>
          {metric.detail && (
            <div className="mt-1 text-[11px] font-mono tracking-[0.06em] text-ink-muted">
              {metric.detail}
            </div>
          )}
        </div>
      ))}
    </section>
  );
}

function PaginationControls({
  currentPage,
  totalPages,
  totalConversations,
}: {
  currentPage: number;
  totalPages: number;
  totalConversations: number;
}) {
  const firstItem = (currentPage - 1) * PAGE_SIZE + 1;
  const lastItem = Math.min(currentPage * PAGE_SIZE, totalConversations);
  const prevPage = currentPage - 1;
  const nextPage = currentPage + 1;
  const prevDisabled = currentPage <= 1;
  const nextDisabled = currentPage >= totalPages;

  return (
    <nav
      className="mt-8 flex flex-col gap-4 border-t border-hairline pt-5 sm:flex-row sm:items-center sm:justify-between"
      aria-label="Conversation pagination"
    >
      <div className="text-[11px] font-mono tracking-[0.12em] uppercase text-ink-muted">
        Showing {firstItem}-{lastItem} of {totalConversations} - Page{" "}
        {currentPage} of {totalPages}
      </div>

      <div className="flex items-center gap-3 text-[11px] font-mono tracking-[0.18em] uppercase">
        {prevDisabled ? (
          <span className="border border-hairline px-4 py-2 text-ink-muted opacity-40">
            Previous
          </span>
        ) : (
          <Link
            href={pageHref(prevPage)}
            className="border border-hairline px-4 py-2 text-ink-muted hover:border-ink hover:text-ink transition-colors"
          >
            Previous
          </Link>
        )}

        {nextDisabled ? (
          <span className="border border-hairline px-4 py-2 text-ink-muted opacity-40">
            Next
          </span>
        ) : (
          <Link
            href={pageHref(nextPage)}
            className="border border-hairline px-4 py-2 text-ink-muted hover:border-ink hover:text-ink transition-colors"
          >
            Next
          </Link>
        )}
      </div>
    </nav>
  );
}
