import Image from "next/image";
import { FEATURED } from "../lib/properties";
import Reveal from "./Reveal";

export default function Featured() {
  const [hero, tall, square] = FEATURED;

  return (
    <section className="border-t border-hairline">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-12 py-16 sm:py-20 lg:py-28">
        <div className="flex items-end justify-between mb-10 sm:mb-12 lg:mb-16">
          <Reveal>
            <div className="text-[11px] font-mono tracking-[0.2em] uppercase text-ink-muted mb-3">
              No. 01 - Pearl Residence
            </div>
            <h2 className="font-serif text-[36px] sm:text-[42px] lg:text-[56px] leading-[1.05] text-ink">
              Featured <span className="italic font-light">plots</span>
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <a
              href="#"
              className="hidden md:inline text-[11px] font-mono tracking-[0.2em] uppercase text-ink hover:text-accent transition-colors"
            >
              View all
            </a>
          </Reveal>
        </div>

        <div className="grid grid-cols-12 gap-y-12 sm:gap-y-14 gap-x-6 lg:gap-8">
          <Reveal delay={60} className="col-span-12 lg:col-span-7 flex">
            <FeaturedCard property={hero} variant="hero" />
          </Reveal>
          <Reveal
            delay={180}
            className="col-span-12 pl-8 sm:pl-12 md:pl-0 md:col-span-7 lg:col-span-3 flex"
          >
            <FeaturedCard property={tall} variant="tall" />
          </Reveal>
          <Reveal
            delay={300}
            className="col-span-12 pr-8 sm:pr-12 md:pr-0 md:col-span-5 lg:col-span-2 flex"
          >
            <FeaturedCard property={square} variant="square" />
          </Reveal>
        </div>

        <Reveal delay={420}>
          <a
            href="#"
            className="md:hidden mt-12 inline-flex items-center gap-2 text-[11px] font-mono tracking-[0.2em] uppercase text-ink border-b border-ink pb-1 hover:text-accent hover:border-accent transition-colors"
          >
            View all
          </a>
        </Reveal>
      </div>
    </section>
  );
}

function FeaturedCard({
  property,
  variant,
}: {
  property: (typeof FEATURED)[number];
  variant: "hero" | "tall" | "square";
}) {
  const ratio =
    variant === "hero"
      ? "aspect-[16/11]"
      : variant === "tall"
        ? "aspect-[3/4]"
        : "aspect-square";

  const isHero = variant === "hero";

  return (
    <article className="group flex flex-col gap-5 w-full">
      <div className={`relative ${ratio} overflow-hidden bg-canvas-deep`}>
        <div className="card-image absolute inset-0">
          <Image
            src={property.photo}
            alt={property.name}
            fill
            sizes={
              isHero
                ? "(max-width: 1024px) 100vw, 60vw"
                : "(max-width: 1024px) 50vw, 25vw"
            }
            className="object-cover"
            priority={isHero}
          />
        </div>
        <span className="absolute top-4 left-4 text-[10px] font-mono tracking-[0.2em] uppercase text-canvas mix-blend-difference">
          0{FEATURED.indexOf(property) + 1}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <h3
          className={`font-serif text-ink flex items-center gap-3 ${
            isHero
              ? "text-[26px] sm:text-[30px] lg:text-[34px] leading-[1.1]"
              : "text-[20px] sm:text-[22px] leading-[1.15]"
          }`}
        >
          <span>{property.name}</span>
          <span
            aria-hidden
            className={`arrow-in text-ink-soft ${
              isHero ? "text-[20px] sm:text-[24px]" : "text-[15px] sm:text-[16px]"
            }`}
          >
            -
          </span>
        </h3>

        {isHero && (
          <p className="caption-dim font-serif italic text-ink-soft text-[16px] sm:text-[17px] lg:text-[18px] leading-[1.5] max-w-md">
            {property.caption}
          </p>
        )}

        <div className="mt-2 flex items-center gap-3 text-[12px] font-mono tracking-[0.08em] text-ink">
          <span>{property.price}</span>
          <span className="h-3 w-px bg-hairline-strong" />
          <span className="text-ink-soft">{property.location}</span>
        </div>
      </div>
    </article>
  );
}
