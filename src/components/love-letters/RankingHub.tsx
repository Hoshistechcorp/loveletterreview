import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import {
  Building2,
  Globe2,
  Heart,
  MapPin,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { trendingVenues, type TrendingVenue } from "@/lib/love-letters/mockVenues";

type TimeKey = "today" | "week" | "month" | "all";
type Audience = "people" | "stakeholders";

const TIME_OPTIONS: { id: TimeKey; label: string; days: number | null }[] = [
  { id: "today", label: "Today", days: 1 },
  { id: "week", label: "This week", days: 7 },
  { id: "month", label: "This month", days: 30 },
  { id: "all", label: "All time", days: null },
];

// Equirectangular projection onto a 1000x500 SVG viewbox.
const project = (lat: number, lng: number) => ({
  x: ((lng + 180) / 360) * 1000,
  y: ((90 - lat) / 180) * 500,
});

// Haversine distance in km
function distanceKm(a: TrendingVenue, b: TrendingVenue) {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function RankingHub() {
  const [time, setTime] = useState<TimeKey>("all");
  const [audience, setAudience] = useState<Audience>("people");
  const [selectedId, setSelectedId] = useState<string>("1");

  const timeCutoff = TIME_OPTIONS.find((t) => t.id === time)?.days ?? null;

  const inWindow = useMemo(() => {
    if (timeCutoff === null) return trendingVenues;
    const since = Date.now() - timeCutoff * 24 * 60 * 60 * 1000;
    return trendingVenues.filter((v) => v.createdAt >= since);
  }, [timeCutoff]);

  // Audience shifts the ranking weight: people care about ratings, stakeholders about volume.
  const ranked = useMemo(() => {
    const copy = [...inWindow];
    if (audience === "people") {
      copy.sort((a, b) => b.rating - a.rating || b.loveCount - a.loveCount);
    } else {
      copy.sort((a, b) => b.loveCount - a.loveCount || b.rating - a.rating);
    }
    return copy;
  }, [inWindow, audience]);

  const worldTop = ranked.slice(0, 5);
  const totalLove = inWindow.reduce((n, v) => n + v.loveCount, 0);
  const avgScore =
    inWindow.length > 0
      ? inWindow.reduce((n, v) => n + v.rating, 0) / inWindow.length
      : 0;

  const selected =
    inWindow.find((v) => v.id === selectedId) ?? inWindow[0] ?? trendingVenues[0];

  const nearby = useMemo(() => {
    if (!selected) return [];
    return inWindow
      .filter((v) => v.id !== selected.id)
      .map((v) => ({ v, km: distanceKm(selected, v) }))
      .sort((a, b) => a.km - b.km)
      .slice(0, 5);
  }, [inWindow, selected]);

  const previewLabel = audience === "people" ? "Traveler score" : "Reach score";
  const secondaryLabel = audience === "people" ? "letters from lovers" : "verified impressions";

  return (
    <section className="px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-5 sm:mb-7">
          <p className="text-xs font-semibold uppercase tracking-widest text-mint">
            <Globe2 className="mr-1 inline h-3.5 w-3.5" /> Ranking Hub · Live pulse
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold sm:text-4xl">
            The <span className="text-gradient-love">World Ranking</span>, mapped
          </h2>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Slide the timeline, switch audience, and explore rankings by place.
          </p>
        </div>

        {/* Controls: timeline slider + audience toggle */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Timeline segmented slider */}
          <div className="relative inline-flex rounded-full border border-foreground/10 bg-foreground/[0.03] p-1">
            {TIME_OPTIONS.map((t) => {
              const active = time === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTime(t.id)}
                  className="relative z-10 rounded-full px-3 py-1.5 text-xs font-semibold transition sm:px-4 sm:text-sm"
                >
                  {active && (
                    <motion.span
                      layoutId="time-pill"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      className="absolute inset-0 -z-10 rounded-full bg-gradient-love shadow-glow-pink"
                    />
                  )}
                  <span className={active ? "text-white" : "text-foreground/70"}>
                    {t.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Audience toggle */}
          <div className="relative inline-flex rounded-full border border-foreground/10 bg-foreground/[0.03] p-1">
            {(
              [
                { id: "people", label: "People", icon: Users },
                { id: "stakeholders", label: "Stakeholders", icon: Building2 },
              ] as const
            ).map((a) => {
              const active = audience === a.id;
              const Icon = a.icon;
              return (
                <button
                  key={a.id}
                  onClick={() => setAudience(a.id)}
                  className="relative z-10 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition sm:px-4 sm:text-sm"
                >
                  {active && (
                    <motion.span
                      layoutId="audience-pill"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      className="absolute inset-0 -z-10 rounded-full bg-gradient-mint"
                    />
                  )}
                  <Icon className={`h-3.5 w-3.5 ${active ? "text-white" : "text-foreground/60"}`} />
                  <span className={active ? "text-white" : "text-foreground/70"}>{a.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* World Ranking summary */}
        <div className="mb-4 grid grid-cols-3 gap-2 sm:gap-3">
          <SummaryCard
            icon={<Sparkles className="h-4 w-4 text-mint" />}
            label="World score"
            value={avgScore ? avgScore.toFixed(1) : "—"}
            sub="avg / 10"
          />
          <SummaryCard
            icon={<Heart className="h-4 w-4 fill-neon-pink text-neon-pink" />}
            label="Total love"
            value={totalLove.toLocaleString()}
            sub={secondaryLabel}
          />
          <SummaryCard
            icon={<TrendingUp className="h-4 w-4 text-purple" />}
            label="Ranked"
            value={String(inWindow.length)}
            sub="places in window"
          />
        </div>

        {/* Map + Nearby */}
        <div className="grid gap-3 sm:grid-cols-5 sm:gap-4">
          {/* Map */}
          <div className="glass relative overflow-hidden rounded-3xl sm:col-span-3">
            <div className="p-3 sm:p-4">
              <div className="mb-1 flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/60">
                  Location map
                </p>
                <p className="text-[10px] text-foreground/50">Tap a dot to explore</p>
              </div>
              <div className="relative aspect-[2/1] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-mint/[0.06] via-transparent to-neon-pink/[0.06]">
                {/* Grid backdrop */}
                <svg
                  viewBox="0 0 1000 500"
                  className="absolute inset-0 h-full w-full"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <pattern id="rh-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path
                        d="M 40 0 L 0 0 0 40"
                        fill="none"
                        stroke="currentColor"
                        strokeOpacity="0.06"
                        strokeWidth="1"
                      />
                    </pattern>
                    <radialGradient id="rh-glow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="currentColor" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <rect width="1000" height="500" fill="url(#rh-grid)" className="text-foreground" />
                  {/* Continent-ish blobs for visual anchor */}
                  <g className="text-mint" fill="url(#rh-glow)">
                    <ellipse cx="230" cy="180" rx="150" ry="90" />
                    <ellipse cx="500" cy="170" rx="150" ry="80" />
                    <ellipse cx="760" cy="200" rx="140" ry="100" />
                    <ellipse cx="290" cy="360" rx="70" ry="80" />
                    <ellipse cx="540" cy="360" rx="70" ry="60" />
                    <ellipse cx="820" cy="380" rx="60" ry="50" />
                  </g>
                </svg>

                {/* Venue dots */}
                {inWindow.map((v) => {
                  const { x, y } = project(v.lat, v.lng);
                  const isSel = v.id === selected?.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setSelectedId(v.id)}
                      aria-label={`${v.name} in ${v.city}`}
                      className="group absolute -translate-x-1/2 -translate-y-1/2"
                      style={{ left: `${x / 10}%`, top: `${y / 5}%` }}
                    >
                      <span
                        className={`relative block rounded-full transition ${
                          isSel
                            ? "h-3.5 w-3.5 bg-neon-pink shadow-glow-pink"
                            : "h-2 w-2 bg-mint group-hover:h-2.5 group-hover:w-2.5"
                        }`}
                      >
                        <span
                          className={`absolute inset-0 -z-10 animate-ping rounded-full ${
                            isSel ? "bg-neon-pink/40" : "bg-mint/30"
                          }`}
                        />
                      </span>
                    </button>
                  );
                })}

                {/* Selected callout */}
                {selected && (
                  <div className="pointer-events-none absolute bottom-2 left-2 right-2 rounded-xl border border-foreground/10 bg-background/85 px-3 py-2 backdrop-blur sm:bottom-3 sm:left-3 sm:right-auto sm:max-w-[60%]">
                    <p className="truncate font-display text-sm font-bold">{selected.name}</p>
                    <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-muted-foreground">
                      <MapPin className="h-3 w-3 text-mint" />
                      {selected.city} · {selected.country}
                    </p>
                    <p className="mt-1 flex items-center gap-2 text-[11px]">
                      <span className="font-semibold text-neon-pink">
                        {selected.rating.toFixed(1)}
                      </span>
                      <span className="text-foreground/50">·</span>
                      <span className="text-foreground/70">
                        {selected.loveCount} {audience === "people" ? "letters" : "impressions"}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Nearby list */}
          <div className="glass rounded-3xl p-3 sm:col-span-2 sm:p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/60">
                Nearby top ranked
              </p>
              <p className="text-[10px] text-foreground/50">
                near {selected?.city.split(",")[0]}
              </p>
            </div>
            <ul className="flex flex-col gap-1.5">
              <AnimatePresence mode="popLayout">
                {nearby.map(({ v, km }, i) => (
                  <motion.li
                    key={v.id}
                    layout
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.25, delay: i * 0.03 }}
                  >
                    <button
                      onClick={() => setSelectedId(v.id)}
                      className="flex w-full items-center gap-2.5 rounded-2xl border border-transparent bg-foreground/[0.02] p-2 text-left transition hover:border-mint/30 hover:bg-mint/[0.04]"
                    >
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-mint font-display text-xs font-bold text-white">
                        {i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold sm:text-sm">{v.name}</p>
                        <p className="truncate text-[10px] text-muted-foreground">
                          {v.city} · {Math.round(km).toLocaleString()} km
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1 text-[11px] font-semibold">
                        <Heart className="h-3 w-3 fill-neon-pink text-neon-pink" />
                        {v.rating.toFixed(1)}
                      </div>
                    </button>
                  </motion.li>
                ))}
                {nearby.length === 0 && (
                  <p className="px-2 py-4 text-center text-xs text-muted-foreground">
                    No neighbors in this window — try a wider timeline.
                  </p>
                )}
              </AnimatePresence>
            </ul>
          </div>
        </div>

        {/* World Ranking leaderboard */}
        <div className="mt-4 glass rounded-3xl p-3 sm:p-4">
          <div className="mb-2 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-neon-pink">
                World Ranking · Top 5
              </p>
              <p className="text-[11px] text-foreground/60">
                Ranked by {audience === "people" ? "traveler love" : "verified reach"} · {TIME_OPTIONS.find((t) => t.id === time)?.label}
              </p>
            </div>
            <Link
              to="/wall"
              className="rounded-full border border-foreground/10 px-3 py-1 text-[11px] font-semibold text-foreground/70 transition hover:border-mint/40 hover:text-foreground"
            >
              See all
            </Link>
          </div>
          <ul className="flex flex-col gap-1.5">
            {worldTop.map((v, i) => (
              <motion.li
                key={v.id}
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
              >
                <Link
                  to="/venue/$venueId"
                  params={{ venueId: v.id }}
                  className="flex items-center gap-3 rounded-2xl border border-transparent bg-foreground/[0.02] p-2.5 transition hover:border-neon-pink/30 hover:bg-neon-pink/[0.04]"
                >
                  <span
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl font-display text-sm font-bold ${
                      i === 0
                        ? "bg-gradient-love text-white shadow-glow-pink"
                        : i === 1
                        ? "bg-gradient-mint text-white"
                        : "bg-foreground/10 text-foreground/70"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-sm font-bold sm:text-base">{v.name}</p>
                    <p className="truncate text-[11px] text-muted-foreground">
                      {v.city} · {v.country}
                    </p>
                  </div>
                  <div className="hidden text-right sm:block">
                    <p className="text-[10px] uppercase tracking-wider text-foreground/50">
                      {previewLabel}
                    </p>
                    <p className="font-display text-sm font-bold text-foreground">
                      {v.rating.toFixed(1)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-sm font-bold text-mint sm:text-base">
                      {v.loveCount}
                    </p>
                    <p className="text-[9px] uppercase tracking-wider text-muted-foreground">
                      {audience === "people" ? "letters" : "reach"}
                    </p>
                  </div>
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="glass rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3">
      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-foreground/60">
        {icon}
        <span className="truncate">{label}</span>
      </div>
      <p className="mt-1 font-display text-lg font-bold sm:text-2xl">{value}</p>
      <p className="text-[10px] text-muted-foreground sm:text-[11px]">{sub}</p>
    </div>
  );
}
