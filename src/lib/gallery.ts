export const galleryCollections = [
  "Heritage dinners",
  "Mental health training",
  "Seniors",
  "Women’s engagement",
  "Seniors seminars",
  "Seniors boat cruise 2024",
  "Marketplace launch",
  "Flag raisings",
  "Black History 2024",
] as const;

export type GalleryCollection = (typeof galleryCollections)[number];

export interface GalleryPhoto {
  id: string;
  title: string;
  collection: GalleryCollection;
  src: string;
  alt: string;
}

export interface GallerySection {
  name: GalleryCollection;
  id: string;
  blurb: string;
  photos: GalleryPhoto[];
}

function photo(id: string, title: string, collection: GalleryCollection): GalleryPhoto {
  return {
    id,
    title,
    collection,
    src: `/images/gallery/${id}.jpg`,
    alt: title,
  };
}

function sectionId(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const blurbs: Record<GalleryCollection, string> = {
  "Heritage dinners": "Evenings of food, dance, and fundraising.",
  "Mental health training": "Members learning together and looking out for one another.",
  Seniors: "Picnics, gardens, and meals with Golden Ages.",
  "Women’s engagement": "Time on the water with the women’s group.",
  "Seniors seminars": "Dance and table conversations at a seniors seminar.",
  "Seniors boat cruise 2024": "Friends from the 2024 boat cruise.",
  "Marketplace launch": "The community marketplace, from the floor to a demonstration.",
  "Flag raisings": "Ghana’s flag raised with the community in cultural dress.",
  "Black History 2024": "Music, dance, and a full room in 2024.",
};

export const galleryPhotos: GalleryPhoto[] = [
  photo("heritage-dinner-community-group", "Community gathered for a heritage dinner", "Heritage dinners"),
  photo(
    "heritage-centre-fundraising-gathering",
    "A fundraising gathering for the heritage centre",
    "Heritage dinners",
  ),
  photo("heritage-dinner-dance-pair", "A dance pair at the heritage dinner", "Heritage dinners"),
  photo("heritage-dinner-cultural-dance", "Cultural dance at the heritage dinner", "Heritage dinners"),
  photo("heritage-dinner-celebration", "Celebration at the heritage dinner", "Heritage dinners"),
  photo("heritage-dinner-shared-smiles", "Shared smiles at the heritage dinner", "Heritage dinners"),
  photo("heritage-dinner-traditional-dress", "Traditional dress at the heritage dinner", "Heritage dinners"),
  photo("heritage-dinner-dance-floor", "The dance floor at the heritage dinner", "Heritage dinners"),
  photo("mental-health-training-group", "The group at mental health training", "Mental health training"),
  photo(
    "mental-health-training-shared-smiles",
    "Shared smiles during mental health training",
    "Mental health training",
  ),
  photo(
    "mental-health-training-participants",
    "Participants at mental health training",
    "Mental health training",
  ),
  photo("seniors-outdoor-friendship", "Seniors together outdoors", "Seniors"),
  photo("seniors-shared-meal", "A shared meal with seniors", "Seniors"),
  photo("seniors-garden-gathering", "Seniors gathered in the garden", "Seniors"),
  photo(
    "womens-engagement-boat-outing-dancing",
    "Dancing on the women’s boat outing",
    "Women’s engagement",
  ),
  photo(
    "womens-engagement-boat-outing-companionship",
    "Companionship on the women’s boat outing",
    "Women’s engagement",
  ),
  photo("seniors-seminar-dance-pair", "A dance pair at the seniors seminar", "Seniors seminars"),
  photo("seniors-seminar-table-gathering", "A table gathering at the seniors seminar", "Seniors seminars"),
  photo("community-boat-outing-friends", "Friends on the 2024 boat cruise", "Seniors boat cruise 2024"),
  photo(
    "community-boat-outing-shared-smiles",
    "Shared smiles on the boat cruise",
    "Seniors boat cruise 2024",
  ),
  photo(
    "community-marketplace-participants",
    "Participants at the marketplace launch",
    "Marketplace launch",
  ),
  photo(
    "community-marketplace-demonstration",
    "A demonstration at the marketplace launch",
    "Marketplace launch",
  ),
  photo(
    "flag-raising-cultural-dress-group",
    "The group in cultural dress at a flag raising",
    "Flag raisings",
  ),
  photo("flag-raising-cultural-celebration", "Celebration at a flag raising", "Flag raisings"),
  photo(
    "flag-raising-ghana-flag-group",
    "Ghana’s flag with the group in cultural dress",
    "Flag raisings",
  ),
  photo(
    "flag-raising-community-celebration",
    "The community celebrating a flag raising",
    "Flag raisings",
  ),
  photo("black-history-cultural-gathering", "A cultural gathering for Black History", "Black History 2024"),
  photo(
    "black-history-audience-shared-smiles",
    "Shared smiles in the Black History audience",
    "Black History 2024",
  ),
  photo(
    "black-history-seated-community-members",
    "Community members seated for Black History",
    "Black History 2024",
  ),
  photo("black-history-live-percussion", "Live percussion at Black History", "Black History 2024"),
  photo(
    "black-history-percussion-and-guitar",
    "Percussion and guitar at Black History",
    "Black History 2024",
  ),
  photo("black-history-cultural-dancing", "Cultural dancing at Black History", "Black History 2024"),
];

export const gallerySections: GallerySection[] = galleryCollections.map((name) => ({
  name,
  id: sectionId(name),
  blurb: blurbs[name],
  photos: galleryPhotos.filter((item) => item.collection === name),
}));

export const firstGallerySectionId = gallerySections[0]?.id ?? "heritage-dinners";
