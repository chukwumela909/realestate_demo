// Seed source-of-truth for properties.
// Each property gets a primary photo + 2 gallery shots.
// Curated from images.unsplash.com — known-stable IDs.

const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export type SeedProperty = {
  id: string;
  name: string;
  caption: string;
  price: string;
  location: string;
  moods: string[]; // serialised to JSON in DB
  status?: string;
  available?: boolean;
  images: { url: string; alt?: string; isPrimary?: boolean }[];
};

export const PROPERTIES_SEED: SeedProperty[] = [
  {
    id: "cedar-house",
    name: "Cedar House",
    caption:
      "A 1962 modernist on three quiet acres, designed by a student of Schindler.",
    price: "$4,200,000",
    location: "Sonoma, CA",
    moods: ["solitude", "modernist", "garden"],
    images: [
      { url: u("photo-1600596542815-ffad4c1539a9"), isPrimary: true, alt: "Cedar House exterior at dusk" },
      { url: u("photo-1600210492486-724fe5c67fb0"), alt: "Living room with original cabinetry" },
      { url: u("photo-1600585152915-d208bec867a1"), alt: "View from the garden" },
    ],
  },
  {
    id: "loft-04",
    name: "Loft 04",
    caption: "Cast-iron columns, north-facing light, the last of its block.",
    price: "$1,800,000",
    location: "Tribeca, NY",
    moods: ["urban", "heirloom"],
    images: [
      { url: u("photo-1600585154340-be6161a56a0c"), isPrimary: true, alt: "Loft 04 main room" },
      { url: u("photo-1545324418-cc1a3fa10c00"), alt: "Cast-iron columns in morning light" },
      { url: u("photo-1505691938895-1758d7feb511"), alt: "View toward the street" },
    ],
  },
  {
    id: "the-annex",
    name: "The Annex",
    caption: "A converted glasshouse off a residential lane.",
    price: "$2,400,000",
    location: "Toronto, ON",
    moods: ["urban", "garden"],
    images: [
      { url: u("photo-1564013799919-ab600027ffc6"), isPrimary: true, alt: "The Annex glasshouse" },
      { url: u("photo-1567496898669-ee935f5f647a"), alt: "Interior gathering space" },
      { url: u("photo-1502005229762-cf1b2da7c5d6"), alt: "Garden view" },
    ],
  },
  {
    id: "long-shore",
    name: "Long Shore",
    caption: "Cedar-clad, set fifteen feet back from the tideline.",
    price: "$6,800,000",
    location: "Mendocino, CA",
    moods: ["coastal", "solitude", "modernist"],
    images: [
      { url: u("photo-1613490493576-7fde63acd811"), isPrimary: true, alt: "Long Shore facing the ocean" },
      { url: u("photo-1600607687939-ce8a6c25118c"), alt: "Open living over the tideline" },
      { url: u("photo-1502005229762-cf1b2da7c5d6"), alt: "Cedar-clad exterior" },
    ],
  },
  {
    id: "field-house",
    name: "Field House",
    caption: "A working farmhouse, restored room by room over a decade.",
    price: "$3,150,000",
    location: "Hudson Valley, NY",
    moods: ["heirloom", "garden", "solitude"],
    images: [
      { url: u("photo-1512917774080-9991f1c4c750"), isPrimary: true, alt: "Field House in summer light" },
      { url: u("photo-1505691938895-1758d7feb511"), alt: "Sitting room" },
      { url: u("photo-1502005229762-cf1b2da7c5d6"), alt: "Walled garden" },
    ],
  },
  {
    id: "the-glasshouse",
    name: "The Glasshouse",
    caption: "Mies-quoting; commissioned by a botanist in 1971.",
    price: "$5,400,000",
    location: "Litchfield, CT",
    moods: ["modernist", "garden", "heirloom"],
    images: [
      { url: u("photo-1605276374104-dee2a0ed3cd6"), isPrimary: true, alt: "The Glasshouse in winter" },
      { url: u("photo-1600585154340-be6161a56a0c"), alt: "Open plan interior" },
      { url: u("photo-1600210492486-724fe5c67fb0"), alt: "Botanical specimens" },
    ],
  },
  {
    id: "rue-saint-paul",
    name: "Rue Saint-Paul",
    caption: "A floor-through above a 19th-century courtyard.",
    price: "€2,950,000",
    location: "Le Marais, Paris",
    moods: ["urban", "heirloom"],
    images: [
      { url: u("photo-1600566753190-17f0baa2a6c3"), isPrimary: true, alt: "Rue Saint-Paul salon" },
      { url: u("photo-1600210492486-724fe5c67fb0"), alt: "Kitchen and dining" },
      { url: u("photo-1545324418-cc1a3fa10c00"), alt: "Courtyard view" },
    ],
  },
  {
    id: "cove-cottage",
    name: "Cove Cottage",
    caption: "Three rooms, a stone hearth, a quiet bay outside the window.",
    price: "$1,250,000",
    location: "Tofino, BC",
    moods: ["coastal", "solitude", "heirloom"],
    images: [
      { url: u("photo-1600607687939-ce8a6c25118c"), isPrimary: true, alt: "Cove Cottage from the bay" },
      { url: u("photo-1512917774080-9991f1c4c750"), alt: "The hearth room" },
      { url: u("photo-1613490493576-7fde63acd811"), alt: "Looking out to the bay" },
    ],
  },
  {
    id: "atelier-46",
    name: "Atelier 46",
    caption: "A north-light artist's studio with a small garden behind.",
    price: "£1,750,000",
    location: "Hampstead, London",
    moods: ["urban", "garden", "heirloom"],
    images: [
      { url: u("photo-1600210492486-724fe5c67fb0"), isPrimary: true, alt: "Atelier 46 studio" },
      { url: u("photo-1564013799919-ab600027ffc6"), alt: "Garden behind the atelier" },
      { url: u("photo-1545324418-cc1a3fa10c00"), alt: "Upper-floor reading nook" },
    ],
  },
  {
    id: "white-pine",
    name: "White Pine",
    caption: "A cantilevered cabin reading toward an unbroken ridgeline.",
    price: "$2,100,000",
    location: "Stowe, VT",
    moods: ["solitude", "modernist", "coastal"],
    images: [
      { url: u("photo-1505691938895-1758d7feb511"), isPrimary: true, alt: "White Pine on the ridge" },
      { url: u("photo-1605276374104-dee2a0ed3cd6"), alt: "Sitting area facing the ridge" },
      { url: u("photo-1600596542815-ffad4c1539a9"), alt: "Approach through pine" },
    ],
  },
  {
    id: "harbor-row",
    name: "Harbor Row",
    caption: "A 1908 brick row house, two blocks from the water.",
    price: "$3,650,000",
    location: "Beacon Hill, MA",
    moods: ["urban", "heirloom", "coastal"],
    images: [
      { url: u("photo-1571055107559-3e67626fa8be"), isPrimary: true, alt: "Harbor Row façade" },
      { url: u("photo-1600585154340-be6161a56a0c"), alt: "Front parlour" },
      { url: u("photo-1502005229762-cf1b2da7c5d6"), alt: "Walk toward the harbor" },
    ],
  },
];

export const MOODS_LIST = [
  "solitude",
  "coastal",
  "heirloom",
  "urban",
  "garden",
  "modernist",
] as const;

export type Mood = (typeof MOODS_LIST)[number];
