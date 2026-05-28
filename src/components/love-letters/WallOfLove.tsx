import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart, MapPin, TrendingUp } from "lucide-react";
import { trendingVenues, type TrendingVenue } from "@/lib/love-letters/mockVenues";
import { EmptyState } from "./EmptyState";
import { WallSkeleton } from "./WallSkeleton";

export function WallOfLove() {
  const [isLoading, setIsLoading] = useState(true);
  const [venues, setVenues] = useState<TrendingVenue[]>([]);

  useEffect(() => {
    const t = window.setTimeout(() => {
      setVenues(trendingVenues);
      setIsLoading(false);
    }, 700);
    return () => window.clearTimeout(t);
  }, []);

  const hasLetters = venues.length > 0;

  return (
    <section className="px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 sm:mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-mint">
            <TrendingUp className="mr-1 inline h-3.5 w-3.5" /> Wall of Love
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold sm:text-4xl">
            Trending <span className="text-gradient-love">this week</span>
          </h2>
        </div>

        {isLoading ? (
          <WallSkeleton />
        ) : hasLetters ? (
          <ul className="flex flex-col gap-2 sm:gap-2.5">
            {venues.map((v, i) => (
              <motion.li
                key={v.id}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                whileHover={{ x: 4 }}
                className="group glass relative flex items-center gap-3 overflow-hidden rounded-2xl px-3 py-2.5 transition hover:shadow-glow-pink sm:gap-4 sm:px-4 sm:py-3"
              >
                {/* Rank */}
                <div className="relative flex h-9 w-9 shrink-0 items-center justify-center sm:h-11 sm:w-11">
                  <div
                    className={`absolute inset-0 rounded-xl ${
                      i === 0
                        ? "bg-gradient-love shadow-glow-pink"
                        : i === 1
                        ? "bg-gradient-mint"
                        : "bg-foreground/5"
                    } transition group-hover:scale-110`}
                  />
                  <span
                    className={`relative font-display text-sm font-bold sm:text-base ${
                      i < 2 ? "text-white" : "text-foreground/70"
                    }`}
                  >
                    {i + 1}
                  </span>
                </div>

                {/* Name + location */}
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-display text-sm font-bold leading-tight sm:text-base">
                    {v.name}
                  </h3>
                  <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-muted-foreground sm:text-xs">
                    <MapPin className="h-2.5 w-2.5 shrink-0 text-mint sm:h-3 sm:w-3" />
                    {v.city}
                  </p>
                </div>

                {/* Rating */}
                <div className="flex shrink-0 items-center gap-1 text-xs font-semibold sm:text-sm">
                  <Heart className="h-3 w-3 fill-neon-pink text-neon-pink transition group-hover:animate-spin-heart sm:h-3.5 sm:w-3.5" />
                  {v.rating.toFixed(1)}
                </div>

                {/* Letter count */}
                <div className="flex shrink-0 flex-col items-end leading-tight">
                  <span className="font-display text-sm font-bold text-mint sm:text-base">
                    {v.loveCount}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-muted-foreground sm:text-[10px]">
                    letters
                  </span>
                </div>

                {/* Shimmer accent on hover */}
                <span className="pointer-events-none absolute inset-y-0 -left-full w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent transition-all duration-700 group-hover:left-full" />
              </motion.li>
            ))}
          </ul>
        ) : (
          <div className="glass rounded-3xl">
            <EmptyState
              title="No Love Letters yet"
              subtitle="Be the first to spread love. Find a place and send a Love Letter today."
              ctaLabel="Send a Love Letter"
              ctaHref="/"
            />
          </div>
        )}
      </div>
    </section>
  );
}
