import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Globe2, Heart, MapPin, TrendingUp } from "lucide-react";
import {
  trendingVenues,
  type TrendingVenue,
  type VenueCategory,
} from "@/lib/love-letters/mockVenues";
import { EmptyState } from "./EmptyState";
import { WallSkeleton } from "./WallSkeleton";

export type WallFilter = "top" | "most" | "new";
export type WallScope = "local" | "regional" | "global";

const FILTERS: { id: WallFilter; label: string }[] = [
  { id: "top", label: "Top rated" },
  { id: "most", label: "Most letters" },
  { id: "new", label: "New this week" },
];

const SCOPES: { id: WallScope; label: string }[] = [
  { id: "local", label: "Local" },
  { id: "regional", label: "Regional" },
  { id: "global", label: "Global" },
];

const CATEGORIES: { id: VenueCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "cafe", label: "Cafés" },
  { id: "restaurant", label: "Restaurants" },
  { id: "bar", label: "Bars" },
  { id: "rooftop", label: "Rooftops" },
  { id: "lounge", label: "Lounges" },
];

// Mock "you" — in a real app this comes from geolocation / profile.
const USER_LOCATION = {
  city: "Brooklyn, NY",
  country: "United States",
  region: "North America",
};

const TOP_N = 10;

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
  const [scope, setScope] = useState<WallScope>("global");
  const [category, setCategory] = useState<VenueCategory>("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const t = window.setTimeout(() => {
      setVenues(trendingVenues);
      setIsLoading(false);
    }, 700);
    return () => window.clearTimeout(t);
  }, []);

  const sorted = useMemo(() => {
    let copy = [...venues];

    // Scope: local (same city) → regional (same continent) → global (all)
    if (scope === "local") {
      copy = copy.filter((v) => v.city === USER_LOCATION.city);
    } else if (scope === "regional") {
      copy = copy.filter((v) => v.region === USER_LOCATION.region);
    }

    if (category !== "all") {
      copy = copy.filter((v) => v.category === category);
    }

    if (filter === "top") copy.sort((a, b) => b.rating - a.rating);
    else if (filter === "most") copy.sort((a, b) => b.loveCount - a.loveCount);
    else copy = copy.filter((v) => v.daysAgo <= 7).sort((a, b) => a.daysAgo - b.daysAgo);

    return copy.slice(0, TOP_N);
  }, [venues, filter, scope, category]);

  const hasLetters = sorted.length > 0;

  const scopeLabel =
    scope === "local"
      ? USER_LOCATION.city
      : scope === "regional"
      ? USER_LOCATION.region
      : "the world";

  return (
    <section className="px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-5 sm:mb-7">
          <p className="text-xs font-semibold uppercase tracking-widest text-mint">
            <TrendingUp className="mr-1 inline h-3.5 w-3.5" /> Wall of Love · Top {TOP_N}
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold sm:text-4xl">
            Trending across{" "}
            <span className="text-gradient-love">{scopeLabel}</span>
          </h2>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground sm:text-sm">
            <Globe2 className="h-3.5 w-3.5 text-mint" />
            Rankings update by scope, category, and time.
          </p>

          {/* Scope (Local / Regional / Global) */}
          <div className="mt-4 inline-flex rounded-full border border-foreground/15 bg-foreground/[0.03] p-1">
            {SCOPES.map((s) => {
              const active = scope === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setScope(s.id)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition sm:text-sm ${
                    active
                      ? "bg-gradient-mint text-white shadow-glow-mint"
                      : "text-foreground/60 hover:text-foreground"
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>

          {/* Category chips */}
          <div className="mt-3 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => {
              const active = category === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className={`rounded-full border px-3 py-1 text-[11px] font-semibold transition sm:text-xs ${
                    active
                      ? "border-mint/60 bg-mint/10 text-mint"
                      : "border-foreground/10 bg-foreground/[0.02] text-foreground/60 hover:border-mint/30 hover:text-foreground"
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>

          {/* Sort filter */}
          <div className="mt-3 flex flex-wrap gap-2">
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
                            : i === 2
                            ? "bg-foreground/15"
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
                        {v.city} · {v.country}
                      </p>
                    </div>

                    {/* Category badge */}
                    <span className="hidden shrink-0 rounded-full border border-foreground/10 bg-foreground/[0.03] px-2 py-0.5 text-[10px] uppercase tracking-wider text-foreground/60 sm:inline-block">
                      {v.category}
                    </span>

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
              title={`No Love Letters in ${scopeLabel} yet`}
              subtitle="Try a wider scope or different category — or be the first to spread the love."
              ctaLabel="Send a Love Letter"
              ctaHref="/"
            />
          </div>
        )}
      </div>
    </section>
  );
}
