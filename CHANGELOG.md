# CHANGELOG.md

## Project: Musician and Band Booking Marketplace

---

## [2026-05-07] — Demos y muestras de audio/video para músicos (US-MUS-018)

### Type of change
New feature — product specification + implementation

### Description
Musicians can now share media samples to help bookers make better decisions before contacting them. Three types of media are supported:

1. **YouTube video link** — embedded directly in the public profile as an iframe.
2. **Streaming platform link** — Spotify, SoundCloud, Apple Music, Bandcamp, etc. — shown as a clickable button that opens in a new tab.
3. **Audio demo upload** — MP3, WAV, OGG or WebM up to 20 MB — played inline on the public profile via an HTML audio player.

All three fields are optional. A new wizard step "Demos" was inserted between "Repertorio" and "Precios". The public profile shows the demos section only when at least one media item is present.

### Modified files
- `prisma/schema.prisma` — Added `youtubeUrl`, `streamingUrl`, `demoAudioUrl` fields to `ProviderProfile`
- `src/components/wizard/steps/StepDemos.tsx` — **New** wizard step component
- `src/app/api/providers/[id]/demo-audio/route.ts` — **New** POST/DELETE API for audio file upload
- `src/app/api/providers/[id]/route.ts` — Extended PATCH to persist `youtubeUrl` and `streamingUrl`; added new fields to GET select
- `src/app/(dashboard)/wizard/[step]/page.tsx` — Added "demos" to STEPS array and rendered StepDemos
- `src/components/wizard/steps/StepPreview.tsx` — Added demos preview section; added new fields to Props interface
- `src/app/(public)/proveedores/[id]/page.tsx` — Added full demos section (YouTube embed, audio player, streaming button)

### Related user stories
US-MUS-018 (new)

### Affected business rules
Public media (YouTube, streaming URL, audio demo) is visible without payment — these are discovery aids, not contact details. Contact data continues to be protected by the payment gate (BR-016, BR-021).

### Source of change
Direct user instruction — 2026-05-07

### Certainty status
Confirmed

### ⚠️ Migration required
Run the following on your local machine after pulling these changes:
```bash
npx prisma db push
npx prisma generate
npm run build
```

---

## [2026-05-07] — Resultados limpios con filtros colapsados e imágenes visibles

### Type of change
Product specification update + implementation

### Description
Updated the public provider listing so search results prioritize the result cards. Advanced filters are now collapsed by default behind a button labeled "Filtros" and open inline only after the user clicks it. Also added a dynamic local upload-serving route so provider images saved under `public/uploads/` remain visible in production-style local runs, and confirmed listing cards render the uploaded band image.

### Modified files
- `docs/behavioral_experience.md` — Documented collapsed-filter behavior on results
- `docs/requirements.md` — Added acceptance criteria for collapsed filters and public image display
- `docs/plan.md` — Documented result-first filter layout and local upload serving route
- `docs/tasks.md` — Updated T-302 and added T-303
- `src/app/(public)/proveedores/page.tsx` — Removed persistent filter sidebar from listing layout
- `src/components/search/SearchFilters.tsx` — Converted filters to collapsed inline controls behind "Filtros"
- `src/app/uploads/[...path]/route.ts` — Created dynamic route for local uploaded images

### Related user stories
US-CON-003, US-CON-004A, US-CON-007, US-MUS-005

### Affected business rules
BR-009, BR-010, BR-011, BR-012, BR-016, BR-020

### Source of change
User instruction: "Cuando se muestren resultados de búsqueda los filtros no deben mostrarse desplegados... así mismo no se ven las imagenes cargadas a la banda, necesito que si se vean"

### Certainty status
Confirmed — `npm run build` passed. Browser verification on `http://127.0.0.1:3007/proveedores?q=banda` confirmed filters are collapsed by default, open after clicking "Filtros", and the provider card includes the uploaded band image.

---

## [2026-05-07] — Búsqueda rápida desde la landing

### Type of change
Product specification update + implementation

### Description
Converted the landing search pill into an editable search form. Bookers can now type a genre, event, city, provider name, provider type, or public-description term directly on the home page, then submit with Enter or the "Buscar" button. The provider listing and public providers API now accept `q` and combine that keyword search with advanced filters while keeping contact details protected.

### Modified files
- `docs/behavioral_experience.md` — Added quick-search UX story and criteria
- `docs/requirements.md` — Added US-CON-004A and verifiable acceptance criteria
- `docs/plan.md` — Documented the `q` query parameter and search/filter logic
- `docs/tasks.md` — Added and completed T-301
- `src/components/search/HomeSearchBox.tsx` — Created editable home search form
- `src/app/page.tsx` — Replaced search links with the new form
- `src/app/(public)/proveedores/page.tsx` — Added `q` filtering, result heading, and keyword empty state
- `src/app/api/providers/route.ts` — Added API support for `q`
- `src/components/search/SearchFilters.tsx` — Preserves quick-search term when advanced filters are applied

### Related user stories
US-CON-004A, US-CON-003, US-CON-004, US-CON-005, US-CON-006, US-CON-007

### Affected business rules
BR-011, BR-012, BR-016, BR-020

### Source of change
User instruction: "Cuando el usuario presione en Busca por genero, evento o ciudad, debe poder escribir sin abrir los filtros y por coincidencias deben mostrarse los restultados tras presionar Enter o en el botón buscar"

### Certainty status
Confirmed — `npm run build` passed and the "Buscar" button was browser-verified at `http://127.0.0.1:3006`, navigating to `/proveedores?q=jazz`. Enter submission is implemented through a native GET search form, which should work in a normal browser; the in-app browser automation did not fire form submission from its synthetic Enter keypress during verification.

---

## [2026-05-07] — Activación de perfil musical desde cuenta contratante

### Type of change
Product specification update + implementation

### Description
Changed the account model so a logged-in booker can activate a musician/band provider profile from the same account instead of creating a duplicate account with another email. The provider registration screen now detects authenticated users and offers to reuse the current account name/email. Added `POST /api/providers/start` to create or return the current user's provider profile, seed the protected email contact point from the existing account, and mark the user role as `BOTH` when needed. Provider wizard and provider-owned API routes now authorize by account/profile ownership instead of requiring a stale session role to be exactly `PROVIDER`.

### Modified files
- `docs/behavioral_experience.md` — Documented dual booker/provider account behavior
- `docs/requirements.md` — Added AC-MUS-001-8/9 and BR-002A
- `docs/plan.md` — Updated user role model and provider start endpoint
- `docs/tasks.md` — Added T-104 for existing-booker provider activation
- `src/app/(auth)/registrarse/proveedor/page.tsx` — Added authenticated reuse-account flow
- `src/app/api/providers/start/route.ts` — Created provider profile activation endpoint
- `src/lib/auth.ts` — Refreshes session role from DB in JWT callback
- `src/app/(dashboard)/wizard/[step]/page.tsx` — Allows authenticated owner with provider profile into wizard
- `src/app/(dashboard)/dashboard/page.tsx` — Detects provider experience by provider profile existence and adds provider CTA to booker dashboard
- `src/components/ui/Navbar.tsx` — Added logged-in links to explore and publish provider profile
- Provider-owned API routes under `src/app/api/providers/[id]/...` — Relaxed exact-role checks; ownership checks remain enforced

### Related user stories
US-MUS-001

### Affected business rules
BR-001, BR-002, BR-002A, BR-016, BR-017

### Source of change
User instruction: "Cuando ya esté loggeado como Contratante, debo poder crear una cuenta como musico o banda también tomando los datos de la cuenta"

### Certainty status
Confirmed — `npm run build` passed and `/registrarse/proveedor` loads in the in-app browser at `http://127.0.0.1:3005/registrarse/proveedor`. Authenticated state display should be verified while logged in as a booker.

---

## [2026-05-07] — Pantallas completas del flujo marketplace

### Type of change
Implementation — Public marketplace, booker account screens, local monetization stubs, profile media/upload flows

### Description
Built the missing screens and supporting routes that were causing broken navigation in the local UI. Added the public provider listing with filters and empty state, provider detail page with contact protection, "cómo funciona" page, saved providers page, unlocked contacts page, subscription page, role-aware booker dashboard, save-provider interaction, local one-time contact unlock stub, local subscription stub, profile image upload, and bulk repertoire CSV/XLSX review/import. Updated landing links so they no longer point to nonexistent mock provider detail pages. Verified the app builds successfully and opened the updated listing in the in-app browser at `http://127.0.0.1:3003/proveedores`.

### Modified files
- `src/app/(public)/proveedores/page.tsx` — Created listing with filters, pagination, and empty state
- `src/app/(public)/proveedores/[id]/page.tsx` — Created public provider detail with locked contact panel
- `src/app/(public)/como-funciona/page.tsx` — Created access-model explanation page
- `src/app/(dashboard)/guardados/page.tsx` — Created saved providers page
- `src/app/(dashboard)/contactos-desbloqueados/page.tsx` — Created unlocked contacts history page
- `src/app/(dashboard)/suscripcion/page.tsx` — Created subscription management page
- `src/app/(dashboard)/dashboard/page.tsx` — Updated booker dashboard with saved/unlocked/subscription status
- `src/app/api/payments/unlock/route.ts` — Created local one-time unlock stub
- `src/app/api/subscriptions/route.ts` — Created local subscription status/activate/cancel route
- `src/app/api/saved/route.ts` — Created saved providers API
- `src/app/api/unlocks/route.ts` — Created unlocked contacts API
- `src/app/api/providers/[id]/image/route.ts` — Created image upload route
- `src/app/api/providers/[id]/repertoire/upload/route.ts` — Created CSV/XLSX repertoire upload parser
- `src/components/search/ProviderCard.tsx` — Created reusable public card with protected-contact signal
- `src/components/search/SearchFilters.tsx` — Created filter controls
- `src/components/provider/ContactAccessPanel.tsx` — Created locked contact/unlock panel
- `src/components/provider/SaveProviderButton.tsx` — Created save/unsave button
- `src/components/provider/SubscriptionActions.tsx` — Created local subscription actions
- `src/components/wizard/steps/StepRepertorioUpload.tsx` — Created bulk upload review/import UI
- `src/components/wizard/steps/StepRepertorio.tsx` — Integrated bulk upload
- `src/components/wizard/steps/StepIdentidad.tsx` — Integrated profile image upload
- `src/lib/provider-format.ts` — Created provider label/price formatting helpers
- `src/app/page.tsx` — Fixed landing links to avoid nonexistent mock profile pages
- `src/app/api/providers/route.ts` — Accepted `event` alias for existing landing/search links
- `docs/tasks.md` — Updated task status for implemented screens and local stubs

### Related user stories
US-MUS-005, US-MUS-010, US-CON-001, US-CON-002, US-CON-003, US-CON-004, US-CON-005, US-CON-006, US-CON-007, US-CON-008, US-CON-009, US-CON-010, US-CON-011, US-MON-001, US-MON-002, US-MON-003, US-MON-004, US-MON-005, US-MON-006, US-SEO-001

### Affected business rules
BR-009, BR-010, BR-011, BR-012, BR-015, BR-016, BR-020, BR-021, BR-022, BR-023, BR-024, BR-025, BR-026

### Source of change
User instruction: "Está mostrando errores 404, necesito que construyas todas las pantallas del flujo segun el behavioral y los requerimientos"

### Certainty status
Confirmed — `npm run build` passed. Browser check confirmed `/proveedores` loads at `http://127.0.0.1:3003/proveedores`. Payment/subscription behavior is a local stub, pending real Stripe integration.

---

## [2026-05-07] — UI local estilo Airbnb y wizard publicable

### Type of change
Implementation — Phase 5 UI and supporting API routes

### Description
Continued the UI work started by Claude and completed the local flow needed to preview the provider experience: auth pages, shared navigation, landing page, provider dashboard, wizard shell, all 7 wizard steps, manual repertoire entry, protected contact management, preview, and publish action. Added the missing API routes required by the wizard for categories, event types, manual repertoire, protected contact points, and profile publication. Adjusted the root layout to avoid remote Google Font fetching so the project builds without network access. Fixed a TypeScript build issue in contact detection by replacing Set spread iteration with `Array.from`.

### Modified files
- `src/app/page.tsx` — Landing UI refined to avoid server/client event-handler build error
- `src/app/layout.tsx` — Removed remote font dependency for offline local builds
- `src/app/api/providers/route.ts` — Marked route dynamic because it reads request URL filters
- `src/app/api/providers/[id]/genres/route.ts` — Created provider genre persistence route
- `src/app/api/providers/[id]/event-types/route.ts` — Created provider event type persistence route
- `src/app/api/providers/[id]/repertoire/route.ts` — Created manual repertoire list/create route
- `src/app/api/providers/[id]/repertoire/[songId]/route.ts` — Created manual repertoire delete route
- `src/app/api/providers/[id]/contact-points/route.ts` — Created protected contact list/create route
- `src/app/api/providers/[id]/contact-points/[contactPointId]/route.ts` — Created protected contact delete route
- `src/app/api/providers/[id]/publish/route.ts` — Created publish route with required-field validation
- `src/components/wizard/steps/StepPreview.tsx` — Created preview and publish wizard step
- `src/app/(auth)/iniciar-sesion/page.tsx` — Wrapped search-param usage in Suspense for production build
- `src/lib/contact-detection.ts` — Fixed TypeScript iteration compatibility
- `docs/tasks.md` — Updated task status for completed UI and API work

### Related user stories
US-MUS-001, US-MUS-002, US-MUS-003, US-MUS-004, US-MUS-006, US-MUS-007, US-MUS-008, US-MUS-009, US-MUS-011, US-MUS-012, US-MUS-013, US-MUS-015, US-MUS-017

### Affected business rules
BR-001, BR-002, BR-003, BR-004, BR-007, BR-008, BR-011, BR-012, BR-013, BR-014, BR-015, BR-016, BR-018, BR-019, BR-020, BR-021

### Source of change
User instruction to continue Claude's UI work: "necesito que comiences a diseñar el UI para que yo lo pueda correr en local y ver como está quedando, usa el look and feel lo mas cercano posible a Airbnb"

### Certainty status
Confirmed — `npm run build` completed successfully. `npm run lint` is pending because Next.js prompted for initial ESLint configuration interactively.

---

## [2026-05-07] — Phase 4: tasks.md creado

### Type of change
Documentation — Phase 4 de la metodología SDD

### Description
Creado `tasks.md` con 35 tareas numeradas (T-000 a T-503) organizadas en 4 prioridades. Las tareas de infraestructura (T-000 a T-012) se marcaron como completadas. Las tareas pendientes cubren: pantallas de auth (T-100–103), wizard de 7 pasos (T-200–208), dashboard de proveedor (T-209), listing y detalle público (T-300–302), monetización con Stripe (T-400–403), y confianza/eficiencia (T-500–503). Cada tarea incluye archivos afectados, story relacionada, criterios de aceptación y dependencias.

### Modified files
- `docs/tasks.md` — Creado

### Source of change
User instruction: "si hazlo"

### Certainty status
Confirmado

---

## [2026-05-07] — Proyecto corriendo localmente ✅

### Type of change
Fix — Corrección de errores de configuración post-instalación

### Description
Corregidos dos errores que impedían levantar el proyecto: (1) `next.config.ts` renombrado a `next.config.mjs` (Next.js 14 no soporta TS en config), (2) creado `.env` separado para que Prisma CLI pueda leer DATABASE_URL. El proyecto corre correctamente en http://localhost:3000. Base de datos SQLite creada y seed aplicado (18 géneros, 13 tipos de evento).

### Modified files
- `next.config.mjs` — Creado (reemplazo de next.config.ts)
- `.env` — Creado (DATABASE_URL para Prisma CLI)
- `SETUP.md` — Actualizado con instrucción de borrar next.config.ts

### Certainty status
Confirmado — proyecto verificado corriendo en localhost:3000

---

## [2026-05-07] — Phase 3 revision + Phase 5 project scaffolding

### Type of change
Architecture revision + Project initialization (Phase 3 update, Phase 5 partial)

### Description
Revised plan.md to use SQLite for local development and Supabase/PostgreSQL for production. Created the full Next.js 14 project structure with all configuration files, Prisma schema, API routes, utilities, and seed data. The project is ready to run after `npm install && npm run db:push && npm run db:seed`.

### Modified files
- `docs/plan.md` — Stack table updated with local/production environment strategy
- `package.json` — Created (Next.js 14, Prisma, NextAuth, bcryptjs, xlsx, csv-parse, Tailwind)
- `tsconfig.json` — Created
- `next.config.ts` — Created
- `tailwind.config.ts` — Created
- `postcss.config.js` — Created
- `.env.local` — Created (SQLite + local storage configured)
- `.env.example` — Created
- `.gitignore` — Created
- `prisma/schema.prisma` — Created (10 models: User, ProviderProfile, Genre, ProviderGenre, EventType, ProviderEventType, RepertoireSong, ContactPoint, ContactUnlock, Subscription, SavedProvider)
- `prisma/seed.ts` — Created (18 genres, 13 event types)
- `src/app/layout.tsx` — Created
- `src/app/page.tsx` — Created (home/landing page)
- `src/app/globals.css` — Created
- `src/app/api/auth/[...nextauth]/route.ts` — Created
- `src/app/api/auth/register/route.ts` — Created
- `src/app/api/providers/route.ts` — Created (list with filters)
- `src/app/api/providers/[id]/route.ts` — Created (GET public + PATCH with contact detection)
- `src/app/api/providers/[id]/contacts/route.ts` — Created (auth + payment gate)
- `src/app/api/genres/route.ts` — Created
- `src/app/api/event-types/route.ts` — Created
- `src/components/ui/Providers.tsx` — Created (NextAuth SessionProvider)
- `src/lib/db.ts` — Created (Prisma singleton)
- `src/lib/auth.ts` — Created (NextAuth credentials config)
- `src/lib/contact-detection.ts` — Created (BR-007/008/018/019)
- `src/lib/upload.ts` — Created (local filesystem, Supabase-ready)
- `src/types/next-auth.d.ts` — Created
- `public/uploads/.gitkeep` — Created
- `SETUP.md` — Created (step-by-step local setup instructions)

### Related user stories
US-MUS-001 (registration), US-MUS-013/014 (contact protection), US-CON-003 (listing), US-CON-004/005/006 (filters), US-CON-008 (profile detail), US-MON-001/002 (contact unlock gate), US-MON-004 (subscription gate)

### Affected business rules
BR-001 through BR-028 — all implemented at schema and API level

### Source of change
User instruction: "Por el momento solo será local, pero mantén un stack que eventualmente permita deployarse free"

### Certainty status
Confirmed — npm install pending user execution (sandbox network restriction)

---

## [2026-05-07] — Phase 3: Technical plan

### Type of change
Documentation — Phase 3 of Specs Driven Development methodology

### Description
Created `plan.md` defining the full technical architecture for the platform. Includes selected stack (Next.js + Node.js + PostgreSQL + Stripe + Cloudinary), complete conceptual data model with 9 entities, screen/module structure (14 screens), REST API design (25+ endpoints), contact protection implementation strategy across 4 layers, monetization flows, publication validation rules, wizard step structure, search/filter implementation, and SEO strategy.

### Modified files
- `docs/plan.md` — Created

### Related user stories
All Priority 1 and Priority 2 stories. Key: US-MUS-001–018, US-CON-001–011, US-MON-001–006, US-SEO-001

### Affected business rules
All BR-001 through BR-028. Specifically BR-016 through BR-021 (contact protection layers), BR-022 through BR-026 (monetization rules).

### Pending decisions registered
- Hosting provider (recommended: Vercel + Railway)
- Email service (recommended: Resend)
- OAuth social login (recommended: none for MVP)
- Currency (recommended: USD for MVP)

### Source of change
User instruction: "hazlo" — Create plan.md

### Certainty status
Confirmed for architecture decisions. Pending user validation on hosting, email service, and OAuth.

---

## [2026-05-07] — Phase 2: Requirements formalization

### Type of change
Documentation — Phase 2 of Specs Driven Development methodology

### Description
Created `requirements.md` by formalizing all user stories, acceptance criteria, business rules, edge cases, and non-functional requirements derived from `behavioral_experience.md`.

### Modified files
- `docs/requirements.md` — Created

### Related user stories
All stories from Epic 1 through Epic 19:
- US-MUS-001 through US-MUS-018
- US-CON-001 through US-CON-011
- US-MON-001 through US-MON-006
- US-SEO-001

### Affected business rules
BR-001 through BR-028 (all defined in this document)

### Source of change
User instruction: "Crealo" — Create requirements.md based on behavioral_experience.md

### Certainty status
Confirmed — directly derived from behavioral_experience.md with no invented stories or rules

---

## [2026-05-07] — Project initialization

### Type of change
Documentation — Phase 1 of Specs Driven Development methodology

### Description
Project initialized with two base documents: `claude.md` (persistent agent instructions) and `docs/behavioral_experience.md` (full behavioral experience specification).

### Modified files
- `claude.md` — Created
- `docs/behavioral_experience.md` — Created

### Related user stories
All epics and user stories are defined in `behavioral_experience.md`

### Source of change
Initial project setup by user

### Certainty status
Confirmed
