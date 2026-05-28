import { AnimatePresence, motion } from "framer-motion";
import { useMemo } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function SuccessOverlay({ open, onClose }: Props) {
  const hearts = useMemo(
    () =>
      Array.from({ length: 24 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.8,
        duration: 2.2 + Math.random() * 1.5,
        size: 14 + Math.random() * 26,
        emoji: ["💖", "💌", "💕", "❤️", "💘"][i % 5],
      })),
    [open],
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-md"
          onClick={onClose}
        >
          {/* Floating hearts */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {hearts.map((h) => (
              <motion.span
                key={h.id}
                initial={{ y: "110vh", opacity: 0, rotate: -20 }}
                animate={{ y: "-20vh", opacity: [0, 1, 1, 0], rotate: 20 }}
                transition={{
                  duration: h.duration,
                  delay: h.delay,
                  ease: "easeOut",
                  repeat: Infinity,
                }}
                style={{ left: `${h.x}%`, fontSize: h.size }}
                className="absolute"
              >
                {h.emoji}
              </motion.span>
            ))}
          </div>

          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
            className="glass relative z-10 mx-4 max-w-md rounded-3xl p-7 text-center shadow-glow-pink"
          >
            <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-gradient-love text-3xl shadow-glow-pink">
              💌
            </div>
            <h3 className="font-display text-2xl font-bold">
              Love Letter Sent!
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              We are notifying the owners right now so they can unlock and read
              your message.
            </p>
            <button
              onClick={onClose}
              className="mt-6 w-full rounded-2xl bg-mint px-5 py-3 text-sm font-bold text-background shadow-glow-mint transition hover:brightness-110"
            >
              Send another 💖
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
