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
                  src="https://commons.wikimedia.org/wiki/Special:FilePath/Beautiful%20formations%20in%20Jos%20Nigeria.jpg?width=1600"
                  alt="Jos Plateau landscape"
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
                On buying land with{" "}
                <span className="italic font-light">room to grow</span>
              </h2>
            </Reveal>
            <Reveal delay={240}>
              <p className="font-serif text-[16px] sm:text-[17px] leading-[1.65] text-ink-soft mb-4">
                Good land decisions begin with practical questions: access,
                title, services, drainage, demand, and what the neighbourhood
                can realistically become.
              </p>
              <p className="font-serif text-[16px] sm:text-[17px] leading-[1.65] text-ink-soft mb-8">
                A field note on mixed-use parcels across Abuja, Kaduna, Jos,
                Ibadan, Lagos, Port Harcourt, and Calabar.
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
