import { motion } from "framer-motion";
import { Heart, MapPin, Search } from "lucide-react";
import { useMemo, useRef, useState, useEffect, type FormEvent } from "react";
import { trendingVenues } from "@/lib/love-letters/mockVenues";

type Props = {
  onSearch: (name: string, city: string) => void;
  isSearching: boolean;
};

export function Hero({ onSearch, isSearching }: Props) {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [showSuggest, setShowSuggest] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(() => {
    const q = name.trim().toLowerCase();
    if (q.length < 1) return [];
    return trendingVenues
      .filter(
        (v) =>
          v.name.toLowerCase().includes(q) ||
          v.category.toLowerCase().includes(q) ||
          v.city.toLowerCase().includes(q),
      )
      .slice(0, 6);
  }, [name]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setShowSuggest(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setShowSuggest(false);
    onSearch(name, city);
  };

  const pick = (vName: string, vCity: string) => {
    setName(vName);
    setCity(vCity);
    setShowSuggest(false);
    onSearch(vName, vCity);
  };

  return (
    <section className="relative px-4 pt-8 pb-6 sm:pt-20 sm:pb-16">
      <div className="mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-2.5 py-0.5 text-[11px] font-medium text-mint shadow-sm sm:mb-5 sm:gap-2 sm:px-3 sm:py-1 sm:text-xs"
        >
          <Heart className="h-3 w-3 fill-current" />
          X = Love
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-display text-3xl font-bold leading-[1.1] tracking-tight sm:text-6xl"
        >
          Leave a <span className="text-gradient-love">Love Letter.</span>{" "}
          <span className="inline-block">💌</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mx-auto mt-3 max-w-md text-sm text-muted-foreground sm:mt-4 sm:text-base"
        >
          Find a place you love. Send them some.
        </motion.p>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mx-auto mt-6 w-full max-w-2xl sm:mt-8"
        >
          <div className="relative flex flex-col gap-1.5 rounded-2xl border border-black/10 bg-white p-1.5 shadow-glow-mint sm:flex-row sm:items-center sm:gap-0 sm:rounded-3xl sm:p-1.5">
            <div ref={wrapRef} className="relative flex flex-1 items-center gap-2 rounded-xl px-2.5 py-2 sm:rounded-2xl sm:px-3 sm:py-3">
              <Search className="h-3.5 w-3.5 shrink-0 text-mint sm:h-4 sm:w-4" />
              <input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setShowSuggest(true);
                }}
                onFocus={() => setShowSuggest(true)}
                placeholder="Place name"
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none sm:text-base"
              />
              {showSuggest && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-black/10 bg-white text-left shadow-xl">
                  <p className="border-b border-black/5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Recommended
                  </p>
                  <ul className="max-h-72 overflow-y-auto">
                    {suggestions.map((s) => (
                      <li key={s.id}>
                        <button
                          type="button"
                          onClick={() => pick(s.name, s.city)}
                          className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-foreground transition hover:bg-mint/10"
                        >
                          <Heart className="h-3 w-3 shrink-0 fill-neon-pink text-neon-pink" />
                          <span className="flex-1 truncate">
                            <span className="font-semibold">{s.name}</span>
                            <span className="ml-1.5 text-xs text-muted-foreground">
                              · {s.city}
                            </span>
                          </span>
                          <span className="hidden text-[10px] uppercase tracking-wider text-muted-foreground sm:inline">
                            {s.category}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="hidden h-8 w-px bg-black/10 sm:block" />
            <div className="flex flex-1 items-center gap-2 rounded-xl px-2.5 py-2 sm:rounded-2xl sm:px-3 sm:py-3">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-neon-pink sm:h-4 sm:w-4" />
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
              className="group inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-love px-4 py-2.5 text-sm font-semibold text-white shadow-glow-pink transition hover:brightness-110 disabled:opacity-80 sm:gap-2 sm:rounded-2xl sm:px-6 sm:py-3"
            >
              {isSearching ? (
                <Heart className="h-3.5 w-3.5 animate-spin-heart fill-current sm:h-4 sm:w-4" />
              ) : (
                <Heart className="h-3.5 w-3.5 fill-current transition group-hover:scale-110 sm:h-4 sm:w-4" />
              )}
              {isSearching ? "Finding..." : "Find"}
            </button>
          </div>
        </motion.form>

      </div>
    </section>
  );
}
