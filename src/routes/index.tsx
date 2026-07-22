import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Navbar } from "@/components/love-letters/Navbar";
import { Hero } from "@/components/love-letters/Hero";
import { PlaceFoundCard } from "@/components/love-letters/PlaceFoundCard";
import { WriteLetterModal } from "@/components/love-letters/WriteLetterModal";
import { AuthWallModal } from "@/components/love-letters/AuthWallModal";
import { SuccessOverlay } from "@/components/love-letters/SuccessOverlay";
import { Link } from "@tanstack/react-router";
import { OwnerTeaserBanner } from "@/components/love-letters/OwnerTeaserBanner";
import { Footer } from "@/components/love-letters/Footer";
import { CategoryTabs, type HomeCategory } from "@/components/love-letters/CategoryTabs";
import { TrendingDestinations } from "@/components/love-letters/TrendingDestinations";
import { TopVenuesGrid } from "@/components/love-letters/TopVenuesGrid";
import { mockSearchVenue, type Venue } from "@/lib/love-letters/mockVenues";
import { addLetter, getUser, signIn } from "@/lib/love-letters/localStore";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "iBloov — Discover places worth loving 💌" },
      {
        name: "description",
        content:
          "Discover top-rated restaurants, hotels, and destinations — then leave a Love Letter to the ones you adore.",
      },
      { property: "og:title", content: "iBloov — Discover places worth loving 💌" },
      {
        property: "og:description",
        content: "Restaurants, hotels, and destinations loved by real people. Send love, not hate.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: LoveLettersPage,
});

function LoveLettersPage() {
  const navigate = useNavigate();

  const [isSearching, setIsSearching] = useState(false);
  const [venue, setVenue] = useState<Venue | null>(null);
  const [writeOpen, setWriteOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [category, setCategory] = useState<HomeCategory>("All");
  const [successOpen, setSuccessOpen] = useState(false);
  const [pendingDraft, setPendingDraft] = useState<{ rating: number; message: string } | null>(null);

  const handleSearch = (name: string, city: string) => {
    setIsSearching(true);
    setVenue(null);
    window.setTimeout(() => {
      setVenue(mockSearchVenue(name, city));
      setIsSearching(false);
    }, 900);
  };

  const finalize = (rating: number, message: string) => {
    if (!venue) return;
    addLetter({
      venueId: venue.id,
      venueName: venue.name,
      city: venue.city,
      rating,
      message,
    });
    setSuccessOpen(true);
    window.setTimeout(() => {
      setSuccessOpen(false);
      toast.success("Love Letter sent 💌", {
        description: `Your note is on its way to ${venue.name}.`,
      });
      navigate({ to: "/profile", search: { tab: "letters" } });
    }, 1800);
  };

  const handleSubmit = (rating: number, message: string) => {
    setWriteOpen(false);
    if (!getUser()) {
      setPendingDraft({ rating, message });
      window.setTimeout(() => setAuthOpen(true), 150);
    } else {
      window.setTimeout(() => finalize(rating, message), 150);
    }
  };

  const handleAuthed = () => {
    setAuthOpen(false);
    if (!getUser()) signIn("guest@ibloov.com", "Guest");
    if (pendingDraft) {
      const draft = pendingDraft;
      setPendingDraft(null);
      window.setTimeout(() => finalize(draft.rating, draft.message), 200);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <main>
        <Hero onSearch={handleSearch} isSearching={isSearching} />

        {venue && (
          <div className="pb-8">
            <PlaceFoundCard venue={venue} onWrite={() => setWriteOpen(true)} />
          </div>
        )}

        <CategoryTabs value={category} onChange={setCategory} />
        <TrendingDestinations />
        <TopVenuesGrid category={category} />

        <div className="mx-auto max-w-5xl px-4 pb-12">
          <Link
            to="/wall"
            className="group flex items-center justify-between gap-4 rounded-3xl border border-foreground/10 bg-gradient-to-r from-neon-pink/10 via-transparent to-mint/10 p-5 transition hover:shadow-glow-pink"
          >
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-neon-pink">
                Wall of Love
              </p>
              <h3 className="mt-1 font-display text-lg font-bold sm:text-xl">
                See every place with a Love Letter →
              </h3>
              <p className="mt-0.5 text-xs text-foreground/60">
                An endless feed of restaurants, hotels, and destinations travelers adore.
              </p>
            </div>
            <span className="hidden shrink-0 rounded-full bg-gradient-love px-4 py-2 text-xs font-bold text-white shadow-glow-pink transition group-hover:scale-105 sm:inline-block">
              Explore the wall
            </span>
          </Link>
        </div>

        <OwnerTeaserBanner />
      </main>

      <Footer />

      <WriteLetterModal
        open={writeOpen}
        venue={venue}
        onClose={() => setWriteOpen(false)}
        onSubmit={handleSubmit}
      />
      <AuthWallModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onAuthed={handleAuthed}
      />
      <SuccessOverlay open={successOpen} onClose={() => setSuccessOpen(false)} />
    </div>
  );
}
