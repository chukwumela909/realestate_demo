import { NextRequest } from "next/server";
import { prisma } from "../../../lib/prisma";
import { ensureSeeded } from "../../../lib/seed";
import { validateProperty } from "../../../lib/propertyValidation";

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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response("bad request", { status: 400 });
  }

  const existing = await prisma.property.findUnique({ where: { id } });
  if (!existing) return new Response("not found", { status: 404 });

  // Force the id from the URL — don't allow re-keying via PATCH
  const v = validateProperty({ ...(body as object), id });
  if (!v.ok || !v.data) {
    return Response.json({ errors: v.errors }, { status: 400 });
  }
  const data = v.data;

  await prisma.$transaction([
    prisma.property.update({
      where: { id },
      data: {
        name: data.name,
        caption: data.caption,
        price: data.price,
        location: data.location,
        status: data.status,
        available: data.status === "available",
        moods: JSON.stringify(data.moods),
      },
    }),
    prisma.propertyImage.deleteMany({ where: { propertyId: id } }),
    prisma.propertyImage.createMany({
      data: data.images.map((img, idx) => ({
        propertyId: id,
        url: img.url,
        alt: img.alt ?? data.name,
        order: idx,
        isPrimary: !!img.isPrimary,
      })),
    }),
  ]);

  return Response.json({ id });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    await prisma.property.delete({ where: { id } });
  } catch {
    return new Response("not found", { status: 404 });
  }
  return Response.json({ ok: true });
}
