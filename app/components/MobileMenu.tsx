"use client";

import { useEffect } from "react";

type Item = { label: string; number: string };

const ITEMS: Item[] = [
  { number: "01", label: "Pearl Residence" },
  { number: "02", label: "Plot options" },
  { number: "03", label: "FAQ" },
  { number: "04", label: "Services" },
  { number: "05", label: "Sales rep" },
];

export default function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <div
      className={`fixed inset-0 z-[70] md:hidden transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        open
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
      aria-hidden={!open}
    >
      <div className="absolute inset-0 bg-canvas" />

      <div className="relative h-full flex flex-col">
        <div className="flex items-center justify-between px-6 h-16 border-b border-hairline">
          <span className="font-serif text-[22px] tracking-[0.18em] text-ink">
            cloud9
          </span>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="text-[12px] font-mono tracking-[0.2em] uppercase text-ink py-3 px-1 -mr-1 hover:text-accent transition-colors"
          >
            Close
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-6 py-10">
          <ul className="flex flex-col gap-2">
            {ITEMS.map((item, i) => (
              <li
                key={item.label}
                className="border-b border-hairline last:border-b-0"
                style={{
                  opacity: open ? 1 : 0,
                  transform: open ? "translateY(0)" : "translateY(8px)",
                  transition: `opacity 600ms ${80 + i * 70}ms cubic-bezier(0.22,1,0.36,1), transform 600ms ${80 + i * 70}ms cubic-bezier(0.22,1,0.36,1)`,
                }}
              >
                <a
                  href="#"
                  onClick={onClose}
                  className="flex items-baseline justify-between gap-6 py-5 group"
                >
                  <span className="font-serif italic font-light text-[42px] leading-[1.05] text-ink group-hover:text-accent transition-colors duration-500">
                    {item.label}
                  </span>
                  <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-ink-muted">
                    No. {item.number}
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-14 pt-8 border-t border-hairline flex items-center justify-between text-[11px] font-mono tracking-[0.2em] uppercase">
            <span className="text-ink-muted">EN / NGN</span>
            <a
              href="#"
              onClick={onClose}
              className="text-ink hover:text-accent transition-colors"
            >
              Contact
            </a>
          </div>

          <p className="mt-10 font-serif italic text-[15px] leading-[1.6] text-ink-soft max-w-xs">
            Verified Cloud9 Pearl Residence Phase 2 plots in Gwagwalada,
            Abuja.
          </p>
        </nav>
      </div>
    </div>
  );
}
