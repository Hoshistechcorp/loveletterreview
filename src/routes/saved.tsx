import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { Bookmark, Heart, MapPin } from "lucide-react";
import { Navbar } from "@/components/love-letters/Navbar";
import { Footer } from "@/components/love-letters/Footer";
import { EmptyState } from "@/components/love-letters/EmptyState";
import { trendingVenues } from "@/lib/love-letters/mockVenues";
import { getSavedVenueIds, toggleSaved, useLocalStore } from "@/lib/love-letters/localStore";

type Tab = "all" | "recent" | "top";
const TABS: { id: Tab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "recent", label: "Recently added" },
  { id: "top", label: "Top rated" },
];
const VALID_TABS: Tab[] = ["all", "recent", "top"];

export const Route = createFileRoute("/saved")({
  validateSearch: (search: Record<string, unknown>): { tab: Tab } => ({
    tab: VALID_TABS.includes(search.tab as Tab) ? (search.tab as Tab) : "all",
  }),
  head: () => ({
    meta: [
      { title: "Saved businesses — iBloov" },
      {
        name: "description",
        content: "Businesses you've saved on iBloov — restaurants, hotels, and destinations you love.",
      },
      { property: "og:title", content: "Saved businesses — iBloov" },
      { property: "og:description", content: "Your bookmarked businesses on iBloov." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: SavedPage,
});

function SavedPage() {
  const { tab } = Route.useSearch();
  const navigate = useNavigate();
  const savedIds = useLocalStore(getSavedVenueIds);
  const setTab = (t: Tab) => navigate({ to: "/saved", search: { tab: t }, replace: true });

  const items = useMemo(() => {
    const list = trendingVenues.filter((v) => savedIds.includes(v.id));
    if (tab === "top") return [...list].sort((a, b) => b.rating - a.rating);
    if (tab === "recent") {
      // preserve savedIds order (last saved appended last)
      return list.sort(
        (a, b) => savedIds.indexOf(b.id) - savedIds.indexOf(a.id),
      );
    }
    return list;
  }, [savedIds, tab]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-5">
          <h1 className="font-display text-3xl font-bold">Saved businesses</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Places you've bookmarked to visit or revisit.
          </p>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition sm:text-sm ${
                  active
                    ? "border-transparent bg-foreground text-background"
                    : "border-black/10 bg-white text-foreground/70 hover:border-mint/40 hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-black/10 bg-white">
            <EmptyState
              title="No saved businesses yet"
              subtitle="Tap the bookmark on any business to keep it here."
              ctaLabel="Explore"
              ctaHref="/"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((v, i) => (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="group relative overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm transition hover:shadow-glow-mint"
              >
                <Link to="/venue/$venueId" params={{ venueId: v.id }} className="block">
                  <div className="relative h-36 w-full overflow-hidden">
                    <img
                      src={v.photo}
                      alt={v.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display text-base font-bold">{v.name}</h3>
                      <div className="flex items-center gap-1 text-xs font-bold text-mint">
                        <Heart className="h-3 w-3 fill-current" />
                        {v.rating.toFixed(1)}
                      </div>
                    </div>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 text-neon-pink" />
                      {v.city}
                    </p>
                    <p className="mt-2 line-clamp-2 text-xs text-foreground/70">“{v.excerpt}”</p>
                  </div>
                </Link>
                <button
                  aria-label="Remove save"
                  onClick={() => toggleSaved(v.id)}
                  className="absolute right-2 top-2 rounded-full bg-white/95 p-1.5 text-mint shadow"
                >
                  <Bookmark className="h-4 w-4 fill-current" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
