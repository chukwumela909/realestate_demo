"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export type ConversationRow = {
  id: string;
  label: string;
  isLead: boolean;
  lastUserMessage: string;
  topInterests: string[];
  userTurnCount: number;
  updatedAtLabel: string;
};

export default function ConversationsList({
  initial,
}: {
  initial: ConversationRow[];
}) {
  const router = useRouter();
  const [rows, setRows] = useState(initial);
  const [busy, setBusy] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  async function remove(id: string) {
    setBusy(id);
    const prev = rows;
    setRows((r) => r.filter((row) => row.id !== id));

    try {
      const res = await fetch(`/api/conversations/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("delete failed");
      router.refresh();
    } catch {
      setRows(prev);
    } finally {
      setBusy(null);
      setConfirmId(null);
    }
  }

  if (rows.length === 0) {
    return (
      <div className="border border-hairline px-8 py-16 text-center">
        <p className="font-serif italic text-[20px] text-ink-soft">
          No conversations yet. The first visitor will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="border-t border-hairline">
      {rows.map((row) => (
        <div
          key={row.id}
          className="grid grid-cols-12 gap-4 border-b border-hairline py-5 px-2 -mx-2 hover:bg-canvas-deep/40 transition-colors group"
        >
          <Link
            href={`/dashboard/conversations/${row.id}`}
            className="col-span-12 md:col-span-10 grid grid-cols-12 gap-4 items-baseline min-w-0"
          >
            <div className="col-span-12 md:col-span-5 flex items-center gap-2 min-w-0">
              {row.isLead && (
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0"
                  aria-label="Lead"
                />
              )}
              <span className="font-serif text-[18px] text-ink truncate group-hover:text-accent transition-colors">
                {row.label}
              </span>
            </div>

            <div className="col-span-12 md:col-span-6 min-w-0">
              <p className="font-serif italic text-[14px] text-ink-soft line-clamp-1">
                {row.lastUserMessage}
              </p>
              {row.topInterests.length > 0 && (
                <div className="mt-1 flex items-center gap-2 text-[11px] font-mono text-ink-muted">
                  <span>Interested:</span>
                  <span className="text-ink truncate">
                    {row.topInterests.join(", ")}
                  </span>
                </div>
              )}
            </div>

            <div className="col-span-12 md:col-span-1 text-left md:text-right text-[11px] font-mono tracking-[0.06em] text-ink-muted">
              {row.updatedAtLabel}
            </div>
          </Link>

          <div className="col-span-12 md:col-span-2 flex items-center justify-between md:justify-end gap-4">
            <span className="text-[11px] font-mono tracking-[0.06em] text-ink-muted">
              {row.userTurnCount} turn{row.userTurnCount === 1 ? "" : "s"}
            </span>

            {confirmId === row.id ? (
              <div className="flex items-center justify-end gap-2 text-[10px] font-mono tracking-[0.18em] uppercase">
                <button
                  type="button"
                  onClick={() => remove(row.id)}
                  disabled={busy === row.id}
                  className="text-accent hover:underline disabled:opacity-50"
                >
                  Confirm
                </button>
                <span className="text-ink-muted">/</span>
                <button
                  type="button"
                  onClick={() => setConfirmId(null)}
                  className="text-ink-muted hover:text-ink"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmId(row.id)}
                disabled={busy === row.id}
                aria-label={`Delete conversation ${row.label}`}
                title="Delete conversation"
                className="text-[14px] leading-none font-mono text-ink-muted hover:text-accent transition-colors disabled:opacity-50"
              >
                x
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
