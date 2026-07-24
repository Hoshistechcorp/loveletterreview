import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Compass, Trophy, Heart, ChevronDown } from "lucide-react";

export type SectionKey = "explore" | "rankings" | "wall";

const TABS: {
  key: SectionKey;
  label: string;
  short: string;
  icon: typeof Compass;
  hint: string;
  accent: string;
}[] = [
  {
    key: "explore",
    label: "Explore",
    short: "Explore",
    icon: Compass,
    hint: "Trending places & destinations",
    accent: "from-mint/25 to-mint/0",
  },
  {
    key: "rankings",
    label: "Rankings",
    short: "Rankings",
    icon: Trophy,
    hint: "World score · nearby · timeline",
    accent: "from-purple/25 to-purple/0",
  },
  {
    key: "wall",
    label: "Wall of Love",
    short: "Wall",
    icon: Heart,
    hint: "Top 10 loved right now",
    accent: "from-neon-pink/25 to-neon-pink/0",
  },
];

type Props = {
  sections: Record<SectionKey, ReactNode>;
};

export function SectionTabs({ sections }: Props) {
  const [active, setActive] = useState<SectionKey>("explore");
  const [mobileOpen, setMobileOpen] = useState(true);
  const current = TABS.find((t) => t.key === active)!;

  return (
    <div className="mx-auto max-w-6xl px-3 sm:px-4">
      {/* Sticky tab pill bar */}
      <div className="sticky top-[57px] z-30 -mx-3 sm:-mx-4">
        <div className="border-y border-black/5 bg-white/85 px-3 py-2 backdrop-blur-md sm:px-4">
          <div className="scrollbar-none flex gap-2 overflow-x-auto">
            {TABS.map((t) => {
              const Icon = t.icon;
              const isActive = active === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => {
                    setActive(t.key);
                    setMobileOpen(true);
                  }}
                  className={`group relative inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold transition sm:text-sm ${
                    isActive
                      ? "border-transparent bg-foreground text-background shadow-sm"
                      : "border-black/10 bg-white text-foreground/70 hover:border-mint/40 hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{t.label}</span>
                  <span className="sm:hidden">{t.short}</span>
                  {isActive && (
                    <motion.span
                      layoutId="tab-underline"
                      className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-mint/20 via-neon-pink/10 to-purple/20"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Collapsible section header */}
      <button
        onClick={() => setMobileOpen((v) => !v)}
        className={`mt-4 flex w-full items-center justify-between gap-3 rounded-2xl border border-black/10 bg-gradient-to-r ${current.accent} to-white/60 px-4 py-3 text-left transition hover:shadow-sm`}
        aria-expanded={mobileOpen}
      >
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/50">
            Section
          </p>
          <h2 className="truncate font-display text-lg font-bold sm:text-xl">
            {current.label}
          </h2>
          <p className="truncate text-[11px] text-foreground/60 sm:text-xs">
            {current.hint}
          </p>
        </div>
        <motion.span
          animate={{ rotate: mobileOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-foreground shadow-sm"
        >
          <ChevronDown className="h-4 w-4" />
        </motion.span>
      </button>

      {/* Animated content swap */}
      <AnimatePresence initial={false} mode="wait">
        {mobileOpen && (
          <motion.section
            key={active}
            initial={{ opacity: 0, y: 8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="-mx-3 pt-2 sm:-mx-4">{sections[active]}</div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
