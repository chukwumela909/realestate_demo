import { NextRequest } from "next/server";
import { prisma } from "../../../lib/prisma";

export const runtime = "nodejs";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    await prisma.session.delete({ where: { id } });
  } catch {
    return new Response("not found", { status: 404 });
  }

  return Response.json({ ok: true });
}
