import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Mail, X } from "lucide-react";
import { useState, useEffect } from "react";
import type { Venue } from "@/lib/love-letters/mockVenues";
import { HeartRating } from "./HeartRating";
import { LetterEditor, MAX_WORDS } from "./LetterEditor";
import { countWords } from "@/lib/love-letters/wordCount";

type Props = {
  open: boolean;
  venue: Venue | null;
  onClose: () => void;
  onSubmit: (rating: number, message: string) => void;
};

type Step = "compose" | "preview";

export function WriteLetterModal({ open, venue, onClose, onSubmit }: Props) {
  const [rating, setRating] = useState(8);
  const [message, setMessage] = useState("");
  const [step, setStep] = useState<Step>("compose");

  useEffect(() => {
    if (open) {
      setRating(8);
      setMessage("");
      setStep("compose");
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

            {step === "compose" ? (
              <>
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
                    onClick={() => setStep("preview")}
                    disabled={!message.trim()}
                    className="w-full rounded-xl bg-gradient-love px-4 py-3 text-sm font-bold text-white shadow-glow-pink transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 sm:rounded-2xl sm:px-5 sm:py-4 sm:text-base"
                  >
                    Preview email →
                  </button>
                </div>
              </>
            ) : (
              <EmailPreview
                venue={venue}
                rating={rating}
                message={message}
                onBack={() => setStep("compose")}
                onSend={() => onSubmit(rating, message)}
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function EmailPreview({
  venue,
  rating,
  message,
  onBack,
  onSend,
}: {
  venue: Venue;
  rating: number;
  message: string;
  onBack: () => void;
  onSend: () => void;
}) {
  return (
    <>
      <div className="mb-3 flex items-center gap-2">
        <button
          onClick={onBack}
          className="rounded-full p-1.5 text-foreground/70 hover:bg-white/10"
          aria-label="Back"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-mint sm:text-xs">
            Email preview
          </p>
          <h3 className="font-display text-lg font-bold sm:text-xl">
            What the owner will see
          </h3>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-foreground/10 bg-white text-zinc-900 shadow-lg">
        {/* Email header */}
        <div className="border-b border-zinc-200 px-4 py-3 text-xs sm:px-5">
          <div className="flex items-center gap-2 text-zinc-500">
            <Mail className="h-3.5 w-3.5" />
            <span className="font-semibold uppercase tracking-wider">
              iBloov Love Letters
            </span>
          </div>
          <div className="mt-2 space-y-0.5">
            <p>
              <span className="text-zinc-500">From:</span>{" "}
              <span className="font-medium">love@ibloov.com</span>
            </p>
            <p>
              <span className="text-zinc-500">To:</span>{" "}
              <span className="font-medium">{venue.name} team</span>
            </p>
            <p>
              <span className="text-zinc-500">Subject:</span>{" "}
              <span className="font-medium">
                💌 You just received a Love Letter ({rating}/10 hearts)
              </span>
            </p>
          </div>
        </div>

        {/* Email body */}
        <div className="space-y-3 px-4 py-4 text-sm sm:px-5 sm:py-5">
          <p>Hi {venue.name} team,</p>
          <p>
            Someone just sent you a Love Letter on iBloov — a real customer,
            telling you what they love about your place.
          </p>
          <div className="rounded-xl border-l-4 border-pink-400 bg-pink-50 p-3 text-zinc-800">
            <p className="text-xs uppercase tracking-wider text-pink-500">
              Their note
            </p>
            <p className="mt-1 italic">
              <span className="font-semibold">I love this place because</span>{" "}
              {message || "…"}
            </p>
            <p className="mt-2 text-xs text-zinc-500">
              Rating: {rating}/10 hearts
            </p>
          </div>
          <p className="text-xs text-zinc-500">
            Claim your venue on iBloov to reply and unlock more letters.
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:gap-3">
        <button
          onClick={onBack}
          className="rounded-xl border border-foreground/15 px-4 py-3 text-sm font-semibold text-foreground/80 transition hover:bg-foreground/5 sm:rounded-2xl"
        >
          Edit letter
        </button>
        <button
          onClick={onSend}
          className="flex-1 rounded-xl bg-gradient-love px-4 py-3 text-sm font-bold text-white shadow-glow-pink transition hover:brightness-110 sm:rounded-2xl sm:py-4 sm:text-base"
        >
          Send Love 💌
        </button>
      </div>
    </>
  );
}
