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
  },
];
