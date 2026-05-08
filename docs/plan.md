# plan.md

## Project: Musician and Band Booking Marketplace

## Purpose of this document

This document defines the technical architecture, data model, module structure, API design, external services, and validation strategy for the platform. It is based exclusively on `requirements.md` and `behavioral_experience.md`.

No implementation should begin without a corresponding task in `tasks.md` that traces back to a user story in `requirements.md`.

---

# 1. Technology stack

## Decision rationale

The stack was chosen to maximize development speed, clear separation of concerns, and long-term maintainability for a marketplace of this type. All components are well-documented, open source, and compatible with the business requirements.

## Environment strategy

The stack is designed for **local-first development** with a clear migration path to free production hosting.

| Concern | Local (dev) | Production (free tier) |
|---------|-------------|----------------------|
| Database | SQLite (file-based, zero setup) | Supabase PostgreSQL (free tier) |
| File storage | Local filesystem (`/public/uploads`) | Supabase Storage (free tier) |
| Hosting | `npm run dev` (localhost:3000) | Vercel (free tier) |
| Auth | NextAuth.js + local DB | NextAuth.js + Supabase DB |
| Payments | Stripe test mode | Stripe live mode |

Migration from local to production requires only: changing `DATABASE_URL`, `STORAGE_PROVIDER`, and adding Supabase credentials. No code changes needed — Prisma handles the SQLite → PostgreSQL switch via provider change in `schema.prisma`.

## Selected stack

| Layer | Technology | Reason |
|-------|-----------|--------|
| Framework | Next.js 14 (React) + App Router | SSR/SSG for indexable profiles (US-SEO-001), API Routes replace separate backend, Vercel-native |
| Styling | Tailwind CSS | Rapid UI development, utility-first, responsive by default |
| Database (local) | SQLite via Prisma | Zero setup, file-based, perfect for local dev |
| Database (prod) | Supabase PostgreSQL | Free tier, Prisma compatible, same schema — just change provider |
| ORM | Prisma | Type-safe, works with SQLite and PostgreSQL, clean migrations |
| Authentication | NextAuth.js v4 | Session management, email/password credentials, extensible to OAuth |
| Payments | Stripe | PCI-compliant, one-time Payment Intents + Subscriptions |
| File storage (local) | Local filesystem (`public/uploads/`) | Zero setup, served by Next.js static assets |
| File storage (prod) | Supabase Storage | Free tier, S3-compatible, easy migration |
| File parsing | xlsx + csv-parse | Handles XLSX and CSV for repertoire bulk upload (US-MUS-010) |
| Hosting (prod) | Vercel | Free tier, Next.js native, auto-deploy from Git |

## Language rules (from CLAUDE.md)

- Internal code, database columns, API endpoints, variables: **English**
- All user-facing interface text: **Spanish**

---

# 2. Conceptual data model

## Core entities

### User
Represents any registered account. Role determines the initial account capabilities, but a user may have both booker and provider capabilities when a booker activates a provider profile from the same account.

```
user
  id              UUID, primary key
  email           String, unique
  password_hash   String
  role            Enum-like String: PROVIDER | BOOKER | BOTH
  created_at      DateTime
  updated_at      DateTime
```

### Provider profile
Belongs to a User with provider capability (`PROVIDER` or `BOTH`). A user has at most one profile.

```
provider_profile
  id              UUID, primary key
  user_id         UUID, foreign key → user
  stage_name      String (required)
  provider_type   String (required) — solo_artist | band | dj | mariachi | duo | choir | classical_ensemble | jazz_group | other
  provider_type_other String (nullable) — used when type = other
  description     String (required)
  base_location   String (required)
  image_url       String (nullable)
  min_duration    Int (1–10, required)
  max_duration    Int (1–10, required)
  hourly_price    Decimal (nullable)
  event_price     Decimal (nullable)
  status          Enum: DRAFT | PUBLISHED
  created_at      DateTime
  updated_at      DateTime
```

Constraint: at least one of `hourly_price` or `event_price` must be set before publication.

### Genre
Master list of music genres. Many-to-many with provider profiles.

```
genre
  id    UUID, primary key
  slug  String, unique — e.g. "rock", "mariachi", "salsa"
  name  String — Spanish display name
```

### Provider genre (join table)
```
provider_genre
  provider_profile_id  UUID, foreign key → provider_profile
  genre_id             UUID, foreign key → genre
  is_primary           Boolean, default false
```

### Event type
Master list of event types. Many-to-many with provider profiles.

```
event_type
  id    UUID, primary key
  slug  String, unique — e.g. "wedding", "birthday", "corporate"
  name  String — Spanish display name
```

### Provider event type (join table)
```
provider_event_type
  provider_profile_id  UUID, foreign key → provider_profile
  event_type_id        UUID, foreign key → event_type
```

### Repertoire song
Belongs to a provider profile. Can be added manually or via bulk upload.

```
repertoire_song
  id                  UUID, primary key
  provider_profile_id UUID, foreign key → provider_profile
  title               String (required)
  artist              String (nullable)
  created_at          DateTime
```

### Contact point
Protected. Belongs to a provider profile. Never exposed publicly.

```
contact_point
  id                  UUID, primary key
  provider_profile_id UUID, foreign key → provider_profile
  type                Enum: PHONE | EMAIL | OTHER
  value               String (encrypted at rest)
  label               String (nullable) — e.g. "WhatsApp", "Manager"
  created_at          DateTime
```

Note: The EMAIL type is automatically seeded from `user.email` on profile creation. Additional phone numbers are added manually.

### Contact unlock
Records that a booker has paid for access to a specific provider's contacts.

```
contact_unlock
  id                  UUID, primary key
  booker_user_id      UUID, foreign key → user
  provider_profile_id UUID, foreign key → provider_profile
  payment_intent_id   String — Stripe payment intent ID
  unlocked_at         DateTime
```

Unique constraint: (booker_user_id, provider_profile_id) — prevents double charges (BR-023, BR-024).

### Subscription
Records an active monthly subscription for a booker.

```
subscription
  id                    UUID, primary key
  user_id               UUID, foreign key → user
  stripe_subscription_id String
  status                Enum: ACTIVE | CANCELLED | EXPIRED | PAST_DUE
  current_period_start  DateTime
  current_period_end    DateTime
  created_at            DateTime
  updated_at            DateTime
```

### Saved provider (favorites)
```
saved_provider
  id                  UUID, primary key
  booker_user_id      UUID, foreign key → user
  provider_profile_id UUID, foreign key → provider_profile
  saved_at            DateTime
```

Unique constraint: (booker_user_id, provider_profile_id).

---

## Entity relationship summary

```
user 1──────────1 provider_profile
                      │
              ┌───────┼────────────┐────────────┐
              │       │            │            │
        genre (M:M)  event_type(M:M) repertoire_song  contact_point
                                               (protected)

user (BOOKER) ──── contact_unlock ──── provider_profile
user (BOOKER) ──── subscription
user (BOOKER) ──── saved_provider ──── provider_profile
```

---

# 3. Module and screen structure

## 3.1 Public area (no authentication required)

| Screen | Route | Description |
|--------|-------|-------------|
| Home / Search | `/` | Provider listing with filters. Entry point for bookers. |
| Provider detail | `/providers/[id]` | Full public profile. Contact details locked. |
| About / How it works | `/como-funciona` | Explains the platform and access model to new users. |
| Registration — Provider | `/registrarse/proveedor` | Account creation for musical providers. |
| Registration — Booker | `/registrarse/contratante` | Account creation for bookers. |
| Login | `/iniciar-sesion` | Shared login for both user types. |

If the user is already authenticated as a booker and visits `/registrarse/proveedor`, the screen must offer to create a provider profile using the current account data instead of creating a duplicate account.

## 3.2 Provider area (authenticated, provider capability)

| Screen | Route | Description |
|--------|-------|-------------|
| Provider dashboard | `/dashboard` | Profile completion status, quick access to sections. |
| Wizard — Step 1: Identity | `/wizard/identidad` | Stage name, type, description, location. |
| Wizard — Step 2: Categories | `/wizard/categorias` | Genres and event types. |
| Wizard — Step 3: Durations | `/wizard/duraciones` | Min and max booking duration. |
| Wizard — Step 4: Repertoire | `/wizard/repertorio` | Manual entry and bulk upload. |
| Wizard — Step 5: Prices | `/wizard/precios` | Hourly and/or event-based pricing. |
| Wizard — Step 6: Contacts | `/wizard/contactos` | Protected phone numbers, email summary. |
| Wizard — Step 7: Preview | `/wizard/preview` | Read-only profile preview before publishing. |
| Edit profile | `/perfil/editar` | Post-publication editing, same sections as wizard. |

## 3.3 Booker area (authenticated, booker capability)

| Screen | Route | Description |
|--------|-------|-------------|
| Booker dashboard | `/dashboard` | Saved providers, unlocked contacts, subscription status. |
| Unlocked contacts | `/contactos-desbloqueados` | History of previously unlocked contacts (US-MON-006). |
| Saved providers | `/guardados` | Favorites list (US-CON-010). |
| Subscription management | `/suscripcion` | View, activate, or cancel subscription. |

## 3.4 Shared flows (modal or overlay)

| Flow | Trigger | Description |
|------|---------|-------------|
| Contact reveal — one-time | Click "Desbloquear contacto" on profile | Payment flow via Stripe Checkout, 1 USD. |
| Contact reveal — subscription | Click "Suscribirse" on profile or dashboard | Stripe recurring subscription, 9.99 USD/month. |
| Access comparison modal | Triggered on contact reveal attempt | Shows both options side by side (US-MON-005). |

---

# 4. API structure

All endpoints are prefixed with `/api/v1`.

## Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user (provider or booker) |
| POST | `/auth/login` | Login and return session |
| POST | `/auth/logout` | Destroy session |
| GET | `/auth/me` | Return current authenticated user |

## Provider profiles

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/providers` | List published profiles with filters (genre, event_type, price_min, price_max) |
| GET | `/providers/:id` | Public profile data — never includes contact fields |
| POST | `/providers` | Create draft profile (authenticated provider-capable account) |
| POST | `/providers/start` | Create or return the current user's draft provider profile, including for existing booker accounts |
| PATCH | `/providers/:id` | Update profile fields (authenticated PROVIDER, own profile) |
| POST | `/providers/:id/publish` | Publish profile after validation (authenticated PROVIDER) |
| GET | `/providers/:id/contacts` | Return contact details — requires unlock or subscription check |

## Repertoire

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/providers/:id/repertoire` | List all songs for a provider |
| POST | `/providers/:id/repertoire` | Add a single song |
| DELETE | `/providers/:id/repertoire/:songId` | Remove a song |
| POST | `/providers/:id/repertoire/upload` | Bulk upload via CSV or XLSX |

## Contact access

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/payments/unlock` | Create Stripe payment intent for one-time unlock |
| POST | `/payments/unlock/confirm` | Confirm Stripe payment and record unlock |
| GET | `/unlocks` | List all unlocked contacts for authenticated booker |
| POST | `/subscriptions` | Create Stripe subscription |
| GET | `/subscriptions/status` | Check active subscription for authenticated user |
| POST | `/subscriptions/cancel` | Cancel active subscription |

## Saved providers

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/saved` | List saved providers for authenticated booker |
| POST | `/saved/:providerId` | Save a provider |
| DELETE | `/saved/:providerId` | Unsave a provider |

## Reference data (master lists)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/genres` | List all available genres |
| GET | `/event-types` | List all available event types |

---

# 5. External services

## 5.1 Stripe — Payments

Used for:
- One-time charge of 1 USD (contact unlock) via Payment Intents
- Monthly recurring subscription of 9.99 USD via Stripe Subscriptions
- Webhook integration to receive payment confirmation events

Key integration points:
- `stripe.paymentIntents.create` — one-time unlock
- `stripe.subscriptions.create` — monthly subscription
- Webhook endpoint: `/api/v1/webhooks/stripe` — handles `payment_intent.succeeded`, `customer.subscription.updated`, `customer.subscription.deleted`

Business rule enforcement via Stripe:
- Idempotency keys on payment intents prevent double charges (BR-023)
- Subscription status synced via webhooks (BR-025, BR-026)

## 5.2 Cloudinary — Image storage

Used for:
- Provider profile image upload and hosting (US-MUS-005)
- Images uploaded directly from the client using signed upload presets
- Transformation: auto-resize and optimize on delivery

## 5.3 xlsx + csv-parse — File parsing

Used for:
- Bulk repertoire upload (US-MUS-010)
- `xlsx` handles .xlsx files
- `csv-parse` handles .csv files
- Parsing occurs server-side; results returned to client for review before confirmation

---

# 6. Contact protection implementation strategy

This is a core business rule. Implementation must be enforced at multiple layers.

## Layer 1: Database

- `contact_point` table has no public-facing exposure.
- `GET /providers/:id` endpoint query explicitly excludes contact_point records.
- Prisma select statements must whitelist returned fields — never use `findUnique` without explicit field selection on provider profiles.

## Layer 2: API authorization

- `GET /providers/:id/contacts` checks:
  1. Is the requesting user authenticated?
  2. Does the user have an active subscription? → Return contacts.
  3. Does the user have an existing `contact_unlock` record for this provider? → Return contacts.
  4. Otherwise → Return 402 Payment Required with options payload.

## Layer 3: Frontend rendering

- The provider detail page (`/providers/[id]`) never receives contact data from the public profile endpoint.
- Contact data is only fetched from `/providers/:id/contacts` after authorization check.
- Contact fields are never included in Next.js `getStaticProps` or `getServerSideProps` for the public profile page.

## Layer 4: Contact detection in public text fields

Applied to: `description`, `stage_name`, and any future free-text public field.

Detection patterns:
- Phone: `/(\+?[\d\s\-\(\)]{7,15})/g`
- Email: `/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g`
- URL: `/(https?:\/\/[^\s]+|www\.[^\s]+)/g`
- Social handle: `/@[a-zA-Z0-9_.]+/g`

Detection runs:
- Server-side on `PATCH /providers/:id` before persisting changes
- Client-side on blur/change as a real-time warning (non-blocking until save)
- Returns a 400 error with a specific message if patterns are found

---

# 7. Visibility rules summary

| Data | Unauthenticated user | Authenticated booker (no payment) | Booker with unlock | Subscribed booker | Provider (own profile) |
|------|---------------------|-----------------------------------|--------------------|-------------------|------------------------|
| Stage name | ✅ | ✅ | ✅ | ✅ | ✅ |
| Description | ✅ | ✅ | ✅ | ✅ | ✅ |
| Genres | ✅ | ✅ | ✅ | ✅ | ✅ |
| Event types | ✅ | ✅ | ✅ | ✅ | ✅ |
| Location | ✅ | ✅ | ✅ | ✅ | ✅ |
| Durations | ✅ | ✅ | ✅ | ✅ | ✅ |
| Repertoire | ✅ | ✅ | ✅ | ✅ | ✅ |
| Prices | ✅ | ✅ | ✅ | ✅ | ✅ |
| Image | ✅ | ✅ | ✅ | ✅ | ✅ |
| Phone numbers | ❌ | ❌ | ✅ | ✅ | ✅ |
| Email | ❌ | ❌ | ✅ | ✅ | ✅ |
| Social handles | ❌ | ❌ | ✅ | ✅ | ✅ |

---

# 8. Monetization flow

## One-time unlock flow

```
Booker views provider profile
  → Clicks "Desbloquear contacto"
  → System checks: already unlocked? → Show contacts directly
  → System checks: active subscription? → Show contacts directly
  → Show access comparison modal (US-MON-005)
  → Booker selects "Pago único $1 USD"
  → Stripe Payment Intent created (server-side)
  → Booker confirms payment in Stripe Checkout
  → Webhook: payment_intent.succeeded
  → contact_unlock record created
  → Frontend re-fetches /providers/:id/contacts
  → Contact details displayed
```

## Subscription flow

```
Booker clicks "Suscribirse por $9.99 USD/mes"
  → Stripe Subscription created
  → Booker completes Stripe Checkout
  → Webhook: customer.subscription.updated (status: active)
  → subscription record created or updated
  → All provider profiles now show contacts for this booker
```

## Subscription expiry

```
Stripe webhook: customer.subscription.deleted or past_due
  → subscription.status updated to CANCELLED or PAST_DUE
  → Contact access reverted to locked state
  → Booker sees clear explanation on next visit
```

---

# 9. Profile publication validation

Before `POST /providers/:id/publish` succeeds, the API must verify:

- `stage_name` is not empty
- `provider_type` is set
- `description` is not empty and passes contact detection
- `base_location` is not empty
- At least one `provider_genre` record exists
- At least one `provider_event_type` record exists
- `min_duration` is set and between 1–10
- `max_duration` is set and between 1–10
- `min_duration` ≤ `max_duration`
- At least one of `hourly_price` or `event_price` is set
- At least one `contact_point` record exists

If any check fails, the API returns a 422 with a structured error listing each failing condition.

---

# 10. Wizard step structure

| Step | Title (Spanish) | Required fields | User story |
|------|----------------|-----------------|------------|
| 1 | Identidad artística | stage_name, provider_type, description, base_location | US-MUS-004 |
| 2 | Categorías | ≥1 genre, ≥1 event_type | US-MUS-006, US-MUS-007 |
| 3 | Duración de contratación | min_duration, max_duration | US-MUS-008 |
| 4 | Repertorio | (optional but recommended) | US-MUS-009, US-MUS-010 |
| 5 | Precios | hourly_price OR event_price | US-MUS-011, US-MUS-012 |
| 6 | Puntos de contacto | ≥1 phone number | US-MUS-013 |
| 7 | Vista previa y publicación | Review + publish action | US-MUS-015 |

---

# 11. Search and filter implementation

The `GET /providers` endpoint accepts the following query parameters:

| Parameter | Type | Description |
|-----------|------|-------------|
| `q` | String | Free-text search from the home search bar. Matches public provider fields: stage name, provider type, base location, description, genre names/slugs, and event type names/slugs. |
| `genre` | String (slug) | Filter by genre slug. Multiple values comma-separated. |
| `event_type` | String (slug) | Filter by event type slug. |
| `price_min` | Number | Minimum price filter (uses lowest of hourly_price or event_price). |
| `price_max` | Number | Maximum price filter. |
| `page` | Number | Page number for pagination. Default 1. |
| `limit` | Number | Results per page. Default 20. |

Response includes only published profiles. Contact data is never included in list responses. Quick search and advanced filters are combined with AND logic, while each quick-search field match is evaluated as an OR group.

The listing page shows a lightweight result-first layout. Advanced filters are collapsed by default behind a "Filtros" button and expand inline above the cards only when requested.

Local uploaded images are stored under `public/uploads/` and are served through a dynamic `/uploads/[...path]` route as well as the public static folder. This keeps uploaded profile images visible in production-style local runs after files are created on disk.

---

# 12. SEO strategy for public profiles

To fulfill US-SEO-001:

- Public profiles are rendered using Next.js `getServerSideProps` or `generateStaticParams` (ISR) to produce server-rendered HTML.
- Each profile page includes:
  - `<title>`: `{stage_name} — {provider_type} en {base_location} | Marketplace`
  - `<meta name="description">`: Derived from description field (first 160 characters).
  - Open Graph tags for social sharing.
- The `/providers` listing is also server-rendered for crawlability.
- Contact data is never present in server-rendered HTML (NFR-001, BR-021).

---

# 13. Pending decisions

| Decision | Options | Recommended | Status |
|----------|---------|-------------|--------|
| Hosting provider | Vercel + Railway, AWS, DigitalOcean | Vercel + Railway | Pending user confirmation |
| OAuth social login | Google, Facebook, none | None for MVP | Pending user confirmation |
| Email service | Resend, SendGrid, Postmark | Resend (simplest) | Pending user confirmation |
| Currency | USD only, MXN, multi-currency | USD for MVP (prices stored as-is) | Pending user confirmation |
| Booker registration requirement | Required to search, or only to pay | Only required to pay/save | Confirmed from behavioral_experience.md |

---

*Document created: 2026-05-07*
*Source: requirements.md + behavioral_experience.md*
*Status: confirmed — pending decisions noted above*
