import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Heart, MapPin, TrendingUp } from "lucide-react";
import { trendingVenues, type TrendingVenue } from "@/lib/love-letters/mockVenues";
import { EmptyState } from "./EmptyState";
import { WallSkeleton } from "./WallSkeleton";

export type WallFilter = "top" | "most" | "new";

const FILTERS: { id: WallFilter; label: string }[] = [
  { id: "top", label: "Top rated" },
  { id: "most", label: "Most letters" },
  { id: "new", label: "New this week" },
];

type Props = {
  filter?: WallFilter;
  onFilterChange?: (f: WallFilter) => void;
};

export function WallOfLove({ filter: filterProp, onFilterChange }: Props = {}) {
  const [isLoading, setIsLoading] = useState(true);
  const [venues, setVenues] = useState<TrendingVenue[]>([]);
  const [filterState, setFilterState] = useState<WallFilter>("top");
  const filter = filterProp ?? filterState;
  const setFilter = (f: WallFilter) => {
    onFilterChange ? onFilterChange(f) : setFilterState(f);
  };
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const t = window.setTimeout(() => {
      setVenues(trendingVenues);
      setIsLoading(false);
    }, 700);
    return () => window.clearTimeout(t);
  }, []);

  const sorted = useMemo(() => {
    const copy = [...venues];
    if (filter === "top") return copy.sort((a, b) => b.rating - a.rating);
    if (filter === "most") return copy.sort((a, b) => b.loveCount - a.loveCount);
    return copy.filter((v) => v.daysAgo <= 7).sort((a, b) => a.daysAgo - b.daysAgo);
  }, [venues, filter]);

  const hasLetters = sorted.length > 0;

  return (
    <section className="px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-5 sm:mb-7">
          <p className="text-xs font-semibold uppercase tracking-widest text-mint">
            <TrendingUp className="mr-1 inline h-3.5 w-3.5" /> Wall of Love
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold sm:text-4xl">
            Trending <span className="text-gradient-love">this week</span>
          </h2>

          {/* Filter chips */}
          <div className="mt-4 flex flex-wrap gap-2">
            {FILTERS.map((f) => {
              const active = filter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition sm:text-sm ${
                    active
                      ? "border-transparent bg-gradient-love text-white shadow-glow-pink"
                      : "border-foreground/15 bg-foreground/[0.03] text-foreground/70 hover:border-mint/40 hover:text-foreground"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {isLoading ? (
          <WallSkeleton />
        ) : hasLetters ? (
          <ul className="flex flex-col gap-2 sm:gap-2.5">
            {sorted.map((v, i) => {
              const isOpen = expanded === v.id;
              return (
                <motion.li
                  key={v.id}
                  layout
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                  className="group glass relative overflow-hidden rounded-2xl transition hover:shadow-glow-pink"
                >
                  <button
                    onClick={() => setExpanded(isOpen ? null : v.id)}
                    className="flex w-full items-center gap-3 px-3 py-2.5 text-left sm:gap-4 sm:px-4 sm:py-3"
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
                      <Heart className="h-3 w-3 fill-neon-pink text-neon-pink sm:h-3.5 sm:w-3.5" />
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

                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-foreground/40 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="exp"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden border-t border-foreground/5"
                      >
                        <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:py-3.5">
                          <p className="font-display text-sm italic leading-relaxed text-foreground/80 sm:text-base">
                            <span className="font-semibold text-mint">
                              I love this place because
                            </span>{" "}
                            {v.excerpt}
                          </p>
                          <button className="inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-love px-4 py-2 text-xs font-bold text-white shadow-glow-pink transition hover:brightness-110 sm:text-sm">
                            Read &amp; Write more
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.li>
              );
            })}
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
