import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Heart, LogOut, MapPin, Save, Settings2, ThumbsUp, Bookmark } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/love-letters/Navbar";
import { Footer } from "@/components/love-letters/Footer";
import { EmptyState } from "@/components/love-letters/EmptyState";
import {
  getHelpfulIds,
  getLetters,
  getSavedVenueIds,
  getUser,
  signOut,
  toggleSaved,
  updateUser,
  useLocalStore,
} from "@/lib/love-letters/localStore";
import { trendingVenues } from "@/lib/love-letters/mockVenues";

type Tab = "letters" | "saved" | "settings" | "stats";

const TABS: { id: Tab; label: string }[] = [
  { id: "letters", label: "My letters" },
  { id: "saved", label: "Saved" },
  { id: "stats", label: "Stats" },
  { id: "settings", label: "Settings" },
];

const VALID_TABS: Tab[] = ["letters", "saved", "settings", "stats"];

export const Route = createFileRoute("/profile")({
  validateSearch: (s: Record<string, unknown>): { tab: Tab } => ({
    tab: VALID_TABS.includes(s.tab as Tab) ? (s.tab as Tab) : "letters",
  }),
  head: () => ({
    meta: [
      { title: "Your profile — iBloov" },
      { name: "description", content: "Your iBloov profile, saved businesses, and Love Letters." },
      { property: "og:title", content: "Your profile — iBloov" },
      { property: "og:description", content: "Manage your iBloov profile." },
      { property: "og:type", content: "profile" },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { tab } = Route.useSearch();
  const navigate = useNavigate();
  const user = useLocalStore(getUser);
  const letters = useLocalStore(getLetters);
  const savedIds = useLocalStore(getSavedVenueIds);
  const helpful = useLocalStore(getHelpfulIds);

  if (!user) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="mx-auto max-w-md px-4 py-16 text-center">
          <h1 className="font-display text-2xl font-bold">You're not signed in</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to see your Love Letters, saved businesses, and stats.
          </p>
          <Link
            to="/login"
            className="mt-5 inline-flex rounded-xl bg-gradient-love px-5 py-2.5 text-sm font-bold text-white shadow-glow-pink"
          >
            Sign in
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const setTab = (t: Tab) =>
    navigate({ to: "/profile", search: { tab: t }, replace: true });

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-8">
        {/* Header card */}
        <div className="flex flex-col items-start gap-4 rounded-2xl border border-black/10 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-love text-lg font-bold text-white">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              initials(user.name)
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-2xl font-bold leading-tight">{user.name}</h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            {user.city && (
              <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 text-neon-pink" />
                {user.city}
              </p>
            )}
          </div>
          <button
            onClick={() => {
              signOut();
              toast.success("Signed out.");
              navigate({ to: "/" });
            }}
            className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold text-foreground/70 hover:border-neon-pink/40 hover:text-neon-pink"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>

        {/* Tabs */}
        <div className="mt-6 mb-5 flex flex-wrap gap-2">
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition sm:text-sm ${
                  active
                    ? "border-transparent bg-foreground text-background"
                    : "border-black/10 bg-white text-foreground/70 hover:border-mint/40 hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {tab === "letters" && <LettersTab letters={letters} />}
        {tab === "saved" && <SavedTab savedIds={savedIds} />}
        {tab === "stats" && (
          <StatsTab
            lettersCount={letters.length}
            savedCount={savedIds.length}
            helpfulCount={helpful.length}
          />
        )}
        {tab === "settings" && <SettingsTab />}
      </main>
      <Footer />
    </div>
  );
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function LettersTab({ letters }: { letters: ReturnType<typeof getLetters> }) {
  if (letters.length === 0) {
    return (
      <div className="rounded-2xl border border-black/10 bg-white">
        <EmptyState
          title="No Love Letters yet"
          subtitle="Find a place you love and write your first Love Letter."
          ctaLabel="Write a Love Letter"
          ctaHref="/"
        />
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {letters.map((l, i) => (
        <motion.div
          key={l.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03 }}
          className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-display text-base font-bold">{l.venueName}</h3>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 text-neon-pink" />
                {l.city}
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-mint">
              <Heart className="h-3 w-3 fill-current" />
              {l.rating.toFixed(1)}
            </div>
          </div>
          <p className="mt-3 line-clamp-3 text-sm italic text-foreground/80">
            “{l.message}”
          </p>
          <div className="mt-2 text-[11px] uppercase tracking-wider text-muted-foreground">
            {relative(l.createdAt)}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function SavedTab({ savedIds }: { savedIds: string[] }) {
  const items = useMemo(
    () => trendingVenues.filter((v) => savedIds.includes(v.id)),
    [savedIds],
  );
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-black/10 bg-white">
        <EmptyState
          title="No saved businesses yet"
          subtitle="Tap the bookmark on any business to save it here."
          ctaLabel="Discover"
          ctaHref="/"
        />
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((v) => (
        <Link
          key={v.id}
          to="/venue/$venueId"
          params={{ venueId: v.id }}
          className="group overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm transition hover:shadow-glow-mint"
        >
          <div className="relative h-32 w-full overflow-hidden">
            <img
              src={v.photo}
              alt={v.name}
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleSaved(v.id);
              }}
              className="absolute right-2 top-2 rounded-full bg-white/95 p-1.5 text-mint shadow"
              aria-label="Remove save"
            >
              <Bookmark className="h-4 w-4 fill-current" />
            </button>
          </div>
          <div className="p-3">
            <h3 className="font-display text-base font-bold leading-tight">{v.name}</h3>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 text-neon-pink" />
              {v.city}
            </p>
            <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>{v.loveCount} letters</span>
              <span className="font-bold text-mint">★ {v.rating.toFixed(1)}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

function StatsTab({
  lettersCount,
  savedCount,
  helpfulCount,
}: {
  lettersCount: number;
  savedCount: number;
  helpfulCount: number;
}) {
  const stats = [
    { label: "Love Letters sent", value: lettersCount, icon: Heart, color: "text-neon-pink" },
    { label: "Saved businesses", value: savedCount, icon: Bookmark, color: "text-mint" },
    { label: "Helpful votes", value: helpfulCount, icon: ThumbsUp, color: "text-purple" },
  ];
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm"
        >
          <s.icon className={`h-5 w-5 ${s.color}`} />
          <div className="mt-2 font-display text-3xl font-bold">{s.value}</div>
          <div className="text-xs text-muted-foreground">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

function SettingsTab() {
  const user = useLocalStore(getUser)!;
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio ?? "");
  const [city, setCity] = useState(user.city ?? "");
  const [avatar, setAvatar] = useState(user.avatar ?? "");

  const save = () => {
    updateUser({ name: name.trim() || user.name, bio, city, avatar });
    toast.success("Profile updated.");
  };

  const onAvatar = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => setAvatar(String(reader.result));
    reader.readAsDataURL(file);
  };

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-gradient-love text-lg font-bold text-white">
          {avatar ? (
            <img src={avatar} alt="" className="h-full w-full object-cover" />
          ) : (
            initials(name)
          )}
        </div>
        <label className="cursor-pointer rounded-full border border-black/10 px-3 py-1.5 text-xs font-semibold hover:border-mint/40">
          Change avatar
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && onAvatar(e.target.files[0])}
          />
        </label>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Name">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm focus:border-mint/40 focus:outline-none"
          />
        </Field>
        <Field label="Email">
          <input
            value={user.email}
            disabled
            className="w-full rounded-xl border border-black/10 bg-muted px-3 py-2 text-sm text-muted-foreground"
          />
        </Field>
        <Field label="City">
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Where are you based?"
            className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm focus:border-mint/40 focus:outline-none"
          />
        </Field>
        <Field label="Bio">
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={2}
            placeholder="A short line about you"
            className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm focus:border-mint/40 focus:outline-none"
          />
        </Field>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Password changes coming soon. <Settings2 className="inline h-3 w-3" />
        </p>
        <button
          onClick={save}
          className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-love px-4 py-2 text-sm font-bold text-white shadow-glow-pink hover:brightness-110"
        >
          <Save className="h-4 w-4" /> Save changes
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-foreground/70">{label}</span>
      {children}
    </label>
  );
}

function relative(ts: number): string {
  const days = Math.max(0, Math.floor((Date.now() - ts) / (24 * 60 * 60 * 1000)));
  if (days === 0) return "today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}
