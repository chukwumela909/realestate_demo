"use client";

import { useEffect, useState } from "react";
import type { PropertyDetail } from "./PropertyCardInline";

type Props = {
  data: PropertyDetail;
  originRect: DOMRect | null;
  onClose: () => void;
  onAsk?: (prompt: string) => void;
};

export default function PropertyModal({ data, originRect, onClose, onAsk }: Props) {
  const [imgIdx, setImgIdx] = useState(0);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    // trigger CSS transition on mount
    const id = requestAnimationFrame(() => setAnimateIn(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight")
        setImgIdx((i) => (i + 1) % data.images.length);
      if (e.key === "ArrowLeft")
        setImgIdx((i) => (i - 1 + data.images.length) % data.images.length);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [data.images.length, onClose]);

  const images = data.images.length > 0 ? data.images : [];
  const current = images[imgIdx];

  // compute origin transform from card rect for scale-from-origin
  const startTransform = (() => {
    if (!originRect || typeof window === "undefined") return undefined;
    const targetW = Math.min(window.innerWidth * 0.78, 1100);
    const targetH = Math.min(window.innerHeight * 0.82, 760);
    const targetCx = window.innerWidth / 2;
    const targetCy = window.innerHeight / 2;
    const originCx = originRect.left + originRect.width / 2;
    const originCy = originRect.top + originRect.height / 2;
    const scale = Math.max(originRect.width / targetW, originRect.height / targetH, 0.05);
    const tx = originCx - targetCx;
    const ty = originCy - targetCy;
    return `translate(${tx}px, ${ty}px) scale(${scale})`;
  })();

  const statusLabel =
    data.status === "available"
      ? null
      : data.status === "under_offer"
        ? "Under offer"
        : data.status === "reserved"
          ? "Reserved"
          : "Sold";

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-8"
      role="dialog"
      aria-label={data.name}
      aria-modal="true"
    >
      {/* backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-ink/85 backdrop-blur-sm transition-opacity duration-500 ${
          animateIn ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* dialog — bottom-sheet on mobile, centered modal on desktop */}
      <div
        className="relative w-full max-w-[1100px] h-[92vh] sm:h-auto sm:max-h-[88vh] bg-canvas overflow-hidden flex flex-col rounded-t-2xl sm:rounded-none"
        style={{
          transform: animateIn
            ? "translate(0,0) scale(1)"
            : typeof window !== "undefined" && window.innerWidth < 640
              ? "translateY(100%)"
              : startTransform,
          opacity: animateIn ? 1 : 0.6,
          transition:
            "transform 600ms cubic-bezier(0.22, 1, 0.36, 1), opacity 360ms cubic-bezier(0.22, 1, 0.36, 1)",
          transformOrigin: "center center",
        }}
      >
        {/* drag handle (mobile only) */}
        <div className="sm:hidden absolute top-2 left-1/2 -translate-x-1/2 z-10 h-1 w-10 bg-ink/20 rounded-full" />
        {/* close */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 h-11 w-11 flex items-center justify-center font-serif text-[28px] sm:text-[24px] text-ink hover:text-accent transition-colors"
        >
          ×
        </button>

        {/* image area */}
        <div className="relative flex-1 min-h-0 bg-ink/5 flex items-center justify-center">
          {current ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={current.url}
              alt={current.alt ?? data.name}
              className="w-full h-full object-cover animate-fade-in"
              key={imgIdx}
            />
          ) : null}

          {images.length > 1 && (
            <>
              <button
                onClick={() =>
                  setImgIdx((i) => (i - 1 + images.length) % images.length)
                }
                aria-label="Previous"
                className="absolute left-3 top-1/2 -translate-y-1/2 h-12 w-12 sm:h-10 sm:w-10 flex items-center justify-center bg-canvas/85 hover:bg-canvas font-serif text-[24px] sm:text-[22px] text-ink transition-colors"
              >
                ‹
              </button>
              <button
                onClick={() => setImgIdx((i) => (i + 1) % images.length)}
                aria-label="Next"
                className="absolute right-3 top-1/2 -translate-y-1/2 h-12 w-12 sm:h-10 sm:w-10 flex items-center justify-center bg-canvas/85 hover:bg-canvas font-serif text-[24px] sm:text-[22px] text-ink transition-colors"
              >
                ›
              </button>

              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIdx(i)}
                    aria-label={`Image ${i + 1}`}
                    className={`h-1 transition-all duration-300 ${
                      i === imgIdx
                        ? "w-6 bg-canvas"
                        : "w-3 bg-canvas/50 hover:bg-canvas/80"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* footer info */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6 px-5 sm:px-6 py-5 sm:py-5 pb-[max(env(safe-area-inset-bottom),20px)] sm:pb-5 border-t border-hairline">
          <div className="min-w-0">
            <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-ink-muted mb-1">
              N° {data.id}
            </div>
            <h3 className="font-serif text-[22px] sm:text-[28px] leading-tight text-ink">
              {data.name}
            </h3>
            <p className="font-serif italic text-[14px] sm:text-[15px] leading-snug text-ink-soft mt-1 max-w-xl">
              {data.caption}
            </p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-[12px] font-mono tracking-[0.08em] text-ink">
              <span>{data.price}</span>
              <span className="h-3 w-px bg-hairline-strong" />
              <span className="text-ink-soft">{data.location}</span>
              {statusLabel && (
                <>
                  <span className="h-3 w-px bg-hairline-strong" />
                  <span className="text-accent uppercase">{statusLabel}</span>
                </>
              )}
            </div>
          </div>

          {onAsk && (
            <button
              onClick={() => {
                onAsk(`Tell me more about ${data.name}.`);
                onClose();
              }}
              className="self-start sm:self-auto flex-shrink-0 text-[11px] font-mono tracking-[0.2em] uppercase text-ink border-b border-ink pb-1 hover:text-accent hover:border-accent transition-colors duration-300"
            >
              Ask about this →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
