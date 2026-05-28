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
      <p className="mb-2 text-sm font-medium text-foreground/80">
        Your Love Letter
      </p>
      <div className="relative overflow-hidden rounded-2xl border border-mint/30 bg-gradient-to-br from-mint/5 via-purple/5 to-neon-pink/5 p-4 shadow-glow-mint">
        <div className="pointer-events-none absolute right-3 top-3 text-2xl opacity-30">
          💌
        </div>
        <p className="font-display text-base leading-relaxed text-foreground/90 sm:text-lg">
          <span className="font-semibold text-mint">{PREFIX}</span>{" "}
          <textarea
            value={value}
            onChange={(e) => {
              const next = clampWords(e.target.value, MAX);
              onChange(next);
            }}
            placeholder="...the rosemary fries hit different, and the staff remembers my name."
            rows={4}
            className="inline-block w-full resize-none bg-transparent align-top text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
          />
        </p>
      </div>
      <div className="mt-2 flex items-center justify-between text-xs">
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
