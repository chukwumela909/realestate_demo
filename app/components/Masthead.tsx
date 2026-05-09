import { ALL_PROPERTIES } from "../lib/properties";

export default function Masthead() {
  const count = ALL_PROPERTIES.length.toString().padStart(3, "0");
  return (
    <div className="border-b border-hairline">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-12 py-3 flex items-center justify-between text-[11px] font-mono tracking-[0.18em] text-ink-muted uppercase">
        <div className="flex items-center gap-3 sm:gap-6">
          <span>VOL. 04</span>
          <span className="text-hairline-strong">·</span>
          <span>ISSUE 02</span>
          <span className="hidden sm:inline text-hairline-strong">·</span>
          <span className="hidden sm:inline">MAY 2026</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline">N°</span>
          <span className="text-ink">{count}</span>
          <span>residences</span>
        </div>
      </div>
    </div>
  );
}
