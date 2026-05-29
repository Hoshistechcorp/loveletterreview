import { motion } from "framer-motion";
import { ExternalLink, Lock, MapPin, Sparkles, X } from "lucide-react";
import type { Venue } from "@/lib/love-letters/mockVenues";

type Props = {
  venue: Venue;
  onWrite: () => void;
  onClose?: () => void;
};

export function PlaceFoundCard({ venue, onWrite, onClose }: Props) {
  const imageUrl = `https://source.unsplash.com/featured/800x600/?${encodeURIComponent(
    venue.imageQuery + ",restaurant",
  )}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 180, damping: 22 }}
      className="mx-auto w-full max-w-3xl px-3 sm:px-4"
    >
      <div className="glass relative overflow-hidden rounded-2xl shadow-glow-purple sm:rounded-3xl">
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-2 top-2 z-10 rounded-full bg-black/50 p-1.5 text-white backdrop-blur transition hover:bg-black/70 sm:right-3 sm:top-3 sm:p-2"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <div className="relative h-36 w-full overflow-hidden sm:h-56">
          <img
            src={imageUrl}
            alt={venue.name}
            className="h-full w-full object-cover opacity-80"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          {!venue.claimed && (
            <div className="absolute right-2 top-2 sm:right-3 sm:top-3">
              <span className="inline-flex animate-pulse-glow items-center gap-1 rounded-full bg-gradient-love px-2 py-0.5 text-[10px] font-semibold text-white shadow-glow-pink sm:gap-1.5 sm:px-3 sm:py-1 sm:text-xs">
                <Sparkles className="h-3 w-3" />
                Be the first!
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-end sm:justify-between sm:gap-4 sm:p-6">
          <div className="min-w-0">
            <h3 className="font-display text-xl font-bold leading-tight sm:text-3xl">
              {venue.name}
            </h3>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground sm:mt-1 sm:text-sm">
              <MapPin className="h-3 w-3 text-mint sm:h-3.5 sm:w-3.5" />
              {venue.address}, {venue.city}
            </p>
            <a
              href={`https://${venue.website}`}
              target="_blank"
              rel="noreferrer"
              className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-mint hover:underline sm:mt-1 sm:text-xs"
            >
              {venue.website} <ExternalLink className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            </a>
          </div>

          <button
            onClick={onWrite}
            className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-mint px-4 py-2.5 text-sm font-bold text-background shadow-glow-mint transition hover:brightness-110 sm:gap-2 sm:rounded-2xl sm:px-5 sm:py-3"
          >
            Write Letter 💌
          </button>
        </div>

        {!venue.claimed && (
          <div className="flex items-center justify-center gap-1 border-t border-white/5 px-3 py-2 text-[11px] text-muted-foreground sm:px-4 sm:py-2.5 sm:text-xs">
            <Lock className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            Are you the owner?{" "}
            <a
              href="https://auralink.ibloov.com"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-foreground/90 underline-offset-2 hover:underline"
            >
              Claim this page
            </a>
          </div>
        )}
      </div>
    </motion.div>
  );
}

