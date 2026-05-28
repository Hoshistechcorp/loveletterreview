export type Venue = {
  id: string;
  name: string;
  address: string;
  city: string;
  website: string;
  imageQuery: string;
  claimed: boolean;
};

export type VenueCategory =
  | "all"
  | "cafe"
  | "restaurant"
  | "bar"
  | "rooftop"
  | "lounge";

export type VenueScope = "local" | "regional" | "global";

export type TrendingVenue = Venue & {
  rating: number;
  loveCount: number;
  excerpt: string;
  daysAgo: number;
  category: Exclude<VenueCategory, "all">;
  country: string;
  region: string; // continent / region grouping
};

export type SavedLetter = {
  id: string;
  venueName: string;
  city: string;
  excerpt: string;
  rating: number;
  loveCount: number;
  savedAt: number;
  unlockedAt: number;
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
  { id: "1", name: "Honeybird Cafe", address: "12 Sunset Blvd", city: "Austin, TX", website: "honeybird.cafe", imageQuery: "cafe interior", claimed: true, rating: 9.8, loveCount: 452, excerpt: "the lavender latte and Sunday vinyl sessions feel like home.", daysAgo: 12, category: "cafe", country: "United States", region: "North America" },
  { id: "2", name: "Neon Koi", address: "88 Lantern St", city: "Brooklyn, NY", website: "neonkoi.nyc", imageQuery: "sushi lounge", claimed: true, rating: 9.6, loveCount: 389, excerpt: "the omakase counter glows pink and chef Mika remembers everyone.", daysAgo: 4, category: "restaurant", country: "United States", region: "North America" },
  { id: "3", name: "Mama Lola's", address: "44 Bourbon St", city: "New Orleans, LA", website: "mamalolas.com", imageQuery: "soul food", claimed: false, rating: 9.5, loveCount: 311, excerpt: "the gumbo tastes like a hug from someone who's missed you.", daysAgo: 21, category: "restaurant", country: "United States", region: "North America" },
  { id: "4", name: "The Velvet Olive", address: "9 Vine Way", city: "Los Angeles, CA", website: "velvetolive.la", imageQuery: "wine bar", claimed: true, rating: 9.4, loveCount: 278, excerpt: "candlelight, low jazz, and a sommelier who actually listens.", daysAgo: 2, category: "bar", country: "United States", region: "North America" },
  { id: "5", name: "Moonshade Rooftop", address: "300 High St", city: "Miami, FL", website: "moonshade.fl", imageQuery: "rooftop bar", claimed: false, rating: 9.3, loveCount: 244, excerpt: "sunset hits the palms and suddenly everyone is your friend.", daysAgo: 6, category: "rooftop", country: "United States", region: "North America" },
  { id: "6", name: "Otto's Pizza Pit", address: "5 Hearth Ln", city: "Chicago, IL", website: "ottospit.com", imageQuery: "neon pizza", claimed: true, rating: 9.2, loveCount: 199, excerpt: "the crust hits different at 1am after a show.", daysAgo: 30, category: "restaurant", country: "United States", region: "North America" },
  { id: "7", name: "Cafe Lumière", address: "14 Rue Cler", city: "Paris", website: "cafelumiere.fr", imageQuery: "paris cafe", claimed: true, rating: 9.7, loveCount: 412, excerpt: "the croissants flake like applause and the espresso is poetry.", daysAgo: 3, category: "cafe", country: "France", region: "Europe" },
  { id: "8", name: "Sora Sky Bar", address: "2-1 Roppongi", city: "Tokyo", website: "sora.tokyo", imageQuery: "tokyo skyline bar", claimed: true, rating: 9.6, loveCount: 367, excerpt: "the skyline melts into highballs and the bartender bows when you smile.", daysAgo: 5, category: "rooftop", country: "Japan", region: "Asia" },
  { id: "9", name: "Casa Mar", address: "Calle 8", city: "Barcelona", website: "casamar.es", imageQuery: "tapas barcelona", claimed: false, rating: 9.5, loveCount: 298, excerpt: "the patatas bravas, the wine, the way nobody rushes you home.", daysAgo: 9, category: "restaurant", country: "Spain", region: "Europe" },
  { id: "10", name: "The Gilded Fox", address: "22 Soho Sq", city: "London", website: "gildedfox.uk", imageQuery: "london speakeasy", claimed: true, rating: 9.4, loveCount: 286, excerpt: "the speakeasy door, the smoky old fashioned, the velvet booths.", daysAgo: 7, category: "lounge", country: "United Kingdom", region: "Europe" },
  { id: "11", name: "Banh & Brew", address: "12 Pasteur St", city: "Ho Chi Minh City", website: "banhbrew.vn", imageQuery: "vietnam coffee", claimed: false, rating: 9.5, loveCount: 271, excerpt: "the iced coffee is a religious experience under the fan blades.", daysAgo: 11, category: "cafe", country: "Vietnam", region: "Asia" },
  { id: "12", name: "Bondi Bloom", address: "1 Campbell Pde", city: "Sydney", website: "bondibloom.au", imageQuery: "sydney brunch", claimed: true, rating: 9.3, loveCount: 233, excerpt: "smashed avo with a sea breeze and the friendliest dog patio in town.", daysAgo: 4, category: "cafe", country: "Australia", region: "Oceania" },
  { id: "13", name: "Café Tortoni", address: "Av. de Mayo 825", city: "Buenos Aires", website: "tortoni.ar", imageQuery: "buenos aires cafe", claimed: false, rating: 9.4, loveCount: 254, excerpt: "the chocolate caliente, the tango ghosts, the mirrors that watched poets.", daysAgo: 14, category: "cafe", country: "Argentina", region: "South America" },
  { id: "14", name: "Marrakech Mint Room", address: "Derb 9", city: "Marrakech", website: "mintroom.ma", imageQuery: "moroccan lounge", claimed: true, rating: 9.6, loveCount: 305, excerpt: "tagine, mint tea pulled from the sky, and lanterns like slow fireflies.", daysAgo: 6, category: "lounge", country: "Morocco", region: "Africa" },
  { id: "15", name: "Skybar Athens", address: "Plaka 4", city: "Athens", website: "skybar.gr", imageQuery: "acropolis view bar", claimed: true, rating: 9.5, loveCount: 289, excerpt: "the Acropolis lit up while ouzo arrives — nothing else needs to happen.", daysAgo: 8, category: "rooftop", country: "Greece", region: "Europe" },
];

const DAY = 24 * 60 * 60 * 1000;
const now = Date.now();

export const savedLettersMock: SavedLetter[] = [
  { id: "s1", venueName: "Neon Koi", city: "Brooklyn, NY", excerpt: "the omakase counter glows pink and chef Mika remembers everyone.", rating: 9.6, loveCount: 389, savedAt: now - 1 * DAY, unlockedAt: now - 1 * DAY },
  { id: "s2", venueName: "Honeybird Cafe", city: "Austin, TX", excerpt: "the lavender latte and Sunday vinyl sessions feel like home.", rating: 9.8, loveCount: 452, savedAt: now - 9 * DAY, unlockedAt: now - 3 * DAY },
  { id: "s3", venueName: "Mama Lola's", city: "New Orleans, LA", excerpt: "the gumbo tastes like a hug from someone who's missed you.", rating: 9.5, loveCount: 311, savedAt: now - 20 * DAY, unlockedAt: now - 12 * DAY },
];
