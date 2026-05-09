import { prisma } from "./prisma";
import { PROPERTIES_SEED } from "./seedData";

let seedingPromise: Promise<void> | null = null;

export async function ensureSeeded() {
  if (seedingPromise) return seedingPromise;

  seedingPromise = (async () => {
    const count = await prisma.property.count();
    if (count > 0) return;

    for (const p of PROPERTIES_SEED) {
      await prisma.property.create({
        data: {
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
      });
    }
    console.log(`[seed] inserted ${PROPERTIES_SEED.length} properties`);
  })().finally(() => {
    seedingPromise = null;
  });

  return seedingPromise;
}
