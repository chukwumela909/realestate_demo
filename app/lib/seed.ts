import { prisma } from "./prisma";
import { PROPERTIES_SEED } from "./seedData";

let seedingPromise: Promise<void> | null = null;

const LEGACY_SEED_IDS = [
  "cedar-house",
  "loft-04",
  "the-annex",
  "long-shore",
  "field-house",
  "the-glasshouse",
  "rue-saint-paul",
  "cove-cottage",
  "atelier-46",
  "white-pine",
  "harbor-row",
  "jabi-growth-corridor",
  "guzape-hillside-parcels",
  "karu-nasarawa-link",
  "kaduna-rail-hub",
  "kano-commerce-edge",
  "jos-plateau-view",
  "minna-campus-belt",
  "lokoja-confluence-acreage",
  "epe-lagoon-extension",
  "ibadan-north-gateway",
  "port-harcourt-green-belt",
  "calabar-river-parcels",
];

export async function ensureSeeded() {
  if (seedingPromise) return seedingPromise;

  seedingPromise = (async () => {
    await prisma.property.deleteMany({
      where: { id: { in: LEGACY_SEED_IDS } },
    });

    for (const p of PROPERTIES_SEED) {
      await prisma.property.upsert({
        where: { id: p.id },
        create: {
          id: p.id,
          name: p.name,
          caption: p.caption,
          price: p.price,
          location: p.location,
          moods: JSON.stringify(p.moods),
          status: p.status ?? "available",
          available: p.available ?? true,
          images: {
            create: p.images.map((img, idx) => ({
              url: img.url,
              alt: img.alt ?? p.name,
              order: idx,
              isPrimary: img.isPrimary ?? idx === 0,
            })),
          },
        },
        update: {
          name: p.name,
          caption: p.caption,
          price: p.price,
          location: p.location,
          moods: JSON.stringify(p.moods),
          status: p.status ?? "available",
          available: p.available ?? true,
          images: {
            deleteMany: {},
            create: p.images.map((img, idx) => ({
              url: img.url,
              alt: img.alt ?? p.name,
              order: idx,
              isPrimary: img.isPrimary ?? idx === 0,
            })),
          },
        },
      });
    }
    console.log(`[seed] synced ${PROPERTIES_SEED.length} Cloud9 plot options`);
  })().finally(() => {
    seedingPromise = null;
  });

  return seedingPromise;
}
