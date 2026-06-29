import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Building2,
  Check,
  Heart,
  Inbox,
  LogOut,
  Mail,
  MapPin,
  MessageCircle,
  Search,
  Send,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { trendingVenues, type Review, type TrendingVenue } from "@/lib/love-letters/mockVenues";
import { Navbar } from "@/components/love-letters/Navbar";
import { Footer } from "@/components/love-letters/Footer";

type Search = { venueId?: string };

export const Route = createFileRoute("/business")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    venueId: typeof s.venueId === "string" ? s.venueId : undefined,
  }),
  component: BusinessPage,
});

type Session = { email: string; businessId: string; businessName: string };
const SESSION_KEY = "ibloov.biz.session";
const RESPONSES_KEY = "ibloov.biz.responses";

function loadSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}
function saveSession(s: Session | null) {
  if (typeof window === "undefined") return;
  if (s) window.localStorage.setItem(SESSION_KEY, JSON.stringify(s));
  else window.localStorage.removeItem(SESSION_KEY);
}
function loadResponses(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(RESPONSES_KEY) ?? "{}");
  } catch {
    return {};
  }
}
function saveResponses(r: Record<string, string>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(RESPONSES_KEY, JSON.stringify(r));
}

type Step = "signin" | "select" | "dashboard";

function BusinessPage() {
  const { venueId } = Route.useSearch();
  const [step, setStep] = useState<Step>("signin");
  const [email, setEmail] = useState("");
  const [session, setSession] = useState<Session | null>(null);

  // Hydrate session from storage on mount
  useEffect(() => {
    const s = loadSession();
    if (s) {
      setSession(s);
      setStep("dashboard");
    } else if (venueId) {
      // Deep link: skip to select with prefilled venue intent
      // (user still has to sign in first)
    }
  }, [venueId]);

  const venueFromLink = useMemo(
    () => (venueId ? trendingVenues.find((v) => v.id === venueId) ?? null : null),
    [venueId],
  );

  function handleSignIn(method: "google" | "apple" | "email", emailValue?: string) {
    // Mock: pretend OAuth succeeded
    const e =
      method === "email"
        ? emailValue ?? email
        : method === "google"
        ? "owner@gmail.com"
        : "owner@icloud.com";
    setEmail(e);
    setStep("select");
  }

  function handlePickBusiness(v: TrendingVenue) {
    const s: Session = { email, businessId: v.id, businessName: v.name };
    saveSession(s);
    setSession(s);
    setStep("dashboard");
    toast.success(`Welcome, ${v.name}! Your Love Letters are unlocked.`);
  }

  function handleSignOut() {
    saveSession(null);
    setSession(null);
    setEmail("");
    setStep("signin");
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
        <Link
          to="/"
          className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-foreground/60 hover:text-mint sm:text-sm"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to iBloov
        </Link>

        <AnimatePresence mode="wait">
          {step === "signin" && (
            <SignInStep
              key="signin"
              venue={venueFromLink}
              onSignIn={handleSignIn}
            />
          )}
          {step === "select" && (
            <SelectBusinessStep
              key="select"
              email={email}
              suggested={venueFromLink}
              onPick={handlePickBusiness}
            />
          )}
          {step === "dashboard" && session && (
            <Dashboard
              key="dashboard"
              session={session}
              onSignOut={handleSignOut}
            />
          )}
        </AnimatePresence>
      </div>
      <Footer />
    </div>
  );
}

/* ---------------- Step 1: Sign in ---------------- */

function SignInStep({
  venue,
  onSignIn,
}: {
  venue: TrendingVenue | null;
  onSignIn: (method: "google" | "apple" | "email", email?: string) => void;
}) {
  const [emailInput, setEmailInput] = useState("");
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35 }}
      className="mx-auto max-w-lg"
    >
      <div className="mb-6 text-center">
        <span className="inline-flex items-center gap-1 rounded-full border border-mint/30 bg-mint/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-mint">
          <Sparkles className="h-3 w-3" /> For business owners
        </span>
        <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
          Read your <span className="text-gradient-love">Love Letters</span>
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-foreground/65">
          {venue
            ? `Sign in to ${venue.name} to see what travelers are saying — and reply publicly.`
            : "Sign in to list your business, see every letter people have written about you, and respond on the Wall of Love."}
        </p>
      </div>

      <div className="glass rounded-3xl p-5 sm:p-7">
        <div className="space-y-2.5">
          <button
            onClick={() => onSignIn("google")}
            className="flex w-full items-center justify-center gap-2.5 rounded-full border border-foreground/15 bg-foreground/[0.03] px-4 py-3 text-sm font-semibold text-foreground transition hover:border-mint/40 hover:bg-foreground/[0.06]"
          >
            <GoogleIcon /> Continue with Google
          </button>
          <button
            onClick={() => onSignIn("apple")}
            className="flex w-full items-center justify-center gap-2.5 rounded-full border border-foreground/15 bg-foreground/[0.03] px-4 py-3 text-sm font-semibold text-foreground transition hover:border-mint/40 hover:bg-foreground/[0.06]"
          >
            <AppleIcon /> Continue with Apple
          </button>
        </div>

        <div className="my-4 flex items-center gap-3 text-[10px] uppercase tracking-widest text-foreground/40">
          <div className="h-px flex-1 bg-foreground/10" />
          or use work email
          <div className="h-px flex-1 bg-foreground/10" />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (emailInput.trim()) onSignIn("email", emailInput.trim());
          }}
          className="space-y-2.5"
        >
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              required
              placeholder="hello@yourbusiness.com"
              className="w-full rounded-full border border-foreground/15 bg-foreground/[0.03] px-10 py-3 text-sm outline-none transition focus:border-mint/60"
            />
          </div>
          <button
            type="submit"
            disabled={!emailInput.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-love px-4 py-3 text-sm font-bold text-white shadow-glow-pink transition hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
          >
            Send magic link <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <p className="mt-4 text-center text-[11px] text-foreground/45">
          We only email businesses that sign in here. Letters stay public on the
          Wall regardless.
        </p>
      </div>
    </motion.div>
  );
}

/* ---------------- Step 2: Select business ---------------- */

function SelectBusinessStep({
  email,
  suggested,
  onPick,
}: {
  email: string;
  suggested: TrendingVenue | null;
  onPick: (v: TrendingVenue) => void;
}) {
  const [q, setQ] = useState("");
  const matches = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return suggested ? [suggested] : trendingVenues.slice(0, 6);
    return trendingVenues
      .filter(
        (v) =>
          v.name.toLowerCase().includes(query) ||
          v.city.toLowerCase().includes(query),
      )
      .slice(0, 8);
  }, [q, suggested]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35 }}
      className="mx-auto max-w-2xl"
    >
      <div className="mb-5 text-center">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">
          Pick your business
        </h1>
        <p className="mt-1 text-sm text-foreground/60">
          Signed in as <span className="font-semibold text-foreground/80">{email}</span> · choose the venue you own.
        </p>
      </div>

      <div className="glass rounded-3xl p-4 sm:p-6">
        <div className="relative mb-3">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by business name or city…"
            className="w-full rounded-full border border-foreground/15 bg-foreground/[0.03] px-10 py-3 text-sm outline-none transition focus:border-mint/60"
          />
        </div>

        {suggested && !q && (
          <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-widest text-mint">
            Suggested from your link
          </p>
        )}

        <ul className="flex flex-col gap-2">
          {matches.map((v) => (
            <li key={v.id}>
              <button
                onClick={() => onPick(v)}
                className="group flex w-full items-center gap-3 rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-2.5 text-left transition hover:border-mint/40 hover:bg-mint/[0.04]"
              >
                <img
                  src={v.photo}
                  alt=""
                  className="h-12 w-12 shrink-0 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{v.name}</p>
                  <p className="flex items-center gap-1 truncate text-[11px] text-foreground/55">
                    <MapPin className="h-2.5 w-2.5 text-mint" />
                    {v.city} · {v.country}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1 text-xs font-semibold text-foreground/70">
                  <Heart className="h-3 w-3 fill-neon-pink text-neon-pink" />
                  {v.loveCount}
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-foreground/30 transition group-hover:translate-x-0.5 group-hover:text-mint" />
              </button>
            </li>
          ))}
          {matches.length === 0 && (
            <li className="rounded-2xl border border-dashed border-foreground/15 p-5 text-center text-sm text-foreground/55">
              No match. Try a different name — or add your business below.
            </li>
          )}
        </ul>

        <div className="mt-4 rounded-2xl border border-dashed border-mint/30 bg-mint/5 p-4 text-center">
          <p className="text-xs font-semibold text-foreground/70">
            Don&rsquo;t see your venue?
          </p>
          <button
            onClick={() =>
              toast.info("In the live app you'd add it here — mock flow ends.")
            }
            className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-foreground/90 px-4 py-2 text-xs font-bold text-background transition hover:bg-foreground"
          >
            <Building2 className="h-3.5 w-3.5" /> List a new business
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ---------------- Step 3: Dashboard ---------------- */

type Tab = "inbox" | "analytics" | "respond";

function Dashboard({
  session,
  onSignOut,
}: {
  session: Session;
  onSignOut: () => void;
}) {
  const venue = useMemo(
    () => trendingVenues.find((v) => v.id === session.businessId) ?? trendingVenues[0],
    [session.businessId],
  );
  const [tab, setTab] = useState<Tab>("inbox");

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35 }}
    >
      {/* Owner header */}
      <div className="glass mb-4 flex flex-col items-start gap-3 rounded-3xl p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-center gap-3">
          <img
            src={venue.photo}
            alt={venue.name}
            className="h-14 w-14 rounded-2xl object-cover"
          />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-mint">
              Business dashboard
            </p>
            <h1 className="font-display text-xl font-bold sm:text-2xl">
              {venue.name}
            </h1>
            <p className="text-xs text-foreground/55">
              {session.email} · {venue.city}
            </p>
          </div>
        </div>
        <button
          onClick={onSignOut}
          className="inline-flex items-center gap-1.5 rounded-full border border-foreground/15 bg-foreground/[0.03] px-3.5 py-1.5 text-xs font-semibold text-foreground/70 transition hover:border-neon-pink/40 hover:text-neon-pink"
        >
          <LogOut className="h-3.5 w-3.5" /> Sign out
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-4 flex gap-1.5 overflow-x-auto">
        {(
          [
            { id: "inbox", label: "Inbox", icon: Inbox },
            { id: "analytics", label: "Analytics", icon: BarChart3 },
            { id: "respond", label: "Public response", icon: MessageCircle },
          ] as { id: Tab; label: string; icon: typeof Inbox }[]
        ).map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition sm:text-sm ${
                active
                  ? "border-transparent bg-gradient-love text-white shadow-glow-pink"
                  : "border-foreground/15 bg-foreground/[0.03] text-foreground/70 hover:border-mint/40"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === "inbox" && <InboxTab venue={venue} />}
      {tab === "analytics" && <AnalyticsTab venue={venue} />}
      {tab === "respond" && <RespondTab venue={venue} />}
    </motion.div>
  );
}

function InboxTab({ venue }: { venue: TrendingVenue }) {
  const letters: Review[] = venue.reviews;
  return (
    <ul className="flex flex-col gap-2.5">
      {letters.map((r, i) => (
        <motion.li
          key={r.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.04 }}
          className="glass rounded-2xl p-4"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-mint text-xs font-bold text-white">
              {r.initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                <span className="text-sm font-semibold">{r.author}</span>
                <span className="text-[11px] text-foreground/40">·</span>
                <span className="text-[11px] text-foreground/50">{r.visited}</span>
                <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-neon-pink/10 px-2 py-0.5 text-[11px] font-bold text-neon-pink">
                  <Heart className="h-3 w-3 fill-current" /> {r.rating.toFixed(1)}
                </span>
              </div>
              <h4 className="mt-1 font-display text-base font-bold">{r.title}</h4>
              <p className="mt-0.5 text-sm leading-relaxed text-foreground/75">
                {r.body}
              </p>
            </div>
          </div>
        </motion.li>
      ))}
    </ul>
  );
}

function AnalyticsTab({ venue }: { venue: TrendingVenue }) {
  const reviews = venue.reviews;
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / Math.max(reviews.length, 1);
  const adoreCount = reviews.filter((r) => r.rating >= 9).length;

  // Mock weekly trend from review timestamps
  const buckets = [0, 0, 0, 0]; // last 4 weeks
  reviews.forEach((r) => {
    const w = Math.min(3, Math.floor(r.daysAgo / 7));
    buckets[3 - w] += 1;
  });
  const maxB = Math.max(1, ...buckets);

  // Keywords: pull frequent meaningful words from excerpts/bodies
  const text = (venue.excerpt + " " + reviews.map((r) => r.body).join(" ")).toLowerCase();
  const stop = new Set(
    "the and a an is are was were be been being to of in on at it its for with from this that these those you your i we our us they them he she his her as by or but if not so do does did have has had like just very really feel feels felt place places".split(" "),
  );
  const freq = new Map<string, number>();
  text.split(/[^a-zA-Z']+/).forEach((w) => {
    const k = w.toLowerCase();
    if (k.length < 4 || stop.has(k)) return;
    freq.set(k, (freq.get(k) ?? 0) + 1);
  });
  const keywords = [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([k]) => k);

  const stats = [
    { label: "Total letters", value: venue.loveCount, icon: Heart },
    { label: "Reviews shown", value: reviews.length, icon: Inbox },
    { label: "Avg rating", value: avg.toFixed(1), icon: TrendingUp },
    { label: "9+ ratings", value: adoreCount, icon: Sparkles },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="glass rounded-2xl p-4">
              <Icon className="h-4 w-4 text-mint" />
              <p className="mt-2 font-display text-2xl font-bold">{s.value}</p>
              <p className="text-[11px] uppercase tracking-wider text-foreground/55">
                {s.label}
              </p>
            </div>
          );
        })}
      </div>

      <div className="glass rounded-2xl p-5">
        <h3 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-foreground/70">
          Letters per week (last 4 weeks)
        </h3>
        <div className="flex h-32 items-end gap-3">
          {buckets.map((b, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
              <div
                className="w-full rounded-t-lg bg-gradient-love transition-all"
                style={{ height: `${(b / maxB) * 100}%`, minHeight: 4 }}
              />
              <span className="text-[10px] font-medium text-foreground/50">
                {i === 3 ? "This wk" : `${3 - i + 1}w ago`}
              </span>
              <span className="text-[10px] font-bold text-foreground/70">{b}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-2xl p-5">
        <h3 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-foreground/70">
          Top words travelers use
        </h3>
        <div className="flex flex-wrap gap-2">
          {keywords.map((k) => (
            <span
              key={k}
              className="rounded-full border border-mint/30 bg-mint/10 px-3 py-1 text-xs font-semibold text-mint"
            >
              {k}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function RespondTab({ venue }: { venue: TrendingVenue }) {
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [draft, setDraft] = useState("");
  const MAX = 160;

  useEffect(() => {
    setResponses(loadResponses());
  }, []);

  const existing = responses[venue.id] ?? "";

  const navigate = useNavigate();

  function publish() {
    if (!draft.trim()) return;
    const next = { ...responses, [venue.id]: draft.trim() };
    saveResponses(next);
    setResponses(next);
    setDraft("");
    toast.success("Your response is live on the Wall of Love.");
    navigate({ to: "/" });
  }

  function remove() {
    const next = { ...responses };
    delete next[venue.id];
    saveResponses(next);
    setResponses(next);
    toast.success("Response removed.");
  }

  return (
    <div className="space-y-4">
      <div className="glass rounded-2xl p-5">
        <h3 className="font-display text-base font-bold">
          Say thanks publicly
        </h3>
        <p className="mt-1 text-xs text-foreground/60">
          One short line from {venue.name} shown beneath your featured letter on
          the Wall of Love. Keep it warm — no promotions.
        </p>

        <div className="mt-4 rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-3">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value.slice(0, MAX))}
            rows={3}
            placeholder={`Thank you for the kind words — come back and we'll save you the corner table. — Team ${venue.name}`}
            className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-foreground/35"
          />
          <div className="mt-1 flex items-center justify-between text-[11px] text-foreground/45">
            <span>Public reply · visible to everyone</span>
            <span>
              {draft.length}/{MAX}
            </span>
          </div>
        </div>

        <div className="mt-3 flex gap-2">
          <button
            onClick={publish}
            disabled={!draft.trim()}
            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-love px-4 py-2 text-xs font-bold text-white shadow-glow-pink transition hover:scale-[1.03] disabled:opacity-50 disabled:hover:scale-100"
          >
            <Send className="h-3.5 w-3.5" /> Publish on the Wall
          </button>
          {existing && (
            <button
              onClick={remove}
              className="inline-flex items-center gap-1.5 rounded-full border border-foreground/15 px-4 py-2 text-xs font-semibold text-foreground/65 hover:border-neon-pink/40 hover:text-neon-pink"
            >
              Remove current
            </button>
          )}
        </div>
      </div>

      {existing && (
        <div className="glass rounded-2xl p-5">
          <div className="mb-2 flex items-center gap-2">
            <div className="inline-flex items-center gap-1 rounded-full bg-mint/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-mint">
              <Check className="h-3 w-3" /> Live
            </div>
            <span className="text-[11px] text-foreground/50">
              Your current public response
            </span>
          </div>
          <p className="text-sm italic leading-relaxed text-foreground/80">
            &ldquo;{existing}&rdquo;
          </p>
          <p className="mt-1 text-[11px] font-semibold text-foreground/60">
            — Team {venue.name}
          </p>
        </div>
      )}
    </div>
  );
}

/* ---------------- icons ---------------- */

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.5-1.7 4.4-5.5 4.4-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.9 14.6 3 12 3 6.9 3 2.8 7.1 2.8 12s4.1 9 9.2 9c5.3 0 8.8-3.7 8.8-9 0-.6-.1-1.1-.2-1.8H12z" />
    </svg>
  );
}
function AppleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16.4 12.6c0-2.5 2-3.7 2.1-3.8-1.2-1.7-3-1.9-3.7-2-1.6-.2-3 .9-3.8.9-.8 0-2-.9-3.3-.9-1.7 0-3.3 1-4.2 2.5-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.2 2.5 1.3 0 1.8-.8 3.3-.8 1.6 0 2 .8 3.3.8 1.4 0 2.3-1.3 3.2-2.5.7-.9 1.2-1.8 1.6-2.8-2.2-.9-3-3.1-3-3.1zM13.9 5.2c.7-.8 1.2-2 1.1-3.2-1 0-2.3.7-3 1.5-.6.7-1.2 1.9-1.1 3.1 1.2.1 2.3-.6 3-1.4z" />
    </svg>
  );
}
