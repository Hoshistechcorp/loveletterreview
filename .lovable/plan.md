# iBloov Love Letters — Build Plan

A single-page marketing + interactive app at `/` (loveletterreview.ibloov.com style). Frontend-only with mocked data — no backend, no real auth, no Places API.

## Aesthetic decision (flagging a tension)

Your spec says **dark mode "Mint Modernism"** (#0A0A0A bg, mint #3EB489, neon pink #FF2E7F, purple, glassmorphism). The attached iBloov.com screenshot is **light mode** with blue/orange playful branding.

I'll go with the **explicit dark Mint Modernism spec** since it's detailed and intentional, but bring in the iBloov logo + brand DNA (heart motif, "x = love" warmth, the iBLOOv wordmark with orange "oo" smile) so it still reads as part of the iBloov family. If you want light mode instead, tell me before I implement.

## Pages & structure

Single route: `src/routes/index.tsx` composing section components from `src/components/love-letters/`.

```text
src/
├─ routes/index.tsx                 (page composition + SEO head)
├─ components/love-letters/
│  ├─ Navbar.tsx                    (logo + AuraLink link)
│  ├─ Hero.tsx                      (headline + search)
│  ├─ PlaceFoundCard.tsx            (glass card, unclaimed badge)
│  ├─ WriteLetterModal.tsx          (hearts + editor + submit)
│  ├─ HeartRating.tsx               (10 hearts, 1-3 locked)
│  ├─ LetterEditor.tsx              (postcard textarea, word count)
│  ├─ AuthWallModal.tsx             (Google/Apple buttons)
│  ├─ SuccessOverlay.tsx            (floating hearts confetti)
│  ├─ WallOfLove.tsx                (leaderboard grid)
│  ├─ OwnerTeaserBanner.tsx         (B2B CTA → AuraLink)
│  └─ Footer.tsx
├─ lib/love-letters/
│  ├─ mockVenues.ts                 (search results + leaderboard)
│  └─ wordCount.ts
└─ assets/ibloov-logo.png           (copied from upload)
```

## Section-by-section

1. **Navbar** — iBloov logo left, "Store" + hamburger pattern from iBloov.com, plus a "Claim your venue" link to auralink.ibloov.com.
2. **Hero** — Headline "Don't Leave a Review. Leave a Love Letter. 💌", subhead, dual-input search ("Place Name" + "City"), glowing mint "Find Place" button with spinning heart loading state.
3. **Place Found Card** — Glassmorphism card with mocked venue (name, address, website, placeholder image). Pulsing pink "Be the first to send them love!" badge for unclaimed state + subtle "Are you the owner? Claim this page" link. Big "Write Letter" CTA.
4. **Write Letter Modal** (slide-up, framer-motion):
   - **Heart rating**: 10 hearts in a row. Hearts 1–3 permanently gray + lock icon; hover/click shows tooltip "At iBloov, we only spread love. 4 hearts is our minimum! ❤️". Hearts 4–10 fill with pink→purple neon gradient.
   - **Editor**: textarea styled as glowing neon postcard. The prefix **"I love this place because..."** is rendered as a non-editable inline label; the textarea value starts empty after it and only the user's continuation is editable (enforced via controlled value, never letting user delete the prefix). Word counter "Words: X/100" with red state at limit; hard cap at 100 words.
   - **Submit**: "Send Love 💌" button.
5. **Auth Wall** — On submit, since auth is mocked to false, slide-up modal: "Claim your AuraLink ID to deliver this letter!" + "Continue with Google" + "Continue with Apple" buttons. Clicking either flips local auth state → closes auth wall → triggers Success Overlay: floating hearts animation (framer-motion) + message "Love Letter Sent! We are notifying the owners right now so they can unlock and read your message."
6. **Wall of Love** — "Top Trending Places This Week" grid of 6 mocked venues (image, name, "9.8/10 💖", "452 Love Letters"), staggered fade-in on scroll. Below it: distinct gradient B2B banner "Are you a restaurant or venue owner? You might have unread Love Letters waiting for you." with "Unlock Your Letters at auralink.ibloov.com →" button.

## Design tokens (src/styles.css)

Add dark theme defaults + brand tokens (all `oklch`):
- `--background` ≈ #0A0A0A
- `--mint` (≈ #3EB489), `--neon-pink` (≈ #FF2E7F), `--purple` (≈ #8B5CF6)
- `--ibloov-blue`, `--ibloov-orange` (from logo, for accent moments)
- `--gradient-love` = pink→purple, `--gradient-mint-glow`, `--glass-bg`, `--glass-border`, `--shadow-glow-pink`, `--shadow-glow-mint`
- Register all as Tailwind utilities via `@theme inline`.

Typography: bold display font for headline (Space Grotesk or similar Gen-Z geometric), Inter for body.

## Tech

- framer-motion (install) for modal slide-ins, heart fills, floating-hearts success, leaderboard stagger.
- lucide-react (already available) for Heart, Search, MapPin, Lock, Sparkles icons.
- All mock data in-memory; no Supabase / no Cloud needed.
- Mobile-first; current viewport is 390px so I'll design for that first then scale up.
- SEO: route `head()` with title "iBloov Love Letters — Send love, not hate 💌", description, og tags.

## Out of scope (call out if you want them)

- Real Google Places autocomplete (mocked)
- Real Google/Apple OAuth (mocked toggle)
- Persisting letters anywhere (no DB)
- Multi-page routing (everything on `/`)
