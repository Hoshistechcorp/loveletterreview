import { clampWords, countWords } from "@/lib/love-letters/wordCount";

const PREFIX = "I love this place because";
const MAX = 100;

type Props = {
  value: string;
  onChange: (v: string) => void;
};

export function LetterEditor({ value, onChange }: Props) {
  const userWords = countWords(value);
  const atLimit = userWords >= MAX;

  return (
    <div>
      <p className="mb-1.5 text-sm font-medium text-foreground/80 sm:mb-2">
        Your Love Letter
      </p>
      <div className="relative overflow-hidden rounded-xl border border-mint/30 bg-gradient-to-br from-mint/5 via-purple/5 to-neon-pink/5 p-3 shadow-glow-mint sm:rounded-2xl sm:p-4">
        <div className="pointer-events-none absolute right-2 top-2 text-xl opacity-30 sm:right-3 sm:top-3 sm:text-2xl">
          💌
        </div>
        <p className="font-display text-sm leading-relaxed text-foreground/90 sm:text-base sm:leading-relaxed">
          <span className="font-semibold text-mint">{PREFIX}</span>{" "}
          <textarea
            value={value}
            onChange={(e) => {
              const next = clampWords(e.target.value, MAX);
              onChange(next);
            }}
            placeholder="...the rosemary fries hit different, and the staff remembers my name."
            rows={3}
            className="inline-block w-full resize-none bg-transparent align-top text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
          />
        </p>
      </div>
      <div className="mt-1.5 flex items-center justify-between text-[11px] sm:mt-2 sm:text-xs">
        <span className="text-muted-foreground">
          Keep it short & sweet — 100 words max
        </span>
        <span
          className={
            atLimit
              ? "font-semibold text-neon-pink"
              : "font-medium text-foreground/70"
          }
        >
          Words: {userWords}/{MAX}
        </span>
      </div>
    </div>
  );
}

