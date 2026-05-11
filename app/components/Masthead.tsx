import { ALL_PROPERTIES } from "../lib/properties";

export default function Masthead() {
  const count = ALL_PROPERTIES.length.toString().padStart(3, "0");
  return (
    <div className="border-b border-hairline">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-12 py-3 flex items-center justify-between text-[11px] font-mono tracking-[0.18em] text-ink-muted uppercase">
        <div className="flex items-center gap-3 sm:gap-6">
          <span>Pearl Residence</span>
          <span className="text-hairline-strong">/</span>
          <span>Phase 2</span>
          <span className="hidden sm:inline text-hairline-strong">/</span>
          <span className="hidden sm:inline">Gwagwalada</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline">No.</span>
          <span className="text-ink">{count}</span>
          <span>plot options</span>
        </div>
      </div>
    </div>
  );
}
