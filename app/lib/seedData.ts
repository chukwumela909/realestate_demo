// Seed source-of-truth for cloud9 land listings.
// Each listing gets a primary location image + 2 gallery shots.

const commons = (filename: string, w = 1600) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(
    filename,
  )}?width=${w}`;

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

const gallery = {
  abuja: [
    commons("Landscape view of abuja.jpg", 1800),
    commons("Abuja landscape view.jpg", 1400),
    commons(
      "Lithium mine showing the beautiful landscape of Takushara village in Abuja, Nigeria.jpg",
      1400,
    ),
  ],
  kaduna: [
    commons("A landscape farm in Kadpoly, Sabon Tasha Campus. Kaduna, Nigeria 🇳🇬.jpg", 1800),
    commons("Landscape view of abuja.jpg", 1400),
    commons("Beautiful formations in Jos Nigeria.jpg", 1400),
  ],
  plateau: [
    commons("Beautiful formations in Jos Nigeria.jpg", 1800),
    commons(
      "ASC Leiden - Rietveld Collection - Nigeria 1970 - 1973 - 01 - 029 The Jos plateau. Landscape with a rocky hillside along the road - Jos Plateau.jpg",
      1400,
    ),
    commons("Landscape view of abuja.jpg", 1400),
  ],
  ibadan: [
    commons("Overview Ibadan, Nigeria.jpg", 1800),
    commons("Ibadan, Nigeria.jpg", 1400),
    commons("Area In Ibadan, Nigeria.jpg", 1400),
  ],
  lagos: [
    commons("Lagos, Nigeria.jpg", 1800),
    commons("Overview Ibadan, Nigeria.jpg", 1400),
    commons("Area In Ibadan, Nigeria.jpg", 1400),
  ],
  portHarcourt: [
    commons("Rain forest Port Harcourt, Nigeria.jpg", 1800),
    commons("Marina Resort, Calabar.jpg", 1400),
    commons("Kwa Falls Calabar 37.jpg", 1400),
  ],
  calabar: [
    commons("Marina Resort, Calabar.jpg", 1800),
    commons("Kwa Falls Calabar 37.jpg", 1400),
    commons("Obudu mountain cattle ranch,calabar Nigeria.jpg", 1400),
  ],
};

const images = (urls: string[], alt: string) =>
  urls.map((url, index) => ({
    url,
    alt: `${alt} ${index + 1}`,
    isPrimary: index === 0,
  }));

export const PROPERTIES_SEED: SeedProperty[] = [
  {
    id: "jabi-growth-corridor",
    name: "Jabi Growth Corridor",
    caption:
      "Mixed-use land positioned for retail frontage, apartments, and everyday access into central Abuja.",
    price: "NGN 420,000,000",
    location: "Jabi, Abuja FCT",
    moods: ["mixed-use", "central", "infrastructure"],
    images: images(gallery.abuja, "Jabi Abuja mixed-use land"),
  },
  {
    id: "guzape-hillside-parcels",
    name: "Guzape Hillside Parcels",
    caption:
      "A serviced hillside holding for low-rise apartments, workspaces, and quiet residential streets.",
    price: "NGN 680,000,000",
    location: "Guzape, Abuja FCT",
    moods: ["mixed-use", "premium", "central"],
    images: images(gallery.abuja, "Guzape Abuja hillside land"),
  },
  {
    id: "karu-nasarawa-link",
    name: "Karu-Nasarawa Link",
    caption:
      "Accessible development land on the Abuja-Nasarawa growth path, ready for a neighbourhood-scale scheme.",
    price: "NGN 155,000,000",
    location: "Karu, Nasarawa",
    moods: ["mixed-use", "growth", "infrastructure"],
    images: images(gallery.abuja, "Karu Nasarawa land"),
  },
  {
    id: "kaduna-rail-hub",
    name: "Kaduna Rail Hub",
    caption:
      "A practical parcel for shops, compact offices, and residential blocks close to Kaduna's mobility spine.",
    price: "NGN 210,000,000",
    location: "Rigasa, Kaduna",
    moods: ["mixed-use", "northern", "infrastructure"],
    images: images(gallery.kaduna, "Kaduna mixed-use land"),
  },
  {
    id: "kano-commerce-edge",
    name: "Kano Commerce Edge",
    caption:
      "Commercially minded land for warehousing, market-facing retail, and apartments serving Kano's trade routes.",
    price: "NGN 260,000,000",
    location: "Kumbotso, Kano",
    moods: ["mixed-use", "northern", "growth"],
    images: images(gallery.kaduna, "Kano commercial land"),
  },
  {
    id: "jos-plateau-view",
    name: "Jos Plateau View",
    caption:
      "Cool-climate development land suited to hospitality, residential plots, and small-format destination retail.",
    price: "NGN 135,000,000",
    location: "Rayfield, Jos, Plateau",
    moods: ["mixed-use", "northern", "greenfield"],
    images: images(gallery.plateau, "Jos Plateau mixed-use land"),
  },
  {
    id: "minna-campus-belt",
    name: "Minna Campus Belt",
    caption:
      "Neighbourhood land for student housing, convenience retail, and everyday services in a steady demand pocket.",
    price: "NGN 118,000,000",
    location: "Bosso, Minna, Niger",
    moods: ["mixed-use", "central", "growth"],
    images: images(gallery.kaduna, "Minna development land"),
  },
  {
    id: "lokoja-confluence-acreage",
    name: "Lokoja Confluence Acreage",
    caption:
      "Broad land with room for a flexible estate plan near one of central Nigeria's strongest logistics crossings.",
    price: "NGN 190,000,000",
    location: "Felele, Lokoja, Kogi",
    moods: ["mixed-use", "central", "greenfield"],
    images: images(gallery.plateau, "Lokoja mixed-use acreage"),
  },
  {
    id: "epe-lagoon-extension",
    name: "Epe Lagoon Extension",
    caption:
      "Western Nigeria land for a measured estate, light commerce, and long-horizon value around the Lekki-Epe axis.",
    price: "NGN 310,000,000",
    location: "Epe, Lagos",
    moods: ["mixed-use", "western", "growth"],
    images: images(gallery.lagos, "Epe Lagos landed property"),
  },
  {
    id: "ibadan-north-gateway",
    name: "Ibadan North Gateway",
    caption:
      "A friendly entry point for townhouse plots, corner shops, and office suites in a mature western city.",
    price: "NGN 175,000,000",
    location: "Moniya, Ibadan, Oyo",
    moods: ["mixed-use", "western", "infrastructure"],
    images: images(gallery.ibadan, "Ibadan mixed-use land"),
  },
  {
    id: "port-harcourt-green-belt",
    name: "Port Harcourt Green Belt",
    caption:
      "Southern Nigeria land for a balanced estate plan with retail services and generous green edges.",
    price: "NGN 240,000,000",
    location: "Eleme Road, Port Harcourt, Rivers",
    moods: ["mixed-use", "southern", "greenfield"],
    images: images(gallery.portHarcourt, "Port Harcourt landed property"),
  },
  {
    id: "calabar-river-parcels",
    name: "Calabar River Parcels",
    caption:
      "Scenic southern land for hospitality-led development, waterfront commerce, and low-density residential plots.",
    price: "NGN 165,000,000",
    location: "Calabar, Cross River",
    moods: ["mixed-use", "southern", "greenfield"],
    images: images(gallery.calabar, "Calabar mixed-use land"),
  },
];

export const MOODS_LIST = [
  "mixed-use",
  "central",
  "northern",
  "western",
  "southern",
  "growth",
  "infrastructure",
  "greenfield",
  "premium",
] as const;

export type Mood = (typeof MOODS_LIST)[number];
