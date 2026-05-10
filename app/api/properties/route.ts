import { NextRequest } from "next/server";
import { prisma } from "../../lib/prisma";
import { validateProperty } from "../../lib/propertyValidation";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response("bad request", { status: 400 });
  }

  const v = validateProperty(body);
  if (!v.ok || !v.data) {
    return Response.json({ errors: v.errors }, { status: 400 });
  }

  const data = v.data;

  const existing = await prisma.property.findUnique({ where: { id: data.id } });
  if (existing) {
    return Response.json(
      { errors: [`Id "${data.id}" is already in use.`] },
      { status: 409 },
    );
  }

  const created = await prisma.property.create({
    data: {
      id: data.id,
      name: data.name,
      caption: data.caption,
      price: data.price,
      location: data.location,
      status: data.status,
      available: data.status === "available",
      moods: JSON.stringify(data.moods),
      images: {
        create: data.images.map((img, idx) => ({
          url: img.url,
          alt: img.alt ?? data.name,
          order: idx,
          isPrimary: !!img.isPrimary,
        })),
      },
    },
  });

  return Response.json({ id: created.id });
}
