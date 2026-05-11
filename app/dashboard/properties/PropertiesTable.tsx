"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export type Row = {
  id: string;
  name: string;
  location: string;
  price: string;
  status: string;
  photo: string | null;
  interestCount: number;
  moods: string[];
};

const STATUS_OPTIONS = [
  { value: "available", label: "Available" },
  { value: "under_offer", label: "Under offer" },
  { value: "reserved", label: "Reserved" },
  { value: "sold", label: "Sold" },
];

export default function PropertiesTable({ initial }: { initial: Row[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(initial);
  const [busy, setBusy] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  async function setStatus(id: string, status: string) {
    setBusy(id);
    const prev = rows;
    setRows((r) =>
      r.map((row) => (row.id === id ? { ...row, status } : row)),
    );
    try {
      const res = await fetch(`/api/properties/${id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("update failed");
    } catch {
      setRows(prev);
    } finally {
      setBusy(null);
    }
  }

  async function remove(id: string) {
    setBusy(id);
    const prev = rows;
    setRows((r) => r.filter((row) => row.id !== id));
    try {
      const res = await fetch(`/api/properties/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("delete failed");
      router.refresh();
    } catch {
      setRows(prev);
    } finally {
      setBusy(null);
      setConfirmId(null);
    }
  }

  return (
    <div className="border-t border-hairline">
      <div className="hidden md:grid grid-cols-12 gap-4 py-3 text-[10px] font-mono tracking-[0.2em] uppercase text-ink-muted border-b border-hairline">
        <div className="col-span-3">Plot option</div>
        <div className="col-span-2">Price</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-2">Tags</div>
        <div className="col-span-1 text-right">Interest</div>
        <div className="col-span-2 text-right">Actions</div>
      </div>

      {rows.length === 0 && (
        <div className="py-16 text-center font-serif italic text-ink-soft">
          The index is empty. Add a plot option to start.
        </div>
      )}

      {rows.map((row) => (
        <div
          key={row.id}
          className="grid grid-cols-12 gap-4 py-4 border-b border-hairline items-center"
        >
          <Link
            href={`/dashboard/properties/${row.id}/edit`}
            className="col-span-12 md:col-span-3 flex items-center gap-4 min-w-0 group"
          >
            <div className="w-14 h-14 flex-shrink-0 bg-canvas-deep overflow-hidden">
              {row.photo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={row.photo}
                  alt={row.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="min-w-0">
              <div className="font-serif text-[18px] text-ink truncate group-hover:text-accent transition-colors">
                {row.name}
              </div>
              <div className="text-[11px] font-mono text-ink-muted truncate">
                {row.location}
              </div>
            </div>
          </Link>

          <div className="col-span-6 md:col-span-2 text-[13px] font-mono text-ink">
            {row.price}
          </div>

          <div className="col-span-6 md:col-span-2">
            <select
              value={row.status}
              onChange={(e) => setStatus(row.id, e.target.value)}
              disabled={busy === row.id}
              className={`text-[12px] font-mono tracking-[0.06em] uppercase bg-canvas border border-hairline px-2 py-1.5 outline-none focus:border-ink transition-colors ${
                row.status === "available"
                  ? "text-ink"
                  : row.status === "sold"
                    ? "text-accent"
                    : "text-ink-soft"
              } ${busy === row.id ? "opacity-50" : ""}`}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-12 md:col-span-2 min-w-0 break-words text-[11px] font-mono text-ink-muted">
            {row.moods.join(" · ")}
          </div>

          <div className="col-span-6 md:col-span-1 text-[12px] font-mono text-ink text-left md:text-right">
            ×{row.interestCount}
          </div>

          <div className="col-span-6 md:col-span-2 min-w-0 text-right">
            {confirmId === row.id ? (
              <div className="flex flex-wrap items-center justify-end gap-x-2 gap-y-1 text-[10px] font-mono tracking-[0.12em] uppercase">
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
              <div className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1 text-[10px] font-mono tracking-[0.12em] uppercase">
                <Link
                  href={`/dashboard/properties/${row.id}/edit`}
                  className="text-ink hover:text-accent transition-colors"
                >
                  Edit
                </Link>
                <span className="text-ink-muted">·</span>
                <button
                  type="button"
                  onClick={() => setConfirmId(row.id)}
                  className="text-ink-muted hover:text-accent transition-colors"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
