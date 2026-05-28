import { ArrowRight } from "lucide-react";

export function OwnerTeaserBanner() {
  return (
    <section className="px-4 pb-16">
      <div className="mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-white p-6 shadow-glow-purple sm:p-10">
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-widest text-mint">
                For Venue Owners
              </p>
              <h3 className="mt-2 font-display text-2xl font-bold leading-tight sm:text-3xl">
                Unread Love Letters are waiting.
              </h3>
            </div>
            <a
              href="https://auralink.ibloov.com"
              target="_blank"
              rel="noreferrer"
              className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-gradient-love px-5 py-3.5 text-sm font-bold text-white shadow-glow-pink transition hover:brightness-110"
            >
              Claim your venue
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

