"use client";

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
  const [rows, setRows] = useState(initial);
  const [busy, setBusy] = useState<string | null>(null);

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
      setRows(prev); // rollback
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="border-t border-hairline">
      <div className="hidden md:grid grid-cols-12 gap-4 py-3 text-[10px] font-mono tracking-[0.2em] uppercase text-ink-muted border-b border-hairline">
        <div className="col-span-5">Residence</div>
        <div className="col-span-2">Price</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-2">Moods</div>
        <div className="col-span-1 text-right">Interest</div>
      </div>

      {rows.map((row) => (
        <div
          key={row.id}
          className="grid grid-cols-12 gap-4 py-4 border-b border-hairline items-center"
        >
          <div className="col-span-12 md:col-span-5 flex items-center gap-4 min-w-0">
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
              <div className="font-serif text-[18px] text-ink truncate">
                {row.name}
              </div>
              <div className="text-[11px] font-mono text-ink-muted truncate">
                {row.location}
              </div>
            </div>
          </div>

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

          <div className="col-span-12 md:col-span-2 text-[11px] font-mono text-ink-muted">
            {row.moods.join(" · ")}
          </div>

          <div className="col-span-12 md:col-span-1 text-[12px] font-mono text-ink text-left md:text-right">
            ×{row.interestCount}
          </div>
        </div>
      ))}
    </div>
  );
}
