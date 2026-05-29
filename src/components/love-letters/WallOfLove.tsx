import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronDown, Clock, Crown, Globe2, Heart, MapPin, Search, Sparkles, TrendingUp, Trophy, X } from "lucide-react";
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
  onWriteForVenue?: (v: TrendingVenue) => void;
};

export function WallOfLove({
  filter: filterProp,
  onFilterChange,
  location: locationProp,
  onLocationChange,
  time: timeProp,
  onTimeChange,
  onWriteForVenue,
}: Props = {}) {
  const [isLoading, setIsLoading] = useState(true);
  const [venues, setVenues] = useState<TrendingVenue[]>([]);
  const [filterState, setFilterState] = useState<WallFilter>("top");
  const [locationState, setLocationState] = useState("");
  const [timeState, setTimeState] = useState<WallTime>("all");
  const [timeOpen, setTimeOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

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

  const sorted = useMemo(() => {
    let copy = [...venues];
    const q = location.trim().toLowerCase();
    if (q) {
      copy = copy.filter(
        (v) =>
          v.city.toLowerCase().includes(q) ||
          v.country.toLowerCase().includes(q) ||
          v.region.toLowerCase().includes(q),
      );
    }
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
  const podium = sorted.slice(0, 3);
  const rest = sorted.slice(3);
  const timeLabel = TIMES.find((t) => t.id === time)?.label ?? "All time";
  const headerScope = location.trim() ? location.trim() : "the world";

  // Reorder for desktop podium: [2nd, 1st, 3rd]
  const podiumOrdered = podium.length === 3
    ? [podium[1], podium[0], podium[2]]
    : podium;

  return (
    <section className="px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-5 text-center sm:mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-mint">
            <TrendingUp className="mr-1 inline h-3.5 w-3.5" /> Wall of Fame · Top {TOP_N}
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold sm:text-4xl">
            Most loved across <span className="text-gradient-love">{headerScope}</span>
          </h2>
          <p className="mt-1 flex items-center justify-center gap-1.5 text-xs text-muted-foreground sm:text-sm">
            <Globe2 className="h-3.5 w-3.5 text-mint" />
            Search any city, state, or country — then narrow by time.
          </p>
        </div>

        {/* Controls */}
        <div className="mx-auto mb-8 max-w-3xl">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
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

          <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
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
          <>
            {/* PODIUM — Top 3 */}
            {podium.length > 0 && (
              <div className="mb-10 grid grid-cols-1 items-end gap-4 sm:grid-cols-3 sm:gap-5">
                {podiumOrdered.map((v) => {
                  const rank = podium.indexOf(v) + 1;
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

            {/* REST — ranks 4..10 */}
            {rest.length > 0 && (
              <div className="mx-auto max-w-4xl">
                <p className="mb-3 px-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  The rest of the wall
                </p>
                <ul className="flex flex-col gap-2 sm:gap-2.5">
                  {rest.map((v, i) => {
                    const rank = i + 4;
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
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-foreground/5 sm:h-11 sm:w-11">
                            <span className="font-display text-sm font-bold text-foreground/70 sm:text-base">
                              {rank}
                            </span>
                          </div>

                          <div className="min-w-0 flex-1">
                            <h3 className="truncate font-display text-sm font-bold leading-tight sm:text-base">
                              {v.name}
                            </h3>
                            <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-muted-foreground sm:text-xs">
                              <MapPin className="h-2.5 w-2.5 shrink-0 text-mint sm:h-3 sm:w-3" />
                              {v.city} · {v.country}
                            </p>
                          </div>

                          <span className="hidden shrink-0 rounded-full border border-foreground/10 bg-foreground/[0.03] px-2 py-0.5 text-[10px] uppercase tracking-wider text-foreground/60 sm:inline-block">
                            {v.category}
                          </span>

                          <div className="flex shrink-0 items-center gap-1 text-xs font-semibold sm:text-sm">
                            <Heart className="h-3 w-3 fill-neon-pink text-neon-pink sm:h-3.5 sm:w-3.5" />
                            {v.rating.toFixed(1)}
                          </div>

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
                              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                              className="relative overflow-hidden border-t border-foreground/5"
                            >
                              <div className="relative z-10 flex flex-col items-center px-6 py-6 text-center sm:px-10 sm:py-8">
                                <span className="mb-3 font-display text-[10px] font-bold uppercase tracking-[0.2em] text-neon-pink sm:text-xs">
                                  I love this place because
                                </span>
                                <p className="mb-5 max-w-xl text-base font-medium leading-relaxed text-foreground/80 sm:text-lg">
                                  &ldquo;{v.excerpt}&rdquo;
                                </p>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onWriteForVenue?.(v);
                                  }}
                                  className="group/cta relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-love px-6 py-3 text-sm font-bold text-white shadow-glow-pink transition hover:scale-[1.03] active:scale-95"
                                >
                                  Read &amp; Write more
                                  <ArrowRight className="h-4 w-4 transition-transform group-hover/cta:translate-x-1" />
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.li>
                    );
                  })}
                </ul>
              </div>
            )}
          </>
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

function PodiumCard({
  venue,
  rank,
  onWrite,
}: {
  venue: TrendingVenue;
  rank: 1 | 2 | 3 | number;
  onWrite: () => void;
}) {
  const styles =
    rank === 1
      ? {
          height: "sm:min-h-[420px]",
          ring: "ring-2 ring-amber-300/60",
          glow: "shadow-glow-pink",
          badge: "bg-gradient-to-br from-amber-300 to-yellow-500 text-black",
          icon: <Crown className="h-4 w-4" />,
          label: "Champion",
          accent: "from-amber-300/20 via-neon-pink/10 to-transparent",
        }
      : rank === 2
      ? {
          height: "sm:min-h-[380px]",
          ring: "ring-1 ring-slate-300/40",
          glow: "shadow-glow-mint",
          badge: "bg-gradient-to-br from-slate-200 to-slate-400 text-black",
          icon: <Trophy className="h-4 w-4" />,
          label: "Runner-up",
          accent: "from-slate-200/15 via-mint/10 to-transparent",
        }
      : {
          height: "sm:min-h-[360px]",
          ring: "ring-1 ring-orange-400/40",
          glow: "shadow-glow-purple",
          badge: "bg-gradient-to-br from-orange-300 to-amber-700 text-black",
          icon: <Sparkles className="h-4 w-4" />,
          label: "Third place",
          accent: "from-orange-300/15 via-purple/10 to-transparent",
        };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: rank * 0.08 }}
      className={`glass relative flex flex-col overflow-hidden rounded-3xl ${styles.height} ${styles.ring} ${styles.glow}`}
    >
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${styles.accent}`} />

      {/* Rank badge */}
      <div className="relative flex items-center justify-between p-4">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${styles.badge}`}>
          {styles.icon}
          #{rank} · {styles.label}
        </span>
        <div className="flex items-center gap-1 text-sm font-semibold">
          <Heart className="h-3.5 w-3.5 fill-neon-pink text-neon-pink" />
          {venue.rating.toFixed(1)}
        </div>
      </div>

      <div className="relative flex flex-1 flex-col px-5 pb-5">
        <h3 className={`font-display font-bold leading-tight ${rank === 1 ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"}`}>
          {venue.name}
        </h3>
        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3 text-mint" />
          {venue.city} · {venue.country}
        </p>
        <span className="mt-2 inline-block w-fit rounded-full border border-foreground/10 bg-foreground/[0.03] px-2 py-0.5 text-[10px] uppercase tracking-wider text-foreground/60">
          {venue.category}
        </span>

        <p className="mt-4 line-clamp-4 text-sm italic leading-relaxed text-foreground/80 sm:text-base">
          <span className="font-semibold not-italic text-neon-pink">I love this place because</span>{" "}
          &ldquo;{venue.excerpt}&rdquo;
        </p>

        <div className="mt-auto flex items-end justify-between pt-5">
          <div className="flex flex-col leading-tight">
            <span className="font-display text-2xl font-bold text-mint">
              {venue.loveCount}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              love letters
            </span>
          </div>
          <button
            onClick={onWrite}
            className="group/cta inline-flex items-center gap-2 rounded-full bg-gradient-love px-4 py-2.5 text-xs font-bold text-white shadow-glow-pink transition hover:scale-[1.03] active:scale-95 sm:text-sm"
          >
            Read &amp; Write more
            <ArrowRight className="h-4 w-4 transition-transform group-hover/cta:translate-x-1" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
