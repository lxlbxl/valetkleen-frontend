# ValetKleen frontend

This repo is the full web UI for ValetKleen, a laundry and dry-cleaning pickup service in Metro
Atlanta. It covers the customer web app and the ops console. It is built with the same stack as
ValetKleen-Backend: **Next.js 14 (App Router), React 18, TypeScript, Tailwind 3 and Zod.** The
design is **Style D (Atelier in motion)**, with the **Style B hero** on the home page.

The UI runs on its own against a typed mock data layer. The backend developer connects it by
editing one file. See [docs/API_CONTRACT.md](docs/API_CONTRACT.md).

## Run it

```bash
npm ci
npm run dev          # http://localhost:3000
npm run typecheck && npm run lint && npm run build
```

Node 20 or later. Copy `.env.example` to `.env.local` when you connect the backend.

## Pages

### Customer (web app, installable as a PWA)

| Route | Screen |
|---|---|
| `/` | Home: Style B hero with ZIP check, process story, services, price list, Pass, CTA |
| `/check?zip=` | C2 Address covered, or C3 Waitlist |
| `/book` → `/book/pickup` → `/book/plan` → `/book/checkout` | C4–C7 booking (draft kept in sessionStorage) |
| `/book/confirmed?order=` | C8 Booking confirmed |
| `/orders/[id]` | C9 Tracking, C10 Weighed and charged, or C11 Delivered and rate (follows status) |
| `/orders/[id]/receipt` | Printable receipt |
| `/orders` | C12 Orders, reorder, report a problem, plan usage |
| `/plans` | Compare and change plan |
| `/account` | Contact, notifications, addresses, cards, referral code, data |
| `/sign-in`, `/sign-up`, `/forgot-password` | Customer auth |
| `/prices`, `/help`, `/terms`, `/privacy` | Full price list (114 items), FAQ and contact, legal placeholders |

### Ops console (`/ops`)

| Route | Screen |
|---|---|
| `/ops/sign-in` | A1 Sign in with password and authenticator code |
| `/ops` | A2 Today dashboard |
| `/ops/orders` | A3 Order board (zone filter, search) |
| `/ops/orders/[id]` | A4 Order detail (customer, internal partner and trips, actions) |
| `/ops/orders/[id]/handoff` | A6 Record a handoff (photo required, append-only log) |
| `/ops/orders/[id]/weigh-in` | A7 Weigh-in, final price, margin check, charge |
| `/ops/dispatch` | A5 Dispatch: pickups and returns, assign, suggest, on-the-way text, drivers |
| `/ops/partners` | A8 Partner directory |
| `/ops/zones` | A9 Zones, waitlist, launch gate, add ZIP, CSV export |
| `/ops/pricing` | A10 Price book, per-item prices, AI suggestion approval |
| `/ops/claims` | A11 Claims queue with photo evidence and decisions |
| `/ops/payouts` | A12 Payouts and per-order economics |

## Structure

```
src/
  app/
    (marketing)/page.tsx      home
    (app)/…                   customer pages (site nav + footer)
    (auth)/…                  customer sign-in, sign-up, reset
    ops/sign-in               staff sign-in
    ops/(console)/…           console pages (sidebar shell)
  components/
    ui/                       primitives (Button, Card, Kv, Timeline…) and controls (Counter, OptionGroup, Stars, PhotoInput)
    site/ home/ booking/ orders/ account/ auth/ ops/ check/
    motion.tsx                Style D scroll motion, driven by data attributes; respects reduced motion
  lib/
    api/index.ts              the data boundary (mock today)
    api/actions.ts            Server Actions wrapping it for client components
    api/mock-data.ts          seed data (planning examples, not client data)
    catalog-data.ts           114 priced items from the pricing spreadsheet
    pricing.ts                price book defaults and the booking estimate
    types.ts format.ts status.ts
  styles/
    app.css                   app screens, ported from the Style D mockups (CSS variables)
    home.css                  home page, scoped under .vk-home
    extras.css                responsive nav, states, phone fixes
public/                       logo, van, photos, item images, PWA icons
```

## Notes for the backend developer

- **Never charge at booking.** Checkout saves the card (SetupIntent). The charge happens at weigh-in (A7).
- **Partners stay hidden from customers.** Customer pages use `CUSTOMER_STATUS_LABEL` and never render `partnerId`.
- **Prices must come from config.** The frontend reads `getPriceBook()` and `getCatalog()`. Do not hardcode prices again.
- **Auth.** Replace the mock `signIn` with Auth.js. Guard `/ops` (admin or super_admin, with TOTP) and the customer pages in `middleware.ts`.
- **Uploads.** `PhotoInput` gives you `File[]`. Upload them to object storage with signed URLs and pass the keys.
- **Camera.** `next.config.mjs` sends `Permissions-Policy: camera=(self)` so handoff and weigh-in photos work in the installed PWA. Make sure no other header blocks the camera.
- `TODO(backend)` comments mark every place that needs wiring.

Testimonials, contact details and legal text are placeholders.
