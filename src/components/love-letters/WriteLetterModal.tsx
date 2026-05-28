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
            className="glass relative w-full max-w-xl rounded-t-3xl border-t border-white/10 p-5 shadow-glow-purple sm:rounded-3xl sm:p-7"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-3 top-3 rounded-full p-2 text-foreground/70 hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mb-5">
              <p className="text-xs uppercase tracking-widest text-mint">
                Writing to
              </p>
              <h3 className="font-display text-2xl font-bold sm:text-3xl">
                {venue.name}
              </h3>
              <p className="text-xs text-muted-foreground">
                {venue.address}, {venue.city}
              </p>
            </div>

            <div className="space-y-6">
              <HeartRating value={rating} onChange={setRating} />
              <LetterEditor value={message} onChange={setMessage} />

              <button
                onClick={() => onSubmit(rating, message)}
                className="w-full rounded-2xl bg-gradient-love px-5 py-4 text-base font-bold text-white shadow-glow-pink transition hover:brightness-110"
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
