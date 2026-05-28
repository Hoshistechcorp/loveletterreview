import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/love-letters/Navbar";
import { Hero } from "@/components/love-letters/Hero";
import { PlaceFoundCard } from "@/components/love-letters/PlaceFoundCard";
import { WriteLetterModal } from "@/components/love-letters/WriteLetterModal";
import { AuthWallModal } from "@/components/love-letters/AuthWallModal";
import { SuccessOverlay } from "@/components/love-letters/SuccessOverlay";
import { WallOfLove } from "@/components/love-letters/WallOfLove";
import { OwnerTeaserBanner } from "@/components/love-letters/OwnerTeaserBanner";
import { Footer } from "@/components/love-letters/Footer";
import {
  mockSearchVenue,
  type Venue,
} from "@/lib/love-letters/mockVenues";

export const Route = createFileRoute("/")({
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
  const [isSearching, setIsSearching] = useState(false);
  const [venue, setVenue] = useState<Venue | null>(null);
  const [writeOpen, setWriteOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);

  const handleSearch = (name: string, city: string) => {
    setIsSearching(true);
    setVenue(null);
    window.setTimeout(() => {
      setVenue(mockSearchVenue(name, city));
      setIsSearching(false);
    }, 900);
  };

  const handleSubmit = (_rating: number, _message: string) => {
    setWriteOpen(false);
    if (!isAuthed) {
      window.setTimeout(() => setAuthOpen(true), 150);
    } else {
      window.setTimeout(() => setSuccessOpen(true), 150);
    }
  };

  const handleAuthed = () => {
    setIsAuthed(true);
    setAuthOpen(false);
    window.setTimeout(() => setSuccessOpen(true), 200);
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <main>
        <Hero onSearch={handleSearch} isSearching={isSearching} />

        {venue && (
          <div className="pb-12">
            <PlaceFoundCard venue={venue} onWrite={() => setWriteOpen(true)} />
          </div>
        )}

        <WallOfLove />
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
