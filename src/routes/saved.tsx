import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Heart, MapPin } from "lucide-react";
import { Navbar } from "@/components/love-letters/Navbar";
import { Footer } from "@/components/love-letters/Footer";
import { EmptyState } from "@/components/love-letters/EmptyState";
import { WallSkeleton } from "@/components/love-letters/WallSkeleton";
import {
  savedLettersMock,
  type SavedLetter,
} from "@/lib/love-letters/mockVenues";

type Tab = "newest" | "loved" | "unlocked";

const TABS: { id: Tab; label: string }[] = [
  { id: "newest", label: "Newest" },
  { id: "loved", label: "Most loved" },
  { id: "unlocked", label: "Recently unlocked" },
];

const VALID_TABS: Tab[] = ["newest", "loved", "unlocked"];

export const Route = createFileRoute("/saved")({
  validateSearch: (search: Record<string, unknown>): { tab: Tab } => {
    const t = search.tab;
    return { tab: VALID_TABS.includes(t as Tab) ? (t as Tab) : "newest" };
  },
  head: () => ({
    meta: [
      { title: "Saved — iBloov Love Letters" },
      {
        name: "description",
        content: "Your saved Love Letters on iBloov.",
      },
    ],
  }),
  component: SavedPage,
});

function SavedPage() {
  const { tab } = Route.useSearch();
  const navigate = useNavigate();
  const setTab = (t: Tab) =>
    navigate({ to: "/saved", search: { tab: t }, replace: true });

  const [isLoading, setIsLoading] = useState(true);
  const [savedLetters, setSavedLetters] = useState<SavedLetter[]>([]);

  useEffect(() => {
    const t = window.setTimeout(() => {
      setSavedLetters(savedLettersMock);
      setIsLoading(false);
    }, 700);
    return () => window.clearTimeout(t);
  }, []);

  const sorted = useMemo(() => {
    const copy = [...savedLetters];
    if (tab === "newest") return copy.sort((a, b) => b.savedAt - a.savedAt);
    if (tab === "loved") return copy.sort((a, b) => b.loveCount - a.loveCount);
    return copy.sort((a, b) => b.unlockedAt - a.unlockedAt);
  }, [savedLetters, tab]);

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-5">
          <h1 className="font-display text-3xl font-bold">Saved</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Love Letters you have bookmarked.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition sm:text-sm ${
                  active
                    ? "border-transparent bg-gradient-love text-white shadow-glow-pink"
                    : "border-foreground/15 bg-foreground/[0.03] text-foreground/70 hover:border-mint/40 hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {isLoading ? (
          <WallSkeleton count={3} />
        ) : sorted.length === 0 ? (
          <div className="glass rounded-3xl">
            <EmptyState
              title="No saved letters yet"
              subtitle="Explore Love Letters and save your favorites to read them again later."
              ctaLabel="Explore"
              ctaHref="/"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((l, i) => (
              <motion.div
                key={l.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="glass rounded-2xl p-4 transition hover:shadow-glow-pink"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="truncate font-display text-base font-bold">
                      {l.venueName}
                    </h3>
                    <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 text-mint" />
                      {l.city}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1 text-xs font-semibold">
                    <Heart className="h-3 w-3 fill-neon-pink text-neon-pink" />
                    {l.rating.toFixed(1)}
                  </div>
                </div>
                <p className="mt-3 line-clamp-2 font-display text-sm italic text-foreground/80">
                  <span className="font-semibold text-mint">
                    I love this place because
                  </span>{" "}
                  {l.excerpt}
                </p>
                <div className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
                  <span>{l.loveCount} letters</span>
                  <span>{relativeDays(tab === "unlocked" ? l.unlockedAt : l.savedAt)}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

function relativeDays(ts: number): string {
  const days = Math.max(0, Math.floor((Date.now() - ts) / (24 * 60 * 60 * 1000)));
  if (days === 0) return "today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}
