export type Mood =
  | "solitude"
  | "coastal"
  | "heirloom"
  | "urban"
  | "garden"
  | "modernist";

export const MOODS: { id: Mood; label: string }[] = [
  { id: "solitude", label: "solitude" },
  { id: "coastal", label: "coastal" },
  { id: "heirloom", label: "heirloom" },
  { id: "urban", label: "urban" },
  { id: "garden", label: "garden" },
  { id: "modernist", label: "modernist" },
];

export type Property = {
  id: string;
  name: string;
  caption: string;
  price: string;
  location: string;
  moods: Mood[];
  photo: string;
};

const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const FEATURED: Property[] = [
  {
    id: "cedar-house",
    name: "Cedar House",
    caption:
      "A 1962 modernist on three quiet acres, designed by a student of Schindler.",
    price: "$4,200,000",
    location: "Sonoma, CA",
    moods: ["solitude", "modernist", "garden"],
    photo: u("photo-1600596542815-ffad4c1539a9", 1800),
  },
  {
    id: "loft-04",
    name: "Loft 04",
    caption: "Cast-iron columns, north-facing light, the last of its block.",
    price: "$1,800,000",
    location: "Tribeca, NY",
    moods: ["urban", "heirloom"],
    photo: u("photo-1600585154340-be6161a56a0c", 1200),
  },
  {
    id: "the-annex",
    name: "The Annex",
    caption: "A converted glasshouse off a residential lane.",
    price: "$2,400,000",
    location: "Toronto, ON",
    moods: ["urban", "garden"],
    photo: u("photo-1564013799919-ab600027ffc6", 1000),
  },
];

export const INDEX: Property[] = [
  {
    id: "long-shore",
    name: "Long Shore",
    caption: "Cedar-clad, set fifteen feet back from the tideline.",
    price: "$6,800,000",
    location: "Mendocino, CA",
    moods: ["coastal", "solitude", "modernist"],
    photo: u("photo-1613490493576-7fde63acd811"),
  },
  {
    id: "field-house",
    name: "Field House",
    caption: "A working farmhouse, restored room by room over a decade.",
    price: "$3,150,000",
    location: "Hudson Valley, NY",
    moods: ["heirloom", "garden", "solitude"],
    photo: u("photo-1512917774080-9991f1c4c750"),
  },
  {
    id: "the-glasshouse",
    name: "The Glasshouse",
    caption: "Mies-quoting; commissioned by a botanist in 1971.",
    price: "$5,400,000",
    location: "Litchfield, CT",
    moods: ["modernist", "garden", "heirloom"],
    photo: u("photo-1605276374104-dee2a0ed3cd6"),
  },
  {
    id: "rue-saint-paul",
    name: "Rue Saint-Paul",
    caption: "A floor-through above a 19th-century courtyard.",
    price: "€2,950,000",
    location: "Le Marais, Paris",
    moods: ["urban", "heirloom"],
    photo: u("photo-1600566753190-17f0baa2a6c3"),
  },
  {
    id: "cove-cottage",
    name: "Cove Cottage",
    caption: "Three rooms, a stone hearth, a quiet bay outside the window.",
    price: "$1,250,000",
    location: "Tofino, BC",
    moods: ["coastal", "solitude", "heirloom"],
    photo: u("photo-1600607687939-ce8a6c25118c"),
  },
  {
    id: "atelier-46",
    name: "Atelier 46",
    caption: "A north-light artist's studio with a small garden behind.",
    price: "£1,750,000",
    location: "Hampstead, London",
    moods: ["urban", "garden", "heirloom"],
    photo: u("photo-1600210492486-724fe5c67fb0"),
  },
  {
    id: "white-pine",
    name: "White Pine",
    caption: "A cantilevered cabin reading toward an unbroken ridgeline.",
    price: "$2,100,000",
    location: "Stowe, VT",
    moods: ["solitude", "modernist", "coastal"],
    photo: u("photo-1505691938895-1758d7feb511"),
  },
  {
    id: "harbor-row",
    name: "Harbor Row",
    caption: "A 1908 brick row house, two blocks from the water.",
    price: "$3,650,000",
    location: "Beacon Hill, MA",
    moods: ["urban", "heirloom", "coastal"],
    photo: u("photo-1571055107559-3e67626fa8be"),
  },
];

export const ALL_PROPERTIES = [...FEATURED, ...INDEX];

export const AGENTS: { id: string; name: string; title: string; photo: string }[] = [
  {
    id: "ines",
    name: "Inès Moreau",
    title: "Principal · Paris",
    photo: u("photo-1494790108377-be9c29b29330", 600),
  },
  {
    id: "tomas",
    name: "Tomás Ferreira",
    title: "Architectural specialist · Lisbon",
    photo: u("photo-1500648767791-00dcc994a43e", 600),
  },
  {
    id: "naomi",
    name: "Naomi Levine",
    title: "Director · New York",
    photo: u("photo-1438761681033-6461ffad8d80", 600),
  },
  {
    id: "yusuf",
    name: "Yusuf Adler",
    title: "Heritage advisor · London",
    photo: u("photo-1507003211169-0a1dd7228f2d", 600),
  },
  {
    id: "marit",
    name: "Marit Solberg",
    title: "Coastal portfolio · Vancouver",
    photo: u("photo-1544005313-94ddf0286df2", 600),
  },
];
