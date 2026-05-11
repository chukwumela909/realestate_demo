// Seed source-of-truth for Cloud9 Pearl Residence Phase 2 plot options.

export type SeedProperty = {
  id: string;
  name: string;
  caption: string;
  price: string;
  location: string;
  moods: string[];
  status?: string;
  available?: boolean;
  images: { url: string; alt?: string; isPrimary?: boolean }[];
};

const projectImage = (path: string) =>
  `https://cloud9propertieslimited.com/wp-content/uploads/${path}`;

const projectGallery = {
  model: projectImage("2025/10/three-dimensional-house-model-1.png"),
  plot400: projectImage(
    "elementor/thumbs/images-7-1-rd1xj3ci8epx05mn23qsaqv02mazjx7zdcpjul2kwg.jpg",
  ),
  plot200: projectImage(
    "elementor/thumbs/images-8-1-rd1xk24j9a1ixq84f0rzd0321vjkgq21u4uiltn0i8.jpg",
  ),
  plot165: projectImage(
    "elementor/thumbs/Nigerian-Land-Sizes-and-Measurement-1024x682-1-rd1qz31c8xn3wug06l60qsvikrk7vta7x7vmyh0574.jpg",
  ),
  acre: projectImage(
    "elementor/thumbs/images-11-rd1wv95uwo34k6979asek9f5ptsvc9l1rd38oyf0pc.jpg",
  ),
};

const images = (primary: string, alt: string) => [
  { url: primary, alt, isPrimary: true },
  { url: projectGallery.model, alt: "Cloud9 Pearl Residence Phase 2 project model" },
];

export const PROPERTIES_SEED: SeedProperty[] = [
  {
    id: "pearl-residence-400-sqm",
    name: "400 SQM Plot",
    caption:
      "Perfect for investors seeking space for family homes or duplex developments, with strong resale and rental potential in fast-developing Gwagwalada.",
    price: "NGN 4,000,000",
    location: "Cloud9 Pearl Residence Phase 2, Gwagwalada, Abuja",
    moods: ["pearl-residence", "gwagwalada", "investment", "residential"],
    images: images(projectGallery.plot400, "Cloud9 Pearl Residence 400 SQM Plot"),
  },
  {
    id: "pearl-residence-200-sqm",
    name: "200 SQM Plot",
    caption:
      "An ideal entry point for first-time investors or buyers who want a smaller plot within a prime estate. Flexible payment options are available.",
    price: "NGN 2,500,000",
    location: "Cloud9 Pearl Residence Phase 2, Gwagwalada, Abuja",
    moods: [
      "pearl-residence",
      "gwagwalada",
      "investment",
      "residential",
      "affordable",
    ],
    images: images(projectGallery.plot200, "Cloud9 Pearl Residence 200 SQM Plot"),
  },
  {
    id: "pearl-residence-165-sqm",
    name: "165 SQM Plot",
    caption:
      "Compact and affordable, suited to young professionals and investors who want to start small in a verified, high-demand location.",
    price: "NGN 1,500,000",
    location: "Cloud9 Pearl Residence Phase 2, Gwagwalada, Abuja",
    moods: [
      "pearl-residence",
      "gwagwalada",
      "investment",
      "residential",
      "affordable",
    ],
    images: images(projectGallery.plot165, "Cloud9 Pearl Residence 165 SQM Plot"),
  },
  {
    id: "pearl-residence-1-acre",
    name: "1 Acre",
    caption:
      "A larger holding for bulk investors or developers, suitable for mini-estates, mixed-use planning, or long-term land banking.",
    price: "NGN 20,000,000",
    location: "Cloud9 Pearl Residence Phase 2, Gwagwalada, Abuja",
    moods: [
      "pearl-residence",
      "gwagwalada",
      "investment",
      "bulk-investor",
    ],
    images: images(projectGallery.acre, "Cloud9 Pearl Residence 1 Acre"),
  },
];

export const MOODS_LIST = [
  "pearl-residence",
  "gwagwalada",
  "investment",
  "residential",
  "affordable",
  "bulk-investor",
] as const;

export type Mood = (typeof MOODS_LIST)[number];
