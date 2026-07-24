import { useCallback, useEffect, useRef, useState, type ReactNode, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
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

const LS_ACTIVE = "ll.sectionTabs.active";
const LS_OPEN = "ll.sectionTabs.open";
const VALID_KEYS: SectionKey[] = ["explore", "rankings", "wall"];

function isSectionKey(v: string | null | undefined): v is SectionKey {
  return !!v && (VALID_KEYS as string[]).includes(v);
}

type Props = {
  sections: Record<SectionKey, ReactNode>;
};

export function SectionTabs({ sections }: Props) {
  const [active, setActive] = useState<SectionKey>("explore");
  const [mobileOpen, setMobileOpen] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const tabRefs = useRef<Record<SectionKey, HTMLButtonElement | null>>({
    explore: null,
    rankings: null,
    wall: null,
  });
  const panelRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // Hydrate from URL first, then localStorage
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlSection = params.get("section");
      const urlOpen = params.get("open");
      const stored = window.localStorage.getItem(LS_ACTIVE);
      const storedOpen = window.localStorage.getItem(LS_OPEN);

      if (isSectionKey(urlSection)) setActive(urlSection);
      else if (isSectionKey(stored)) setActive(stored);

      if (urlOpen === "0") setMobileOpen(false);
      else if (urlOpen === "1") setMobileOpen(true);
      else if (storedOpen === "0") setMobileOpen(false);
      else if (storedOpen === "1") setMobileOpen(true);
    } catch {
      /* noop */
    }
    setHydrated(true);
  }, []);

  // Persist to localStorage + URL
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(LS_ACTIVE, active);
      window.localStorage.setItem(LS_OPEN, mobileOpen ? "1" : "0");
      const url = new URL(window.location.href);
      url.searchParams.set("section", active);
      url.searchParams.set("open", mobileOpen ? "1" : "0");
      window.history.replaceState({}, "", url.toString());
    } catch {
      /* noop */
    }
  }, [active, mobileOpen, hydrated]);

  const current = TABS.find((t) => t.key === active)!;

  const focusTab = useCallback((key: SectionKey) => {
    tabRefs.current[key]?.focus();
  }, []);

  const onTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>, key: SectionKey) => {
    const idx = TABS.findIndex((t) => t.key === key);
    let nextIdx: number | null = null;
    if (e.key === "ArrowRight") nextIdx = (idx + 1) % TABS.length;
    else if (e.key === "ArrowLeft") nextIdx = (idx - 1 + TABS.length) % TABS.length;
    else if (e.key === "Home") nextIdx = 0;
    else if (e.key === "End") nextIdx = TABS.length - 1;
    else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setActive(key);
      setMobileOpen(true);
      return;
    }
    if (nextIdx !== null) {
      e.preventDefault();
      const nextKey = TABS[nextIdx].key;
      setActive(nextKey);
      setMobileOpen(true);
      focusTab(nextKey);
    }
  };

  const motionProps = prefersReducedMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.01 },
      }
    : {
        initial: { opacity: 0, y: 8, height: 0 },
        animate: { opacity: 1, y: 0, height: "auto" as const },
        exit: { opacity: 0, y: -4, height: 0 },
        transition: { duration: 0.28, ease: "easeOut" as const },
      };

  return (
    <div className="mx-auto max-w-6xl px-3 sm:px-4">
      {/* Sticky tab pill bar */}
      <div className="sticky top-[57px] z-30 -mx-3 sm:-mx-4">
        <div className="border-y border-black/5 bg-white/85 px-3 py-2 backdrop-blur-md sm:px-4">
          <div
            role="tablist"
            aria-label="Home sections"
            aria-orientation="horizontal"
            className="scrollbar-none flex gap-2 overflow-x-auto"
          >
            {TABS.map((t) => {
              const Icon = t.icon;
              const isActive = active === t.key;
              return (
                <button
                  key={t.key}
                  ref={(el) => {
                    tabRefs.current[t.key] = el;
                  }}
                  role="tab"
                  id={`sectiontab-${t.key}`}
                  aria-selected={isActive}
                  aria-controls={`sectionpanel-${t.key}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => {
                    setActive(t.key);
                    setMobileOpen(true);
                  }}
                  onKeyDown={(e) => onTabKeyDown(e, t.key)}
                  className={`group relative inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-pink focus-visible:ring-offset-2 sm:text-sm ${
                    isActive
                      ? "border-transparent bg-foreground text-background shadow-sm"
                      : "border-black/10 bg-white text-foreground/70 hover:border-mint/40 hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">{t.label}</span>
                  <span className="sm:hidden">{t.short}</span>
                  {isActive && !prefersReducedMotion && (
                    <motion.span
                      layoutId="tab-underline"
                      aria-hidden="true"
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
        className={`mt-4 flex w-full items-center justify-between gap-3 rounded-2xl border border-black/10 bg-gradient-to-r ${current.accent} to-white/60 px-4 py-3 text-left transition hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-pink focus-visible:ring-offset-2`}
        aria-expanded={mobileOpen}
        aria-controls={`sectionpanel-${active}`}
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
          transition={{ duration: prefersReducedMotion ? 0 : 0.25 }}
          aria-hidden="true"
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
            ref={panelRef}
            role="tabpanel"
            id={`sectionpanel-${active}`}
            aria-labelledby={`sectiontab-${active}`}
            tabIndex={0}
            {...motionProps}
            className="overflow-hidden focus:outline-none"
          >
            <div className="-mx-3 pt-2 sm:-mx-4">{sections[active]}</div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
