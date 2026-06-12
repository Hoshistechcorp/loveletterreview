import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronDown, Clock, Globe2, Heart, MapPin, Search, TrendingUp, X } from "lucide-react";
import { trendingVenues, type TrendingVenue } from "@/lib/love-letters/mockVenues";
import { EmptyState } from "./EmptyState";
import { WallSkeleton } from "./WallSkeleton";

export type WallFilter = "top" | "most" | "new";
export type WallTime = "today" | "week" | "month" | "all";

const FILTERS: { id: WallFilter; label: string }[] = [
  { id: "top", label: "Top rated" },
  { id: "most", label: "Most letters" },
  { id: "new", label: "New this week" },
];

const TIMES: { id: WallTime; label: string; days: number | null }[] = [
  { id: "today", label: "Today", days: 1 },
  { id: "week", label: "This week", days: 7 },
  { id: "month", label: "This month", days: 30 },
  { id: "all", label: "All time", days: null },
];

const TOP_N = 10;

type Props = {
  filter?: WallFilter;
  onFilterChange?: (f: WallFilter) => void;
  location?: string;
  onLocationChange?: (v: string) => void;
  time?: WallTime;
  onTimeChange?: (t: WallTime) => void;
};

export function WallOfLove({
  filter: filterProp,
  onFilterChange,
  location: locationProp,
  onLocationChange,
  time: timeProp,
  onTimeChange,
}: Props = {}) {
  const [isLoading, setIsLoading] = useState(true);
  const [venues, setVenues] = useState<TrendingVenue[]>([]);
  const [filterState, setFilterState] = useState<WallFilter>("top");
  const [locationState, setLocationState] = useState("");
  const [timeState, setTimeState] = useState<WallTime>("all");
  const [timeOpen, setTimeOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [locationFocused, setLocationFocused] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(-1);

  const filter = filterProp ?? filterState;
  const setFilter = (f: WallFilter) => (onFilterChange ? onFilterChange(f) : setFilterState(f));
  const location = locationProp ?? locationState;
  const setLocation = (v: string) => (onLocationChange ? onLocationChange(v) : setLocationState(v));
  const time = timeProp ?? timeState;
  const setTime = (t: WallTime) => (onTimeChange ? onTimeChange(t) : setTimeState(t));

  useEffect(() => {
    const t = window.setTimeout(() => {
      setVenues(trendingVenues);
      setIsLoading(false);
    }, 700);
    return () => window.clearTimeout(t);
  }, []);

  const locationOptions = useMemo(() => {
    const set = new Set<string>();
    venues.forEach((v) => {
      if (v.city) set.add(v.city);
      if (v.country) set.add(v.country);
      if (v.region) set.add(v.region);
    });
    return Array.from(set).sort();
  }, [venues]);

  const suggestions = useMemo(() => {
    const q = location.trim().toLowerCase();
    const base = q
      ? locationOptions.filter((o) => o.toLowerCase().includes(q) && o.toLowerCase() !== q)
      : locationOptions;
    return base.slice(0, 8);
  }, [location, locationOptions]);

  const sorted = useMemo(() => {
    let copy = [...venues];

    // Location: substring match across city, country, region.
    const q = location.trim().toLowerCase();
    if (q) {
      copy = copy.filter(
        (v) =>
          v.city.toLowerCase().includes(q) ||
          v.country.toLowerCase().includes(q) ||
          v.region.toLowerCase().includes(q),
      );
    }

    // Time
    const cutoff = TIMES.find((x) => x.id === time)?.days ?? null;
    if (cutoff !== null) {
      const since = Date.now() - cutoff * 24 * 60 * 60 * 1000;
      copy = copy.filter((v) => v.createdAt >= since);
    }

    if (filter === "top") copy.sort((a, b) => b.rating - a.rating);
    else if (filter === "most") copy.sort((a, b) => b.loveCount - a.loveCount);
    else copy = copy.filter((v) => v.daysAgo <= 7).sort((a, b) => a.daysAgo - b.daysAgo);

    return copy.slice(0, TOP_N);
  }, [venues, filter, location, time]);

  const hasLetters = sorted.length > 0;
  const timeLabel = TIMES.find((t) => t.id === time)?.label ?? "All time";
  const headerScope = location.trim() ? location.trim() : "the world";

  return (
    <section className="px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-5 sm:mb-7">
          <p className="text-xs font-semibold uppercase tracking-widest text-mint">
            <TrendingUp className="mr-1 inline h-3.5 w-3.5" /> Wall of Love · Top {TOP_N}
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold sm:text-4xl">
            Trending across <span className="text-gradient-love">{headerScope}</span>
          </h2>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground sm:text-sm">
            <Globe2 className="h-3.5 w-3.5 text-mint" />
            Search any city, state, or country — then narrow by time.
          </p>

          {/* Location + Time */}
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
              <input
                type="text"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setHighlightIdx(-1);
                  setLocationFocused(true);
                }}
                onFocus={() => setLocationFocused(true)}
                onBlur={() => window.setTimeout(() => setLocationFocused(false), 120)}
                onKeyDown={(e) => {
                  if (!locationFocused || suggestions.length === 0) return;
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setHighlightIdx((i) => (i + 1) % suggestions.length);
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setHighlightIdx((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
                  } else if (e.key === "Enter" && highlightIdx >= 0) {
                    e.preventDefault();
                    setLocation(suggestions[highlightIdx]);
                    setLocationFocused(false);
                  } else if (e.key === "Escape") {
                    setLocationFocused(false);
                  }
                }}
                placeholder="Search city, state, or country…"
                className="w-full rounded-full border border-foreground/15 bg-foreground/[0.03] px-10 py-2.5 text-sm text-foreground placeholder:text-foreground/40 outline-none transition focus:border-mint/60 focus:bg-foreground/[0.05] focus:shadow-glow-mint"
              />
              {location && (
                <button
                  onClick={() => setLocation("")}
                  aria-label="Clear location"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-foreground/40 hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}

              <AnimatePresence>
                {locationFocused && suggestions.length > 0 && (
                  <motion.ul
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 right-0 z-30 mt-2 max-h-72 overflow-auto rounded-2xl border border-foreground/10 bg-background/95 py-1 shadow-xl backdrop-blur"
                  >
                    {suggestions.map((s, idx) => (
                      <li key={s}>
                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            setLocation(s);
                            setLocationFocused(false);
                          }}
                          onMouseEnter={() => setHighlightIdx(idx)}
                          className={`flex w-full items-center gap-2 px-4 py-2 text-left text-sm transition ${
                            idx === highlightIdx
                              ? "bg-mint/10 text-foreground"
                              : "text-foreground/80 hover:bg-foreground/5"
                          }`}
                        >
                          <MapPin className="h-3.5 w-3.5 text-mint" />
                          {s}
                        </button>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>


            <div className="relative">
              <button
                onClick={() => setTimeOpen((o) => !o)}
                className="inline-flex w-full items-center justify-between gap-2 rounded-full border border-foreground/15 bg-foreground/[0.03] px-4 py-2.5 text-sm font-semibold text-foreground/80 transition hover:border-mint/40 sm:w-auto"
              >
                <Clock className="h-4 w-4 text-mint" />
                {timeLabel}
                <ChevronDown className={`h-4 w-4 transition-transform ${timeOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {timeOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-2xl border border-foreground/10 bg-background/95 shadow-xl backdrop-blur"
                  >
                    {TIMES.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          setTime(t.id);
                          setTimeOpen(false);
                        }}
                        className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm transition ${
                          time === t.id
                            ? "bg-mint/10 font-semibold text-mint"
                            : "text-foreground/80 hover:bg-foreground/5"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="relative overflow-hidden border-t border-foreground/5"
                      >
                        {/* Layered gradient sheen */}
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-mint/[0.04] via-neon-pink/[0.06] to-transparent" />
                        <div
                          className="pointer-events-none absolute inset-0"
                          style={{
                            background:
                              "radial-gradient(circle at 70% 20%, color-mix(in oklab, var(--neon-pink) 15%, transparent) 0%, transparent 50%)",
                          }}
                        />

                        {/* Floating decorative hearts */}
                        <Heart
                          className="animate-float-heart pointer-events-none absolute left-8 top-6 h-7 w-7 fill-neon-pink/20 text-neon-pink/20 sm:left-12 sm:top-8 sm:h-8 sm:w-8"
                          style={{ ["--heart-rot" as string]: "-12deg", animationDelay: "0s" }}
                        />
                        <Heart
                          className="animate-float-heart pointer-events-none absolute bottom-16 right-10 h-6 w-6 fill-purple/10 text-purple/10 sm:bottom-20 sm:right-16"
                          style={{
                            ["--heart-rot" as string]: "45deg",
                            ["--heart-scale" as string]: "1.25",
                            animationDelay: "1.5s",
                          }}
                        />

                        <div className="relative z-10 flex flex-col items-center px-6 py-8 text-center sm:px-10 sm:py-10">
                          <motion.span
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.05 }}
                            className="mb-5 font-display text-xs font-bold uppercase tracking-[0.2em] text-neon-pink sm:text-sm"
                          >
                            I love this place because
                          </motion.span>

                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.12 }}
                            className="relative mb-9 max-w-xl"
                          >
                            <span
                              aria-hidden
                              className="pointer-events-none absolute -left-6 -top-6 select-none font-display text-6xl leading-none text-neon-pink/20 sm:-left-8"
                            >
                              &ldquo;
                            </span>
                            <p
                              className="text-lg font-medium leading-relaxed text-foreground/80 sm:text-2xl"
                              style={{ fontFamily: "'DM Sans', Inter, system-ui, sans-serif" }}
                            >
                              {v.excerpt}
                            </p>
                            <span
                              aria-hidden
                              className="pointer-events-none absolute -bottom-10 -right-6 select-none font-display text-6xl leading-none text-neon-pink/20 sm:-right-8"
                            >
                              &rdquo;
                            </span>
                          </motion.div>

                          <motion.button
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                            className="group/cta relative inline-flex items-center gap-3 overflow-hidden rounded-full px-8 py-3.5 shadow-glow-pink transition-all duration-300 hover:scale-[1.03] active:scale-95 sm:px-10 sm:py-4"
                          >
                            <span className="absolute inset-0 bg-gradient-love" />
                            <span className="absolute inset-0 bg-white/0 transition-opacity duration-300 group-hover/cta:bg-white/10" />
                            <span className="relative font-display text-sm font-bold tracking-wide text-white sm:text-base">
                              Read &amp; Write more
                            </span>
                            <ArrowRight className="relative h-5 w-5 text-white transition-transform group-hover/cta:translate-x-1" />
                          </motion.button>

                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.28 }}
                            className="mt-8 flex items-center gap-2"
                          >
                            <div className="h-px w-8 bg-neon-pink/20" />
                            <span className="text-[11px] font-medium tracking-wider text-neon-pink/70">
                              Featured Letter
                            </span>
                            <div className="h-px w-8 bg-neon-pink/20" />
                          </motion.div>

                          <motion.a
                            href={`/claim/${v.id}`}
                            onClick={(e) => e.stopPropagation()}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4, delay: 0.34 }}
                            className="mt-4 text-[11px] font-medium text-foreground/50 underline decoration-dotted underline-offset-4 transition hover:text-mint sm:text-xs"
                          >
                            Are you {v.name}? Claim to reply →
                          </motion.a>

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
              title={`No Love Letters in ${headerScope} yet`}
              subtitle="Try a different location or widen the time window — or be the first to spread the love."
              ctaLabel="Send a Love Letter"
              ctaHref="/"
            />
          </div>
        )}
      </div>
    </section>
  );
}
