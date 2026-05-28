import { ArrowRight, Lock } from "lucide-react";

export function OwnerTeaserBanner() {
  return (
    <section className="px-4 pb-16">
      <div className="mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-purple/30 via-neon-pink/20 to-mint/20 p-6 shadow-glow-purple sm:p-10">
          <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-neon-pink/30 blur-3xl" />
          <div className="absolute -bottom-12 -left-12 h-44 w-44 rounded-full bg-mint/30 blur-3xl" />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                <Lock className="h-3 w-3" /> For Venue Owners
              </div>
              <h3 className="font-display text-2xl font-bold leading-tight text-white sm:text-3xl">
                You might have unread Love Letters waiting for you.
              </h3>
              <p className="mt-2 text-sm text-white/80">
                Restaurants, lounges, and venues — claim your AuraLink profile to
                unlock every letter customers have written to you.
              </p>
            </div>
            <a
              href="https://auralink.ibloov.com"
              target="_blank"
              rel="noreferrer"
              className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3.5 text-sm font-bold text-background shadow-glow-pink transition hover:brightness-95"
            >
              Unlock Your Letters
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
