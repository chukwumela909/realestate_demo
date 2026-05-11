"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

const HERO_PHOTO =
  "https://commons.wikimedia.org/wiki/Special:FilePath/Landscape%20view%20of%20abuja.jpg?width=1800";

const LINES = [
  { word: "Land", italic: false, indent: "" },
  { word: "for", italic: false, indent: "" },
  { word: "mixed-use", italic: false, indent: "" },
  { word: "growth.", italic: true, indent: "md:pl-[44%] lg:pl-[58%]" },
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
      <div className="mx-auto max-w-[1320px] px-6 lg:px-12 pt-10 sm:pt-12 lg:pt-16 pb-12 sm:pb-16 lg:pb-24">
        <div className="md:relative md:min-h-[72vh] lg:min-h-[78vh]">
          <h1
            aria-label={fullHeadline}
            className="relative z-10 font-serif tracking-[-0.025em] leading-[0.92] md:leading-[0.88] text-[56px] sm:text-[88px] md:text-[104px] lg:text-[132px] xl:text-[148px] text-ink md:mix-blend-difference md:text-white pointer-events-none"
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

          <div className="relative md:absolute md:top-0 md:bottom-0 md:right-0 md:w-[58%] lg:w-[56%] aspect-[4/5] md:aspect-auto mt-8 md:mt-0 -mx-6 md:mx-0 overflow-hidden bg-canvas-deep">
            <div
              ref={photoRef}
              className="absolute inset-0 will-change-transform"
              style={{ transform: "translate3d(0,0,0) scale(1.05)" }}
            >
              <Image
                src={HERO_PHOTO}
                alt="Abuja landscape"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 60vw, 56vw"
                className="object-cover animate-fade-in"
                priority
              />
            </div>
            <span className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5 z-[2] flex items-center justify-between text-[10px] font-mono tracking-[0.2em] uppercase text-canvas">
              <span>Cover - No. 009</span>
              <span>Abuja FCT</span>
            </span>
          </div>

          <div
            className="relative md:absolute md:left-0 md:bottom-0 z-10 max-w-sm flex flex-col gap-4 mt-8 md:mt-0 animate-fade-up"
            style={{ animationDelay: `${140 + LINES.length * 110 + 80}ms` }}
          >
            <div className="h-px w-10 bg-ink" />
            <p className="font-serif italic text-ink-soft text-[16px] sm:text-[17px] lg:text-[18px] leading-[1.5]">
              Friendly access to mixed-use land in central and northern
              Nigeria, plus select parcels across the west and south.
            </p>
          </div>
        </div>

        <div
          className="mt-10 lg:mt-14 flex items-center justify-between border-t border-hairline pt-5 sm:pt-6 animate-fade-up"
          style={{ animationDelay: "820ms" }}
        >
          <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.2em] uppercase text-ink-muted">
            Scroll
          </span>
          <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.2em] uppercase text-ink-muted">
            Available land
          </span>
        </div>
      </div>
    </section>
  );
}
