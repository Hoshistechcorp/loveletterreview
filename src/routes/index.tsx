import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Navbar } from "@/components/love-letters/Navbar";
import { Hero } from "@/components/love-letters/Hero";
import { PlaceFoundCard } from "@/components/love-letters/PlaceFoundCard";
import { WriteLetterModal } from "@/components/love-letters/WriteLetterModal";
import { AuthWallModal } from "@/components/love-letters/AuthWallModal";
import { WallOfLove, type WallFilter, type WallTime } from "@/components/love-letters/WallOfLove";
import { OwnerTeaserBanner } from "@/components/love-letters/OwnerTeaserBanner";
import { Footer } from "@/components/love-letters/Footer";
import { CategoryTabs, type HomeCategory } from "@/components/love-letters/CategoryTabs";
import { TrendingDestinations } from "@/components/love-letters/TrendingDestinations";
import { TopVenuesGrid } from "@/components/love-letters/TopVenuesGrid";
import { mockSearchVenue, type Venue } from "@/lib/love-letters/mockVenues";
import { addLetter, getUser } from "@/lib/love-letters/localStore";

const VALID_FILTERS: WallFilter[] = ["top", "most", "new"];
const VALID_TIMES: WallTime[] = ["today", "week", "month", "all"];

export const Route = createFileRoute("/")({
  validateSearch: (
    search: Record<string, unknown>,
  ): { wallFilter: WallFilter; wallLocation: string; wallTime: WallTime } => {
    const f = search.wallFilter;
    const t = search.wallTime;
    const loc = search.wallLocation;
    return {
      wallFilter: VALID_FILTERS.includes(f as WallFilter) ? (f as WallFilter) : "top",
      wallTime: VALID_TIMES.includes(t as WallTime) ? (t as WallTime) : "all",
      wallLocation: typeof loc === "string" ? loc : "",
    };
  },

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
  const { wallFilter, wallLocation, wallTime } = Route.useSearch();
  const navigate = useNavigate();

  const [isSearching, setIsSearching] = useState(false);
  const [venue, setVenue] = useState<Venue | null>(null);
  const [writeOpen, setWriteOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [category, setCategory] = useState<HomeCategory>("All");
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
    toast.success("Love Letter sent 💌", {
      description: `Your note is on its way to ${venue.name}.`,
    });
    navigate({ to: "/profile", search: { tab: "letters" } });
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

        <div id="wall">
          <WallOfLove
            filter={wallFilter}
            onFilterChange={(f) =>
              navigate({
                to: "/",
                search: { wallFilter: f, wallLocation, wallTime },
                replace: true,
              })
            }
            location={wallLocation}
            onLocationChange={(v) =>
              navigate({
                to: "/",
                search: { wallFilter, wallLocation: v, wallTime },
                replace: true,
              })
            }
            time={wallTime}
            onTimeChange={(t) =>
              navigate({
                to: "/",
                search: { wallFilter, wallLocation, wallTime: t },
                replace: true,
              })
            }
          />
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
    </div>
  );
}
