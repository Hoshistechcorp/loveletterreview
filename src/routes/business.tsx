import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Building2,
  Check,
  Globe,
  Heart,
  Inbox,
  Loader2,
  LogOut,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  Send,
  Sparkles,
  Tag,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { trendingVenues, type Review, type TrendingVenue } from "@/lib/love-letters/mockVenues";
import { Navbar } from "@/components/love-letters/Navbar";
import { Footer } from "@/components/love-letters/Footer";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

type SearchParams = { venueId?: string };

export const Route = createFileRoute("/business")({
  validateSearch: (s: Record<string, unknown>): SearchParams => ({
    venueId: typeof s.venueId === "string" ? s.venueId : undefined,
  }),
  component: BusinessPage,
});

type OwnerBusiness = {
  businessId: string;
  businessName: string;
  city: string;
  country: string;
  category: string;
  website: string;
  address: string;
  description: string;
  photo: string;
};

type OwnerSession = {
  userId: string;
  email: string;
} & OwnerBusiness;

const BIZ_PICK_KEY = "ibloov.biz.pick"; // { userId: OwnerBusiness }
const RESPONSES_KEY = "ibloov.biz.responses";
const DEFAULT_PHOTO =
  "https://images.unsplash.com/photo-1559329007-40df8a9345d8?auto=format&fit=crop&w=600&q=70";

function loadPicks(): Record<string, OwnerBusiness> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(BIZ_PICK_KEY) ?? "{}");
  } catch {
    return {};
  }
}
function savePick(userId: string, biz: OwnerBusiness) {
  if (typeof window === "undefined") return;
  const all = loadPicks();
  all[userId] = biz;
  window.localStorage.setItem(BIZ_PICK_KEY, JSON.stringify(all));
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

type Step = "signin" | "onboarding" | "dashboard";

function BusinessPage() {
  const { venueId } = Route.useSearch();
  const [step, setStep] = useState<Step>("signin");
  const [authUser, setAuthUser] = useState<{ id: string; email: string } | null>(null);
  const [session, setSession] = useState<OwnerSession | null>(null);
  const [bootstrapping, setBootstrapping] = useState(true);

  useEffect(() => {
    let active = true;
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      const u = sess?.user;
      if (u && u.email) {
        setAuthUser({ id: u.id, email: u.email });
      } else {
        setAuthUser(null);
        setSession(null);
        setStep("signin");
      }
    });
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      const u = data.session?.user;
      if (u && u.email) setAuthUser({ id: u.id, email: u.email });
      setBootstrapping(false);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!authUser) return;
    const pick = loadPicks()[authUser.id];
    if (pick) {
      setSession({ userId: authUser.id, email: authUser.email, ...pick });
      setStep("dashboard");
    } else {
      setSession(null);
      setStep("onboarding");
    }
  }, [authUser]);

  const venueFromLink = useMemo(
    () => (venueId ? trendingVenues.find((v) => v.id === venueId) ?? null : null),
    [venueId],
  );

  function handleOnboard(biz: OwnerBusiness) {
    if (!authUser) return;
    savePick(authUser.id, biz);
    supabase
      .from("profiles")
      .upsert(
        {
          id: authUser.id,
          email: authUser.email,
          business_id: biz.businessId,
          business_name: biz.businessName,
          business_city: biz.city,
          business_country: biz.country,
          business_category: biz.category,
          business_website: biz.website,
          business_address: biz.address,
          business_description: biz.description,
        },
        { onConflict: "id" },
      )
      .then(({ error }) => {
        if (error) console.warn("profile upsert", error.message);
      });
    setSession({ userId: authUser.id, email: authUser.email, ...biz });
    setStep("dashboard");
    toast.success(`${biz.businessName} is live on iBloov.`);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    setAuthUser(null);
    setSession(null);
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

        {bootstrapping ? (
          <div className="flex items-center justify-center py-24 text-foreground/50">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {step === "signin" && <SignInStep key="signin" venue={venueFromLink} />}
            {step === "onboarding" && authUser && (
              <OnboardingStep
                key="onboarding"
                email={authUser.email}
                suggested={venueFromLink}
                onSubmit={handleOnboard}
              />
            )}
            {step === "dashboard" && session && (
              <Dashboard key="dashboard" session={session} onSignOut={handleSignOut} />
            )}
          </AnimatePresence>
        )}
      </div>
      <Footer />
    </div>
  );
}

/* ---------------- Step 1: Sign in / Sign up / Forgot password ---------------- */

type AuthMode = "signin" | "signup" | "forgot";

function SignInStep({ venue }: { venue: TrendingVenue | null }) {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: window.location.origin + "/business",
            data: { full_name: displayName.trim() || undefined },
          },
        });
        if (error) throw error;
        toast.success("Account created — you're signed in.");
      } else if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        toast.success("Welcome back.");
      } else {
        // forgot
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: window.location.origin + "/reset-password",
        });
        if (error) throw error;
        toast.success("Check your email for a reset link.");
        setMode("signin");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleOAuth(provider: "google" | "apple") {
    setSubmitting(true);
    try {
      const result = await lovable.auth.signInWithOAuth(provider, {
        redirect_uri: window.location.origin + "/business",
      });
      if (result.error) {
        toast.error(result.error instanceof Error ? result.error.message : "Sign-in failed");
        setSubmitting(false);
        return;
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Sign-in failed";
      toast.error(msg);
      setSubmitting(false);
    }
  }

  const isForgot = mode === "forgot";
  const isSignup = mode === "signup";

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
          {isForgot
            ? "Reset your password"
            : isSignup
              ? "Create your account"
              : "Read your "}
          {mode === "signin" && <span className="text-gradient-love">Love Letters</span>}
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-foreground/65">
          {isForgot
            ? "Enter your email and we'll send a link to set a new password."
            : venue
              ? `Sign in to ${venue.name} to see what travelers are saying — and reply publicly.`
              : "Sign in to list your business, see every letter people write about you, and respond on the Wall of Love."}
        </p>
      </div>

      <div className="glass rounded-3xl p-5 sm:p-7">
        {!isForgot && (
          <>
            <div className="space-y-2.5">
              <button
                onClick={() => handleOAuth("google")}
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2.5 rounded-full border border-foreground/15 bg-foreground/[0.03] px-4 py-3 text-sm font-semibold text-foreground transition hover:border-mint/40 hover:bg-foreground/[0.06] disabled:opacity-60"
              >
                <GoogleIcon /> Continue with Google
              </button>
              <button
                onClick={() => handleOAuth("apple")}
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2.5 rounded-full border border-foreground/15 bg-foreground/[0.03] px-4 py-3 text-sm font-semibold text-foreground transition hover:border-mint/40 hover:bg-foreground/[0.06] disabled:opacity-60"
              >
                <AppleIcon /> Continue with Apple
              </button>
            </div>

            <div className="my-4 flex items-center gap-3 text-[10px] uppercase tracking-widest text-foreground/40">
              <div className="h-px flex-1 bg-foreground/10" />
              or with email
              <div className="h-px flex-1 bg-foreground/10" />
            </div>
          </>
        )}

        <form onSubmit={handleEmailSubmit} className="space-y-2.5">
          {isSignup && (
            <div className="relative">
              <Sparkles className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-full border border-foreground/15 bg-foreground/[0.03] px-10 py-3 text-sm outline-none transition focus:border-mint/60"
              />
            </div>
          )}
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="hello@yourbusiness.com"
              className="w-full rounded-full border border-foreground/15 bg-foreground/[0.03] px-10 py-3 text-sm outline-none transition focus:border-mint/60"
            />
          </div>
          {!isForgot && (
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete={isSignup ? "new-password" : "current-password"}
                placeholder={isSignup ? "Create a password (min 6)" : "Your password"}
                className="w-full rounded-full border border-foreground/15 bg-foreground/[0.03] px-10 py-3 text-sm outline-none transition focus:border-mint/60"
              />
            </div>
          )}

          {mode === "signin" && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setMode("forgot")}
                className="text-[12px] font-semibold text-foreground/60 hover:text-mint"
              >
                Forgot password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={
              submitting ||
              !email.trim() ||
              (!isForgot && password.length < 6)
            }
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-love px-4 py-3 text-sm font-bold text-white shadow-glow-pink transition hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                {isForgot ? "Send reset link" : isSignup ? "Create account" : "Sign in"}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <p className="mt-4 text-center text-[12px] text-foreground/55">
          {mode === "signin" && (
            <>
              New here?{" "}
              <button
                type="button"
                onClick={() => setMode("signup")}
                className="font-semibold text-mint hover:underline"
              >
                Create a business account
              </button>
            </>
          )}
          {mode === "signup" && (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("signin")}
                className="font-semibold text-mint hover:underline"
              >
                Sign in
              </button>
            </>
          )}
          {mode === "forgot" && (
            <>
              Remembered it?{" "}
              <button
                type="button"
                onClick={() => setMode("signin")}
                className="font-semibold text-mint hover:underline"
              >
                Back to sign in
              </button>
            </>
          )}
        </p>
      </div>
    </motion.div>
  );
}

/* ---------------- Step 2: Business onboarding ---------------- */

const CATEGORIES = [
  "Restaurant",
  "Cafe",
  "Bar",
  "Hotel",
  "Things to do",
  "Shop",
  "Spa & wellness",
  "Other",
];

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

function OnboardingStep({
  email,
  suggested,
  onSubmit,
}: {
  email: string;
  suggested: TrendingVenue | null;
  onSubmit: (b: OwnerBusiness) => void;
}) {
  const [name, setName] = useState(suggested?.name ?? "");
  const [city, setCity] = useState(suggested?.city ?? "");
  const [country, setCountry] = useState(suggested?.country ?? "");
  const [category, setCategory] = useState(suggested?.category ?? CATEGORIES[0]);
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState(suggested?.excerpt ?? "");

  const canSubmit =
    name.trim().length >= 2 &&
    city.trim().length >= 2 &&
    country.trim().length >= 2 &&
    category.trim().length > 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit({
      businessId: suggested?.id ?? `biz-${slugify(name)}-${Date.now().toString(36)}`,
      businessName: name.trim(),
      city: city.trim(),
      country: country.trim(),
      category: category.trim(),
      website: website.trim(),
      address: address.trim(),
      description: description.trim(),
      photo: suggested?.photo ?? DEFAULT_PHOTO,
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35 }}
      className="mx-auto max-w-2xl"
    >
      <div className="mb-5 text-center">
        <span className="inline-flex items-center gap-1 rounded-full border border-mint/30 bg-mint/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-mint">
          <Building2 className="h-3 w-3" /> List your business
        </span>
        <h1 className="mt-3 font-display text-2xl font-bold sm:text-3xl">
          Tell us about your business
        </h1>
        <p className="mt-1 text-sm text-foreground/60">
          Signed in as <span className="font-semibold text-foreground/80">{email}</span>. These details power your Wall of Love profile.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass space-y-3 rounded-3xl p-5 sm:p-7">
        <Field label="Business name" required>
          <div className="relative">
            <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. Marigold Cafe"
              className="w-full rounded-full border border-foreground/15 bg-foreground/[0.03] px-10 py-3 text-sm outline-none transition focus:border-mint/60"
            />
          </div>
        </Field>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="City" required>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                placeholder="Lisbon"
                className="w-full rounded-full border border-foreground/15 bg-foreground/[0.03] px-10 py-3 text-sm outline-none transition focus:border-mint/60"
              />
            </div>
          </Field>
          <Field label="Country" required>
            <div className="relative">
              <Globe className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
              <input
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
                placeholder="Portugal"
                className="w-full rounded-full border border-foreground/15 bg-foreground/[0.03] px-10 py-3 text-sm outline-none transition focus:border-mint/60"
              />
            </div>
          </Field>
        </div>

        <Field label="Category" required>
          <div className="relative">
            <Tag className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full appearance-none rounded-full border border-foreground/15 bg-foreground/[0.03] px-10 py-3 text-sm outline-none transition focus:border-mint/60"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </Field>

        <Field label="Street address">
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Rua das Flores 23"
            className="w-full rounded-full border border-foreground/15 bg-foreground/[0.03] px-4 py-3 text-sm outline-none transition focus:border-mint/60"
          />
        </Field>

        <Field label="Website">
          <div className="relative">
            <Globe className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://yourbusiness.com"
              className="w-full rounded-full border border-foreground/15 bg-foreground/[0.03] px-10 py-3 text-sm outline-none transition focus:border-mint/60"
            />
          </div>
        </Field>

        <Field label="Short description">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value.slice(0, 240))}
            rows={3}
            placeholder="One sentence about what makes your place special."
            className="w-full resize-none rounded-2xl border border-foreground/15 bg-foreground/[0.03] px-4 py-3 text-sm outline-none transition focus:border-mint/60"
          />
          <div className="mt-1 text-right text-[11px] text-foreground/45">
            {description.length}/240
          </div>
        </Field>

        <button
          type="submit"
          disabled={!canSubmit}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-love px-4 py-3 text-sm font-bold text-white shadow-glow-pink transition hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
        >
          Create my business profile <ArrowRight className="h-4 w-4" />
        </button>
      </form>
    </motion.div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block px-1 text-[11px] font-semibold uppercase tracking-widest text-foreground/55">
        {label}
        {required && <span className="ml-1 text-neon-pink">*</span>}
      </span>
      {children}
    </label>
  );
}

/* ---------------- Step 3: Dashboard ---------------- */

type Tab = "inbox" | "analytics" | "respond";

function sessionToVenue(session: OwnerSession): TrendingVenue {
  // Prefer matching demo venue (so the inbox/analytics show example letters)
  const match = trendingVenues.find((v) => v.id === session.businessId);
  if (match) return match;
  return {
    id: session.businessId,
    name: session.businessName,
    city: session.city,
    country: session.country,
    region: "",
    category: session.category,
    photo: session.photo || DEFAULT_PHOTO,
    loveCount: 0,
    rank: 0,
    daysAgo: 0,
    teaser: session.description,
    excerpt: session.description,
    reviews: [],
  } as TrendingVenue;
}

function Dashboard({
  session,
  onSignOut,
}: {
  session: OwnerSession;
  onSignOut: () => void;
}) {
  const venue = useMemo(() => sessionToVenue(session), [session]);
  const [tab, setTab] = useState<Tab>("inbox");

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35 }}
    >
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
            <h1 className="font-display text-xl font-bold sm:text-2xl">{venue.name}</h1>
            <p className="text-xs text-foreground/55">
              {session.email} · {venue.city}
              {venue.country ? `, ${venue.country}` : ""}
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
  if (letters.length === 0) {
    return (
      <div className="glass rounded-3xl p-8 text-center">
        <Heart className="mx-auto h-8 w-8 text-neon-pink" />
        <h3 className="mt-2 font-display text-lg font-bold">No letters yet</h3>
        <p className="mt-1 text-sm text-foreground/60">
          Share your iBloov page so travelers can leave Love Letters about {venue.name}.
        </p>
      </div>
    );
  }
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
              <p className="mt-0.5 text-sm leading-relaxed text-foreground/75">{r.body}</p>
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

  const buckets = [0, 0, 0, 0];
  reviews.forEach((r) => {
    const w = Math.min(3, Math.floor(r.daysAgo / 7));
    buckets[3 - w] += 1;
  });
  const maxB = Math.max(1, ...buckets);

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
    { label: "Avg rating", value: reviews.length ? avg.toFixed(1) : "—", icon: TrendingUp },
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

      {keywords.length > 0 && (
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
      )}
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
        <h3 className="font-display text-base font-bold">Say thanks publicly</h3>
        <p className="mt-1 text-xs text-foreground/60">
          One short line from {venue.name} shown beneath your featured letter on the Wall
          of Love. Keep it warm — no promotions.
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
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.2 1.5-1.7 4.4-5.5 4.4-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.9 14.6 3 12 3 6.9 3 2.8 7.1 2.8 12s4.1 9 9.2 9c5.3 0 8.8-3.7 8.8-9 0-.6-.1-1.1-.2-1.8H12z"
      />
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
