import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Navbar } from "@/components/love-letters/Navbar";
import { Hero } from "@/components/love-letters/Hero";
import { PlaceFoundCard } from "@/components/love-letters/PlaceFoundCard";
import { WriteLetterModal } from "@/components/love-letters/WriteLetterModal";
import { AuthWallModal } from "@/components/love-letters/AuthWallModal";
import { WallOfLove, type WallFilter, type WallTime } from "@/components/love-letters/WallOfLove";
import { LettersPreviewModal } from "@/components/love-letters/LettersPreviewModal";
import { OwnerTeaserBanner } from "@/components/love-letters/OwnerTeaserBanner";
import { Footer } from "@/components/love-letters/Footer";
import {
  mockSearchVenue,
  type TrendingVenue,
  type Venue,
} from "@/lib/love-letters/mockVenues";

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
      { title: "iBloov Love Letters — Send love, not hate 💌" },
      {
        name: "description",
        content:
          "The world has enough 1-star hate. Write a Love Letter (up to 100 words) to your favorite restaurants, lounges, and venues.",
      },
      { property: "og:title", content: "iBloov Love Letters — Send love, not hate 💌" },
      {
        property: "og:description",
        content:
          "Don't leave a review. Leave a Love Letter. iBloov is the world's first life & leisure OS for shared joy.",
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
  const [isAuthed, setIsAuthed] = useState(false);
  const [previewVenue, setPreviewVenue] = useState<TrendingVenue | null>(null);

  const handleSearch = (name: string, city: string) => {
    setIsSearching(true);
    setVenue(null);
    window.setTimeout(() => {
      setVenue(mockSearchVenue(name, city));
      setIsSearching(false);
    }, 900);
  };

  const completeSend = () => {
    toast.success("Love Letter sent 💌", {
      description: venue
        ? `Your note is on its way to ${venue.name}.`
        : "Your note is on its way.",
    });
    navigate({ to: "/saved", search: { tab: "unlocked" } });
  };

  const handleSubmit = (_rating: number, _message: string) => {
    setWriteOpen(false);
    if (!isAuthed) {
      window.setTimeout(() => setAuthOpen(true), 150);
    } else {
      window.setTimeout(completeSend, 150);
    }
  };

  const handleAuthed = () => {
    setIsAuthed(true);
    setAuthOpen(false);
    window.setTimeout(completeSend, 200);
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <main>
        <Hero onSearch={handleSearch} isSearching={isSearching} />

        {venue && (
          <div className="pb-12">
            <PlaceFoundCard
              venue={venue}
              onWrite={() => setWriteOpen(true)}
              onClose={() => setVenue(null)}
            />
          </div>
        )}

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
          onWriteForVenue={(v) => {
            setPreviewVenue(v);
          }}
        />


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
      <LettersPreviewModal
        open={!!previewVenue}
        venue={previewVenue}
        onClose={() => setPreviewVenue(null)}
        onWrite={() => {
          if (!previewVenue) return;
          setVenue({
            id: previewVenue.id,
            name: previewVenue.name,
            address: previewVenue.address,
            city: previewVenue.city,
            website: previewVenue.website,
            imageQuery: previewVenue.imageQuery,
            claimed: previewVenue.claimed,
          });
          setPreviewVenue(null);
          setWriteOpen(true);
          if (typeof window !== "undefined") {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }}
      />
    </div>
  );
}
