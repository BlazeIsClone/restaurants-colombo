# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server with Turbopack at localhost:3000
npm run build    # Production build
npm run lint     # ESLint
```

There are no tests in this project.

## Environment

Requires `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` in `.env` for the Google Maps integration to work on article/restaurant pages.

## Architecture

This is a Next.js 15 app (App Router) with Tailwind CSS v4. It's a restaurant guide for Colombo with two page types:

**`/` (home)** — Lists articles from `src/data/articles.json`. Each article card links to `/<article.id>`.

**`/[slug]`** — A single `"use client"` page that handles two slug types:
- **Article slug** (e.g. `top-10-brunch-spots-colombo`): Shows multiple restaurants filtered by `article.featured_restaurants` IDs.
- **Restaurant slug** (e.g. `neko-and-kopi`): Shows a single restaurant directly.

The `[slug]/page.tsx` renders a split layout: a scrollable restaurant list on the left (50%) and a Google Map on the right (50%). As the user scrolls, the map pans to whichever restaurant is closest to the center of the scroll container (debounced at 150ms). Clicking a map marker scrolls to and highlights that restaurant. The active restaurant is tracked via `activeRestaurantId` state.

## Data layer

All data is static JSON — no database or API:
- `src/data/restaurants.json` — full restaurant records (id, name, type, lat/lng, images, hours, rating, etc.)
- `src/data/articles.json` — article metadata with `featured_restaurants: string[]` (restaurant IDs)
- `src/data/map.json` — Google Maps style config (passed directly to the `GoogleMap` `styles` option)

### Types
- `Restaurant` (`src/types/restaurant.ts`) — depends on `RestaurantType` from `marker.ts`
- `RestaurantType` = `'cafe' | 'bakery' | 'fine_dining' | 'casual_dining' | 'bar'`
- `Article` (`src/types/article.ts`)

## Adding content

To add a new restaurant: add an entry to `restaurants.json` with a unique `id`.

To crawl a restaurant from `restaurantsinsrilanka.com` and add it automatically:

```bash
# Single restaurant
python3 scripts/crawl_restaurant.py https://www.restaurantsinsrilanka.com/restaurant/<slug>/

# Multiple at once
python3 scripts/crawl_restaurant.py <url1> <url2> ...

# Preview without writing
python3 scripts/crawl_restaurant.py --dry-run <url>
```

The script uses browser headers to bypass 403 blocks, extracts coordinates from the Google Maps embed, rating (converted from /5 to /10), gallery images, opening hours, and FAQ-based descriptions. It skips restaurants already in the JSON by ID. Coordinates may be `null` for restaurants whose map embed is zoomed out to country/city level — fix those manually.

To add a new article: add an entry to `articles.json` referencing existing restaurant IDs in `featured_restaurants`. The article is automatically accessible at `/<article.id>`.

Images are loaded from external URLs. `next.config.ts` allows all HTTPS hostnames (`hostname: "*"`).
