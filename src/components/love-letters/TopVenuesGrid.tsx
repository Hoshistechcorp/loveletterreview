import { motion } from "framer-motion";
import { Bookmark, BookmarkCheck, Heart, MapPin } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  CATEGORY_GROUPS,
  trendingVenues,
  type CategoryGroup,
} from "@/lib/love-letters/mockVenues";
import { toggleSaved, useLocalStore, getSavedVenueIds } from "@/lib/love-letters/localStore";
import type { HomeCategory } from "./CategoryTabs";

type Props = {
  category: HomeCategory;
};

export function TopVenuesGrid({ category }: Props) {
  const groups: CategoryGroup[] = category === "All" ? CATEGORY_GROUPS : [category];
  const savedIds = useLocalStore(getSavedVenueIds);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {groups.map((g) => (
        <GroupRow key={g} group={g} savedIds={savedIds} />
      ))}
    </div>
  );
}

function GroupRow({ group, savedIds }: { group: CategoryGroup; savedIds: string[] }) {
  const items = useMemo(
    () =>
      trendingVenues
        .filter((v) => v.categoryGroup === group)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 6),
    [group],
  );
  if (items.length === 0) return null;

  return (
    <section className="mb-8">
      <div className="mb-3 flex items-end justify-between">
        <h2 className="font-display text-xl font-bold sm:text-2xl">
          Top rated · {group}
        </h2>
        <a href="#wall" className="text-xs font-semibold text-mint hover:underline">
          See all →
        </a>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((v, i) => {
          const saved = savedIds.includes(v.id);
          return (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.35 }}
              className="group relative overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm transition hover:shadow-glow-mint"
            >
              <Link
                to="/venue/$venueId"
                params={{ venueId: v.id }}
                className="block"
              >
                <div className="relative h-40 w-full overflow-hidden">
                  <img
                    src={v.photo}
                    alt={v.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-foreground shadow">
                    {v.category}
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display text-base font-bold leading-tight">
                      {v.name}
                    </h3>
                    <div className="flex shrink-0 items-center gap-1 rounded-full bg-mint/10 px-2 py-0.5 text-xs font-bold text-mint">
                      <Heart className="h-3 w-3 fill-current" />
                      {v.rating.toFixed(1)}
                    </div>
                  </div>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3 text-neon-pink" />
                    {v.city}
                  </p>
                  <p className="mt-2 line-clamp-2 text-xs text-foreground/70">
                    “{v.excerpt}”
                  </p>
                  <div className="mt-2 text-[11px] text-muted-foreground">
                    {v.loveCount} love letters
                  </div>
                </div>
              </Link>
              <button
                aria-label={saved ? "Remove save" : "Save"}
                onClick={(e) => {
                  e.preventDefault();
                  toggleSaved(v.id);
                }}
                className="absolute right-2 top-2 rounded-full bg-white/95 p-1.5 text-foreground shadow hover:text-mint"
              >
                {saved ? (
                  <BookmarkCheck className="h-4 w-4 text-mint" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
              </button>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
