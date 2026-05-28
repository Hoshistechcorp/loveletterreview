import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  onAuthed: () => void;
};

export function AuthWallModal({ open, onClose, onAuthed }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/80 backdrop-blur-md sm:items-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="glass relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-2xl p-5 shadow-glow-pink sm:rounded-3xl sm:p-8"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-2 top-2 rounded-full p-1.5 text-foreground/70 hover:bg-white/10 sm:right-3 sm:top-3 sm:p-2"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="text-center">
              <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-xl bg-gradient-love text-xl shadow-glow-pink sm:mb-4 sm:h-14 sm:w-14 sm:rounded-2xl sm:text-2xl">
                💌
              </div>
              <h3 className="font-display text-xl font-bold leading-tight sm:text-2xl">
                Sign up to iBloov to send your letter
              </h3>
              <p className="mt-1.5 text-xs text-muted-foreground sm:mt-2 sm:text-sm">
                Continue with Google or Apple to deliver your Love Letter.
              </p>
            </div>

            <div className="mt-5 space-y-2.5 sm:mt-6 sm:space-y-3">
              <button
                onClick={onAuthed}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-black/5 sm:gap-3 sm:rounded-2xl sm:py-3"
              >
                <GoogleIcon /> Continue with Google
              </button>
              <button
                onClick={onAuthed}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 sm:gap-3 sm:rounded-2xl sm:py-3"
              >
                <AppleIcon /> Continue with Apple
              </button>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4">
      <path
        fill="#EA4335"
        d="M12 10.2v3.96h5.52c-.24 1.44-1.68 4.2-5.52 4.2-3.36 0-6.12-2.76-6.12-6.36S8.64 5.64 12 5.64c1.92 0 3.24.84 3.96 1.56l2.7-2.64C16.92 2.88 14.64 1.8 12 1.8 6.6 1.8 2.28 6.12 2.28 11.4S6.6 21 12 21c6.96 0 9.6-4.92 9.6-9.36 0-.6-.12-1.08-.24-1.44H12z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white">
      <path d="M16.365 1.43c0 1.14-.46 2.23-1.205 3.02-.798.85-2.097 1.51-3.165 1.43-.132-1.1.426-2.27 1.176-3.06.83-.87 2.215-1.5 3.194-1.39zM21.5 17.06c-.57 1.31-.84 1.9-1.58 3.06-1.03 1.62-2.48 3.64-4.28 3.65-1.6.02-2.01-1.04-4.18-1.03-2.17.01-2.62 1.05-4.22 1.03-1.8-.02-3.18-1.84-4.21-3.46C-1.59 17.4-1.9 11.9.74 8.97c1.55-1.72 4-2.73 6.3-2.73 1.92 0 3.13 1.05 4.72 1.05 1.54 0 2.48-1.05 4.7-1.05 1.68 0 3.47.92 4.74 2.5-4.17 2.28-3.49 8.24.3 8.32z" />
    </svg>
  );
}
