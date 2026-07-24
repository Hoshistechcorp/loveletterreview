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

export type CategoryGroup =
  | "Restaurants & bars"
  | "Hotels & stays"
  | "Things to do"
  | "Destinations";

export const CATEGORY_GROUPS: CategoryGroup[] = [
  "Restaurants & bars",
  "Hotels & stays",
  "Things to do",
  "Destinations",
];

export type Review = {
  id: string;
  author: string;
  initials: string;
  rating: number;
  title: string;
  body: string;
  daysAgo: number;
  helpful: number;
  visited: string;
};

export type TrendingVenue = Venue & {
  rating: number;
  loveCount: number;
  excerpt: string;
  daysAgo: number;
  category: string;
  categoryGroup: CategoryGroup;
  country: string;
  region: string; // continent / region grouping
  createdAt: number; // ms timestamp — used by time filter
  photo: string;
  reviews: Review[];
  lat: number;
  lng: number;
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

type RawVenue = Omit<TrendingVenue, "categoryGroup" | "photo" | "reviews" | "lat" | "lng">;

const coordsById: Record<string, { lat: number; lng: number }> = {
  "1": { lat: 30.2672, lng: -97.7431 }, // Austin
  "2": { lat: 40.6782, lng: -73.9442 }, // Brooklyn
  "3": { lat: 29.9511, lng: -90.0715 }, // New Orleans
  "4": { lat: 34.0522, lng: -118.2437 }, // LA
  "5": { lat: 25.7617, lng: -80.1918 }, // Miami
  "6": { lat: 41.8781, lng: -87.6298 }, // Chicago
  "7": { lat: 48.8566, lng: 2.3522 }, // Paris
  "8": { lat: 35.6762, lng: 139.6503 }, // Tokyo
  "9": { lat: 41.3851, lng: 2.1734 }, // Barcelona
  "10": { lat: 51.5074, lng: -0.1278 }, // London
  "11": { lat: 10.8231, lng: 106.6297 }, // HCMC
  "12": { lat: -33.8688, lng: 151.2093 }, // Sydney
  "13": { lat: -34.6037, lng: -58.3816 }, // BA
  "14": { lat: 31.6295, lng: -7.9811 }, // Marrakech
  "15": { lat: 37.9838, lng: 23.7275 }, // Athens
  "16": { lat: 35.6595, lng: 139.7004 }, // Shibuya
  "17": { lat: 52.52, lng: 13.405 }, // Berlin
  "18": { lat: -22.9068, lng: -43.1729 }, // Rio
  "19": { lat: 20.9101, lng: 107.1839 }, // Halong
  "20": { lat: 69.6492, lng: 18.9553 }, // Tromsø
  "21": { lat: 35.0116, lng: 135.7681 }, // Kyoto
  "22": { lat: 36.4618, lng: 25.3753 }, // Santorini
  "23": { lat: 51.4968, lng: -115.9281 }, // Banff
  "24": { lat: 30.3285, lng: 35.4444 }, // Petra
  "25": { lat: 63.8804, lng: -22.4495 }, // Blue Lagoon
};


const rawTrendingVenues: RawVenue[] = [
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
  { id: "20", name: "Hotel Aurora", address: "Tromsø Centrum", city: "Tromsø", website: "hotelaurora.no", imageQuery: "boutique hotel northern lights", claimed: true, rating: 9.7, loveCount: 198, excerpt: "fell asleep under the northern lights through a glass ceiling — unreal.", daysAgo: 4, category: "Boutique hotel", country: "Norway", region: "Europe", createdAt: ago(4) },
  { id: "21", name: "Kyoto Izakaya Hana", address: "Ponto-cho", city: "Kyoto", website: "hana.kyoto", imageQuery: "kyoto izakaya", claimed: true, rating: 9.6, loveCount: 295, excerpt: "sake, yakitori, paper lanterns — it feels like a love letter to dinner.", daysAgo: 4, category: "Izakaya", country: "Japan", region: "Asia", createdAt: ago(4) },
  { id: "22", name: "Santorini Cliffside Resort", address: "Oia Caldera", city: "Santorini", website: "cliffside.gr", imageQuery: "santorini resort", claimed: true, rating: 9.8, loveCount: 367, excerpt: "the infinity pool melts into the Aegean — pure honeymoon energy.", daysAgo: 3, category: "Cliffside resort", country: "Greece", region: "Europe", createdAt: ago(3) },
  { id: "23", name: "Banff National Park", address: "Improvement District", city: "Banff", website: "banff.ca", imageQuery: "banff lake louise", claimed: false, rating: 9.9, loveCount: 521, excerpt: "Lake Louise turned turquoise at sunrise — I cried, no shame.", daysAgo: 1, category: "National park", country: "Canada", region: "North America", createdAt: ago(1) },
  { id: "24", name: "Petra Ancient City", address: "Wadi Musa", city: "Petra", website: "visitpetra.jo", imageQuery: "petra jordan", claimed: false, rating: 9.7, loveCount: 298, excerpt: "walked through the Siq at dawn — the Treasury reveal still echoes.", daysAgo: 12, category: "Historic landmark", country: "Jordan", region: "Middle East", createdAt: ago(12) },
  { id: "25", name: "Reykjavík Blue Lagoon", address: "Norðurljósavegur", city: "Reykjavík", website: "bluelagoon.is", imageQuery: "blue lagoon iceland", claimed: true, rating: 9.5, loveCount: 244, excerpt: "geothermal silk water in a black lava field — every cell exhales.", daysAgo: 5, category: "Thermal spa", country: "Iceland", region: "Europe", createdAt: ago(5) },
];

function categoryGroupFor(category: string): CategoryGroup {
  const c = category.toLowerCase();
  if (/(hotel|resort|stay|lodge|inn|boutique)/.test(c)) return "Hotels & stays";
  if (/(park|landmark|spa|tour|museum|gallery)/.test(c)) return "Things to do";
  if (/(island|city|destination|beach club)/.test(c) || category === "National park" || category === "Historic landmark" || category === "Thermal spa") return "Destinations";
  return "Restaurants & bars";
}

const photoFor = (id: string, query: string) =>
  `https://images.unsplash.com/photo-${
    {
      "1": "1554118811-1e0d58224f24", // cafe
      "2": "1517248135467-4c7edcad34c4", // sushi
      "3": "1555126634-323283e090fa", // soul food
      "4": "1510812431401-41d2bd2722f3", // wine bar
      "5": "1519214605650-76a613ee3245", // rooftop
      "6": "1565299624946-b28f40a0ae38", // pizza
      "7": "1511920170033-f8396924c348", // paris cafe
      "8": "1542931287-023b922fa89b", // tokyo bar
      "9": "1515443961218-a51367888e4b", // tapas
      "10": "1543007631-283050bb3e8c", // speakeasy
      "11": "1495474472287-4d71bcdd2085", // coffee
      "12": "1493770348161-369560ae357d", // brunch
      "13": "1559925393-8be0ec4767c8", // historic cafe
      "14": "1542361345-89e58247f2d5", // moroccan
      "15": "1555992336-fb0d29498b13", // athens
      "16": "1557872943-16a5ac26437e", // ramen
      "17": "1559496417-e7f25cb247cd", // gallery cafe
      "18": "1483683804023-6ccdb62f86ef", // rio
      "19": "1545048702-79362596cdc9", // tea house
      "20": "1531366936337-7c912a4589a7", // aurora hotel
      "21": "1564631027894-5bdb17613b2c", // izakaya
      "22": "1570077188670-e3a8d69ac5ff", // santorini
      "23": "1503614472-8c93d56e92ce", // banff
      "24": "1563177682-3b7e7f1d5e4e", // petra
      "25": "1531168556467-80aace0d0144", // blue lagoon
    }[id] ?? "1517248135467-4c7edcad34c4"
  }?auto=format&fit=crop&w=1200&q=70`;

const reviewAuthors = [
  { name: "Maya Chen", initials: "MC" },
  { name: "Diego Alvarez", initials: "DA" },
  { name: "Priya Singh", initials: "PS" },
  { name: "Jordan Park", initials: "JP" },
  { name: "Amara Okafor", initials: "AO" },
  { name: "Léa Dubois", initials: "LD" },
  { name: "Yuki Tanaka", initials: "YT" },
];

function reviewsFor(v: RawVenue): Review[] {
  const titles = [
    "An absolute love letter",
    "Worth every step",
    "Quietly extraordinary",
    "I keep coming back",
    "Bring someone you love",
  ];
  const bodies = [
    v.excerpt + " It stayed with me for days.",
    "Staff treated us like family, not customers. We will be back before the year ends.",
    "Atmosphere, details, and the small moments — everything felt curated with care.",
    "Came in skeptical, left writing a Love Letter. Worth the detour.",
    "If you only do one thing in " + v.city.split(",")[0] + ", make it this place.",
  ];
  const count = 3 + (parseInt(v.id, 10) % 3); // 3-5 reviews
  return Array.from({ length: count }, (_, i) => {
    const a = reviewAuthors[(parseInt(v.id, 10) + i) % reviewAuthors.length];
    const rating = Math.max(7, Math.min(10, v.rating - (i === 0 ? 0 : i * 0.3 - 0.1)));
    const monthIdx = (parseInt(v.id, 10) + i) % 12;
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return {
      id: `${v.id}-r${i}`,
      author: a.name,
      initials: a.initials,
      rating: Math.round(rating * 10) / 10,
      title: titles[(parseInt(v.id, 10) + i) % titles.length],
      body: bodies[(parseInt(v.id, 10) + i) % bodies.length],
      daysAgo: v.daysAgo + i * 6 + 1,
      helpful: Math.max(2, Math.round(v.loveCount / (10 + i * 6))),
      visited: `Visited ${months[monthIdx]} 2026`,
    };
  });
}

export const trendingVenues: TrendingVenue[] = rawTrendingVenues.map((v) => ({
  ...v,
  categoryGroup: categoryGroupFor(v.category),
  photo: photoFor(v.id, v.imageQuery),
  reviews: reviewsFor(v),
  lat: coordsById[v.id]?.lat ?? 0,
  lng: coordsById[v.id]?.lng ?? 0,
}));

export const savedLettersMock: SavedLetter[] = [
  { id: "s1", venueName: "Neon Koi", city: "Brooklyn, NY", excerpt: "the omakase counter glows pink and chef Mika remembers everyone.", rating: 9.6, loveCount: 389, savedAt: now - 1 * DAY, unlockedAt: now - 1 * DAY },
  { id: "s2", venueName: "Honeybird Cafe", city: "Austin, TX", excerpt: "the lavender latte and Sunday vinyl sessions feel like home.", rating: 9.8, loveCount: 452, savedAt: now - 9 * DAY, unlockedAt: now - 3 * DAY },
  { id: "s3", venueName: "Mama Lola's", city: "New Orleans, LA", excerpt: "the gumbo tastes like a hug from someone who's missed you.", rating: 9.5, loveCount: 311, savedAt: now - 20 * DAY, unlockedAt: now - 12 * DAY },
];
