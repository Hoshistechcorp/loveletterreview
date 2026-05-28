import { motion, AnimatePresence } from "framer-motion";
import { Heart, Lock } from "lucide-react";
import { useState } from "react";

type Props = {
  value: number;
  onChange: (v: number) => void;
};

const MIN = 4;
const TOTAL = 10;

export function HeartRating({ value, onChange }: Props) {
  const [tooltipFor, setTooltipFor] = useState<number | null>(null);

  const handleClick = (n: number) => {
    if (n < MIN) {
      setTooltipFor(n);
      window.setTimeout(() => setTooltipFor((c) => (c === n ? null : c)), 2200);
      return;
    }
    onChange(n);
  };

  return (
    <div className="relative">
      <div className="mb-1.5 flex items-center justify-between sm:mb-2">
        <p className="text-sm font-medium text-foreground/80">
          How much do you love it?
        </p>
        <span className="text-xs font-semibold text-neon-pink">
          {value}/{TOTAL} 💖
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
        {Array.from({ length: TOTAL }).map((_, i) => {
          const n = i + 1;
          const locked = n < MIN;
          const filled = !locked && n <= value;
          return (
            <button
              key={n}
              type="button"
              onClick={() => handleClick(n)}
              onMouseEnter={() => locked && setTooltipFor(n)}
              onMouseLeave={() => locked && setTooltipFor(null)}
              aria-label={locked ? `${n} hearts (locked)` : `${n} hearts`}
              className="group relative grid h-8 w-8 place-items-center rounded-lg transition hover:scale-110 sm:h-9 sm:w-9"
            >
              {locked ? (
                <div className="relative">
                  <Heart className="h-6 w-6 text-black/15 sm:h-7 sm:w-7" />
                  <Lock className="absolute inset-0 m-auto h-2.5 w-2.5 text-black/40 sm:h-3 sm:w-3" />
                </div>
              ) : (
                <motion.div
                  animate={filled ? { scale: [1, 1.25, 1] } : { scale: 1 }}
                  transition={{ duration: 0.25 }}
                >
                  <Heart
                    className={
                      filled
                        ? "h-6 w-6 stroke-[1.5] sm:h-7 sm:w-7"
                        : "h-6 w-6 text-black/25 hover:text-neon-pink sm:h-7 sm:w-7"
                    }
                    style={

                      filled
                        ? {
                            fill: "url(#heartGrad)",
                            stroke: "transparent",
                            filter:
                              "drop-shadow(0 0 6px color-mix(in oklab, var(--neon-pink) 70%, transparent))",
                          }
                        : undefined
                    }
                  />
                </motion.div>
              )}
            </button>
          );
        })}
        {/* shared gradient defs */}
        <svg width="0" height="0" className="absolute">
          <defs>
            <linearGradient id="heartGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="oklch(0.66 0.27 0)" />
              <stop offset="100%" stopColor="oklch(0.62 0.22 295)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <AnimatePresence>
        {tooltipFor !== null && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="mt-2 rounded-lg border border-neon-pink/30 bg-neon-pink/10 px-2.5 py-1.5 text-[11px] text-foreground sm:mt-3 sm:rounded-xl sm:px-3 sm:py-2 sm:text-xs"
          >
            At iBloov, we only spread love. 4 hearts is our minimum! ❤️
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

