import { countWords } from "@/lib/love-letters/wordCount";

const PREFIX = "I love this place because";
export const MAX_WORDS = 100;

type Props = {
  value: string;
  onChange: (v: string) => void;
};

export function LetterEditor({ value, onChange }: Props) {
  const userWords = countWords(value);
  const chars = value.length;
  const over = userWords > MAX_WORDS;
  const nearLimit = !over && userWords >= MAX_WORDS - 10;

  return (
    <div>
      <p className="mb-1.5 text-sm font-medium text-foreground/80 sm:mb-2">
        Your Love Letter
      </p>
      <div
        className={`relative overflow-hidden rounded-xl border bg-gradient-to-br from-mint/5 via-purple/5 to-neon-pink/5 p-3 shadow-glow-mint sm:rounded-2xl sm:p-4 ${
          over ? "border-neon-pink/60" : "border-mint/30"
        }`}
      >
        <div className="pointer-events-none absolute right-2 top-2 text-xl opacity-30 sm:right-3 sm:top-3 sm:text-2xl">
          💌
        </div>
        <p className="font-display text-sm leading-relaxed text-foreground/90 sm:text-base sm:leading-relaxed">
          <span className="font-semibold text-mint">{PREFIX}</span>{" "}
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="...the rosemary fries hit different, and the staff remembers my name."
            rows={3}
            className="inline-block w-full resize-none bg-transparent align-top text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
          />
        </p>
      </div>
      <div className="mt-1.5 flex items-center justify-between gap-3 text-[11px] sm:mt-2 sm:text-xs">
        <span
          className={
            over
              ? "font-semibold text-neon-pink"
              : "text-muted-foreground"
          }
        >
          {over
            ? `${userWords - MAX_WORDS} word${userWords - MAX_WORDS === 1 ? "" : "s"} over — trim to send`
            : "Keep it short & sweet — 100 words max"}
        </span>
        <span
          className={`font-medium tabular-nums ${
            over
              ? "font-semibold text-neon-pink"
              : nearLimit
              ? "text-mint"
              : "text-foreground/70"
          }`}
        >
          {userWords}/{MAX_WORDS} words · {chars} chars
        </span>
      </div>
    </div>
  );
}
