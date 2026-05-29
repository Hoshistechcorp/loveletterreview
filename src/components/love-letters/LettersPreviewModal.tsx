import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Heart, MapPin, X } from "lucide-react";
import type { TrendingVenue } from "@/lib/love-letters/mockVenues";

type SampleLetter = {
  id: string;
  author: string;
  daysAgo: number;
  rating: number;
  message: string;
};

const AUTHORS = ["Maya R.", "Jordan K.", "Sofia L.", "Marcus T.", "Amelia W.", "Diego F.", "Priya S."];

const FRAGMENTS = [
  "I came in tired and left lighter — that almost never happens.",
  "Every detail feels like it was put there on purpose, with love.",
  "Brought my mom here on her birthday and she cried (the good kind).",
  "The kind of place you describe to a stranger and they immediately want to go.",
  "I've been three times this month. I'm not even mad about it.",
  "It doesn't try to be cool. It just is. And that's the magic.",
];

export function sampleLettersFor(venue: TrendingVenue): SampleLetter[] {
  // Deterministic-ish samples seeded by venue id
  const seed = parseInt(venue.id, 10) || 1;
  const pick = <T,>(arr: T[], offset: number) => arr[(seed + offset) % arr.length];
  return [
    {
      id: `${venue.id}-l1`,
      author: pick(AUTHORS, 0),
      daysAgo: Math.max(1, venue.daysAgo),
      rating: venue.rating,
      message: `I love this place because ${venue.excerpt}`,
    },
    {
      id: `${venue.id}-l2`,
      author: pick(AUTHORS, 2),
      daysAgo: Math.max(2, venue.daysAgo + 3),
      rating: Math.max(8, Math.round(venue.rating * 10 - 4) / 10),
      message: pick(FRAGMENTS, 1),
    },
    {
      id: `${venue.id}-l3`,
      author: pick(AUTHORS, 4),
      daysAgo: Math.max(4, venue.daysAgo + 7),
      rating: Math.max(8, Math.round(venue.rating * 10 - 7) / 10),
      message: pick(FRAGMENTS, 3),
    },
    {
      id: `${venue.id}-l4`,
      author: pick(AUTHORS, 5),
      daysAgo: Math.max(6, venue.daysAgo + 14),
      rating: Math.max(8, Math.round(venue.rating * 10 - 9) / 10),
      message: pick(FRAGMENTS, 5),
    },
  ];
}

function timeAgo(days: number) {
  if (days < 1) return "today";
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.round(days / 7)}w ago`;
  return `${Math.round(days / 30)}mo ago`;
}

type Props = {
  open: boolean;
  venue: TrendingVenue | null;
  onClose: () => void;
  onWrite: () => void;
};

export function LettersPreviewModal({ open, venue, onClose, onWrite }: Props) {
  return (
    <AnimatePresence>
      {open && venue && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%", opacity: 0.8 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0.5 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl border border-foreground/10 bg-background shadow-2xl sm:rounded-3xl"
          >
            {/* Header */}
            <div className="relative shrink-0 border-b border-foreground/5 bg-gradient-to-br from-neon-pink/10 via-purple/5 to-transparent px-5 py-5 sm:px-7 sm:py-6">
              <button
                onClick={onClose}
                aria-label="Close"
                className="absolute right-4 top-4 rounded-full bg-foreground/5 p-1.5 text-foreground/60 transition hover:bg-foreground/10 hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-mint">
                Love Letters for
              </p>
              <h2 className="mt-1 font-display text-2xl font-bold leading-tight sm:text-3xl">
                {venue.name}
              </h2>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground sm:text-sm">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-mint" />
                  {venue.city} · {venue.country}
                </span>
                <span className="inline-flex items-center gap-1 font-semibold text-foreground/80">
                  <Heart className="h-3 w-3 fill-neon-pink text-neon-pink" />
                  {venue.rating.toFixed(1)}
                </span>
                <span className="font-semibold text-mint">{venue.loveCount} letters</span>
              </div>
            </div>

            {/* Letters list */}
            <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                A few of the most recent letters
              </p>
              <ul className="flex flex-col gap-3">
                {sampleLettersFor(venue).map((l) => (
                  <li
                    key={l.id}
                    className="glass rounded-2xl p-4 sm:p-5"
                  >
                    <div className="mb-2 flex items-center justify-between text-xs">
                      <span className="font-semibold text-foreground/80">{l.author}</span>
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <span className="inline-flex items-center gap-1 font-semibold text-foreground/70">
                          <Heart className="h-3 w-3 fill-neon-pink text-neon-pink" />
                          {l.rating.toFixed(1)}
                        </span>
                        <span>{timeAgo(l.daysAgo)}</span>
                      </div>
                    </div>
                    <p className="text-sm italic leading-relaxed text-foreground/85 sm:text-base">
                      &ldquo;{l.message}&rdquo;
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer CTA */}
            <div className="shrink-0 border-t border-foreground/5 bg-background/95 px-5 py-4 sm:px-7 sm:py-5">
              <button
                onClick={onWrite}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-love px-6 py-3.5 text-sm font-bold text-white shadow-glow-pink transition hover:scale-[1.02] active:scale-95 sm:text-base"
              >
                Write your Love Letter to {venue.name} 💌
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
