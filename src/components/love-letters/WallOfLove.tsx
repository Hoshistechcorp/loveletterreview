import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart, TrendingUp } from "lucide-react";
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
    <section className="px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-mint">
            <TrendingUp className="mr-1 inline h-3.5 w-3.5" /> Wall of Love
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
            Trending <span className="text-gradient-love">this week</span>
          </h2>
        </div>

        {isLoading ? (
          <WallSkeleton />
        ) : hasLetters ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {venues.map((v, i) => (
              <motion.article
                key={v.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="glass group overflow-hidden rounded-3xl transition hover:-translate-y-1 hover:shadow-glow-pink"
              >
                <div className="relative h-36 overflow-hidden">
                  <img
                    src={`https://source.unsplash.com/featured/600x400/?${encodeURIComponent(
                      v.imageQuery,
                    )}`}
                    alt={v.name}
                    className="h-full w-full object-cover transition group-hover:scale-110"
                    onError={(e) =>
                      ((e.currentTarget as HTMLImageElement).style.display = "none")
                    }
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/10 to-transparent" />
                  <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 text-xs font-bold text-white backdrop-blur">
                    #{i + 1}
                  </div>
                  {!v.claimed && (
                    <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-gradient-love px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                      Unclaimed
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-display text-lg font-bold leading-tight">
                    {v.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">{v.city}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-sm font-semibold">
                      <Heart className="h-3.5 w-3.5 fill-neon-pink text-neon-pink" />
                      {v.rating.toFixed(1)}/10
                    </span>
                    <span className="text-xs text-muted-foreground">
                      <span className="font-semibold text-mint">{v.loveCount}</span>{" "}
                      Love Letters
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
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
