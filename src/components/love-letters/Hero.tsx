import { motion } from "framer-motion";
import { Heart, MapPin, Search } from "lucide-react";
import { useState, type FormEvent } from "react";

type Props = {
  onSearch: (name: string, city: string) => void;
  isSearching: boolean;
};

export function Hero({ onSearch, isSearching }: Props) {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSearch(name, city);
  };

  return (
    <section className="relative px-4 pt-12 pb-10 sm:pt-20 sm:pb-16">
      <div className="mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-medium text-mint shadow-sm"
        >
          <Heart className="h-3.5 w-3.5 fill-current" />
          X = Love
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl"
        >
          Leave a <span className="text-gradient-love">Love Letter.</span>{" "}
          <span className="inline-block">💌</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mx-auto mt-4 max-w-md text-base text-muted-foreground"
        >
          Find a place you love. Send them some.
        </motion.p>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mx-auto mt-8 w-full max-w-2xl"
        >
          <div className="relative flex flex-col gap-2 rounded-3xl border border-black/10 bg-white p-2 shadow-glow-mint sm:flex-row sm:items-center sm:gap-0 sm:p-1.5">
            <div className="flex flex-1 items-center gap-2 rounded-2xl px-3 py-2 sm:py-3">
              <Search className="h-4 w-4 shrink-0 text-mint" />
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Place name"
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none sm:text-base"
              />
            </div>
            <div className="hidden h-8 w-px bg-black/10 sm:block" />
            <div className="flex flex-1 items-center gap-2 rounded-2xl px-3 py-2 sm:py-3">
              <MapPin className="h-4 w-4 shrink-0 text-neon-pink" />
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none sm:text-base"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-love px-5 py-3 text-sm font-semibold text-white shadow-glow-pink transition hover:brightness-110 disabled:opacity-80 sm:px-6"
            >
              {isSearching ? (
                <Heart className="h-4 w-4 animate-spin-heart fill-current" />
              ) : (
                <Heart className="h-4 w-4 fill-current transition group-hover:scale-110" />
              )}
              {isSearching ? "Finding..." : "Find"}
            </button>
          </div>
        </motion.form>

      </div>
    </section>
  );
}
