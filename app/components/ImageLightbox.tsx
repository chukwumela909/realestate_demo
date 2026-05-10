"use client";

import { useEffect, useState } from "react";

export default function ImageLightbox({
  url,
  alt,
  originRect,
  onClose,
}: {
  url: string;
  alt: string;
  originRect: DOMRect | null;
  onClose: () => void;
}) {
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setAnimateIn(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const startTransform = (() => {
    if (!originRect || typeof window === "undefined") return undefined;
    const targetW = Math.min(window.innerWidth * 0.86, 1200);
    const targetH = Math.min(window.innerHeight * 0.84, 800);
    const targetCx = window.innerWidth / 2;
    const targetCy = window.innerHeight / 2;
    const originCx = originRect.left + originRect.width / 2;
    const originCy = originRect.top + originRect.height / 2;
    const scale = Math.max(
      originRect.width / targetW,
      originRect.height / targetH,
      0.05,
    );
    const tx = originCx - targetCx;
    const ty = originCy - targetCy;
    return `translate(${tx}px, ${ty}px) scale(${scale})`;
  })();

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8"
      role="dialog"
      aria-label={alt || "Image"}
      aria-modal="true"
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-ink/90 backdrop-blur-sm transition-opacity duration-500 ${
          animateIn ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        className="relative max-w-[1200px] max-h-[88vh] w-full"
        style={{
          transform: animateIn ? "translate(0,0) scale(1)" : startTransform,
          opacity: animateIn ? 1 : 0.6,
          transition:
            "transform 600ms cubic-bezier(0.22, 1, 0.36, 1), opacity 360ms cubic-bezier(0.22, 1, 0.36, 1)",
          transformOrigin: "center center",
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 z-20 h-9 w-9 flex items-center justify-center bg-canvas/90 hover:bg-canvas font-serif text-[22px] text-ink transition-colors"
        >
          ×
        </button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt={alt}
          className="block w-full h-full max-h-[88vh] object-contain bg-ink/5"
        />
        {alt && (
          <div className="absolute left-3 bottom-3 px-3 py-1.5 bg-canvas/90 text-[11px] font-mono tracking-[0.06em] uppercase text-ink">
            {alt}
          </div>
        )}
      </div>
    </div>
  );
}
