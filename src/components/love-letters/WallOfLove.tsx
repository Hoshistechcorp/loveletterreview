import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Heart, MapPin, Star, TrendingUp } from "lucide-react";
import { trendingVenues, type TrendingVenue } from "@/lib/love-letters/mockVenues";
import { EmptyState } from "./EmptyState";
import { WallSkeleton } from "./WallSkeleton";

export type WallFilter = "top" | "most" | "new";
export type WallTime = "today" | "week" | "month" | "all";

const TOP_N = 10;

type Props = {
  filter?: WallFilter;
  onFilterChange?: (f: WallFilter) => void;
  location?: string;
  onLocationChange?: (v: string) => void;
  time?: WallTime;
  onTimeChange?: (t: WallTime) => void;
  onWriteForVenue?: (v: TrendingVenue) => void;
};

export function WallOfLove({ onWriteForVenue }: Props = {}) {
  const [isLoading, setIsLoading] = useState(true);
  const [venues, setVenues] = useState<TrendingVenue[]>([]);

  useEffect(() => {
    const t = window.setTimeout(() => {
      setVenues(trendingVenues);
      setIsLoading(false);
    }, 700);
    return () => window.clearTimeout(t);
  }, []);

  const sorted = useMemo(
    () => [...venues].sort((a, b) => b.loveCount - a.loveCount).slice(0, TOP_N),
    [venues],
  );

  const hasLetters = sorted.length > 0;
  const podium = sorted.slice(0, 3);
  const rest = sorted.slice(3);
  const maxLove = sorted[0]?.loveCount ?? 1;

  // Desktop podium order: [#2, #1, #3]
  const podiumOrdered = podium.length === 3 ? [podium[1], podium[0], podium[2]] : podium;

  return (
    <section className="px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 text-center sm:mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-mint">
            <TrendingUp className="mr-1 inline h-3.5 w-3.5" /> Leaderboard · Top {TOP_N}
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold sm:text-5xl">
            <span className="text-gradient-love">Wall of Fame</span>
          </h2>
          <p className="mt-2 text-xs text-muted-foreground sm:text-sm">
            The most loved places on iBloov — ranked by love letters received.
          </p>
        </div>

        {isLoading ? (
          <WallSkeleton />
        ) : hasLetters ? (
          <>
            {/* PODIUM */}
            {podium.length > 0 && (
              <div className="mb-8 grid grid-cols-1 items-end gap-4 sm:grid-cols-3 sm:gap-6">
                {podiumOrdered.map((v) => {
                  const rank = (podium.indexOf(v) + 1) as 1 | 2 | 3;
                  return (
                    <PodiumCard
                      key={v.id}
                      venue={v}
                      rank={rank}
                      onWrite={() => onWriteForVenue?.(v)}
                    />
                  );
                })}
              </div>
            )}

            {/* REST */}
            {rest.length > 0 && (
              <ul className="flex flex-col gap-2.5">
                {rest.map((v, i) => {
                  const rank = i + 4;
                  const pct = Math.max(8, Math.round((v.loveCount / maxLove) * 100));
                  return (
                    <motion.li
                      key={v.id}
                      initial={{ opacity: 0, x: -16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ duration: 0.35, delay: i * 0.04 }}
                    >
                      <button
                        onClick={() => onWriteForVenue?.(v)}
                        className="glass group flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition hover:shadow-glow-pink sm:gap-4 sm:px-5 sm:py-3.5"
                      >
                        <RankStar rank={rank} variant="list" />
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate font-display text-sm font-bold leading-tight sm:text-base">
                            {v.name}
                          </h3>
                          <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-muted-foreground sm:text-xs">
                            <MapPin className="h-2.5 w-2.5 shrink-0 text-mint sm:h-3 sm:w-3" />
                            {v.city} · {v.country}
                          </p>
                        </div>
                        <div className="flex w-32 shrink-0 flex-col items-end gap-1 sm:w-44">
                          <span className="font-display text-sm font-bold text-mint sm:text-base">
                            {v.loveCount} <span className="text-[10px] uppercase tracking-wider text-muted-foreground">letters</span>
                          </span>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-foreground/10">
                            <div
                              className="h-full rounded-full bg-gradient-love"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      </button>
                    </motion.li>
                  );
                })}
              </ul>
            )}
          </>
        ) : (
          <div className="glass rounded-3xl">
            <EmptyState
              title="No Love Letters yet"
              subtitle="Be the first to spread the love."
              ctaLabel="Send a Love Letter"
              ctaHref="/"
            />
          </div>
        )}
      </div>
    </section>
  );
}

function RankStar({
  rank,
  variant,
}: {
  rank: number;
  variant: "podium" | "list";
}) {
  const color =
    rank === 1
      ? "text-amber-300 fill-amber-300"
      : rank === 2
      ? "text-sky-400 fill-sky-400"
      : rank === 3
      ? "text-neon-pink fill-neon-pink"
      : "text-purple fill-purple";

  const size =
    variant === "podium"
      ? rank === 1
        ? "h-14 w-14 sm:h-16 sm:w-16"
        : "h-12 w-12 sm:h-14 sm:w-14"
      : "h-8 w-8 sm:h-9 sm:w-9";

  const textSize = variant === "podium" ? (rank === 1 ? "text-base" : "text-sm") : "text-[10px] sm:text-xs";

  return (
    <div className={`relative shrink-0 ${size}`}>
      <Star className={`absolute inset-0 h-full w-full ${color}`} strokeWidth={1.25} />
      <span
        className={`absolute inset-0 flex items-center justify-center font-display font-bold text-black ${textSize}`}
      >
        {rank}
      </span>
    </div>
  );
}

function PodiumCard({
  venue,
  rank,
  onWrite,
}: {
  venue: TrendingVenue;
  rank: 1 | 2 | 3;
  onWrite: () => void;
}) {
  const styles =
    rank === 1
      ? {
          height: "sm:min-h-[360px]",
          ring: "ring-2 ring-amber-300/50",
          glow: "shadow-glow-pink",
          points: "text-amber-300",
          accent: "from-amber-300/15 via-neon-pink/10 to-transparent",
        }
      : rank === 2
      ? {
          height: "sm:min-h-[320px]",
          ring: "ring-1 ring-sky-400/40",
          glow: "shadow-glow-mint",
          points: "text-sky-400",
          accent: "from-sky-400/10 via-mint/10 to-transparent",
        }
      : {
          height: "sm:min-h-[320px]",
          ring: "ring-1 ring-neon-pink/40",
          glow: "shadow-glow-pink",
          points: "text-neon-pink",
          accent: "from-neon-pink/10 via-purple/10 to-transparent",
        };

  return (
    <motion.button
      onClick={onWrite}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: rank * 0.08 }}
      className={`glass relative flex flex-col items-center overflow-hidden rounded-3xl px-5 pb-6 pt-10 text-center transition hover:scale-[1.02] ${styles.height} ${styles.ring} ${styles.glow}`}
    >
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${styles.accent}`} />

      {/* Floating star rank badge */}
      <div className="absolute -top-2 left-1/2 z-10 -translate-x-1/2">
        <RankStar rank={rank} variant="podium" />
      </div>

      <div className="relative mt-4 flex flex-1 flex-col items-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-love text-3xl shadow-glow-pink sm:h-24 sm:w-24 sm:text-4xl">
          {venue.name.slice(0, 1).toUpperCase()}
        </div>

        <h3
          className={`mt-3 font-display font-bold leading-tight ${
            rank === 1 ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"
          }`}
        >
          {venue.name}
        </h3>
        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3 text-mint" />
          {venue.city} · {venue.country}
        </p>

        <div className={`mt-auto pt-5 font-display font-bold ${styles.points} ${rank === 1 ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl"}`}>
          {venue.loveCount}
          <span className="ml-1 text-xs font-semibold uppercase tracking-wider opacity-80">
            letters
          </span>
        </div>

        <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-foreground/70">
          <Heart className="h-3 w-3 fill-neon-pink text-neon-pink" />
          {venue.rating.toFixed(1)} rating
        </div>
      </div>
    </motion.button>
  );
}
