# Wall of Love — Location search + Time filter

## Goals
- Remove the 5 category chips (All / Cafés / Restaurants / Bars / Rooftops / Lounges) entirely. Venues stop being limited to those 5 types; category is no longer a filter.
- Replace the Local / Regional / Global scope toggle with a **Google Maps–powered location search bar** (city, state, or country).
- Add a **Time filter** alongside it (Today, This week, This month, All time).
- Keep existing sort chips (Top rated, Most letters, New this week) and Top-10 ranking.

## UX

```text
┌─ Wall of Love ─────────────────────────────────────┐
│  [🔍 Search city, state, or country…    ▼]  [⏱ This week ▼] │
│                                                    │
│  [Top rated] [Most letters] [New this week]        │
│                                                    │
│  #1  Venue Name · Brooklyn, NY   ❤ 482  📝 37     │
│  #2  …                                             │
└────────────────────────────────────────────────────┘
```

- **Location input**: Google Places autocomplete (cities/regions/countries only). Empty input = Global. Selected place narrows ranking to venues inside that city / state / country. A small "Clear" affordance resets to Global. Header text updates dynamically ("Trending in Paris", "Trending worldwide").
- **Time filter**: simple dropdown with `Today | This week | This month | All time` (default: All time). Filters mock venues by their `unlockedAt` / `createdAt` mock timestamp.
- **Categories**: removed. Each card still shows the venue's `category` as a small badge for context (no filtering on it).
- Venue mock data is expanded with more varied categories (speakeasy, jazz club, bakery, beach club, art gallery cafe, ramen bar, etc.) so it no longer feels limited to 5 types.

## Technical Changes

### 1. Google Maps connector
- Call `standard_connectors--connect` with `google_maps` so `VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY` is available client-side.
- Load Maps JS API async with `loading=async&libraries=places&callback=initMap`.
- Use **Places API (New)** `AutocompleteSuggestion.fetchAutocompleteSuggestions` (NOT legacy `Autocomplete`), restricted to `includedPrimaryTypes: ['locality','administrative_area_level_1','country']`.
- On selection, resolve place details to `{ city, region, country }` and store in filter state.

### 2. New component `LocationSearch.tsx`
- Controlled input with debounced autocomplete suggestions list.
- Emits `{ city?, region?, country? } | null` to parent.
- Handles loading + error states (e.g. missing key → falls back to plain text input).

### 3. `WallOfLove.tsx`
- Remove `categoryFilter` state, category chip row, and `scope` (local/regional/global) toggle + its UI.
- Add `locationFilter` and `timeFilter` state, persisted to URL search params (`wallLocation`, `wallTime`) alongside existing `wallFilter`.
- Filtering pipeline: `venues → byLocation → byTime → sortBy(filter) → top 10`.
- Header copy adapts to location ("Trending in {city}" / "worldwide").
- Each card shows category as a subtle badge.

### 4. `src/routes/index.tsx`
- Extend `validateSearch` with `wallLocation` (string) and `wallTime` (`today|week|month|all`).
- Pass through to `WallOfLove`.

### 5. `src/lib/love-letters/mockVenues.ts`
- Expand to ~25 venues across diverse categories (cafe, speakeasy, ramen bar, jazz club, beach club, gallery, bakery, wine bar, izakaya, brewery, tea house, etc.) and varied cities/countries.
- Add `createdAt` timestamps spread across today/this week/this month/older to make the time filter meaningful.

## Out of scope
- No server route; autocomplete runs in the browser via the Maps JS API browser key.
- No changes to Saved page, Write Letter flow, or word counter.
