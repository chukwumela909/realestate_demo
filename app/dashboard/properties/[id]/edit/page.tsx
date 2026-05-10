import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "../../../../lib/prisma";
import PropertyForm from "../../PropertyForm";

export const dynamic = "force-dynamic";

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const p = await prisma.property.findUnique({
    where: { id },
    include: { images: { orderBy: { order: "asc" } } },
  });
  if (!p) notFound();

  return (
    <div className="px-8 lg:px-12 py-10 lg:py-14">
      <Link
        href="/dashboard/properties"
        className="text-[11px] font-mono tracking-[0.2em] uppercase text-ink-muted hover:text-ink transition-colors"
      >
        ← Properties
      </Link>

      <header className="mt-6 mb-10">
        <div className="text-[11px] font-mono tracking-[0.2em] uppercase text-ink-muted mb-2">
          Editing
        </div>
        <h1 className="font-serif text-[40px] lg:text-[48px] leading-[1.05] text-ink">
          {p.name}
        </h1>
      </header>

      <PropertyForm
        mode="edit"
        initial={{
          id: p.id,
          name: p.name,
          caption: p.caption,
          price: p.price,
          location: p.location,
          status: p.status,
          moods: JSON.parse(p.moods) as string[],
          images: p.images.map((i) => ({
            url: i.url,
            alt: i.alt,
            isPrimary: i.isPrimary,
          })),
        }}
      />
    </div>
  );
}
