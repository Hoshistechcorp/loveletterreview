export type Venue = {
  id: string;
  name: string;
  address: string;
  city: string;
  website: string;
  imageQuery: string;
  claimed: boolean;
};

export type TrendingVenue = Venue & {
  rating: number;
  loveCount: number;
  excerpt: string;
  daysAgo: number;
};

export type SavedLetter = {
  id: string;
  venueName: string;
  city: string;
  excerpt: string;
  rating: number;
  loveCount: number;
  savedAt: number; // ms timestamp
  unlockedAt: number; // ms timestamp
};

export const mockSearchVenue = (name: string, city: string): Venue => ({
  id: "v-" + name.toLowerCase().replace(/\s+/g, "-"),
  name: name.trim() || "The Velvet Olive",
  address: "221 Lover's Lane",
  city: city.trim() || "Brooklyn, NY",
  website: "www.example.com",
  imageQuery: name,
  claimed: false,
});

export const trendingVenues: TrendingVenue[] = [
  {
    id: "1",
    name: "Honeybird Cafe",
    address: "12 Sunset Blvd",
    city: "Austin, TX",
    website: "honeybird.cafe",
    imageQuery: "cafe interior",
    claimed: true,
    rating: 9.8,
    loveCount: 452,
    excerpt: "the lavender latte and Sunday vinyl sessions feel like home.",
    daysAgo: 12,
  },
  {
    id: "2",
    name: "Neon Koi",
    address: "88 Lantern St",
    city: "Brooklyn, NY",
    website: "neonkoi.nyc",
    imageQuery: "sushi lounge",
    claimed: true,
    rating: 9.6,
    loveCount: 389,
    excerpt: "the omakase counter glows pink and chef Mika remembers everyone.",
    daysAgo: 4,
  },
  {
    id: "3",
    name: "Mama Lola's",
    address: "44 Bourbon St",
    city: "New Orleans, LA",
    website: "mamalolas.com",
    imageQuery: "soul food restaurant",
    claimed: false,
    rating: 9.5,
    loveCount: 311,
    excerpt: "the gumbo tastes like a hug from someone who's missed you.",
    daysAgo: 21,
  },
  {
    id: "4",
    name: "The Velvet Olive",
    address: "9 Vine Way",
    city: "Los Angeles, CA",
    website: "velvetolive.la",
    imageQuery: "wine bar candlelight",
    claimed: true,
    rating: 9.4,
    loveCount: 278,
    excerpt: "candlelight, low jazz, and a sommelier who actually listens.",
    daysAgo: 2,
  },
  {
    id: "5",
    name: "Moonshade Rooftop",
    address: "300 High St",
    city: "Miami, FL",
    website: "moonshade.fl",
    imageQuery: "rooftop bar palm trees",
    claimed: false,
    rating: 9.3,
    loveCount: 244,
    excerpt: "sunset hits the palms and suddenly everyone is your friend.",
    daysAgo: 6,
  },
  {
    id: "6",
    name: "Otto's Pizza Pit",
    address: "5 Hearth Ln",
    city: "Chicago, IL",
    website: "ottospit.com",
    imageQuery: "neon pizza shop",
    claimed: true,
    rating: 9.2,
    loveCount: 199,
    excerpt: "the crust hits different at 1am after a show.",
    daysAgo: 30,
  },
];

const DAY = 24 * 60 * 60 * 1000;
const now = Date.now();

export const savedLettersMock: SavedLetter[] = [
  {
    id: "s1",
    venueName: "Neon Koi",
    city: "Brooklyn, NY",
    excerpt: "the omakase counter glows pink and chef Mika remembers everyone.",
    rating: 9.6,
    loveCount: 389,
    savedAt: now - 1 * DAY,
    unlockedAt: now - 1 * DAY,
  },
  {
    id: "s2",
    venueName: "Honeybird Cafe",
    city: "Austin, TX",
    excerpt: "the lavender latte and Sunday vinyl sessions feel like home.",
    rating: 9.8,
    loveCount: 452,
    savedAt: now - 9 * DAY,
    unlockedAt: now - 3 * DAY,
  },
  {
    id: "s3",
    venueName: "Mama Lola's",
    city: "New Orleans, LA",
    excerpt: "the gumbo tastes like a hug from someone who's missed you.",
    rating: 9.5,
    loveCount: 311,
    savedAt: now - 20 * DAY,
    unlockedAt: now - 12 * DAY,
  },
];

