import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import {
  Building2,
  Check,
  Globe2,
  Heart,
  MapPin,
  Share2,
  Sparkles,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { trendingVenues, type TrendingVenue } from "@/lib/love-letters/mockVenues";

type TimeKey = "today" | "week" | "month" | "all";
type Audience = "people" | "stakeholders";

const TIME_OPTIONS: { id: TimeKey; label: string; days: number | null }[] = [
  { id: "today", label: "Today", days: 1 },
  { id: "week", label: "This week", days: 7 },
  { id: "month", label: "This month", days: 30 },
  { id: "all", label: "All time", days: null },
];

const STORAGE_KEY = "rankingHub:v1";
const DEFAULT_RADIUS = 5000; // km

// Equirectangular projection onto a 1000x500 SVG viewbox.
const project = (lat: number, lng: number) => ({
  x: ((lng + 180) / 360) * 1000,
  y: ((90 - lat) / 180) * 500,
});

function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

type Persisted = {
  time: TimeKey;
  audience: Audience;
  selectedId: string;
  radius: number;
};

function readInitialState(): Persisted {
  const fallback: Persisted = {
    time: "all",
    audience: "people",
    selectedId: "1",
    radius: DEFAULT_RADIUS,
  };
  if (typeof window === "undefined") return fallback;

  // URL params take priority (shareable links)
  try {
    const params = new URLSearchParams(window.location.search);
    const fromUrl: Partial<Persisted> = {};
    const t = params.get("rhTime") as TimeKey | null;
    if (t && TIME_OPTIONS.some((o) => o.id === t)) fromUrl.time = t;
    const a = params.get("rhAud");
    if (a === "people" || a === "stakeholders") fromUrl.audience = a;
    const s = params.get("rhSel");
    if (s && trendingVenues.some((v) => v.id === s)) fromUrl.selectedId = s;
    const r = Number(params.get("rhRadius"));
    if (Number.isFinite(r) && r > 0) fromUrl.radius = r;
    if (Object.keys(fromUrl).length > 0) return { ...fallback, ...fromUrl };
  } catch {}

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...fallback, ...JSON.parse(raw) };
  } catch {}
  return fallback;
}

export function RankingHub() {
  const [hydrated, setHydrated] = useState(false);
  const [time, setTime] = useState<TimeKey>("all");
  const [audience, setAudience] = useState<Audience>("people");
  const [selectedId, setSelectedId] = useState<string>("1");
  const [radius, setRadius] = useState<number>(DEFAULT_RADIUS);
  const [drawerId, setDrawerId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Hydrate from URL / localStorage after mount to avoid SSR mismatch
  useEffect(() => {
    const init = readInitialState();
    setTime(init.time);
    setAudience(init.audience);
    setSelectedId(init.selectedId);
    setRadius(init.radius);
    setHydrated(true);
  }, []);

  // Persist
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ time, audience, selectedId, radius }),
      );
    } catch {}
  }, [hydrated, time, audience, selectedId, radius]);

  const timeCutoff = TIME_OPTIONS.find((t) => t.id === time)?.days ?? null;

  const inWindow = useMemo(() => {
    if (timeCutoff === null) return trendingVenues;
    const since = Date.now() - timeCutoff * 24 * 60 * 60 * 1000;
    return trendingVenues.filter((v) => v.createdAt >= since);
  }, [timeCutoff]);

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
      .filter(({ km }) => km <= radius)
      .sort((a, b) => a.km - b.km)
      .slice(0, 8);
  }, [inWindow, selected, radius]);

  const previewLabel = audience === "people" ? "Traveler score" : "Reach score";
  const secondaryLabel = audience === "people" ? "letters from lovers" : "verified impressions";

  const drawerVenue = drawerId ? trendingVenues.find((v) => v.id === drawerId) ?? null : null;
  const drawerRank = drawerVenue ? ranked.findIndex((v) => v.id === drawerVenue.id) : -1;

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.searchParams.set("rhTime", time);
    url.searchParams.set("rhAud", audience);
    url.searchParams.set("rhSel", selectedId);
    url.searchParams.set("rhRadius", String(radius));
    url.hash = "ranking-hub";
    const link = url.toString();
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      toast.success("Share link copied", {
        description: "Your current ranking view is captured in the link.",
      });
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Couldn't copy. Long-press to copy the URL manually.");
    }
  };

  return (
    <section id="ranking-hub" className="px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-5 flex items-start justify-between gap-3 sm:mb-7">
          <div>
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
          <button
            onClick={handleShare}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-foreground/10 bg-foreground/[0.03] px-3 py-2 text-xs font-semibold text-foreground/80 transition hover:border-mint/40 hover:text-foreground sm:text-sm"
            aria-label="Copy shareable link of this ranking view"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-mint" /> : <Share2 className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{copied ? "Copied" : "Share view"}</span>
          </button>
        </div>

        {/* Controls */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
                  <span className={active ? "text-white" : "text-foreground/70"}>{t.label}</span>
                </button>
              );
            })}
          </div>

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

        {/* Summary */}
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
          <div className="glass relative overflow-hidden rounded-3xl sm:col-span-3">
            <div className="p-3 sm:p-4">
              <div className="mb-1 flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/60">
                  Location map
                </p>
                <p className="text-[10px] text-foreground/50">Tap a dot to open details</p>
              </div>
              <div className="relative aspect-[2/1] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-mint/[0.06] via-transparent to-neon-pink/[0.06]">
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
                  <g className="text-mint" fill="url(#rh-glow)">
                    <ellipse cx="230" cy="180" rx="150" ry="90" />
                    <ellipse cx="500" cy="170" rx="150" ry="80" />
                    <ellipse cx="760" cy="200" rx="140" ry="100" />
                    <ellipse cx="290" cy="360" rx="70" ry="80" />
                    <ellipse cx="540" cy="360" rx="70" ry="60" />
                    <ellipse cx="820" cy="380" rx="60" ry="50" />
                  </g>
                </svg>

                {inWindow.map((v) => {
                  const { x, y } = project(v.lat, v.lng);
                  const isSel = v.id === selected?.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => {
                        setSelectedId(v.id);
                        setDrawerId(v.id);
                      }}
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

                {selected && (
                  <button
                    onClick={() => setDrawerId(selected.id)}
                    className="absolute bottom-2 left-2 right-2 rounded-xl border border-foreground/10 bg-background/85 px-3 py-2 text-left backdrop-blur transition hover:border-neon-pink/40 sm:bottom-3 sm:left-3 sm:right-auto sm:max-w-[60%]"
                  >
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
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Nearby list with radius slider */}
          <div className="glass rounded-3xl p-3 sm:col-span-2 sm:p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/60">
                Nearby top ranked
              </p>
              <p className="text-[10px] text-foreground/50">
                near {selected?.city.split(",")[0]}
              </p>
            </div>

            <div className="mb-3 rounded-2xl border border-foreground/10 bg-foreground/[0.02] px-3 py-2.5">
              <div className="mb-1.5 flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-foreground/60">
                <span>Radius</span>
                <span className="font-display text-xs text-foreground">
                  {radius >= 1000
                    ? `${(radius / 1000).toFixed(radius >= 5000 ? 0 : 1)}k km`
                    : `${radius} km`}
                </span>
              </div>
              <Slider
                value={[radius]}
                onValueChange={(vals) => setRadius(vals[0] ?? DEFAULT_RADIUS)}
                min={100}
                max={20000}
                step={100}
                aria-label="Search radius"
              />
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
                      onClick={() => setDrawerId(v.id)}
                      className="flex w-full items-center gap-2.5 rounded-2xl border border-transparent bg-foreground/[0.02] p-2 text-left transition hover:border-mint/30 hover:bg-mint/[0.04]"
                    >
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-mint font-display text-xs font-bold text-white">
                        {i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold sm:text-sm">{v.name}</p>
                        <p className="truncate text-[10px] text-muted-foreground">
                          {v.city} · {Math.round(km).toLocaleString()} km away
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
                    No places within {radius.toLocaleString()} km — widen the radius.
                  </p>
                )}
              </AnimatePresence>
            </ul>
          </div>
        </div>

        {/* World Ranking leaderboard */}
        <div className="glass mt-4 rounded-3xl p-3 sm:p-4">
          <div className="mb-2 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-neon-pink">
                World Ranking · Top 5
              </p>
              <p className="text-[11px] text-foreground/60">
                Ranked by {audience === "people" ? "traveler love" : "verified reach"} ·{" "}
                {TIME_OPTIONS.find((t) => t.id === time)?.label}
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
                <button
                  onClick={() => setDrawerId(v.id)}
                  className="flex w-full items-center gap-3 rounded-2xl border border-transparent bg-foreground/[0.02] p-2.5 text-left transition hover:border-neon-pink/30 hover:bg-neon-pink/[0.04]"
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
                </button>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>

      {/* Venue details drawer */}
      <Sheet open={!!drawerVenue} onOpenChange={(o) => !o && setDrawerId(null)}>
        <SheetContent side="right" className="w-full max-w-md overflow-y-auto p-0 sm:max-w-lg">
          {drawerVenue && (
            <VenueDrawerBody
              venue={drawerVenue}
              rank={drawerRank}
              audience={audience}
              time={time}
              distanceFromSelected={
                selected && selected.id !== drawerVenue.id
                  ? distanceKm(selected, drawerVenue)
                  : null
              }
              onClose={() => setDrawerId(null)}
            />
          )}
        </SheetContent>
      </Sheet>
    </section>
  );
}

function VenueDrawerBody({
  venue,
  rank,
  audience,
  time,
  distanceFromSelected,
  onClose,
}: {
  venue: TrendingVenue;
  rank: number;
  audience: Audience;
  time: TimeKey;
  distanceFromSelected: number | null;
  onClose: () => void;
}) {
  const timeLabel = TIME_OPTIONS.find((t) => t.id === time)?.label ?? "All time";
  const metricLabel = audience === "people" ? "Letters" : "Impressions";
  return (
    <div className="flex flex-col">
      <div className="relative h-40 w-full overflow-hidden">
        {venue.photo ? (
          <img src={venue.photo} alt={venue.name} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-gradient-love" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <button
          onClick={onClose}
          aria-label="Close details"
          className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-background/80 backdrop-blur transition hover:bg-background"
        >
          <X className="h-4 w-4" />
        </button>
        {rank >= 0 && (
          <div className="absolute left-3 top-3 rounded-full bg-background/85 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-neon-pink backdrop-blur">
            #{rank + 1} · {timeLabel}
          </div>
        )}
      </div>

      <SheetHeader className="px-5 pt-3 text-left">
        <SheetTitle className="font-display text-2xl">{venue.name}</SheetTitle>
        <SheetDescription className="flex items-center gap-1 text-xs">
          <MapPin className="h-3 w-3 text-mint" />
          {venue.city} · {venue.country}
        </SheetDescription>
      </SheetHeader>

      <div className="grid grid-cols-3 gap-2 px-5 pt-4">
        <MiniStat label={audience === "people" ? "Traveler score" : "Reach score"} value={venue.rating.toFixed(1)} />
        <MiniStat label={metricLabel} value={venue.loveCount.toLocaleString()} />
        <MiniStat
          label="Distance"
          value={distanceFromSelected != null ? `${Math.round(distanceFromSelected).toLocaleString()} km` : "—"}
        />
      </div>

      {venue.category && (
        <div className="px-5 pt-3">
          <span className="inline-flex items-center rounded-full border border-foreground/10 bg-foreground/[0.03] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-foreground/70">
            {venue.category}
          </span>
        </div>
      )}

      <div className="flex gap-2 px-5 py-5">
        <Button asChild className="flex-1 rounded-full bg-gradient-love text-white shadow-glow-pink">
          <Link to="/venue/$venueId" params={{ venueId: venue.id }} onClick={onClose}>
            Open venue page
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="rounded-full"
        >
          <Link to="/venue/$venueId" params={{ venueId: venue.id }} onClick={onClose}>
            <Heart className="mr-1 h-4 w-4 text-neon-pink" /> Write letter
          </Link>
        </Button>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.03] px-3 py-2">
      <p className="text-[9px] font-semibold uppercase tracking-wider text-foreground/50">{label}</p>
      <p className="mt-0.5 font-display text-base font-bold">{value}</p>
    </div>
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
