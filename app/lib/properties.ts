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

export const INDEX: Property[] = ALL_PROPERTIES.slice(3);

export const AGENTS: { id: string; name: string; title: string; photo: string }[] = [
  {
    id: "amina",
    name: "Amina Bello",
    title: "Central Nigeria sales agent",
    photo:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "musa",
    name: "Musa Danladi",
    title: "Northern corridor sales agent",
    photo:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "tola",
    name: "Tola Adeyemi",
    title: "Western land desk",
    photo:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "ngozi",
    name: "Ngozi Okafor",
    title: "Southern land desk",
    photo:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
  },
];
