import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowLeft,
  Heart,
  MapPin,
  Share2,
  ThumbsUp,
  Globe2,
  PenLine,
  Tag,
} from "lucide-react";
import { trendingVenues, type Review } from "@/lib/love-letters/mockVenues";
import { Navbar } from "@/components/love-letters/Navbar";
import { Footer } from "@/components/love-letters/Footer";
import { WriteLetterModal } from "@/components/love-letters/WriteLetterModal";
import { AuthWallModal } from "@/components/love-letters/AuthWallModal";
import { SuccessOverlay } from "@/components/love-letters/SuccessOverlay";
import { addLetter, getUser, signIn } from "@/lib/love-letters/localStore";


export const Route = createFileRoute("/venue/$venueId")({
  component: VenuePage,
  loader: ({ params }) => {
    const venue = trendingVenues.find((v) => v.id === params.venueId);
    if (!venue) throw notFound();
    return { venue };
  },
});

function timeAgo(days: number) {
  if (days < 1) return "today";
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.round(days / 7)} weeks ago`;
  return `${Math.round(days / 30)} months ago`;
}

function VenuePage() {
  const { venue } = Route.useLoaderData();
  const [helpful, setHelpful] = useState<Record<string, boolean>>({});

  const breakdown = useMemo(() => {
    // Bucket reviews into love tiers
    const buckets = [
      { label: "Adored (9–10)", min: 9, max: 10 },
      { label: "Loved (8–9)", min: 8, max: 9 },
      { label: "Liked (7–8)", min: 7, max: 8 },
      { label: "Mixed (5–7)", min: 5, max: 7 },
      { label: "Below (<5)", min: 0, max: 5 },
    ];
    const total = venue.reviews.length || 1;
    return buckets.map((b) => {
      const c = venue.reviews.filter(
        (r: Review) => r.rating >= b.min && r.rating < (b.max === 10 ? 10.01 : b.max),
      ).length;
      return { ...b, count: c, pct: Math.round((c / total) * 100) };
    });
  }, [venue]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero photo */}
      <div className="relative h-56 w-full overflow-hidden sm:h-80">
        <img
          src={venue.photo}
          alt={venue.name}
          className="h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
      </div>

      <div className="mx-auto -mt-16 max-w-5xl px-4 pb-16 sm:-mt-20">
        {/* Breadcrumb */}
        <Link
          to="/"
          className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-foreground/60 hover:text-mint sm:text-sm"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Wall of Love
        </Link>

        {/* Title card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass relative overflow-hidden rounded-3xl p-5 sm:p-7"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-mint/30 bg-mint/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-mint">
                  <Tag className="h-3 w-3" /> {venue.categoryGroup}
                </span>
                <span className="rounded-full border border-foreground/10 bg-foreground/[0.03] px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-foreground/60">
                  {venue.category}
                </span>
              </div>
              <h1 className="font-display text-2xl font-bold sm:text-4xl">
                {venue.name}
              </h1>
              <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 text-mint" />
                {venue.address} · {venue.city} · {venue.country}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 fill-neon-pink text-neon-pink" />
                  <span className="font-display text-xl font-bold sm:text-2xl">
                    {venue.rating.toFixed(1)}
                  </span>
                  <span className="text-xs text-muted-foreground">/ 10</span>
                </div>
                <span className="text-xs text-foreground/40">·</span>
                <span className="text-sm font-medium text-foreground/70">
                  {venue.loveCount} Love Letters
                </span>
                <span className="text-xs text-foreground/40">·</span>
                <span className="inline-flex items-center gap-1 text-xs text-mint">
                  <Globe2 className="h-3 w-3" /> {venue.region}
                </span>
              </div>
            </div>

            <div className="flex shrink-0 gap-2">
              <button
                onClick={() => {
                  if (typeof navigator !== "undefined" && navigator.share) {
                    navigator.share({ title: venue.name, url: window.location.href }).catch(() => {});
                  }
                }}
                className="inline-flex items-center gap-1.5 rounded-full border border-foreground/15 bg-foreground/[0.03] px-3.5 py-2 text-xs font-semibold text-foreground/70 transition hover:border-mint/40 hover:text-foreground"
              >
                <Share2 className="h-3.5 w-3.5" /> Share
              </button>
              <Link
                to="/"
                className="group inline-flex items-center gap-1.5 rounded-full bg-gradient-love px-4 py-2 text-xs font-bold text-white shadow-glow-pink transition hover:scale-[1.03] active:scale-95"
              >
                <PenLine className="h-3.5 w-3.5" /> Write a Love Letter
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Rating breakdown + featured letter */}
        <div className="mt-5 grid gap-4 sm:mt-7 sm:grid-cols-3">
          <div className="glass rounded-2xl p-5 sm:col-span-1">
            <h3 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-foreground/70">
              Rating breakdown
            </h3>
            <ul className="space-y-2">
              {breakdown.map((b) => (
                <li key={b.label} className="flex items-center gap-2 text-xs">
                  <span className="w-28 shrink-0 text-foreground/60">{b.label}</span>
                  <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-foreground/5">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full bg-gradient-love"
                      style={{ width: `${b.pct}%` }}
                    />
                  </div>
                  <span className="w-6 text-right tabular-nums text-foreground/60">
                    {b.count}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass relative overflow-hidden rounded-2xl p-5 sm:col-span-2">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-mint/5 via-transparent to-neon-pink/5" />
            <div className="relative">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neon-pink">
                Featured Love Letter
              </p>
              <p
                className="mt-3 text-lg font-medium leading-relaxed text-foreground/85 sm:text-xl"
                style={{ fontFamily: "'DM Sans', Inter, system-ui, sans-serif" }}
              >
                &ldquo;{venue.excerpt}&rdquo;
              </p>
              <p className="mt-3 text-xs text-foreground/50">
                Top-rated letter from the past month · {venue.loveCount} total letters
              </p>
            </div>
          </div>
        </div>

        {/* Reviews list */}
        <div className="mt-6 sm:mt-8">
          <div className="mb-3 flex items-end justify-between">
            <h2 className="font-display text-xl font-bold sm:text-2xl">
              Love Letters from travelers
            </h2>
            <span className="text-xs text-foreground/50">
              Showing {venue.reviews.length} of {venue.loveCount}
            </span>
          </div>

          <ul className="flex flex-col gap-3">
            {venue.reviews.map((r: Review, i: number) => {
              const marked = !!helpful[r.id];
              return (
                <motion.li
                  key={r.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                  className="glass rounded-2xl p-4 sm:p-5"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-mint text-xs font-bold text-white">
                      {r.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                        <span className="font-semibold text-sm">{r.author}</span>
                        <span className="text-[11px] text-foreground/40">·</span>
                        <span className="text-[11px] text-foreground/50">{r.visited}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-neon-pink/10 px-2 py-0.5 text-xs font-bold text-neon-pink">
                          <Heart className="h-3 w-3 fill-current" />
                          {r.rating.toFixed(1)}
                        </span>
                        <span className="text-[11px] text-foreground/40">
                          {timeAgo(r.daysAgo)}
                        </span>
                      </div>

                      <h4 className="mt-2 font-display text-base font-bold sm:text-lg">
                        {r.title}
                      </h4>
                      <p className="mt-1 text-sm leading-relaxed text-foreground/75">
                        {r.body}
                      </p>

                      <div className="mt-3 flex items-center gap-2">
                        <button
                          onClick={() =>
                            setHelpful((s) => ({ ...s, [r.id]: !s[r.id] }))
                          }
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold transition ${
                            marked
                              ? "border-mint bg-mint/10 text-mint"
                              : "border-foreground/15 bg-foreground/[0.03] text-foreground/60 hover:border-mint/40 hover:text-foreground"
                          }`}
                        >
                          <ThumbsUp className="h-3 w-3" />
                          Helpful · {r.helpful + (marked ? 1 : 0)}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </ul>

          {/* Bottom CTA */}
          <div className="mt-8 rounded-3xl border border-dashed border-mint/30 bg-mint/5 p-6 text-center">
            <h3 className="font-display text-lg font-bold sm:text-xl">
              Been to {venue.name}?
            </h3>
            <p className="mx-auto mt-1 max-w-md text-sm text-foreground/65">
              Share what made it special. Your Love Letter joins the public Wall and
              helps other travelers discover their next favorite place.
            </p>
            <Link
              to="/"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-love px-5 py-2.5 text-sm font-bold text-white shadow-glow-pink transition hover:scale-[1.03] active:scale-95"
            >
              <PenLine className="h-4 w-4" /> Write a Love Letter
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
