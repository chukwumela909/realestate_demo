"use client";

import { useState } from "react";

export type InspectionDateOption = {
  value: string;
  label: string;
  window: string;
};

export default function InspectionDatePicker({
  dates,
  disabled,
  onSelect,
}: {
  dates: InspectionDateOption[];
  disabled: boolean;
  onSelect: (date: InspectionDateOption) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  if (selected) {
    const date = dates.find((d) => d.value === selected);
    return (
      <div className="my-2 flex items-center gap-2 text-[12px] font-mono tracking-[0.06em] text-ink-muted animate-fade-in">
        <span className="text-accent">OK</span>
        <span>{date ? `${date.label} selected` : "Inspection date selected"}</span>
      </div>
    );
  }

  return (
    <div className="my-3 border border-hairline bg-canvas animate-fade-up">
      <div className="border-b border-hairline px-3 py-2 text-[10px] font-mono tracking-[0.2em] uppercase text-ink-muted">
        Available inspection dates
      </div>
      <div className="flex flex-col">
        {dates.map((date) => (
          <button
            key={date.value}
            type="button"
            disabled={disabled}
            onClick={() => {
              setSelected(date.value);
              onSelect(date);
            }}
            className="flex items-center justify-between gap-4 border-b border-hairline last:border-b-0 px-3 py-3 text-left hover:bg-canvas-deep/50 disabled:opacity-50 transition-colors duration-300"
          >
            <span className="font-serif italic text-[16px] leading-tight text-ink">
              {date.label}
            </span>
            <span className="text-[10px] font-mono tracking-[0.12em] uppercase text-ink-muted">
              {date.window}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
