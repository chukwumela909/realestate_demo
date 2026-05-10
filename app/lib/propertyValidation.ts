// Shared validation/normalisation for property create + edit payloads.

export const ALLOWED_STATUS = [
  "available",
  "under_offer",
  "reserved",
  "sold",
] as const;

export const ALLOWED_MOODS = [
  "solitude",
  "coastal",
  "heirloom",
  "urban",
  "garden",
  "modernist",
] as const;

export type PropertyImageInput = {
  url: string;
  alt?: string | null;
  isPrimary?: boolean;
};

export type PropertyInput = {
  id?: string;
  name: string;
  caption: string;
  price: string;
  location: string;
  status?: string;
  moods: string[];
  images: PropertyImageInput[];
};

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

export function validateProperty(input: unknown): {
  ok: boolean;
  errors: string[];
  data?: Required<PropertyInput>;
} {
  const errors: string[] = [];
  if (!input || typeof input !== "object") {
    return { ok: false, errors: ["Body must be an object."] };
  }
  const i = input as Record<string, unknown>;
  const name = String(i.name ?? "").trim();
  const caption = String(i.caption ?? "").trim();
  const price = String(i.price ?? "").trim();
  const location = String(i.location ?? "").trim();
  const status = String(i.status ?? "available");
  const id = i.id ? String(i.id).trim() : slugify(name);
  const moods = Array.isArray(i.moods) ? i.moods.map(String) : [];
  const imagesRaw = Array.isArray(i.images) ? i.images : [];

  if (!name) errors.push("Name is required.");
  if (!caption) errors.push("Caption is required.");
  if (!price) errors.push("Price is required.");
  if (!location) errors.push("Location is required.");
  if (!id || !/^[a-z0-9-]+$/.test(id))
    errors.push(
      "Id must be lowercase letters, numbers and hyphens only.",
    );
  if (!ALLOWED_STATUS.includes(status as (typeof ALLOWED_STATUS)[number]))
    errors.push("Status invalid.");

  const cleanedMoods = moods
    .filter((m) => ALLOWED_MOODS.includes(m as (typeof ALLOWED_MOODS)[number]))
    .filter((m, idx, arr) => arr.indexOf(m) === idx);
  if (cleanedMoods.length === 0) errors.push("Pick at least one mood.");

  const images = imagesRaw
    .flatMap<PropertyImageInput>((raw) => {
      if (!raw || typeof raw !== "object") return [];
      const r = raw as Record<string, unknown>;
      const url = String(r.url ?? "").trim();
      if (!url) return [];
      return [{
        url,
        alt: r.alt ? String(r.alt).trim() : null,
        isPrimary: Boolean(r.isPrimary),
      }];
    });

  if (images.length === 0) errors.push("Add at least one image.");

  // Ensure exactly one primary
  if (images.length > 0) {
    const primaryCount = images.filter((x) => x.isPrimary).length;
    if (primaryCount === 0) images[0].isPrimary = true;
    if (primaryCount > 1) {
      let kept = false;
      for (const img of images) {
        if (img.isPrimary) {
          if (kept) img.isPrimary = false;
          else kept = true;
        }
      }
    }
  }

  if (errors.length) return { ok: false, errors };

  return {
    ok: true,
    errors: [],
    data: {
      id,
      name,
      caption,
      price,
      location,
      status,
      moods: cleanedMoods,
      images,
    },
  };
}
