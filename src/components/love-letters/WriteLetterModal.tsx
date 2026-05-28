import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import type { Venue } from "@/lib/love-letters/mockVenues";
import { HeartRating } from "./HeartRating";
import { LetterEditor } from "./LetterEditor";

type Props = {
  open: boolean;
  venue: Venue | null;
  onClose: () => void;
  onSubmit: (rating: number, message: string) => void;
};

export function WriteLetterModal({ open, venue, onClose, onSubmit }: Props) {
  const [rating, setRating] = useState(8);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (open) {
      setRating(8);
      setMessage("");
    }
  }, [open]);

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
            transition={{ type: "spring", stiffness: 240, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="glass relative max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-2xl border-t border-white/10 p-4 shadow-glow-purple sm:rounded-3xl sm:p-7"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-2 top-2 rounded-full p-1.5 text-foreground/70 hover:bg-white/10 sm:right-3 sm:top-3 sm:p-2"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mb-4 sm:mb-5">
              <p className="text-[10px] uppercase tracking-widest text-mint sm:text-xs">
                Writing to
              </p>
              <h3 className="font-display text-xl font-bold sm:text-3xl">
                {venue.name}
              </h3>
              <p className="text-[11px] text-muted-foreground sm:text-xs">
                {venue.address}, {venue.city}
              </p>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <HeartRating value={rating} onChange={setRating} />
              <LetterEditor value={message} onChange={setMessage} />

              <button
                onClick={() => onSubmit(rating, message)}
                className="w-full rounded-xl bg-gradient-love px-4 py-3 text-sm font-bold text-white shadow-glow-pink transition hover:brightness-110 sm:rounded-2xl sm:px-5 sm:py-4 sm:text-base"
              >
                Send Love 💌
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

}
