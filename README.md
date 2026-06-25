# Recipe Wizard

A two-step recipe recommender built with Next.js 16. Pick a cuisine and a category, get a matched recipe from TheMealDB, and save your reactions. History is persisted in `localStorage` and accessible at any time.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No API keys or environment variables required — TheMealDB is free and open.

## Features

- **Two-step wizard** — select a cuisine/area (step 1) then a category (step 2), move freely back and forth without losing state
- **Dynamic autocomplete** — both fields filter options as you type
- **Recommendation card** — shows title, image, area, category, a link to the source recipe, and a YouTube link when available
- **Like / Dislike** — saves the reaction to `localStorage` with recipe ID, title, image, timestamp, and the search inputs used
- **New Idea** — cycles through other matching recipes without repeating what you've already rated
- **My Recipes** — history page with All / Liked / Disliked filter tabs and a live search field
- **Recipe detail page** — full-width hero image, ingredient list with measures, step-by-step instructions, share link (copies URL to clipboard)
- **EN / IT** — full internationalisation via `next-intl`

## Stack

| Layer      | Choice                                        |
| ---------- | --------------------------------------------- |
| Framework  | Next.js 16 (App Router, server + client mix)  |
| Language   | TypeScript 5 strict                           |
| Styling    | SCSS Modules — two-layer design token system  |
| i18n       | `next-intl` v4                                |
| Icons      | `react-icons` (lu + hi sets)                  |

## Design decisions

### Recommendation logic (`useMealMatcher`)

TheMealDB has no single endpoint that filters by both area and category simultaneously. The hook fetches both filter lists in parallel and takes their **intersection**. If the intersection is empty (the combination doesn't exist in the DB), it falls back to the **union** so the user always gets a result. The pool is shuffled with Fisher-Yates so repeated "New Idea" clicks give a random order without repeats.

`excludeIds` (recipes already rated) are applied once when the candidate pool is built, not on every `next()` call, to avoid re-fetching the filter lists on each like/dislike.

### Persistence strategy

All history is stored in a single `localStorage` key (`recipe-history`) as a JSON array. The context reads it once on mount (client-only, inside `useEffect`) to avoid SSR hydration mismatches. Adding a new entry for an already-rated recipe replaces the old entry rather than duplicating it.

### API proxy

Next.js route handlers in `src/app/api/meals/` proxy TheMealDB. This keeps the third-party origin out of client code and enables `next: { revalidate: 3600 }` caching — filter lists and recipe details are re-fetched at most once per hour.

### Wizard state

The wizard's `SearchState` (area, category, current step) lives in a React context (`RecipesContext`) rather than local component state. This means navigating away and back preserves the in-progress selection without URL-based state.

### No external state manager

Context + `useState` is sufficient at this scale. Adding Redux or Zustand would be premature.

## Scripts

| Command         | Description      |
| --------------- | ---------------- |
| `npm run dev`   | Dev server       |
| `npm run build` | Production build |
| `npm run lint`  | ESLint           |
