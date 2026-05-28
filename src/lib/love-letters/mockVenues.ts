export type Venue = {
  id: string;
  name: string;
  address: string;
  city: string;
  website: string;
  imageQuery: string;
  claimed: boolean;
};

// Free-form category — venues can be anything.
export type VenueScope = "local" | "regional" | "global";

export type TrendingVenue = Venue & {
  rating: number;
  loveCount: number;
  excerpt: string;
  daysAgo: number;
  category: string;
  country: string;
  region: string; // continent / region grouping
  createdAt: number; // ms timestamp — used by time filter
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

const DAY = 24 * 60 * 60 * 1000;
const now = Date.now();
const ago = (d: number) => now - d * DAY;

export const trendingVenues: TrendingVenue[] = [
  { id: "1", name: "Honeybird Cafe", address: "12 Sunset Blvd", city: "Austin, TX", website: "honeybird.cafe", imageQuery: "cafe interior", claimed: true, rating: 9.8, loveCount: 452, excerpt: "the lavender latte and Sunday vinyl sessions feel like home.", daysAgo: 0, category: "Vinyl café", country: "United States", region: "North America", createdAt: ago(0) },
  { id: "2", name: "Neon Koi", address: "88 Lantern St", city: "Brooklyn, NY", website: "neonkoi.nyc", imageQuery: "sushi lounge", claimed: true, rating: 9.6, loveCount: 389, excerpt: "the omakase counter glows pink and chef Mika remembers everyone.", daysAgo: 2, category: "Omakase", country: "United States", region: "North America", createdAt: ago(2) },
  { id: "3", name: "Mama Lola's", address: "44 Bourbon St", city: "New Orleans, LA", website: "mamalolas.com", imageQuery: "soul food", claimed: false, rating: 9.5, loveCount: 311, excerpt: "the gumbo tastes like a hug from someone who's missed you.", daysAgo: 21, category: "Soul kitchen", country: "United States", region: "North America", createdAt: ago(21) },
  { id: "4", name: "The Velvet Olive", address: "9 Vine Way", city: "Los Angeles, CA", website: "velvetolive.la", imageQuery: "wine bar", claimed: true, rating: 9.4, loveCount: 278, excerpt: "candlelight, low jazz, and a sommelier who actually listens.", daysAgo: 2, category: "Wine bar", country: "United States", region: "North America", createdAt: ago(2) },
  { id: "5", name: "Moonshade Rooftop", address: "300 High St", city: "Miami, FL", website: "moonshade.fl", imageQuery: "rooftop bar", claimed: false, rating: 9.3, loveCount: 244, excerpt: "sunset hits the palms and suddenly everyone is your friend.", daysAgo: 6, category: "Rooftop", country: "United States", region: "North America", createdAt: ago(6) },
  { id: "6", name: "Otto's Pizza Pit", address: "5 Hearth Ln", city: "Chicago, IL", website: "ottospit.com", imageQuery: "neon pizza", claimed: true, rating: 9.2, loveCount: 199, excerpt: "the crust hits different at 1am after a show.", daysAgo: 30, category: "Late-night pizza", country: "United States", region: "North America", createdAt: ago(30) },
  { id: "7", name: "Cafe Lumière", address: "14 Rue Cler", city: "Paris", website: "cafelumiere.fr", imageQuery: "paris cafe", claimed: true, rating: 9.7, loveCount: 412, excerpt: "the croissants flake like applause and the espresso is poetry.", daysAgo: 1, category: "Patisserie", country: "France", region: "Europe", createdAt: ago(1) },
  { id: "8", name: "Sora Sky Bar", address: "2-1 Roppongi", city: "Tokyo", website: "sora.tokyo", imageQuery: "tokyo skyline bar", claimed: true, rating: 9.6, loveCount: 367, excerpt: "the skyline melts into highballs and the bartender bows when you smile.", daysAgo: 5, category: "Skyline bar", country: "Japan", region: "Asia", createdAt: ago(5) },
  { id: "9", name: "Casa Mar", address: "Calle 8", city: "Barcelona", website: "casamar.es", imageQuery: "tapas barcelona", claimed: false, rating: 9.5, loveCount: 298, excerpt: "the patatas bravas, the wine, the way nobody rushes you home.", daysAgo: 9, category: "Tapas", country: "Spain", region: "Europe", createdAt: ago(9) },
  { id: "10", name: "The Gilded Fox", address: "22 Soho Sq", city: "London", website: "gildedfox.uk", imageQuery: "london speakeasy", claimed: true, rating: 9.4, loveCount: 286, excerpt: "the speakeasy door, the smoky old fashioned, the velvet booths.", daysAgo: 7, category: "Speakeasy", country: "United Kingdom", region: "Europe", createdAt: ago(7) },
  { id: "11", name: "Banh & Brew", address: "12 Pasteur St", city: "Ho Chi Minh City", website: "banhbrew.vn", imageQuery: "vietnam coffee", claimed: false, rating: 9.5, loveCount: 271, excerpt: "the iced coffee is a religious experience under the fan blades.", daysAgo: 11, category: "Coffee bar", country: "Vietnam", region: "Asia", createdAt: ago(11) },
  { id: "12", name: "Bondi Bloom", address: "1 Campbell Pde", city: "Sydney", website: "bondibloom.au", imageQuery: "sydney brunch", claimed: true, rating: 9.3, loveCount: 233, excerpt: "smashed avo with a sea breeze and the friendliest dog patio in town.", daysAgo: 4, category: "Brunch", country: "Australia", region: "Oceania", createdAt: ago(4) },
  { id: "13", name: "Café Tortoni", address: "Av. de Mayo 825", city: "Buenos Aires", website: "tortoni.ar", imageQuery: "buenos aires cafe", claimed: false, rating: 9.4, loveCount: 254, excerpt: "the chocolate caliente, the tango ghosts, the mirrors that watched poets.", daysAgo: 14, category: "Historic café", country: "Argentina", region: "South America", createdAt: ago(14) },
  { id: "14", name: "Marrakech Mint Room", address: "Derb 9", city: "Marrakech", website: "mintroom.ma", imageQuery: "moroccan lounge", claimed: true, rating: 9.6, loveCount: 305, excerpt: "tagine, mint tea pulled from the sky, and lanterns like slow fireflies.", daysAgo: 6, category: "Tea lounge", country: "Morocco", region: "Africa", createdAt: ago(6) },
  { id: "15", name: "Skybar Athens", address: "Plaka 4", city: "Athens", website: "skybar.gr", imageQuery: "acropolis view bar", claimed: true, rating: 9.5, loveCount: 289, excerpt: "the Acropolis lit up while ouzo arrives — nothing else needs to happen.", daysAgo: 8, category: "View bar", country: "Greece", region: "Europe", createdAt: ago(8) },
  { id: "16", name: "Ramen Yokocho", address: "3-2 Shibuya", city: "Tokyo", website: "ramen-yokocho.jp", imageQuery: "ramen alley", claimed: true, rating: 9.5, loveCount: 332, excerpt: "the broth has secrets older than any of us; eat it slowly.", daysAgo: 3, category: "Ramen bar", country: "Japan", region: "Asia", createdAt: ago(3) },
  { id: "17", name: "Glassroom Gallery Café", address: "10 Mitte", city: "Berlin", website: "glassroom.de", imageQuery: "berlin gallery cafe", claimed: false, rating: 9.2, loveCount: 178, excerpt: "drink a flat white inside a quiet room of paintings — it rewires you.", daysAgo: 5, category: "Gallery café", country: "Germany", region: "Europe", createdAt: ago(5) },
  { id: "18", name: "Ipanema Beach Club", address: "Av. Vieira Souto", city: "Rio de Janeiro", website: "ipanemaclub.br", imageQuery: "rio beach club", claimed: true, rating: 9.4, loveCount: 261, excerpt: "caipirinhas, samba, and a sun that refuses to behave.", daysAgo: 10, category: "Beach club", country: "Brazil", region: "South America", createdAt: ago(10) },
  { id: "19", name: "Halong Tea House", address: "Bai Chay", city: "Halong", website: "halongtea.vn", imageQuery: "vietnam tea house", claimed: false, rating: 9.3, loveCount: 142, excerpt: "lotus tea, junk boats outside the window, time stops politely.", daysAgo: 18, category: "Tea house", country: "Vietnam", region: "Asia", createdAt: ago(18) },
  { id: "20", name: "Bierhaus Prenzlauer", address: "Schönhauser 12", city: "Berlin", website: "bierhaus.de", imageQuery: "berlin brewery", claimed: true, rating: 9.1, loveCount: 167, excerpt: "the hefeweizen, the wooden benches, the strangers who become friends.", daysAgo: 13, category: "Brewery", country: "Germany", region: "Europe", createdAt: ago(13) },
  { id: "21", name: "Kyoto Izakaya Hana", address: "Ponto-cho", city: "Kyoto", website: "hana.kyoto", imageQuery: "kyoto izakaya", claimed: true, rating: 9.6, loveCount: 295, excerpt: "sake, yakitori, paper lanterns — it feels like a love letter to dinner.", daysAgo: 4, category: "Izakaya", country: "Japan", region: "Asia", createdAt: ago(4) },
  { id: "22", name: "Hot Plate Diner", address: "Route 66", city: "Albuquerque, NM", website: "hotplate.us", imageQuery: "retro diner", claimed: false, rating: 9.0, loveCount: 121, excerpt: "green chile, jukebox, waitress named Joy who actually is.", daysAgo: 1, category: "Diner", country: "United States", region: "North America", createdAt: ago(1) },
  { id: "23", name: "Salt & Sail", address: "Pier 4", city: "Lisbon", website: "saltandsail.pt", imageQuery: "lisbon seafood", claimed: true, rating: 9.4, loveCount: 218, excerpt: "grilled sardines and a vinho verde that knows what summer is for.", daysAgo: 6, category: "Seafood", country: "Portugal", region: "Europe", createdAt: ago(6) },
  { id: "24", name: "Sunset Pottery Bar", address: "9 Calle Loiza", city: "San Juan", website: "sunsetpottery.pr", imageQuery: "pottery bar", claimed: false, rating: 9.2, loveCount: 156, excerpt: "make a mug, drink rum from it, fall in love with whoever's beside you.", daysAgo: 2, category: "Pottery bar", country: "Puerto Rico", region: "North America", createdAt: ago(2) },
  { id: "25", name: "The Jazz Cellar", address: "1 Rue des Lombards", city: "Paris", website: "jazzcellar.fr", imageQuery: "paris jazz", claimed: true, rating: 9.6, loveCount: 312, excerpt: "the bass walks in like an old lover and nobody touches their phone.", daysAgo: 5, category: "Jazz club", country: "France", region: "Europe", createdAt: ago(5) },
];

export const savedLettersMock: SavedLetter[] = [
  { id: "s1", venueName: "Neon Koi", city: "Brooklyn, NY", excerpt: "the omakase counter glows pink and chef Mika remembers everyone.", rating: 9.6, loveCount: 389, savedAt: now - 1 * DAY, unlockedAt: now - 1 * DAY },
  { id: "s2", venueName: "Honeybird Cafe", city: "Austin, TX", excerpt: "the lavender latte and Sunday vinyl sessions feel like home.", rating: 9.8, loveCount: 452, savedAt: now - 9 * DAY, unlockedAt: now - 3 * DAY },
  { id: "s3", venueName: "Mama Lola's", city: "New Orleans, LA", excerpt: "the gumbo tastes like a hug from someone who's missed you.", rating: 9.5, loveCount: 311, savedAt: now - 20 * DAY, unlockedAt: now - 12 * DAY },
];
