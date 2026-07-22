import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Heart, MapPin, Search, TrendingUp, X, Loader2 } from "lucide-react";
import { Navbar } from "@/components/love-letters/Navbar";
import { Footer } from "@/components/love-letters/Footer";
import { trendingVenues, type TrendingVenue } from "@/lib/love-letters/mockVenues";

export const Route = createFileRoute("/wall")({
  head: () => ({
    meta: [
      { title: "Wall of Love — Every place with a Love Letter · iBloov" },
      {
        name: "description",
        content:
          "Scroll every restaurant, hotel, and destination that's received a Love Letter on iBloov.",
      },
      { property: "og:title", content: "Wall of Love · iBloov" },
      {
        property: "og:description",
        content: "Endless feed of the places travelers love around the world.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: WallPage,
});

const PAGE = 12;

function WallPage() {
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(PAGE);
  const sentinel = useRef<HTMLDivElement | null>(null);

  // Sort by loveCount and repeat cyclically for "endless" feel.
  const base = useMemo(
    () => [...trendingVenues].sort((a, b) => b.loveCount - a.loveCount),
    [],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return base;
    return base.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.city.toLowerCase().includes(q) ||
        v.country.toLowerCase().includes(q) ||
        v.region.toLowerCase().includes(q) ||
        v.category.toLowerCase().includes(q),
    );
  }, [base, query]);

  // Endless feed: cycle the list up to `visible` items.
  const feed: (TrendingVenue & { _k: string })[] = useMemo(() => {
    if (filtered.length === 0) return [];
    const items: (TrendingVenue & { _k: string })[] = [];
    for (let i = 0; i < visible; i++) {
      const v = filtered[i % filtered.length];
      items.push({ ...v, _k: `${v.id}-${i}` });
    }
    return items;
  }, [filtered, visible]);

  useEffect(() => {
    setVisible(PAGE);
  }, [query]);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible((n) => n + PAGE);
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-mint">
            <TrendingUp className="mr-1 inline h-3.5 w-3.5" /> Wall of Love
          </p>
          <h1 className="mt-2 font-display text-2xl font-bold sm:text-4xl">
            Every place with a <span className="text-gradient-love">Love Letter</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            An endless feed of the restaurants, hotels, and destinations travelers adore.
          </p>

          <div className="relative mt-4">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, city, country, or category…"
              className="w-full rounded-full border border-foreground/15 bg-foreground/[0.03] px-10 py-2.5 text-sm outline-none transition focus:border-mint/60 focus:shadow-glow-mint"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="Clear"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-foreground/40 hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="glass rounded-3xl p-10 text-center">
            <Heart className="mx-auto h-8 w-8 text-neon-pink" />
            <h3 className="mt-2 font-display text-lg font-bold">No matches</h3>
            <p className="mt-1 text-sm text-foreground/60">
              Try a different city, country, or category.
            </p>
          </div>
        ) : (
          <>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {feed.map((v, i) => (
                <motion.li
                  key={v._k}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: (i % PAGE) * 0.03 }}
                  className="group glass overflow-hidden rounded-2xl transition hover:shadow-glow-pink"
                >
                  <Link
                    to="/venue/$venueId"
                    params={{ venueId: v.id }}
                    className="flex gap-3 p-3"
                  >
                    <img
                      src={v.photo}
                      alt={v.name}
                      loading="lazy"
                      className="h-20 w-20 shrink-0 rounded-xl object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="truncate font-display text-sm font-bold sm:text-base">
                          {v.name}
                        </h3>
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-neon-pink/10 px-2 py-0.5 text-[11px] font-bold text-neon-pink">
                          <Heart className="h-3 w-3 fill-current" />
                          {v.rating.toFixed(1)}
                        </span>
                      </div>
                      <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-muted-foreground">
                        <MapPin className="h-3 w-3 text-mint" />
                        {v.city} · {v.country}
                      </p>
                      <p className="mt-1 line-clamp-2 text-xs text-foreground/70">
                        “{v.excerpt}”
                      </p>
                      <p className="mt-1 text-[11px] font-semibold text-mint">
                        {v.loveCount} love letters
                      </p>
                    </div>
                  </Link>
                </motion.li>
              ))}
            </ul>

            <div
              ref={sentinel}
              className="mt-8 flex items-center justify-center py-6 text-xs text-foreground/50"
            >
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading more love…
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
