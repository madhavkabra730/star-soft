# NFTarket — NFT Marketplace (Starsoft Frontend Challenge)

An NFT marketplace interface with shopping-cart functionality, built for the
[Starsoft Frontend Developer challenge](https://github.com/star-soft/starsoft-frontend-challenge)
with Next.js (App Router), TypeScript, Redux Toolkit, React Query, Framer
Motion, and SCSS.

## Quick start

### Option A — Docker (recommended, single command)

```bash
docker compose up
```

Then open **http://localhost:3000**. This runs the hot-reloading dev server
inside the container (source is bind-mounted, so edits on your machine are
picked up immediately).

For a production-style build instead (Next.js `standalone` output, no
hot reload):

```bash
docker compose -f docker-compose.prod.yml up --build
```

### Option B — Local Node.js

Requires Node.js ≥ 20.9.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

### Other scripts

| Script                  | Description                                             |
| ------------------------ | -------------------------------------------------------- |
| `npm run build`          | Production build                                         |
| `npm start`               | Serve a production build (`npm run build` first)         |
| `npm run lint`             | ESLint                                                    |
| `npm run format` / `format:check` | Prettier — write / check                          |
| `npm test` / `test:watch` / `test:coverage` | Jest + React Testing Library         |
| `npm run generate:mocks` | Regenerate the placeholder NFT artwork in `public/nfts`   |

## Why a mock API

The challenge points to a live API at
`https://starsoft-challenge-7dfd4a56a575.herokuapp.com/v1/docs`. That host has
been **permanently decommissioned** — Heroku returns `"No such app"` (a
deleted app, not a sleeping free dyno; verified with repeated requests at the
time of writing). To keep the app fully functional — and to actually
demonstrate the required SSR/SSG + React Query integration — this project
ships its own data layer with the exact same contract:

- `GET /api/products?page=1&limit=8` → `{ data: Product[], metadata: { page, pageCount, totalCount, limit } }`
- `GET /api/products/:id` → `Product`
- `Product { id, name, description, image, price, createdAt, cryptoSymbol, cryptoIconPath }`

(This shape was confirmed against a completed public solution to the same,
now-offline challenge, to stay faithful to the original contract.)

- **Seed data**: `src/mocks/products.ts` — 24 NFTs with deterministic prices/dates.
- **Artwork**: generated locally as SVGs by `scripts/generate-nft-art.mjs`
  (`npm run generate:mocks`) instead of hot-linking a third-party placeholder
  service, so the app has zero runtime dependency on external image hosts.
- **Data access**: `src/lib/products.ts` is called directly by Server
  Components (no self-fetch over HTTP — an antipattern in Next.js Server
  Components); the same functions back the `/api/products*` Route Handlers
  used by the client-side React Query hooks.
- **Swapping in a real backend**: set `NEXT_PUBLIC_API_BASE_URL` (see
  `.env.example`) to any server implementing the same two endpoints — no
  component, hook, or Redux code needs to change.

## Design

The Figma file linked in the challenge requires interactive/authenticated
access that isn't fetchable headlessly. The UI was built from:

1. The button-label glossary given in the brief (COMPRAR / ADICIONADO AO
   CARRINHO / FINALIZAR COMPRA / COMPRA FINALIZADA! / Carregar mais / Você já
   viu tudo) — implemented literally as the interaction states described.
2. Design tokens (colors, spacing, breakpoints, card sizing) cross-checked
   against a completed public solution of this same challenge, to stay
   reasonably close to the intended dark, orange-accented look.

If exact Figma screenshots are available, `src/styles/_variables.scss` is the
single place to retune colors/spacing/type, and the component-level SCSS
Modules make layout tweaks isolated and low-risk.

## Features implemented

- **NFT catalogue** (`/`) — server-rendered first page (ISR, 60s revalidate)
  seeded into React Query, then paginated client-side via "Carregar mais" /
  "Você já viu tudo" (`useInfiniteQuery`).
- **NFT detail page** (`/nft/[id]`) — statically generated for every NFT at
  build time (`generateStaticParams`), with per-page metadata (`generateMetadata`)
  for SEO/Open Graph.
- **Cart** — Redux Toolkit slice (`src/features/cart`): add/remove items,
  checkout flow (Finalizar compra → Compra finalizada! → auto-clears), and
  client-side persistence to `localStorage` (hydrated post-mount to avoid SSR
  hydration mismatches).
- **Cart drawer** — Framer Motion slide-over, code-split via `next/dynamic`
  (`ssr: false`) since it's only needed after a user interaction.
- **Loading / success / error states** — skeleton grid while the first page
  loads, an inline retry affordance on fetch failure, an empty state, a
  custom `not-found.tsx` for unknown NFT ids, and a route-level `error.tsx`
  boundary.
- **Animations** — page transitions (`app/template.tsx`, remounts on every
  navigation), card hover/tap, cart item enter/exit, cart drawer slide-in.
- **Accessibility** — semantic buttons/roles, `aria-pressed` on toggling buy
  buttons, `aria-label`s on icon-only controls, focus rings, Escape-to-close
  on the cart drawer.

## Tech stack & reasoning

| Area | Choice | Why |
| --- | --- | --- |
| Framework | Next.js 16 (App Router) | Required by the brief. SSR (product list, ISR) + SSG (`generateStaticParams` on NFT detail pages) + Route Handlers + `next/image` + `next/dynamic` are all exercised directly. |
| Language | TypeScript | Static typing across the Redux store, React Query hooks, and API contract — the "nice to have" in the brief. |
| State | Redux Toolkit | Required by the brief; RTK's `createSlice` keeps the cart reducer/selectors small and immutable-by-default (Immer). |
| Data fetching | TanStack React Query | Required by the brief; `useInfiniteQuery` for pagination, `useQuery` (seeded via `initialData`) on the detail page so SSR content and the client cache agree with no refetch flash. |
| Styling | SCSS Modules | Required (SASS); modules keep styles component-scoped, `src/styles/_variables.scss` / `_mixins.scss` centralise tokens and are `@use`d project-wide via `sassOptions.loadPaths`. |
| Animation | Framer Motion | Required by the brief; used for hover/tap micro-interactions, list enter/exit, drawer and page transitions. |
| Testing | Jest + React Testing Library | Required by the brief; `next/jest` handles the SWC/SCSS-module wiring. |

## Project structure

```
src/
  app/                # App Router: pages, layouts, Route Handlers, templates
    api/products/      # Mock API (GET list + GET by id)
    nft/[id]/          # NFT detail page (SSG)
  components/          # Reusable UI components (one folder per component)
  features/cart/       # Redux slice + selectors
  hooks/                # React Query hooks (useProducts, useProduct)
  lib/                  # Store setup, data-access layer, API client
  mocks/                # Seed NFT data
  styles/               # SCSS variables & mixins
  types/                # Shared TypeScript types
scripts/                # generate-nft-art.mjs — placeholder artwork generator
```

## Testing

```bash
npm test
```

26 tests across the cart reducer/selectors, the mock data-access layer
(`getProductsPage` / `getProductById`), and user-facing component behaviour
(buy button state, load-more button's three states, cart badge count).

## Known limitations & possible future improvements

- **No real backend.** The original API is gone; see "Why a mock API" above.
  Swapping in a real one is a one-line env var change.
- **Design fidelity is approximate**, not pixel-verified against Figma (see
  "Design" above) — token-driven styling makes closing that gap
  straightforward once exact specs are available.
- **No quantity per NFT.** Since NFTs are unique, each is added to the cart
  at most once — there's no quantity selector by design.
- **No persisted "purchase history."** Checkout resets the cart; a real
  backend would record orders server-side.
- **No i18n layer.** UI copy follows the brief's Portuguese button labels
  directly rather than going through a translation library, since the rest
  of the challenge brief is in English.
