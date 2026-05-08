# tasks.md

## Project: Musician and Band Booking Marketplace

## Purpose of this document

This document breaks down `plan.md` into small, sequential, and verifiable implementation tasks. Each task is linked to a user story in `requirements.md` and can be executed independently by any agent.

A task is only complete when:
- It fulfills the acceptance criteria of its related user story
- It does not break visibility or monetization rules
- It is documented in `CHANGELOG.md`
- It is reflected in `HANDOFF.md`

---

## Status legend

| Status | Meaning |
|--------|---------|
| ✅ Done | Complete, tested, documented |
| 🔄 In progress | Being worked on |
| ⬜ Pending | Not started |
| 🔒 Blocked | Depends on another task |

---

## Already completed (infrastructure)

| ID | Task | Story | Status |
|----|------|-------|--------|
| T-000 | Project scaffolding (Next.js + Tailwind + Prisma) | — | ✅ Done |
| T-001 | Prisma schema with all 10 entities | — | ✅ Done |
| T-002 | SQLite database created and seeded (18 genres, 13 event types) | — | ✅ Done |
| T-003 | NextAuth.js credentials provider configured | US-MUS-001 | ✅ Done |
| T-004 | `POST /api/auth/register` — provider and booker registration | US-MUS-001 | ✅ Done |
| T-005 | `GET /api/providers` — public listing with filters | US-CON-003/004/005/006 | ✅ Done |
| T-006 | `GET /api/providers/[id]` — public profile (no contacts) | US-CON-008 | ✅ Done |
| T-007 | `PATCH /api/providers/[id]` — profile update with contact detection | US-MUS-004/014 | ✅ Done |
| T-008 | `GET /api/providers/[id]/contacts` — contact gate (subscription/unlock check) | US-MON-001/002/004 | ✅ Done |
| T-009 | `GET /api/genres` and `GET /api/event-types` — master lists | US-MUS-006/007 | ✅ Done |
| T-010 | Contact detection utility (`src/lib/contact-detection.ts`) | US-MUS-017 | ✅ Done |
| T-011 | Local file upload utility (`src/lib/upload.ts`) | US-MUS-005 | ✅ Done |
| T-012 | Landing page (`src/app/page.tsx`) | — | ✅ Done |

---

# Priority 1 — Marketplace functional foundation

---

## T-100 — Registration page: provider

**Status:** ✅ Done — build verified on 2026-05-07.

**Objective:** Create the registration form for musical providers.

**Affected files:**
- `src/app/(auth)/registrarse/proveedor/page.tsx` — create
- `src/components/ui/AuthForm.tsx` — create (reusable form wrapper)

**Related story:** US-MUS-001

**Acceptance criteria:**
- AC-MUS-001-1: Form clearly identifies it is for a musical provider account.
- AC-MUS-001-2: Fields: full name, email, password.
- AC-MUS-001-7: Password minimum 8 characters with inline validation.
- AC-MUS-001-6: If email already exists, show specific error (not generic).
- AC-MUS-001-4: After successful registration, user is redirected to the wizard.
- AC-MUS-001-5: Wizard redirect happens automatically — user does not search for next step.

**Completion criteria:**
- Form submits to `POST /api/auth/register` with `role: "PROVIDER"`.
- On success: auto-login via NextAuth + redirect to `/wizard/identidad`.
- On error: inline message in Spanish, no page reload.
- All labels and messages in Spanish.

**Dependencies:** T-004 (API already done), T-200 (wizard step 1 — can mock redirect)

---

## T-101 — Registration page: booker

**Status:** ✅ Done — build verified on 2026-05-07.

**Objective:** Create the registration form for bookers.

**Affected files:**
- `src/app/(auth)/registrarse/contratante/page.tsx` — create

**Related story:** US-CON (booker registration)

**Acceptance criteria:**
- Form clearly identifies it is for a booker/client account.
- Fields: full name, email, password.
- Same validations as T-100.
- After registration: redirect to `/proveedores` (the listing).

**Completion criteria:**
- Submits to `POST /api/auth/register` with `role: "BOOKER"`.
- On success: auto-login + redirect to `/proveedores`.
- All text in Spanish.

**Dependencies:** T-004

---

## T-102 — Login page

**Status:** ✅ Done — build verified on 2026-05-07.

**Objective:** Create the shared login page for both user types.

**Affected files:**
- `src/app/(auth)/iniciar-sesion/page.tsx` — create

**Related story:** US-MUS-001, US-CON

**Acceptance criteria:**
- Fields: email and password.
- On success: redirect based on role — PROVIDER to `/dashboard`, BOOKER to `/proveedores`.
- On error: specific message in Spanish (not "CredentialsSignin").
- Link to registration for each role.

**Completion criteria:**
- Uses `signIn("credentials", ...)` from NextAuth.
- Error messages translated to Spanish.
- Role-based redirect works.

**Dependencies:** T-003

---

## T-103 — Shared navigation component

**Status:** ✅ Done — build verified on 2026-05-07.

**Objective:** Create a reusable top navigation bar for all pages.

**Affected files:**
- `src/components/ui/Navbar.tsx` — create
- `src/app/layout.tsx` — update to include Navbar

**Related story:** General UX

**Acceptance criteria:**
- Shows platform name/logo.
- Unauthenticated: shows "Iniciar sesión" + "Buscar músicos" buttons.
- Authenticated PROVIDER: shows "Mi perfil" + "Cerrar sesión".
- Authenticated BOOKER: shows "Explorar" + "Guardados" + "Cerrar sesión".
- Mobile responsive.

**Completion criteria:**
- Uses `useSession()` from NextAuth to conditionally render links.
- All text in Spanish.

**Dependencies:** T-102

---

## T-104 — Activate provider profile from existing booker account

**Status:** ✅ Done — build verified on 2026-05-07.

**Objective:** Allow a logged-in booker to create a musician/band provider profile from the same account.

**Affected files:**
- `src/app/(auth)/registrarse/proveedor/page.tsx` — update
- `src/app/api/providers/start/route.ts` — create
- `src/app/(dashboard)/wizard/[step]/page.tsx` — update access check
- `src/app/(dashboard)/dashboard/page.tsx` — update account/profile detection
- Provider-owned API routes — update ownership checks

**Related story:** US-MUS-001

**Acceptance criteria:**
- AC-MUS-001-8: Logged-in booker can create a provider profile without registering another email.
- AC-MUS-001-9: The UI explains that existing account name/email will be reused.
- BR-001/BR-002A: No duplicate user account is created.

**Completion criteria:**
- Logged-in booker visiting `/registrarse/proveedor` sees a reuse-account confirmation.
- Confirmation creates or returns the user's provider profile.
- User is redirected to `/wizard/identidad`.
- Provider wizard and provider-owned APIs accept the current user by profile ownership, not by stale session role alone.

**Dependencies:** T-100, T-200

---

## T-200 — Wizard layout and progress indicator

**Status:** ✅ Done — build verified on 2026-05-07.

**Objective:** Create the shared wizard layout that wraps all 7 steps.

**Affected files:**
- `src/app/(dashboard)/wizard/layout.tsx` — create
- `src/components/wizard/WizardProgress.tsx` — create
- `src/components/wizard/WizardNav.tsx` — create (back/next buttons)

**Related story:** US-MUS-002

**Acceptance criteria:**
- AC-MUS-002-1: Shows current step number and total (e.g., "Paso 2 de 7").
- AC-MUS-002-3: Back button navigates without losing data.
- AC-MUS-002-6: Only one section visible at a time.
- Progress bar or step indicator visible on every step.

**Completion criteria:**
- Layout wraps all wizard steps.
- Step indicator highlights current and completed steps.
- Back/next navigation works via URL params or state.
- Protected route — redirects to `/iniciar-sesion` if not authenticated.

**Dependencies:** T-102

---

## T-201 — Wizard step 1: Artistic identity

**Status:** ✅ Done — build verified on 2026-05-07.

**Objective:** Capture stage name, provider type, description, and base location.

**Affected files:**
- `src/app/(dashboard)/wizard/[step]/page.tsx` — create (dynamic step router)
- `src/components/wizard/steps/StepIdentidad.tsx` — create

**Related story:** US-MUS-004

**Acceptance criteria:**
- AC-MUS-004-1: Provider type selector with all defined options (solo, banda, DJ, mariachi, etc.).
- AC-MUS-004-2: Description textarea.
- AC-MUS-004-3: Placeholder/example text guides a quality description.
- AC-MUS-004-4: Base location field (city/region).
- AC-MUS-004-5: Real-time contact detection warning if phone/email/handle detected in description or stage name (BR-007, BR-008).
- AC-MUS-004-6: Stage name is required.

**Completion criteria:**
- Submits via `PATCH /api/providers/[id]`.
- Contact detection warning shown inline in Spanish before save.
- Save is blocked (or warned) if contact pattern detected.
- All text in Spanish.

**Dependencies:** T-007, T-200

---

## T-202 — Wizard step 2: Categories (genres and event types)

**Status:** ✅ Done — UI and persistence API build verified on 2026-05-07.

**Objective:** Let the provider select music genres and event types.

**Affected files:**
- `src/components/wizard/steps/StepCategorias.tsx` — create
- `src/app/api/providers/[id]/genres/route.ts` — create
- `src/app/api/providers/[id]/event-types/route.ts` — create

**Related story:** US-MUS-006, US-MUS-007

**Acceptance criteria:**
- AC-MUS-007-1/2: Multi-select for genres with all 18 options.
- AC-MUS-006-1/2: Multi-select for event types with all 13 options.
- AC-MUS-006-3: "Otro" option available for event types.
- At least one genre and one event type required to advance.
- Selected options are clearly highlighted.

**Completion criteria:**
- Genres and event types loaded from `/api/genres` and `/api/event-types`.
- Selection persisted via API (`PUT /api/providers/[id]/genres`, `PUT /api/providers/[id]/event-types`).
- Minimum 1 of each validated before allowing next step.

**Dependencies:** T-009, T-201

---

## T-203 — Wizard step 3: Booking durations

**Status:** ✅ Done — build verified on 2026-05-07.

**Objective:** Capture minimum and maximum booking duration (1–10 hours).

**Affected files:**
- `src/components/wizard/steps/StepDuraciones.tsx` — create

**Related story:** US-MUS-008

**Acceptance criteria:**
- AC-MUS-008-1/2: Min and max duration inputs (1–10 hours).
- AC-MUS-008-3: Inline error if min > max (BR-013).
- AC-MUS-008-4/5: Both values required to advance.

**Completion criteria:**
- Inputs only accept integers 1–10.
- `min > max` condition caught client-side and server-side.
- Values persisted via `PATCH /api/providers/[id]`.

**Dependencies:** T-202

---

## T-204 — Wizard step 4: Repertoire (manual entry)

**Status:** ✅ Done — manual UI and persistence API build verified on 2026-05-07.

**Objective:** Let the provider add songs one by one.

**Affected files:**
- `src/components/wizard/steps/StepRepertorio.tsx` — create
- `src/app/api/providers/[id]/repertoire/route.ts` — create (`GET`, `POST`, `DELETE`)

**Related story:** US-MUS-009

**Acceptance criteria:**
- AC-MUS-009-1: Add song with title + artist fields.
- AC-MUS-009-2: Can add multiple songs without restarting form.
- AC-MUS-009-3: Can edit or remove any song.
- AC-MUS-009-4: Songs displayed in order added.
- Step is optional — user can skip without blocking next step.

**Completion criteria:**
- `POST /api/providers/[id]/repertoire` creates a song.
- `DELETE /api/providers/[id]/repertoire/[songId]` removes it.
- Song list updates without page reload.
- "Agregar canción" form clears after each add.

**Dependencies:** T-203

---

## T-205 — Wizard step 4b: Bulk repertoire upload (CSV/XLSX)

**Status:** ✅ Done — CSV/XLSX review/import build verified on 2026-05-07.

**Objective:** Allow uploading a CSV or Excel file with the full repertoire.

**Affected files:**
- `src/components/wizard/steps/StepRepertorioUpload.tsx` — create (tab within step 4)
- `src/app/api/providers/[id]/repertoire/upload/route.ts` — create

**Related story:** US-MUS-010

**Acceptance criteria:**
- AC-MUS-010-1: Accepts CSV and XLSX.
- AC-MUS-010-2/3: Shows expected format (title, artist columns) with example.
- AC-MUS-010-4: Preview parsed list before confirming.
- AC-MUS-010-5/6: Per-row error report — valid rows shown even if some fail.
- AC-MUS-010-7: On confirm, songs added to repertoire.

**Completion criteria:**
- File parsed server-side using `xlsx` + `csv-parse`.
- Preview UI shows valid rows (green) and invalid rows (red with reason).
- Confirm button disabled until user reviews.
- All error messages in Spanish.

**Dependencies:** T-204

---

## T-206 — Wizard step 5: Prices

**Status:** ✅ Done — build verified on 2026-05-07.

**Objective:** Let the provider define hourly and/or event-based pricing.

**Affected files:**
- `src/components/wizard/steps/StepPrecios.tsx` — create

**Related story:** US-MUS-011, US-MUS-012

**Acceptance criteria:**
- AC-MUS-011-1/2: Hourly price field with explanation that it will be public.
- AC-MUS-012-1/2: Event price field with explanation of difference.
- AC-MUS-012-1: User can choose hourly, event, or both.
- At least one pricing model required to advance.

**Completion criteria:**
- Values persisted via `PATCH /api/providers/[id]`.
- "At least one price required" validated before next step.
- Price displayed in MXN or USD (consistent with platform decision).

**Dependencies:** T-205 or T-204 (either manual or upload is enough)

---

## T-207 — Wizard step 6: Contact points

**Status:** ✅ Done — UI and persistence API build verified on 2026-05-07.

**Objective:** Let the provider add phone numbers as protected contact points.

**Affected files:**
- `src/components/wizard/steps/StepContactos.tsx` — create
- `src/app/api/providers/[id]/contact-points/route.ts` — create (`GET`, `POST`, `DELETE`)

**Related story:** US-MUS-013

**Acceptance criteria:**
- AC-MUS-013-1: Can add one or more phone numbers.
- AC-MUS-013-2: Email (from registration) shown as automatically included — read-only.
- AC-MUS-013-3: Explanation that these details are protected (not public).
- AC-MUS-013-4: Summary of what will be revealed to paying bookers.
- AC-MUS-013-5: At least one contact point required to publish.

**Completion criteria:**
- Email contact point shown from DB (already seeded at registration — T-004).
- `POST /api/providers/[id]/contact-points` adds a phone.
- `DELETE /api/providers/[id]/contact-points/[id]` removes it.
- All text about protection in Spanish.

**Dependencies:** T-206

---

## T-208 — Wizard step 7: Preview and publish

**Status:** ✅ Done — preview UI and publish API build verified on 2026-05-07.

**Objective:** Show a read-only preview of the profile and allow publishing.

**Affected files:**
- `src/components/wizard/steps/StepPreview.tsx` — create
- `src/app/api/providers/[id]/publish/route.ts` — create (`POST`)

**Related story:** US-MUS-015, US-MUS-003

**Acceptance criteria:**
- AC-MUS-015-1: Read-only view of the full public profile.
- AC-MUS-015-2: Clearly marks which info is public vs. protected.
- AC-MUS-015-3: "Editar" links navigate back to specific steps.
- AC-MUS-015-4: Clear confirmation after publishing.
- Publish blocked if required fields missing (BR-003, publication checklist).

**Completion criteria:**
- `POST /api/providers/[id]/publish` validates all required fields server-side.
- Returns structured 422 with list of missing fields if validation fails.
- On success: profile `status` changes to `PUBLISHED`.
- Redirect to provider dashboard after publish.

**Dependencies:** T-207

---

## T-209 — Provider dashboard

**Status:** ✅ Done — build verified on 2026-05-07.

**Objective:** Dashboard showing profile completion status and quick access to sections.

**Affected files:**
- `src/app/(dashboard)/dashboard/page.tsx` — create
- `src/components/provider/CompletionStatus.tsx` — create

**Related story:** US-MUS-003, US-MUS-018

**Acceptance criteria:**
- AC-MUS-003-1: Visual completion indicator (% or section checklist).
- AC-MUS-003-2: Each section labeled complete or incomplete.
- AC-MUS-003-3: If not publishable, explains why specifically.
- AC-MUS-003-4: Direct link to any incomplete section.
- AC-MUS-018-2: Messages specific (e.g., "Falta al menos un género musical").

**Completion criteria:**
- Completion % calculated from required fields (BR-005).
- Provider can navigate to any wizard step from dashboard.
- Published profile shows a "Ver perfil público" link.

**Dependencies:** T-208

---

## T-300 — Public provider listing page

**Status:** ✅ Done — public route and filters build/browser verified on 2026-05-07.

**Objective:** Search and listing page for bookers with genre, event type, and cost filters.

**Affected files:**
- `src/app/(public)/proveedores/page.tsx` — create
- `src/components/search/ProviderCard.tsx` — create
- `src/components/search/SearchFilters.tsx` — create

**Related story:** US-CON-003, US-CON-004, US-CON-005, US-CON-006, US-CON-007

**Acceptance criteria:**
- AC-CON-003-1: Each card shows name, type, genres, event types, location, price reference.
- AC-CON-003-2: No contact info in listing.
- AC-CON-004-1/2/3/4: Genre filter visible, multi-select, updates results, clearable.
- AC-CON-005-1/2/3/4: Event type filter, single select, updates results, clearable.
- AC-CON-006-1/2/3/4: Price range filter, explains price type.
- AC-CON-007-1/2/3: Filters combinable, active filters shown, "limpiar filtros" available.
- AC-CON-011-1/2/3: Empty state with suggestions when no results.
- AC-CON-003-5: Pagination or infinite scroll.

**Completion criteria:**
- Filters update URL params (shareable search state).
- Results fetched from `GET /api/providers` with query params.
- Empty state is clear and actionable.
- Page is server-rendered (SSR) for SEO (AC-SEO-001).

**Dependencies:** T-005, T-009

---

## T-301 — Home quick search entry

**Status:** ✅ Done — build verified on 2026-05-07.

**Objective:** Let bookers type directly in the home search bar and open matching provider results by pressing Enter or "Buscar".

**Affected files:**
- `src/app/page.tsx` — update
- `src/components/search/HomeSearchBox.tsx` — create
- `src/app/(public)/proveedores/page.tsx` — update
- `src/app/api/providers/route.ts` — update
- `src/components/search/SearchFilters.tsx` — update

**Related story:** US-CON-004A

**Acceptance criteria:**
- AC-CON-004A-1/2/3: Home search is editable and submits with Enter or the button.
- AC-CON-004A-4/5: Listing applies `q` to public provider fields and category metadata.
- AC-CON-004A-6: Contact data remains protected.
- AC-CON-004A-7: Advanced filters preserve the quick-search term.

**Completion criteria:**
- Home search navigates to `/proveedores?q=...`.
- Listing and public API both support `q`.
- Empty states distinguish keyword search from advanced filters.
- Documentation and handoff are updated.

**Dependencies:** T-300

---

## T-301 — Public provider detail page

**Status:** ✅ Done — public detail with locked contact panel build verified on 2026-05-07.

**Objective:** Full profile view for bookers, contact access locked.

**Affected files:**
- `src/app/(public)/proveedores/[id]/page.tsx` — create
- `src/components/provider/ProfileDetail.tsx` — create
- `src/components/provider/RepertoireList.tsx` — create
- `src/components/provider/ContactLocked.tsx` — create

**Related story:** US-CON-008, US-CON-009, US-CON-001

**Acceptance criteria:**
- AC-CON-008-1: Shows all public fields (name, description, genres, event types, durations, repertoire, prices).
- AC-CON-008-2: Contact hidden — shows lock UI instead.
- AC-CON-008-3: Visible CTA explaining how to unlock contact.
- AC-CON-008-4: Back button preserves search state.
- AC-CON-001-1/2: Repertoire in scannable list, paginated if >20 songs.
- AC-CON-001-4: If no repertoire, shows neutral message.
- AC-CON-009-1: Profile completion signal (all required fields filled = complete badge).
- AC-SEO-001-1/2/3: Unique URL, metadata tags, public content indexable.

**Completion criteria:**
- Page rendered server-side via `getServerSideProps` or equivalent.
- No contact data in HTML source (NFR-001, BR-021).
- Metadata title/description set dynamically.
- "Back to search" link works.

**Dependencies:** T-006, T-300

---

## T-302 — Profile image upload

**Status:** ✅ Done — provider image upload API, wizard UI, public card/detail display, and local upload serving build verified on 2026-05-07.

**Objective:** Allow providers to upload a profile image in the wizard or dashboard.

**Affected files:**
- `src/components/wizard/steps/StepImagen.tsx` — create (or integrate into StepIdentidad)
- `src/app/api/providers/[id]/image/route.ts` — create (`POST`)
- `src/app/uploads/[...path]/route.ts` — create (`GET` for local uploaded files)
- `src/components/search/ProviderCard.tsx` — display uploaded image in listing cards

**Related story:** US-MUS-005

**Acceptance criteria:**
- AC-MUS-005-1/2: Upload from device, JPG/PNG/WEBP only.
- AC-MUS-005-3: Recommendation text shown.
- AC-MUS-005-4: Neutral fallback if no image.
- AC-MUS-005-5: Preview before saving.
- AC-MUS-005-6: Uploaded images appear in public listing cards and public profile detail pages.
- BR-010: Max 5 MB.

**Completion criteria:**
- Image saved to `public/uploads/images/`.
- `imageUrl` updated in `provider_profiles` table.
- Uploaded local image URLs can be served during production-style local runs.
- File type and size validated server-side.
- Unsupported format returns specific error in Spanish.

**Dependencies:** T-201, T-011

---

## T-303 — Collapsed filters on search results

**Status:** ✅ Done — build verified on 2026-05-07.

**Objective:** Keep provider results visually lightweight by hiding advanced filters until the booker asks for them.

**Affected files:**
- `src/app/(public)/proveedores/page.tsx` — update result layout
- `src/components/search/SearchFilters.tsx` — update collapsible filter controls

**Related story:** US-CON-004A, US-CON-007

**Acceptance criteria:**
- AC-CON-004A-8: Search results show a "Filtros" button instead of an always-open filter panel.
- AC-CON-007-5: Filter controls are collapsed by default and open inline after clicking "Filtros".
- Active search/filter count remains visible.
- Clearing filters remains available when search or filters are active.

**Completion criteria:**
- Listing no longer uses a persistent sidebar for filters.
- Filters can still be applied and preserve quick-search terms.
- Results remain the primary visual focus.

**Dependencies:** T-300, T-301

---

# Priority 2 — Initial monetization

---

## T-400 — Contact unlock modal (one-time payment — Stripe stub)

**Status:** ✅ Done — local unlock panel and stub API build verified on 2026-05-07.

**Objective:** Show the access comparison modal and initiate unlock flow.

**Affected files:**
- `src/components/provider/ContactUnlockModal.tsx` — create
- `src/app/api/payments/unlock/route.ts` — create (Stripe stub for now)

**Related story:** US-MON-001, US-MON-002, US-MON-005

**Acceptance criteria:**
- AC-MON-005-1/2/3/4: Both options shown clearly (1 USD one-time, 9.99/month subscription).
- AC-MON-001-2: Provider name and what will be revealed shown before payment.
- AC-MON-001-1: Price ($1 USD) visible before confirmation.
- AC-MON-002-1/2/3: If already unlocked, show contacts directly — no payment shown.
- EC-MON-001-1: Payment failure: contact not revealed, retry offered.

**Completion criteria:**
- Modal appears when unauthenticated/unpaid user clicks "Ver contacto".
- Unauthenticated user redirected to login, then back to profile.
- Already-unlocked check via `GET /api/providers/[id]/contacts` (already returns 402 or contacts).
- Stripe integration stubbed (can be replaced with real Stripe in T-401).

**Dependencies:** T-008, T-301

---

## T-401 — Stripe one-time payment integration

**Objective:** Complete the Stripe Payment Intent flow for contact unlocking.

**Affected files:**
- `src/app/api/payments/unlock/route.ts` — update
- `src/app/api/payments/unlock/confirm/route.ts` — create
- `src/components/provider/StripeCheckout.tsx` — create

**Related story:** US-MON-001

**Acceptance criteria:**
- AC-MON-001-3: User must confirm payment.
- AC-MON-001-4: Contacts appear immediately after payment.
- AC-MON-001-5: Confirmation shown on-screen.
- BR-022: Only one provider unlocked.
- BR-023: No double charge (unique constraint on contact_unlock table).

**Completion criteria:**
- Stripe test mode works end-to-end.
- `contact_unlock` record created on `payment_intent.succeeded`.
- Idempotency key used on Payment Intent creation.

**Dependencies:** T-400, Stripe account + test keys

---

## T-402 — Monthly subscription flow

**Status:** ✅ Done for local stub — subscription page/API build verified on 2026-05-07. Real Stripe remains T-401/T-402 production integration work.

**Objective:** Stripe Subscription for 9.99 USD/month.

**Affected files:**
- `src/app/api/subscriptions/route.ts` — create
- `src/app/api/subscriptions/status/route.ts` — create
- `src/app/api/subscriptions/cancel/route.ts` — create
- `src/app/api/webhooks/stripe/route.ts` — create
- `src/app/(dashboard)/suscripcion/page.tsx` — create

**Related story:** US-MON-003, US-MON-004

**Acceptance criteria:**
- AC-MON-003-1/2/3/4: Subscription option clearly presented.
- AC-MON-004-1/2/3: Active subscriber sees contacts on all profiles.
- AC-MON-004-4: Expired subscription shows clear explanation.
- BR-025/026: Subscription status verified in real-time.

**Completion criteria:**
- Stripe webhook handles `customer.subscription.updated` and `customer.subscription.deleted`.
- `subscription` record updated on webhook events.
- Subscribed user bypasses payment modal.

**Dependencies:** T-401

---

## T-403 — Unlocked contact history

**Status:** ✅ Done — page/API build verified on 2026-05-07.

**Objective:** Page showing all previously unlocked contacts for a booker.

**Affected files:**
- `src/app/(dashboard)/contactos-desbloqueados/page.tsx` — create
- `src/app/api/unlocks/route.ts` — create

**Related story:** US-MON-006

**Acceptance criteria:**
- AC-MON-006-1/2/3/4: List of unlocked providers with name and unlock date.
- Link to provider profile from each entry.
- No payment prompt shown for already-unlocked contacts.

**Dependencies:** T-401

---

# Priority 3 — Trust and efficiency

---

## T-500 — Saved providers (favorites)

**Status:** ✅ Done — save API, button, and saved page build verified on 2026-05-07.

**Objective:** Let bookers save providers for comparison.

**Affected files:**
- `src/app/api/saved/route.ts` — create
- `src/app/(dashboard)/guardados/page.tsx` — create
- `src/components/provider/SaveButton.tsx` — create

**Related story:** US-CON-010

**Acceptance criteria:**
- AC-CON-010-1/2/3/4/5: Save from listing or detail, reversible, persists across sessions, no contact revealed.

**Dependencies:** T-301

---

## T-501 — Edit published profile

**Objective:** Allow providers to edit their profile after publishing.

**Affected files:**
- `src/app/(dashboard)/perfil/editar/page.tsx` — create
- Reuse wizard step components

**Related story:** US-MUS-016

**Acceptance criteria:**
- AC-MUS-016-1/2/3/4/5: Edit via same sections as wizard, save changes without rebuilding, confirm on save, contact detection on edit.

**Dependencies:** T-208, T-209

---

## T-502 — Contact leakage warning in UI

**Objective:** Show real-time inline warning in wizard description/stage name fields.

**Affected files:**
- `src/components/wizard/steps/StepIdentidad.tsx` — update
- `src/components/ui/ContactWarning.tsx` — create

**Related story:** US-MUS-017

**Acceptance criteria:**
- AC-MUS-017-1/2/3/4: Warning appears on blur, non-accusatory Spanish language, explains where to put contact info, user can correct without losing text.

**Dependencies:** T-010, T-201

---

## T-503 — Booker dashboard

**Status:** ✅ Done — role-aware dashboard build verified on 2026-05-07.

**Objective:** Dashboard for bookers showing saved providers, unlocks, and subscription status.

**Affected files:**
- `src/app/(dashboard)/dashboard/page.tsx` — update (role-aware)

**Related story:** US-CON general

**Acceptance criteria:**
- Booker sees: saved providers count, unlocked contacts count, subscription status.
- Quick links to `/guardados`, `/contactos-desbloqueados`, `/suscripcion`.

**Dependencies:** T-403, T-500

---

# Priority 4 — Future evolution (out of current scope)

The following are documented for traceability but will not be implemented in this phase:

| ID | Feature | Story |
|----|---------|-------|
| T-600 | Verified reviews | Future |
| T-601 | Availability calendar | Future |
| T-602 | Custom quotes | Future |
| T-603 | Internal chat | Future |
| T-604 | Booking packages | Future |
| T-605 | Provider analytics dashboard | Future |
| T-606 | Advanced profile verification | Future |

---

# Implementation order (recommended)

```
T-102 (login)
  → T-100 (provider registration)
  → T-101 (booker registration)
  → T-103 (navbar)
  → T-200 (wizard layout)
    → T-201 (step 1: identity)
    → T-202 (step 2: categories)
    → T-203 (step 3: durations)
    → T-204 (step 4: repertoire manual)
    → T-205 (step 4b: bulk upload)
    → T-206 (step 5: prices)
    → T-207 (step 6: contacts)
    → T-208 (step 7: preview + publish)
    → T-302 (image upload — can be parallel with T-201)
  → T-209 (provider dashboard)
  → T-300 (public listing + filters)
  → T-301 (provider detail page)

T-400 (unlock modal stub)
  → T-401 (Stripe one-time)
  → T-402 (Stripe subscription)
  → T-403 (unlock history)

T-500 (saved providers)
T-501 (edit profile)
T-502 (contact leakage warning UI)
T-503 (booker dashboard)
```

---

*Document created: 2026-05-07*
*Source: plan.md + requirements.md*
*Status: confirmed*
