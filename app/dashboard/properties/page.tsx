import Link from "next/link";
import { prisma } from "../../lib/prisma";
import { ensureSeeded } from "../../lib/seed";
import PropertiesTable from "./PropertiesTable";

export const dynamic = "force-dynamic";

export default async function PropertiesPage() {
  await ensureSeeded();

  const properties = await prisma.property.findMany({
    include: {
      images: { where: { isPrimary: true }, take: 1 },
      _count: { select: { interests: true } },
    },
    orderBy: { name: "asc" },
  });

  const initial = properties.map((p) => ({
    id: p.id,
    name: p.name,
    location: p.location,
    price: p.price,
    status: p.status,
    photo: p.images[0]?.url ?? null,
    interestCount: p._count.interests,
    moods: JSON.parse(p.moods) as string[],
  }));

  return (
    <div className="px-8 lg:px-12 py-10 lg:py-14">
      <header className="mb-10 flex items-end justify-between">
        <div>
          <div className="text-[11px] font-mono tracking-[0.2em] uppercase text-ink-muted mb-2">
            N° 02 — Desk
          </div>
          <h1 className="font-serif text-[44px] lg:text-[52px] leading-[1.05] text-ink">
            Properties
          </h1>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-[11px] font-mono tracking-[0.18em] uppercase text-ink-muted">
            {initial.length} in the index
          </span>
          <Link
            href="/dashboard/properties/new"
            className="bg-ink text-canvas px-4 py-2.5 text-[11px] font-mono tracking-[0.18em] uppercase hover:bg-accent transition-colors duration-300"
          >
            + New land listing
          </Link>
        </div>
      </header>

      <PropertiesTable initial={initial} />
    </div>
  );
}
