import Image from "next/image";
import { AGENTS } from "../lib/properties";
import Reveal from "./Reveal";

export default function Agents() {
  return (
    <section className="border-t border-hairline bg-canvas-deep/40">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-12 py-16 sm:py-20 lg:py-28">
        <Reveal>
          <div className="flex items-end justify-between mb-10 sm:mb-12 lg:mb-14">
            <div>
              <div className="text-[11px] font-mono tracking-[0.2em] uppercase text-ink-muted mb-3">
                N° 04 — The land desk
              </div>
              <h2 className="font-serif text-[36px] sm:text-[42px] lg:text-[56px] leading-[1.05] text-ink">
                Specialists in{" "}
                <span className="italic font-light">land</span>
              </h2>
            </div>
          </div>
        </Reveal>

        <div className="no-scrollbar flex gap-4 sm:gap-6 lg:gap-10 overflow-x-auto pb-2 -mx-6 lg:-mx-12 px-6 lg:px-12 snap-x snap-mandatory">
          {AGENTS.map((a, i) => (
            <Reveal
              key={a.id}
              delay={i * 80}
              className="flex-shrink-0 w-[160px] sm:w-[200px] lg:w-[220px] snap-start"
            >
              <article className="group">
                <div className="relative aspect-[3/4] overflow-hidden bg-canvas-deep mb-4">
                  <div className="card-image absolute inset-0">
                    <Image
                      src={a.photo}
                      alt={a.name}
                      fill
                      sizes="220px"
                      className="object-cover grayscale transition-[filter] duration-700 group-hover:grayscale-0"
                    />
                  </div>
                </div>
                <h3 className="font-serif italic text-[18px] sm:text-[20px] leading-tight text-ink mb-1 transition-colors duration-300 group-hover:text-accent">
                  {a.name}
                </h3>
                <p className="text-[11px] font-mono tracking-[0.12em] uppercase text-ink-muted">
                  {a.title}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
