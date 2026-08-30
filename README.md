# Olbos Event

A premium event management and digital invitation platform — weddings, birthdays,
conferences, churches, graduations, and more. Built with Next.js 15, React 19,
TypeScript, Tailwind v4, shadcn/ui, Prisma, and Postgres.

This repository is **Phase 1** of the product: a real, fully-working vertical
slice (auth → create event → build invitation → publish → guest RSVP → guest
management → QR check-in → analytics → billing → admin), not a mockup. Every
feature listed as "done" below is wired to a real database and, where
applicable, real third-party services — see [What's not built yet](#whats-not-built-yet-roadmap)
for what's intentionally deferred.

## Tech stack

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Framer Motion, React Hook Form, Zod, TanStack Query
- **Backend:** Next.js Route Handlers, Prisma ORM 7 (driver adapters), PostgreSQL
- **Auth:** Better Auth (email/password + Google OAuth; Apple gated behind config)
- **Storage:** S3-compatible object storage (MinIO locally, AWS S3 or compatible in prod)
- **Cache / rate limiting:** Redis
- **Payments:** Stripe (Checkout + webhooks)
- **Email:** Resend
- **QR codes:** `qrcode` (generation) + `@zxing/browser` (camera scanning)
- **Maps:** Google Maps embed (no API key required for the basic embed)

## What's built (Phase 1)

- Luxury design system (cream / champagne gold / rose gold / emerald / black), light & dark mode
- Marketing landing page (hero, templates, pricing, testimonials, FAQ, contact form)
- Auth: email/password + Google OAuth sign up/login
- Event CRUD: create, edit, publish/unpublish, duplicate, delete; public/private/password-protected visibility
- Invitation builder with **5 templates** (Luxury Blush, Modern Editorial, Floral Romance, Minimal Emerald, Navy Elegance) and a live preview pane
- Envelope-opening intro animation (tap-to-reveal, toggleable per invitation) and 4 animated background effects (sparkles, floating petals, snowfall, golden particles) selectable independently of template
- Public invitation page with countdown timer, schedule, story timeline, gallery, venue map, dress code, password gate
- QR code + share buttons (WhatsApp/email/copy link) for the invitation link
- RSVP system (accept/decline/maybe, plus-ones, meal preference, dietary restrictions, transportation/hotel, message) with email confirmation
- Guest management (manual add, CSV import, tagging/groups, per-guest QR)
- QR check-in system (camera scanner + manual fallback + live attendance count)
- Basic analytics per event (views, RSVP rate, QR scans, check-ins, views-over-time chart)
- Stripe billing (Checkout sessions + webhook-driven subscription sync)
- Basic admin dashboard (users, events, payments — admin-role gated)
- Vitest unit tests + one Playwright end-to-end smoke test (signup → create event → publish → guest RSVP)

## Getting started

### 1. Prerequisites

- Node.js 22+
- pnpm (`corepack enable pnpm` if you don't have it)
- Docker (for local Postgres, Redis, and MinIO)

### 2. Install and configure

```bash
pnpm install
cp .env.example .env
```

Fill in `.env`:
- `BETTER_AUTH_SECRET` — generate with `openssl rand -base64 32`
- `QR_SIGNING_SECRET` — generate with `openssl rand -hex 32`
- Everything else can stay at its default for local development.

### 3. Start local infrastructure

```bash
docker compose up -d
```

This starts Postgres (port `5433` — `5432` is often already taken by a local
install), Redis (`6379`), and MinIO (`9000`/`9001`, with the `olbosevents-media`
bucket created automatically).

### 4. Run migrations and start the app

```bash
pnpm exec prisma migrate dev
pnpm dev
```

Open [http://localhost:3002](http://localhost:3002).

### 5. Run tests

```bash
pnpm test          # Vitest unit tests
pnpm test:e2e       # Playwright smoke test (needs the app running + local infra up)
pnpm lint
pnpm exec tsc --noEmit
```

## Environment variables

See `.env.example` for the full list with comments. Nothing beyond
`DATABASE_URL`, `REDIS_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, and
`QR_SIGNING_SECRET` is required to run the app locally — everything else
(Google OAuth, Stripe, Resend, S3, Google Maps) degrades gracefully when unset:
the relevant feature returns a clear "not configured" error instead of
crashing, so you can develop against the rest of the app without every
credential in hand.

## Deployment

### Docker

```bash
docker build -t olbosevents .
docker run -p 3000:3000 --env-file .env.production olbosevents
```

The `Dockerfile` uses Next.js's `output: "standalone"` build for a minimal
runtime image. You still need a real Postgres, Redis, and S3-compatible bucket
in production — `docker-compose.yml` is for local development only.

### Vercel

The app deploys to Vercel as a standard Next.js app. Set all the environment
variables from `.env.example` in the Vercel project settings, point
`DATABASE_URL` at a managed Postgres instance (Neon, RDS, Supabase, etc.), and
`REDIS_URL` at a managed Redis (Upstash, ElastiCache, etc.). Run
`prisma migrate deploy` against production as part of your deploy step.

### Stripe webhook

Point a Stripe webhook endpoint at `/api/webhooks/stripe` for
`checkout.session.completed`, `customer.subscription.updated`, and
`customer.subscription.deleted`, and set `STRIPE_WEBHOOK_SECRET` accordingly.

## What's not built yet (roadmap)

Deliberately deferred from this Phase 1 pass — flagged here rather than
silently missing:

- Guest reminder emails/SMS, Twilio SMS confirmations
- PayPal
- Apple Sign-In (needs a paid Apple Developer account — code path exists, gated behind config), Apple/Outlook calendar export
- The remaining ~45 templates beyond the 5 shipped
- Drag-and-drop invitation builder (current builder is form-based, not drag-and-drop)
- Vendor marketplace UI (schema exists, no UI)
- White-label / custom domains
- Full audit log UI (schema exists, not surfaced)
- AI features (invitation writer, seating, budget planner, etc.)
- Gift registry integration (a registry URL field exists; no dedicated registry flow)
- Full Playwright E2E coverage (one smoke test covers the core vertical slice today)
