"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { INDEX, MOODS, type Mood } from "../lib/properties";
import Reveal from "./Reveal";

export default function MoodIndex() {
  const [active, setActive] = useState<Mood | null>(null);
  const filtered = useMemo(() => {
    if (!active) return INDEX;
    return INDEX.filter((p) => p.moods.includes(active));
  }, [active]);

  return (
    <section className="border-t border-hairline bg-canvas-deep/40">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-12 py-16 sm:py-20 lg:py-28">
        <div className="grid grid-cols-12 gap-6 mb-10 sm:mb-12 lg:mb-16">
          <Reveal className="col-span-12 lg:col-span-6">
            <div className="text-[11px] font-mono tracking-[0.2em] uppercase text-ink-muted mb-3">
              N° 02 — The Index
            </div>
            <h2 className="font-serif text-[36px] sm:text-[42px] lg:text-[56px] leading-[1.05] text-ink">
              Browse by <span className="italic font-light">region</span>
            </h2>
          </Reveal>
          <Reveal
            delay={140}
            className="col-span-12 lg:col-span-5 lg:col-start-8 self-end"
          >
            <p className="font-serif italic text-[16px] sm:text-[18px] leading-[1.5] text-ink-soft">
              Start with central and northern growth corridors, then compare
              western and southern parcels with room for flexible plans.
            </p>
          </Reveal>
        </div>

        <Reveal delay={120}>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-3 mb-10 sm:mb-12 pb-6 border-b border-hairline">
            <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-ink-muted mr-2 sm:mr-3 w-full sm:w-auto mb-1 sm:mb-0">
              Filter ·
            </span>
            <MoodChip
              label="all"
              active={active === null}
              onClick={() => setActive(null)}
            />
            {MOODS.map((m) => (
              <MoodChip
                key={m.id}
                label={m.label}
                active={active === m.id}
                onClick={() => setActive(m.id)}
              />
            ))}
          </div>
        </Reveal>

        {filtered.length === 0 ? (
          <div className="py-24 text-center font-serif italic text-ink-soft animate-fade-in">
            Nothing in the index matches that filter yet. Try another, or ask
            the sales agent.
          </div>
        ) : (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14"
          >
            {filtered.map((p, i) => (
              <article
                key={p.id}
                className="group flex flex-col gap-4 animate-fade-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-canvas-deep">
                  <div className="card-image absolute inset-0">
                    <Image
                      src={p.photo}
                      alt={p.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="font-serif text-[22px] leading-[1.15] text-ink flex items-center gap-2">
                    <span>{p.name}</span>
                    <span
                      aria-hidden
                      className="arrow-in text-ink-soft text-[15px]"
                    >
                      →
                    </span>
                  </h3>
                  <p className="caption-dim font-serif italic text-ink-soft text-[15px] leading-[1.5]">
                    {p.caption}
                  </p>
                  <div className="mt-2 flex items-center gap-3 text-[12px] font-mono tracking-[0.08em] text-ink">
                    <span>{p.price}</span>
                    <span className="h-3 w-px bg-hairline-strong" />
                    <span className="text-ink-soft">{p.location}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function MoodChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative px-4 py-2.5 min-h-[40px] text-[14px] sm:text-[13px] font-serif italic transition-colors duration-300
        ${
          active
            ? "text-canvas bg-ink"
            : "text-ink-soft hover:text-ink"
        }`}
    >
      {label}
    </button>
  );
}
