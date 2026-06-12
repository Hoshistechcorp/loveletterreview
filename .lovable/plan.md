## Goal

Make iBloov legally and reputationally safe to send Love Letters to businesses, by removing any implication that we scrape or guess business emails. Every letter is **public** by default; venues only receive an email if **they themselves** registered a contact address (via venue claim).

## Why this is safe

The risk of "where did you get my email?" complaints (GDPR Art. 6/14, CAN-SPAM, CASL) comes from emailing addresses the recipient never gave us. We avoid that by sourcing emails through exactly two consent paths:

1. **Verified claim** — A venue owner proves ownership (Google Business OAuth, domain email verification, or in-place code) and enters a notification email themselves.
2. **Self-published contact** (optional, phase 2) — Email pulled live from the venue's own Google Business Profile via the official API, with a "this came from your public Google listing — unsubscribe in one click" footer. We never scrape websites.

Letters to unclaimed venues are **never emailed** — they sit publicly on the Wall of Love and act as a claim incentive ("you have 3 unread Love Letters — claim to read them").

## User-facing flow changes

### Writer (no behavioral change today, copy change only)
- The `WriteLetterModal` preview step keeps its current email-card layout (per user's request) but the **label and microcopy** change so it doesn't promise an email will land in the venue's inbox:
  - Header: "Preview your Love Letter" (was "Email preview")
  - Subheader: "What the {venue} team will see when they claim their listing"
  - Below the card, add a small note: "Posted publicly to the Wall of Love. The {venue} team gets notified when they claim their venue on iBloov."
  - Button stays "Send Love 💌"

### Venue / business owner (new, phase 1)
- Each public letter on the Wall shows a "Are you {venue}? Claim to reply →" CTA (the existing `OwnerTeaserBanner` becomes per-card).
- Claim page: owner verifies via one of:
  - Google Business Profile OAuth (preferred — proves ownership instantly)
  - Email link sent to an address on the venue's own published domain
  - 6-digit code mailed/displayed to the venue's public address
- After claim, owner enters a **notification email** and toggles "Email me when I receive a Love Letter."
- Only then does the queue start sending letter notifications to that address. Every email includes a one-click unsubscribe and a "why am I getting this?" explainer.

### Phase 2 (optional, gated behind explicit user approval later)
- Pull contact email from Google Business Profile API for **unclaimed** venues, with full provenance disclosure in the email footer.

## Technical implementation (phase 1 only)

**Frontend — copy + UI only, no business logic yet:**
- `src/components/love-letters/WriteLetterModal.tsx` — rename "Email preview" → "Preview your Love Letter", update subheader and add provenance note. Keep the email-card visual.
- `src/components/love-letters/WallOfLove.tsx` — add a small "Are you {venue}? Claim to reply" link on each letter card.
- New route `src/routes/claim.$venueId.tsx` — placeholder claim landing page explaining the three verification options (UI only for now; no real verification wired yet).

**Backend — defer to when claim flow is actually built:**
- No Lovable Cloud / no email sending in this phase.
- No `email_domain--setup_email_infra` yet — we don't email anyone until the claim flow exists.
- Document the data model decision: venues table will get `claimed_by`, `notification_email`, `notification_opt_in`, `notification_consent_at`.

**Legal copy (add to footer / about):**
- "iBloov never emails a business unless they've claimed their venue and opted in. Letters to unclaimed venues live publicly on our Wall of Love."
- Privacy page section: "How we contact businesses" — describes the claim-first model.

## What this plan does NOT do

- Does not enable Lovable Cloud (no backend needed for phase 1 copy + UI changes).
- Does not build the actual claim verification (Google OAuth, domain email, mailed code) — that is its own scoped project.
- Does not send any emails. The current flow already only shows a toast; this plan keeps that behavior and just corrects the framing.
- Does not change the "Public + opt-in email" model the user chose — it is the foundation, just not implemented end-to-end in one go.

## Suggested next step after this plan

Once the framing is correct, the next focused task is the **claim flow** (route + verification provider). That's where Lovable Cloud, the venues table, and email infrastructure get added.
