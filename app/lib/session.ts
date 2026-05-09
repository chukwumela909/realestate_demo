import { cookies } from "next/headers";
import { randomBytes } from "node:crypto";
import { prisma } from "./prisma";

const COOKIE = "maison_session";
const ONE_YEAR = 60 * 60 * 24 * 365;

export async function getOrCreateSession() {
  const jar = await cookies();
  let id = jar.get(COOKIE)?.value;

  if (id) {
    const existing = await prisma.session.findUnique({ where: { id } });
    if (existing) return existing;
  }

  id = `s_${randomBytes(16).toString("hex")}`;
  jar.set(COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: ONE_YEAR,
  });

  return prisma.session.create({ data: { id } });
}

export async function getSessionFromCookie() {
  const jar = await cookies();
  const id = jar.get(COOKIE)?.value;
  if (!id) return null;
  return prisma.session.findUnique({ where: { id } });
}
