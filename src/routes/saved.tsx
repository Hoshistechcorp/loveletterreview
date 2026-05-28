import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/love-letters/Navbar";
import { Footer } from "@/components/love-letters/Footer";
import { EmptyState } from "@/components/love-letters/EmptyState";

export const Route = createFileRoute("/saved")({
  head: () => ({
    meta: [
      { title: "Saved — iBloov Love Letters" },
      {
        name: "description",
        content: "Your saved Love Letters on iBloov.",
      },
    ],
  }),
  component: SavedPage,
});

function SavedPage() {
  const savedLetters: unknown[] = [];

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-6">
          <h1 className="font-display text-3xl font-bold">Saved</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Love Letters you have bookmarked.
          </p>
        </div>

        {savedLetters.length === 0 ? (
          <div className="glass rounded-3xl">
            <EmptyState
              title="No saved letters yet"
              subtitle="Explore Love Letters and save your favorites to read them again later."
              ctaLabel="Explore"
              ctaHref="/"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Saved letter cards will render here */}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
