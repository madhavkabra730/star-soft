# Starsoft — NFT Marketplace (Frontend Challenge)

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

Requires Node.js ≥ 22 (Next.js itself only needs ≥ 20.9, but
`@testing-library/jest-dom` requires ≥ 22 — the Docker image and CI-style
checks in this repo are pinned to Node 22 to match).

```bash
npm install
npm run dev
```

Open http://localhost:3000.

### Other scripts

| Script                                      | Description                                      |
| ------------------------------------------- | ------------------------------------------------ |
| `npm run build`                             | Production build                                 |
| `npm start`                                 | Serve a production build (`npm run build` first) |
| `npm run lint`                              | ESLint                                           |
| `npm run format` / `format:check`           | Prettier — write / check                         |
| `npm test` / `test:watch` / `test:coverage` | Jest + React Testing Library                     |

## Data fetching

The app talks directly to the live **Starsoft/MKS Front-end Challenge API**,
documented at [api-challenge.starsoft.games/api-docs](https://api-challenge.starsoft.games/api-docs/)
(Swagger UI). The spec's own `servers` entry points at a Heroku app that's
since been decommissioned (`"No such app"`), but the docs host itself proxies
to a live deployment — this project defaults to that:

- Base URL: `https://api-challenge.starsoft.games/api/v1`
- `GET /products?page&rows&sortBy&orderBy` (all four query params are
  required by the API; `rows` must be in `[5, 50]`) →
  `{ products: RawProduct[], count: number }`
- `RawProduct { id, name, description, image, price: string, createdAt }` —
  `price` comes back as a decimal string (e.g. `"182.00000000"`)
- There is **no** `GET /products/:id`. The NFT detail page,
  `generateStaticParams`, and `sitemap.ts` all need a single item, so they
  fetch the whole catalogue (walking `rows=50` pages, the API's own ceiling)
  and find the item locally — see `ProductsService.getAllProducts` /
  `getProductById` in `src/lib/api.ts`.

`src/lib/api.ts` normalizes every response into this app's internal contract
— `Product { id, name, description, image, price: number, createdAt }` and
`PaginatedResponse<Product> = { data, metadata: { page, limit, totalCount, pageCount } }`
— so nothing above that layer (components, Redux, React Query hooks) needs
to know about the real API's shape.

- **Server-side**: `page.tsx`, `nft/[id]/page.tsx`, and `sitemap.ts` call
  `ProductsService` directly from Server Components (no self-fetch over
  HTTP — an antipattern in Next.js Server Components — since this is now an
  external API, not a route this app itself serves).
- **Client-side**: `useProducts` / `useProduct` (React Query) call the same
  `ProductsService` functions, seeded via `initialData` from the
  server-rendered page so there's no loading flash for content already sent
  as HTML.
- **No crypto data from the API**: the real catalogue is fantasy items
  priced in plain decimals, not NFTs priced in ETH. The Figma design still
  shows an ETH price tag, so `PriceTag` defaults `cryptoSymbol="ETH"` /
  `cryptoIconPath="/icons/eth.svg"` itself rather than reading them off
  `Product` — a presentation choice, not API data.
- **Swapping in a different deployment**: set `NEXT_PUBLIC_API_BASE_URL`
  (see `.env.example`) to any server implementing the same
  `GET /products?page&rows&sortBy&orderBy` contract — no component, hook, or
  Redux code needs to change.

## Design

The Figma file itself requires interactive/authenticated access that isn't
fetchable headlessly, so the UI was built from reference screenshots of its
design-system panel and the shop/cart screens, plus the button-label glossary
from the brief. All tokens live in `src/styles/_variables.scss`.

**Palette** (exact hex values from Figma's "paleta" swatch):

| Swatch | Hex       | Used for                                                   |
| ------ | --------- | ---------------------------------------------------------- |
| 🟧     | `#FF8310` | Primary accent — active buy/checkout CTAs                  |
| ⬛     | `#232323` | Card / panel surface                                       |
| ⬛     | `#191A20` | Page background, inset image panels                        |
| ⬛     | `#393939` | Neutral controls (default buy button, load-more, steppers) |
| ⬜     | `#CCCCCC` | Muted text                                                 |
| ⬜     | `#FFFFFF` | Primary text                                               |

Font: **Poppins**. Border-radius: **8px**, applied uniformly to cards,
buttons, and panels.

Two behaviors came directly from Figma's `buy-bt` / `load-bt` component
swatches rather than being guessed: the buy button defaults to **gray**
("Comprar") and only turns **orange** once added ("Adicionado ao carrinho")
— the reverse of the more common orange-primary-CTA pattern — and the
load-more button carries a thin progress bar above it, filled by how much of
the catalogue has loaded so far. The cart drawer is titled "Mochila de
Compras" (not a generic "Carrinho") and each row includes a quantity
stepper, per the reference screenshots.

## Features implemented

- **NFT catalogue** (`/`) — server-rendered first page (ISR, 60s revalidate)
  seeded into React Query, then paginated client-side via "Carregar mais" /
  "Você já viu tudo" (`useInfiniteQuery`).
- **NFT detail page** (`/nft/[id]`) — statically generated for every NFT at
  build time (`generateStaticParams`), with per-page metadata (`generateMetadata`)
  for SEO/Open Graph.
- **Cart** ("Mochila de Compras") — Redux Toolkit slice (`src/features/cart`):
  add items, a per-row quantity stepper (increment/decrement, removing the
  item below quantity 1), checkout flow (Finalizar compra → Compra
  finalizada! → auto-clears), and client-side persistence to `localStorage`
  (hydrated post-mount to avoid SSR hydration mismatches).
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

| Area          | Choice                       | Why                                                                                                                                                                                 |
| ------------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework     | Next.js 16 (App Router)      | Required by the brief. SSR (product list, ISR) + SSG (`generateStaticParams` on NFT detail pages) + `next/image` + `next/dynamic` are all exercised directly.                       |
| Language      | TypeScript                   | Static typing across the Redux store, React Query hooks, and API contract — the "nice to have" in the brief.                                                                        |
| State         | Redux Toolkit                | Required by the brief; RTK's `createSlice` keeps the cart reducer/selectors small and immutable-by-default (Immer).                                                                 |
| Data fetching | TanStack React Query         | Required by the brief; `useInfiniteQuery` for pagination, `useQuery` (seeded via `initialData`) on the detail page so SSR content and the client cache agree with no refetch flash. |
| Styling       | SCSS Modules                 | Required (SASS); modules keep styles component-scoped, `src/styles/_variables.scss` / `_mixins.scss` centralise tokens and are `@use`d project-wide via `sassOptions.loadPaths`.    |
| Animation     | Framer Motion                | Required by the brief; used for hover/tap micro-interactions, list enter/exit, drawer and page transitions.                                                                         |
| Testing       | Jest + React Testing Library | Required by the brief; `next/jest` handles the SWC/SCSS-module wiring.                                                                                                              |

## Project structure

```
src/
  app/                # App Router: pages, layouts, templates
    nft/[id]/          # NFT detail page (SSG)
  components/          # Reusable UI components (one folder per component)
  features/cart/       # Redux slice + selectors
  hooks/                # React Query hooks (useProducts, useProduct)
  lib/                  # Store setup, API client (ProductsService)
  styles/               # SCSS variables & mixins
  types/                # Shared TypeScript types
```

## Testing

```bash
npm test
```

39 tests across the cart reducer/selectors (including the quantity stepper),
the API client (`ProductsService` — response normalization, query params,
the `rows` clamp, the fetch-all-and-find `getProductById` fallback, all
mocking `fetch`), and user-facing component behaviour (buy button state,
load-more's three states and progress bar, cart quantity/checkout flow, cart
badge count).

## Known limitations & possible future improvements

- **No `GET /products/:id` on the real API.** The NFT detail page,
  `generateStaticParams`, and the sitemap all fetch the full catalogue and
  find the item locally (see "Data fetching" above) — fine at this
  catalogue's size, but wouldn't scale to a much larger one without a real
  by-id endpoint.
- **Design fidelity covers the screens referenced** (shop grid, NFT card,
  cart drawer, and the finish-bt/buy-bt/load-bt component states) — pages
  outside that reference (if any exist in the full Figma file) weren't
  visually verified.
- **No persisted "purchase history."** Checkout resets the cart; a real
  backend would record orders server-side.
- **No i18n layer.** UI copy follows the brief's Portuguese button labels
  directly rather than going through a translation library, since the rest
  of the challenge brief is in English.
