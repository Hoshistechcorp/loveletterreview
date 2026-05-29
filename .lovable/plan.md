# Redesign Wall of Love expandable row

Adopt the **Luminous gradient sheen** direction for the expanded panel on each Wall of Love item. Collapsed row stays exactly as it is today. Only one row open at a time (unchanged).

## What changes

In `src/components/love-letters/WallOfLove.tsx`, replace the existing expanded `<motion.div>` block (currently a simple horizontal row with excerpt + pill button) with the new design.

### Expanded panel structure (vertical stack, centered)

```text
┌─ Expanded panel ─────────────────────────────────┐
│  (floating ❤ top-left, floating ❤ bottom-right)  │
│                                                  │
│         I LOVE THIS PLACE BECAUSE  (mint label)  │
│                                                  │
│       " The atmosphere here is truly             │
│         unparalleled, from the way the           │
│         light hits the vintage counters… "       │
│                                                  │
│         [ Read & Write more  → ]  (gradient CTA) │
│                                                  │
│         ─── Featured Letter ───                  │
└──────────────────────────────────────────────────┘
```

### Visual treatment

- Background: layered gradient sheen using existing tokens — base `bg-gradient-to-tr from-mint/[0.04] via-neon-pink/[0.06] to-transparent` + radial pink glow at 70% 20% via inline `radial-gradient` using `color-mix(in oklab, var(--neon-pink) 15%, transparent)`.
- Decorative quote marks (`"` / `"`) flanking the excerpt at low opacity using `text-neon-pink/20`.
- Two floating heart SVGs (lucide `Heart` filled) — one top-left rotated -12°, one bottom-right rotated 45°/scale 1.25 — at low opacity.
- **Animated hearts**: add a `float-heart` keyframe to `src/styles.css` (gentle 4s ease-in-out vertical drift ±6px + slight rotation wobble), staggered with `animation-delay` so the two hearts breathe out of phase. Respects `prefers-reduced-motion` via `@media (prefers-reduced-motion: reduce) { animation: none }`.
- "Featured Letter" signature line at the bottom with thin `bg-neon-pink/20` dividers.

### Typography (already loaded)

- Eyebrow label "I LOVE THIS PLACE BECAUSE": `font-display` (Space Grotesk), uppercase, tracking-widest, `text-neon-pink`.
- Excerpt: DM Sans medium (loaded once in `src/styles.css` next to the existing Inter/Space Grotesk `@import url(...)`).
- CTA label: `font-display` semibold.

### CTA

Re-implement the existing "Read & Write more" pill with the gradient sheen treatment: `bg-gradient-love` base + transparent white overlay that fades in on group-hover, arrow icon (`ArrowRight` from lucide) that nudges right on hover. Keep the existing click handler (currently no-op) intact.

### Motion (Framer Motion, already used)

Replace the current `initial/animate/exit` on the panel with a richer reveal:

- Panel: `initial={{ height: 0, opacity: 0 }}` → `animate={{ height: 'auto', opacity: 1 }}`, `transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}`.
- Inner content wrapper: staggered children — eyebrow (delay 0.05s), excerpt (0.12s), CTA (0.20s), signature (0.28s), each fading + sliding up 8px.

## Files to touch

- `src/components/love-letters/WallOfLove.tsx` — replace lines 277–300 (the `AnimatePresence` block for the expanded panel). Add imports for `ArrowRight` from `lucide-react`.
- `src/styles.css` — add the DM Sans font import alongside the existing Google Fonts `@import`, add `--font-body-quote` token (optional), and add `@keyframes float-heart` + `.animate-float-heart` utility with the reduced-motion guard.

## Out of scope

- Collapsed row, rank chip, rating, letter count, chevron, category badge — unchanged.
- Filter chips, location search, time dropdown, section header — unchanged.
- `mockVenues.ts` — unchanged. The excerpt text already exists on each venue.
