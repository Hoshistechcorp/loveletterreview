import { Hotel, UtensilsCrossed, Ticket, Globe2, Sparkles } from "lucide-react";
import { CATEGORY_GROUPS, type CategoryGroup } from "@/lib/love-letters/mockVenues";

export type HomeCategory = "All" | CategoryGroup;

const ICONS: Record<HomeCategory, typeof Sparkles> = {
  All: Sparkles,
  "Restaurants & bars": UtensilsCrossed,
  "Hotels & stays": Hotel,
  "Things to do": Ticket,
  Destinations: Globe2,
};

type Props = {
  value: HomeCategory;
  onChange: (v: HomeCategory) => void;
};

export function CategoryTabs({ value, onChange }: Props) {
  const items: HomeCategory[] = ["All", ...CATEGORY_GROUPS];
  return (
    <div className="mx-auto max-w-6xl px-4">
      <div className="scrollbar-none flex gap-2 overflow-x-auto pb-2">
        {items.map((c) => {
          const Icon = ICONS[c];
          const active = value === c;
          return (
            <button
              key={c}
              onClick={() => onChange(c)}
              className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                active
                  ? "border-transparent bg-foreground text-background shadow-sm"
                  : "border-black/10 bg-white text-foreground/70 hover:border-mint/40 hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {c}
            </button>
          );
        })}
      </div>
    </div>
  );
}
