import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Mail, MapPin, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/claim/$venueId")({
  component: ClaimVenuePage,
  head: () => ({
    meta: [
      { title: "Claim your venue · iBloov Love Letters" },
      {
        name: "description",
        content:
          "Verify ownership of your venue to read and reply to Love Letters from real customers.",
      },
    ],
  }),
});

function ClaimVenuePage() {
  const { venueId } = Route.useParams();

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:py-16">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-foreground/60 hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Wall of Love
      </Link>

      <h1 className="font-display text-3xl font-bold sm:text-4xl">
        Claim your venue
      </h1>
      <p className="mt-3 text-sm text-foreground/70 sm:text-base">
        Love Letters about your place are already posted publicly on the Wall of
        Love. Verify ownership to read them, reply, and opt in to email
        notifications when new letters arrive.
      </p>
      <p className="mt-1 text-xs text-foreground/40">Venue ID: {venueId}</p>

      <div className="mt-8 space-y-3">
        <Option
          icon={<ShieldCheck className="h-5 w-5" />}
          title="Verify with Google Business Profile"
          desc="One-click sign-in proves you manage this listing on Google. Fastest option."
          badge="Recommended"
        />
        <Option
          icon={<Mail className="h-5 w-5" />}
          title="Email a link to a domain address"
          desc="We send a verification link to an email on your venue's own website domain."
        />
        <Option
          icon={<MapPin className="h-5 w-5" />}
          title="Mailed verification code"
          desc="We mail a 6-digit code to your venue's public street address."
        />
      </div>

      <p className="mt-8 rounded-2xl border border-foreground/10 bg-foreground/[0.03] p-4 text-xs leading-relaxed text-foreground/60 sm:text-sm">
        iBloov never emails a business that hasn&rsquo;t claimed their venue and
        opted in. Letters to unclaimed venues stay public on the Wall of Love —
        we don&rsquo;t source contact addresses from third parties.
      </p>
    </main>
  );
}

function Option({
  icon,
  title,
  desc,
  badge,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  badge?: string;
}) {
  return (
    <button
      type="button"
      disabled
      className="flex w-full items-start gap-4 rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-4 text-left transition hover:border-mint/40 disabled:cursor-not-allowed disabled:opacity-80 sm:p-5"
    >
      <div className="mt-0.5 rounded-xl bg-mint/10 p-2 text-mint">{icon}</div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-display text-base font-bold sm:text-lg">
            {title}
          </h3>
          {badge && (
            <span className="rounded-full bg-mint/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-mint">
              {badge}
            </span>
          )}
        </div>
        <p className="mt-1 text-xs text-foreground/60 sm:text-sm">{desc}</p>
        <p className="mt-2 text-[10px] uppercase tracking-wider text-foreground/40">
          Coming soon
        </p>
      </div>
    </button>
  );
}
