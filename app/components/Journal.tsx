import Image from "next/image";
import Reveal from "./Reveal";

export default function Journal() {
  return (
    <section className="border-t border-hairline">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-12 py-16 sm:py-20 lg:py-28">
        <div className="grid grid-cols-12 gap-y-8 gap-x-6 lg:gap-12">
          <Reveal className="col-span-12 lg:col-span-7">
            <div className="group relative aspect-[5/4] overflow-hidden bg-canvas-deep">
              <div className="card-image absolute inset-0">
                <Image
                  src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1600&q=80"
                  alt="Architectural interior"
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />
              </div>
            </div>
          </Reveal>

          <div className="col-span-12 lg:col-span-5 flex flex-col justify-center">
            <Reveal delay={120}>
              <div className="text-[11px] font-mono tracking-[0.2em] uppercase text-ink-muted mb-4">
                N° 03 — From the Journal
              </div>
              <h2 className="font-serif text-[32px] sm:text-[42px] lg:text-[52px] leading-[1.05] text-ink mb-5 sm:mb-6">
                On the architecture of{" "}
                <span className="italic font-light">staying put</span>
              </h2>
            </Reveal>
            <Reveal delay={240}>
              <p className="font-serif text-[16px] sm:text-[17px] leading-[1.65] text-ink-soft mb-4">
                We tend to talk about a house in the language of acquisition —
                square footage, lot lines, comparable sales. But the houses
                worth keeping are the ones we eventually stop measuring.
              </p>
              <p className="font-serif text-[16px] sm:text-[17px] leading-[1.65] text-ink-soft mb-8">
                An essay on permanence, light, and the rooms we end up coming
                back to.
              </p>
            </Reveal>
            <Reveal delay={360}>
              <a
                href="#"
                className="group self-start inline-flex items-center gap-2 text-[12px] font-mono tracking-[0.2em] uppercase text-ink border-b border-ink pb-1 hover:text-accent hover:border-accent transition-colors duration-300"
              >
                <span>Continue reading</span>
                <span className="inline-block transition-transform duration-500 group-hover:translate-x-1">
                  →
                </span>
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
