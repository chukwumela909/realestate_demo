import { NextRequest } from "next/server";
import { prisma } from "../../../../lib/prisma";

export const runtime = "nodejs";

const ALLOWED = ["available", "under_offer", "reserved", "sold"];

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  let body: { status?: string };
  try {
    body = await req.json();
  } catch {
    return new Response("bad request", { status: 400 });
  }
  const status = body.status;
  if (!status || !ALLOWED.includes(status)) {
    return new Response("invalid status", { status: 400 });
  }
  try {
    const updated = await prisma.property.update({
      where: { id },
      data: {
        status,
        available: status === "available",
      },
    });
    return Response.json({ id: updated.id, status: updated.status });
  } catch {
    return new Response("not found", { status: 404 });
  }
}
