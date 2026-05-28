import { motion } from "framer-motion";
import { ExternalLink, Lock, MapPin, Sparkles } from "lucide-react";
import type { Venue } from "@/lib/love-letters/mockVenues";

type Props = {
  venue: Venue;
  onWrite: () => void;
};

export function PlaceFoundCard({ venue, onWrite }: Props) {
  const imageUrl = `https://source.unsplash.com/featured/800x600/?${encodeURIComponent(
    venue.imageQuery + ",restaurant",
  )}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 180, damping: 22 }}
      className="mx-auto w-full max-w-3xl px-4"
    >
      <div className="glass relative overflow-hidden rounded-3xl shadow-glow-purple">
        <div className="relative h-44 w-full overflow-hidden sm:h-56">
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
            <div className="absolute right-3 top-3">
              <span className="inline-flex animate-pulse-glow items-center gap-1.5 rounded-full bg-gradient-love px-3 py-1 text-xs font-semibold text-white shadow-glow-pink">
                <Sparkles className="h-3.5 w-3.5" />
                Be the first to send them love!
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-end sm:justify-between sm:p-6">
          <div className="min-w-0">
            <h3 className="font-display text-2xl font-bold leading-tight sm:text-3xl">
              {venue.name}
            </h3>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 text-mint" />
              {venue.address}, {venue.city}
            </p>
            <a
              href={`https://${venue.website}`}
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-flex items-center gap-1 text-xs text-mint hover:underline"
            >
              {venue.website} <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <button
            onClick={onWrite}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-mint px-5 py-3 text-sm font-bold text-background shadow-glow-mint transition hover:brightness-110"
          >
            Write Letter 💌
          </button>
        </div>

        {!venue.claimed && (
          <div className="flex items-center justify-center gap-1.5 border-t border-white/5 px-4 py-2.5 text-xs text-muted-foreground">
            <Lock className="h-3 w-3" />
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
