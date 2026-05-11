import { MOODS_LIST, PROPERTIES_SEED } from "./seedData";

export type Mood = (typeof MOODS_LIST)[number];

export const MOODS: { id: Mood; label: string }[] = MOODS_LIST.map((mood) => ({
  id: mood,
  label: mood,
}));

export type Property = {
  id: string;
  name: string;
  caption: string;
  price: string;
  location: string;
  moods: Mood[];
  photo: string;
};

const toProperty = (property: (typeof PROPERTIES_SEED)[number]): Property => ({
  id: property.id,
  name: property.name,
  caption: property.caption,
  price: property.price,
  location: property.location,
  moods: property.moods as Mood[],
  photo: property.images.find((image) => image.isPrimary)?.url ?? property.images[0]?.url ?? "",
});

export const ALL_PROPERTIES: Property[] = PROPERTIES_SEED.map(toProperty);

export const FEATURED: Property[] = ALL_PROPERTIES.slice(0, 3);

export const INDEX: Property[] = ALL_PROPERTIES;

export const AGENTS: { id: string; name: string; title: string; photo: string }[] = [
  {
    id: "ibrahim-quassim",
    name: "Ibrahim Quassim",
    title: "Chief Executive Officer",
    photo:
      "https://cloud9propertieslimited.com/wp-content/uploads/elementor/thumbs/Frame-1-rd0cqq97j2efe5qs2l3phyjhm0suad36927291mens.webp",
  },
  {
    id: "ojewale-omotayo-loveth",
    name: "Ojewale Omotayo Loveth",
    title: "Chief Operating Officer",
    photo:
      "https://cloud9propertieslimited.com/wp-content/uploads/elementor/thumbs/Frame-rd0cpjygzisivpg7xkthvr7qvolbnzf938u7nld4fs.webp",
  },
];
