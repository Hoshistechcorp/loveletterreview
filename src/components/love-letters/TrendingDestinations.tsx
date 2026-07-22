import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { useMemo } from "react";
import { trendingVenues } from "@/lib/love-letters/mockVenues";

export function TrendingDestinations() {
  const destinations = useMemo(() => {
    const byCity = new Map<
      string,
      { city: string; country: string; photo: string; letters: number }
    >();
    for (const v of trendingVenues) {
      const key = v.city.split(",")[0].trim();
      const cur = byCity.get(key);
      if (cur) {
        cur.letters += v.loveCount;
      } else {
        byCity.set(key, {
          city: key,
          country: v.country,
          photo: v.photo,
          letters: v.loveCount,
        });
      }
    }
    return Array.from(byCity.values())
      .sort((a, b) => b.letters - a.letters)
      .slice(0, 10);
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-3 flex items-end justify-between">
        <div>
          <h2 className="font-display text-xl font-bold sm:text-2xl">
            Trending destinations
          </h2>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Cities the world is loving right now.
          </p>
        </div>
      </div>
      <div className="scrollbar-none -mx-4 flex gap-3 overflow-x-auto px-4 pb-2">
        {destinations.map((d, i) => (
          <motion.a
            key={d.city}
            href="#wall"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.35 }}
            className="group relative h-40 w-56 shrink-0 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm transition hover:shadow-glow-mint sm:h-48 sm:w-64"
          >
            <img
              src={d.photo}
              alt={d.city}
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-3 text-white">
              <div className="flex items-center gap-1 text-[11px] opacity-90">
                <MapPin className="h-3 w-3" />
                {d.country}
              </div>
              <div className="font-display text-lg font-bold leading-tight">
                {d.city}
              </div>
              <div className="text-[11px] opacity-90">{d.letters} love letters</div>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
