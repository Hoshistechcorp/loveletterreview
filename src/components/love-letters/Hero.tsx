import { AnimatePresence, motion } from "framer-motion";
import { Heart, MapPin, Search } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { trendingVenues } from "@/lib/love-letters/mockVenues";

type Props = {
  onSearch: (name: string, city: string) => void;
  isSearching: boolean;
};

export function Hero({ onSearch, isSearching }: Props) {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");

  const [nameFocused, setNameFocused] = useState(false);
  const [nameHighlight, setNameHighlight] = useState(-1);
  const [cityFocused, setCityFocused] = useState(false);
  const [cityHighlight, setCityHighlight] = useState(-1);

  const nameOptions = useMemo(() => {
    const set = new Set<string>();
    trendingVenues.forEach((v) => set.add(v.name));
    return Array.from(set).sort();
  }, []);

  const cityOptions = useMemo(() => {
    const set = new Set<string>();
    trendingVenues.forEach((v) => {
      if (v.city) set.add(v.city);
    });
    return Array.from(set).sort();
  }, []);

  const nameSuggestions = useMemo(() => {
    const q = name.trim().toLowerCase();
    const base = q
      ? nameOptions.filter((o) => o.toLowerCase().includes(q) && o.toLowerCase() !== q)
      : nameOptions;
    return base.slice(0, 6);
  }, [name, nameOptions]);

  const citySuggestions = useMemo(() => {
    const q = city.trim().toLowerCase();
    const base = q
      ? cityOptions.filter((o) => o.toLowerCase().includes(q) && o.toLowerCase() !== q)
      : cityOptions;
    return base.slice(0, 6);
  }, [city, cityOptions]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSearch(name, city);
    setNameFocused(false);
    setCityFocused(false);
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
            {/* Name input with suggestions */}
            <div className="relative flex-1">
              <div className="flex items-center gap-2 rounded-xl px-2.5 py-2 sm:rounded-2xl sm:px-3 sm:py-3">
                <Search className="h-3.5 w-3.5 shrink-0 text-mint sm:h-4 sm:w-4" />
                <input
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setNameHighlight(-1);
                  }}
                  onFocus={() => setNameFocused(true)}
                  onBlur={() => {
                    window.setTimeout(() => setNameFocused(false), 150);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setNameHighlight((i) =>
                        Math.min(i + 1, nameSuggestions.length - 1)
                      );
                    } else if (e.key === "ArrowUp") {
                      e.preventDefault();
                      setNameHighlight((i) => Math.max(i - 1, -1));
                    } else if (e.key === "Enter" && nameHighlight >= 0) {
                      e.preventDefault();
                      const s = nameSuggestions[nameHighlight];
                      if (s) {
                        setName(s);
                        setNameFocused(false);
                        setNameHighlight(-1);
                      }
                    } else if (e.key === "Escape") {
                      setNameFocused(false);
                    }
                  }}
                  placeholder="Place name"
                  className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none sm:text-base"
                />
              </div>
              <AnimatePresence>
                {nameFocused && nameSuggestions.length > 0 && (
                  <motion.ul
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 right-0 top-full z-30 mt-1 max-h-52 overflow-auto rounded-xl border border-black/10 bg-white py-1 shadow-lg"
                  >
                    {nameSuggestions.map((s, i) => (
                      <li
                        key={s}
                        onMouseEnter={() => setNameHighlight(i)}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setName(s);
                          setNameFocused(false);
                          setNameHighlight(-1);
                        }}
                        className={`cursor-pointer px-3 py-2 text-left text-sm ${
                          i === nameHighlight
                            ? "bg-mint/10 text-mint"
                            : "text-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                          <span className="truncate">{s}</span>
                        </div>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>

            <div className="hidden h-8 w-px bg-black/10 sm:block" />

            {/* City input with suggestions */}
            <div className="relative flex-1">
              <div className="flex items-center gap-2 rounded-xl px-2.5 py-2 sm:rounded-2xl sm:px-3 sm:py-3">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-neon-pink sm:h-4 sm:w-4" />
                <input
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                    setCityHighlight(-1);
                  }}
                  onFocus={() => setCityFocused(true)}
                  onBlur={() => {
                    window.setTimeout(() => setCityFocused(false), 150);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setCityHighlight((i) =>
                        Math.min(i + 1, citySuggestions.length - 1)
                      );
                    } else if (e.key === "ArrowUp") {
                      e.preventDefault();
                      setCityHighlight((i) => Math.max(i - 1, -1));
                    } else if (e.key === "Enter" && cityHighlight >= 0) {
                      e.preventDefault();
                      const s = citySuggestions[cityHighlight];
                      if (s) {
                        setCity(s);
                        setCityFocused(false);
                        setCityHighlight(-1);
                      }
                    } else if (e.key === "Escape") {
                      setCityFocused(false);
                    }
                  }}
                  placeholder="City"
                  className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none sm:text-base"
                />
              </div>
              <AnimatePresence>
                {cityFocused && citySuggestions.length > 0 && (
                  <motion.ul
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 right-0 top-full z-30 mt-1 max-h-52 overflow-auto rounded-xl border border-black/10 bg-white py-1 shadow-lg"
                  >
                    {citySuggestions.map((s, i) => (
                      <li
                        key={s}
                        onMouseEnter={() => setCityHighlight(i)}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setCity(s);
                          setCityFocused(false);
                          setCityHighlight(-1);
                        }}
                        className={`cursor-pointer px-3 py-2 text-left text-sm ${
                          i === cityHighlight
                            ? "bg-mint/10 text-mint"
                            : "text-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                          <span className="truncate">{s}</span>
                        </div>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
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
