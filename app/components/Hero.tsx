"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

const HERO_PHOTO =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=85";

const LINES = [
  { word: "Homes", italic: false, indent: "" },
  { word: "worth", italic: false, indent: "" },
  { word: "staying", italic: false, indent: "" },
  { word: "in.", italic: true, indent: "pl-[34%] sm:pl-[44%] lg:pl-[58%]" },
];

export default function Hero() {
  const photoRef = useRef<HTMLDivElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const photo = photoRef.current;
    const wrap = wrapRef.current;
    if (!photo || !wrap) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) return;

    let raf = 0;
    let pending = false;

    const update = () => {
      pending = false;
      const rect = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = Math.max(
        0,
        Math.min(1, (vh * 0.9 - rect.top) / (vh + rect.height)),
      );
      const drift = -progress * 28;
      photo.style.transform = `translate3d(0, ${drift}px, 0) scale(1.05)`;
    };

    const onScroll = () => {
      if (pending) return;
      pending = true;
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const fullHeadline = LINES.map((l) => l.word).join(" ");

  return (
    <section ref={wrapRef} className="relative">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-12 pt-12 lg:pt-16 pb-16 lg:pb-24">
        {/* Two-zone overlap area */}
        <div className="relative min-h-[72vh] lg:min-h-[78vh]">
          {/* Photo — absolute, right 58% */}
          <div className="absolute top-0 bottom-0 right-0 w-[62%] sm:w-[58%] lg:w-[56%] overflow-hidden bg-canvas-deep">
            <div
              ref={photoRef}
              className="absolute inset-0 will-change-transform"
              style={{ transform: "translate3d(0,0,0) scale(1.05)" }}
            >
              <Image
                src={HERO_PHOTO}
                alt="A residence in repose"
                fill
                sizes="(max-width: 1024px) 60vw, 56vw"
                className="object-cover animate-fade-in"
                priority
              />
            </div>
            <span className="absolute bottom-5 left-5 right-5 z-[2] flex items-center justify-between text-[10px] font-mono tracking-[0.2em] uppercase text-canvas">
              <span>Cover · N° 047</span>
              <span>Sonoma, CA</span>
            </span>
          </div>

          {/* Headline — full container width, mix-blend-difference */}
          <h1
            aria-label={fullHeadline}
            className="relative z-10 font-serif tracking-[-0.025em] leading-[0.88] text-[68px] sm:text-[104px] lg:text-[132px] xl:text-[148px] mix-blend-difference text-white pointer-events-none"
          >
            {LINES.map((l, i) => (
              <span
                key={i}
                aria-hidden
                className={`block animate-fade-up ${l.indent} ${
                  l.italic ? "italic font-light" : "font-normal"
                }`}
                style={{
                  animationDelay: `${140 + i * 110}ms`,
                }}
              >
                {l.word}
              </span>
            ))}
          </h1>

          {/* Kicker — bottom-left, in left zone only */}
          <div
            className="absolute left-0 bottom-0 z-10 max-w-sm flex flex-col gap-4 animate-fade-up"
            style={{ animationDelay: `${140 + LINES.length * 110 + 80}ms` }}
          >
            <div className="h-px w-10 bg-ink" />
            <p className="font-serif italic text-ink-soft text-[17px] lg:text-[18px] leading-[1.5]">
              A curated index of architecturally significant residences,
              refreshed monthly.
            </p>
          </div>
        </div>

        {/* Scroll cue — below the overlap area */}
        <div
          className="mt-10 lg:mt-14 flex items-center justify-between border-t border-hairline pt-6 animate-fade-up"
          style={{ animationDelay: "820ms" }}
        >
          <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-ink-muted">
            Scroll
          </span>
          <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-ink-muted">
            ↓ This issue
          </span>
        </div>
      </div>
    </section>
  );
}
