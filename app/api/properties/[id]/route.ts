import { NextRequest } from "next/server";
import { prisma } from "../../../lib/prisma";
import { ensureSeeded } from "../../../lib/seed";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  await ensureSeeded();
  const { id } = await params;
  const p = await prisma.property.findUnique({
    where: { id },
    include: { images: { orderBy: { order: "asc" } } },
  });
  if (!p) return new Response("not found", { status: 404 });
  return Response.json({
    id: p.id,
    name: p.name,
    caption: p.caption,
    price: p.price,
    location: p.location,
    status: p.status,
    available: p.available,
    moods: JSON.parse(p.moods) as string[],
    images: p.images.map((i) => ({
      url: i.url,
      alt: i.alt,
      isPrimary: i.isPrimary,
    })),
  });
}
