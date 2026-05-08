# requirements.md

## Project: Musician and Band Booking Marketplace

## Purpose of this document

This document formalizes the behavioral experience defined in `behavioral_experience.md` into verifiable functional requirements, business rules, edge cases, and access restrictions.

Every requirement traces back to a User Story or Job Story in `behavioral_experience.md`. This document is the technical source of truth for building `plan.md` and `tasks.md`.

---

## Traceability key

- `US-MUS-XXX` — Musician or band user stories
- `US-CON-XXX` — Booker / client user stories
- `US-MON-XXX` — Monetization user stories
- `US-SEO-XXX` — Indexing and discovery user stories

---

# 1. Functional requirements

---

## Epic 1: Registration and account creation

### US-MUS-001: Musical provider registration

**As a** musician or band, **I want to** register on the platform, **so that** I can create and manage my service profile.

#### Acceptance criteria

- AC-MUS-001-1: The registration form clearly identifies that the user is creating a **musical provider** account (not a booker account).
- AC-MUS-001-2: Registration requires at minimum: full name, email address, and password.
- AC-MUS-001-3: The email is automatically associated as the base contact email of the profile.
- AC-MUS-001-4: The system sends a confirmation message upon successful account creation.
- AC-MUS-001-5: After registration, the user is automatically directed to the profile creation wizard without needing to navigate manually.
- AC-MUS-001-6: If the email is already registered, the system shows a clear and non-generic error message.
- AC-MUS-001-7: Password must meet a minimum security requirement (at least 8 characters).
- AC-MUS-001-8: If a logged-in booker wants to publish as a musician or band, the system allows them to create a provider profile under the same account without entering another email or password.
- AC-MUS-001-9: When a logged-in booker activates a provider profile, the system clearly states that the existing account name and email will be reused, and then redirects to the profile wizard.

#### Business rules

- BR-001: A single email address can only be associated with one account; that account may have booker capabilities, provider capabilities, or both.
- BR-002: The registration email becomes the protected contact email on the profile and cannot be changed independently of the account.
- BR-002A: Creating a provider profile from an existing booker account must not create a duplicate user record; it must create or reuse the provider profile linked to the current user.

#### Edge cases

- EC-MUS-001-1: User submits the form with an already registered email → show specific error, do not create a duplicate account.
- EC-MUS-001-2: User submits the form with an invalid email format → show inline validation error before submission.
- EC-MUS-001-3: User navigates away before completing registration → no account is created, no data is stored.
- EC-MUS-001-4: Logged-in booker opens provider registration → show a reuse-account confirmation instead of a duplicate registration form.
- EC-MUS-001-5: Logged-in booker already has a provider profile → send them to the existing provider wizard/dashboard instead of creating another profile.

---

## Epic 2: Profile creation wizard

### US-MUS-002: Step-by-step guided profile form

**As a** musician or band, **I want to** complete my profile through a wizard-style form, **so that** I can move through clear and manageable sections.

#### Acceptance criteria

- AC-MUS-002-1: The wizard shows the current step number and total steps (e.g., "Step 2 of 6").
- AC-MUS-002-2: Each step has a clear title and a short contextual explanation.
- AC-MUS-002-3: The user can navigate back to previous steps without losing entered data.
- AC-MUS-002-4: Required fields are visually distinguished from optional fields.
- AC-MUS-002-5: If required fields are missing when advancing, the system explains which fields need attention.
- AC-MUS-002-6: No step shows more than one logical section at a time.
- AC-MUS-002-7: The user can save progress and return to the wizard later without losing data.

#### Business rules

- BR-003: A profile can only be published when all required fields across all steps are complete.
- BR-004: Progress is saved automatically or on step advancement — the user must not lose data on accidental navigation.

#### Edge cases

- EC-MUS-002-1: User closes browser mid-wizard → saved progress is restored on next login.
- EC-MUS-002-2: User tries to advance to the next step with missing required fields → system blocks navigation and highlights the missing fields.
- EC-MUS-002-3: User refreshes the page mid-wizard → system restores the last saved state.

---

### US-MUS-003: Profile completion status

**As a** musician or band, **I want to** know how complete my profile is, **so that** I can understand whether it is ready to publish or what is still missing.

#### Acceptance criteria

- AC-MUS-003-1: The platform displays a visual profile completion indicator (e.g., percentage or progress bar).
- AC-MUS-003-2: Each section is individually labeled as complete or incomplete.
- AC-MUS-003-3: If the profile cannot be published, the reason is explained clearly and specifically.
- AC-MUS-003-4: The user can navigate directly to an incomplete section from the completion status view.

#### Business rules

- BR-005: Completion percentage is calculated based on required fields only.
- BR-006: Optional fields may increase completeness score but are not blockers for publication.

---

## Epic 3: Basic provider information

### US-MUS-004: Artistic identity capture

**As a** musician or band, **I want to** add my stage name, description, and base location, **so that** I can present myself correctly to potential bookers.

#### Acceptance criteria

- AC-MUS-004-1: The user can select their provider type from predefined options (solo artist, band, group, DJ, mariachi, duo, choir, classical ensemble, jazz group, or other).
- AC-MUS-004-2: The user can write a short description of their musical proposal.
- AC-MUS-004-3: The platform provides examples or a placeholder to guide a quality description.
- AC-MUS-004-4: The base location field is required and accepts city or region.
- AC-MUS-004-5: The system detects and warns the user if the description contains phone numbers, emails, or social media handles.
- AC-MUS-004-6: Stage name is a required field.

#### Business rules

- BR-007: The description field must be scanned for contact information patterns (phone numbers, emails, URLs, social media handles) before saving.
- BR-008: If contact information is detected in a public field, the system warns the user and blocks saving until corrected.

#### Edge cases

- EC-MUS-004-1: User types a phone number or email in the description → system shows a contextual warning explaining the contact protection policy and where to enter contact details correctly.
- EC-MUS-004-2: User selects "other" as provider type → a free-text field allows them to describe the type.

---

### US-MUS-005: Main profile image

**As a** musician or band, **I want to** add a main image to my profile, **so that** I can build trust and make my listing more attractive.

#### Acceptance criteria

- AC-MUS-005-1: The user can upload a main image from their device.
- AC-MUS-005-2: Accepted formats are JPG, PNG, and WEBP.
- AC-MUS-005-3: The platform shows a recommendation for image type (professional, clear, related to the service).
- AC-MUS-005-4: If no image is uploaded, the profile shows a neutral visual fallback.
- AC-MUS-005-5: The user can preview how the image appears on the profile before saving.
- AC-MUS-005-6: Uploaded images appear in public listing cards and public profile detail pages.

#### Business rules

- BR-009: Image upload is optional and must not block profile publication.
- BR-010: Maximum file size is 5 MB.

#### Edge cases

- EC-MUS-005-1: User uploads an unsupported file format → system shows a specific error and does not process the file.
- EC-MUS-005-2: User uploads a file exceeding the size limit → system rejects and explains the limit.

---

## Epic 4: Service categories

### US-MUS-006: Event type selection

**As a** musician or band, **I want to** select the event types I serve, **so that** bookers can find me according to their needs.

#### Acceptance criteria

- AC-MUS-006-1: The user can select one or multiple event types.
- AC-MUS-006-2: Available options include at minimum: weddings, quinceañeras, birthdays, corporate events, bars, restaurants, serenades, private parties, festivals, religious events, and other.
- AC-MUS-006-3: Selecting "other" presents a free-text input.
- AC-MUS-006-4: Selected event types are shown on the public profile.
- AC-MUS-006-5: At least one event type is required to publish the profile.

#### Business rules

- BR-011: Event types are used as filterable metadata in the booker search view.

---

### US-MUS-007: Music genre selection

**As a** musician or band, **I want to** select my music genres, **so that** I can be found by bookers looking for a specific style.

#### Acceptance criteria

- AC-MUS-007-1: The user can select one or multiple music genres.
- AC-MUS-007-2: Available options include at minimum: regional Mexican, mariachi, norteño, banda, pop, rock, jazz, classical, salsa, cumbia, reggaeton, versatile, electronic, acoustic, and other.
- AC-MUS-007-3: The user can mark one genre as primary and others as secondary, or simply select all applicable.
- AC-MUS-007-4: Selected genres are shown on the public profile.
- AC-MUS-007-5: At least one music genre is required to publish the profile.

#### Business rules

- BR-012: Music genres are used as filterable metadata in the booker search view.

---

## Epic 5: Booking durations

### US-MUS-008: Minimum and maximum booking duration

**As a** musician or band, **I want to** define my booking durations between 1 and 10 hours, **so that** I can set clear expectations with bookers.

#### Acceptance criteria

- AC-MUS-008-1: The user can set a minimum booking duration (1–10 hours).
- AC-MUS-008-2: The user can set a maximum booking duration (1–10 hours).
- AC-MUS-008-3: The system prevents saving if the minimum duration is greater than the maximum duration.
- AC-MUS-008-4: Both minimum and maximum durations are shown on the public profile.
- AC-MUS-008-5: Both fields are required to publish the profile.

#### Business rules

- BR-013: Minimum duration must always be ≤ maximum duration.
- BR-014: Duration values must be whole numbers between 1 and 10.

#### Edge cases

- EC-MUS-008-1: User sets minimum = 5 and maximum = 3 → system shows an inline error and blocks saving.
- EC-MUS-008-2: User enters a value outside 1–10 → system validates and rejects.

---

## Epic 6: Musical repertoire

### US-MUS-009: Manual repertoire entry

**As a** musician or band, **I want to** add songs one by one, **so that** I can build my repertoire directly on the platform.

#### Acceptance criteria

- AC-MUS-009-1: The user can add a song with at minimum: song title and artist or reference.
- AC-MUS-009-2: The user can add multiple songs sequentially without restarting the form.
- AC-MUS-009-3: The user can edit or remove any song before publishing.
- AC-MUS-009-4: Songs are displayed in the order they were added (or alphabetically if sorted).

#### Business rules

- BR-015: Repertoire is optional for profile publication but the platform should clearly recommend adding it to improve booker trust.

---

### US-MUS-010: Bulk repertoire upload

**As a** musician or band, **I want to** upload a CSV or Excel file with my repertoire, **so that** I can load many songs without entering them one by one.

#### Acceptance criteria

- AC-MUS-010-1: The platform accepts CSV and XLSX file formats.
- AC-MUS-010-2: The platform clearly communicates the expected file structure (columns: song title, artist or reference).
- AC-MUS-010-3: A downloadable template or inline example is provided.
- AC-MUS-010-4: After upload, the user can review the parsed list before confirming.
- AC-MUS-010-5: If the file contains errors, the platform specifies which rows are problematic and why.
- AC-MUS-010-6: A single error in the file does not reject the entire upload — valid rows are shown and the user can correct or skip invalid rows.
- AC-MUS-010-7: After confirmation, the bulk-uploaded songs are added to the repertoire.

#### Edge cases

- EC-MUS-010-1: User uploads a file with an unsupported format → system explains accepted formats.
- EC-MUS-010-2: User uploads an empty file → system shows a specific message and does not crash.
- EC-MUS-010-3: File contains 0 valid rows and all rows have errors → system explains the problem without discarding user effort.

---

### US-CON-001: Public repertoire display for bookers

**As a** booker, **I want to** review a musician's or band's repertoire, **so that** I can know whether they perform songs suitable for my event.

#### Acceptance criteria

- AC-CON-001-1: The repertoire is shown in an organized, scannable list.
- AC-CON-001-2: If the repertoire has more than 20 songs, pagination or search within the list is provided.
- AC-CON-001-3: The repertoire display does not expose any contact information.
- AC-CON-001-4: If no repertoire has been added, the profile shows a neutral message (e.g., "Este proveedor aún no ha agregado su repertorio").

---

## Epic 7: Prices and costs

### US-MUS-011: Hourly cost

**As a** musician or band, **I want to** assign an hourly cost, **so that** bookers can estimate what it would cost to hire me.

#### Acceptance criteria

- AC-MUS-011-1: The user can enter an hourly price in the local currency.
- AC-MUS-011-2: The platform informs the user that this price will be visible to bookers.
- AC-MUS-011-3: The price is shown on the public profile and in search results.
- AC-MUS-011-4: At least one pricing model (hourly or event-based) is required to publish.

---

### US-MUS-012: Event-based cost

**As a** musician or band, **I want to** define a cost per event, **so that** I can offer a fixed rate when my service does not depend only on hours.

#### Acceptance criteria

- AC-MUS-012-1: The user can choose to charge by hour, by event, or both.
- AC-MUS-012-2: The platform explains the difference between both models with a short contextual description.
- AC-MUS-012-3: The public profile shows the pricing model in clear and understandable terms.

---

### US-CON-002: Starting price reference for bookers

**As a** booker, **I want to** understand the starting price for hiring a provider, **so that** I can evaluate whether they fit my budget.

#### Acceptance criteria

- AC-CON-002-1: Search results show a price reference for each provider.
- AC-CON-002-2: When the price may vary, it is displayed as "Desde $X" or "Aprox. $X".
- AC-CON-002-3: The detail profile explains the pricing model (hourly, event-based, or both).
- AC-CON-002-4: The platform does not imply that the listed price is the final confirmed price.

---

## Epic 8: Protected contact points

### US-MUS-013: Contact point capture

**As a** musician or band, **I want to** add phone numbers and other allowed contact points, **so that** bookers can contact me after paying or subscribing.

#### Acceptance criteria

- AC-MUS-013-1: The user can add one or multiple phone numbers.
- AC-MUS-013-2: The email from the registration account is automatically included as a contact point.
- AC-MUS-013-3: The platform explicitly communicates that these details will not be publicly visible before payment or subscription.
- AC-MUS-013-4: The user can see a summary of which details will be revealed to paying bookers.
- AC-MUS-013-5: At least one contact point (phone or email) is required to publish the profile.

#### Business rules

- BR-016: Contact fields are stored as protected and must never appear in public-facing API responses or rendered HTML before access is authorized.
- BR-017: The profile email is automatically taken from the registration account. It cannot be set to a different address through the contact fields.

---

### US-MUS-014: Contact protection on public profile

**As a** musician or band, **I want** my contact details to not appear freely on my public profile, **so that** the platform respects the controlled access model.

#### Acceptance criteria

- AC-MUS-014-1: Phone numbers and email addresses are not rendered in the public profile view.
- AC-MUS-014-2: No public field (description, repertoire, location) displays or leaks contact information.
- AC-MUS-014-3: If a provider writes contact data in a public text field, the system detects it and shows a warning before saving.
- AC-MUS-014-4: The public profile shows a clear call-to-action explaining how bookers can access contact details.

#### Business rules

- BR-018: Contact detection must run on save for description, stage name, and any other free-text public field.
- BR-019: Detected patterns include: phone number formats (including international), email addresses, URLs, and common social media handle patterns (@handle).

---

## Epic 9: Profile publishing

### US-MUS-015: Profile preview before publishing

**As a** musician or band, **I want to** preview my profile before publishing it, **so that** I can confirm it is well presented.

#### Acceptance criteria

- AC-MUS-015-1: The user can view a read-only preview of their public profile before publishing.
- AC-MUS-015-2: The preview clearly marks which sections will be public and which will remain protected.
- AC-MUS-015-3: The user can navigate back to edit any section from the preview.
- AC-MUS-015-4: The user receives a clear confirmation message after the profile is published.

---

### US-SEO-001: Indexable public profile

**As a** musician or band, **I want** my profile to be discoverable through search engines and inside the platform, **so that** I can increase my booking opportunities.

#### Acceptance criteria

- AC-SEO-001-1: Each published profile has a unique, shareable URL.
- AC-SEO-001-2: The public profile page includes appropriate metadata (title, description) for search engine indexing.
- AC-SEO-001-3: Public information (stage name, genres, event types, location) is part of the indexable content.
- AC-SEO-001-4: Contact details are excluded from any indexable or publicly rendered content.

---

## Epic 10: Provider exploration (Booker)

### US-CON-003: View musician and band listings

**As a** booker, **I want to** see a list of musicians and bands, **so that** I can compare options before deciding whom to contact.

#### Acceptance criteria

- AC-CON-003-1: The listing shows each provider's name, type, genres, event types, base location, and price reference.
- AC-CON-003-2: Contact details are not shown in the listing.
- AC-CON-003-3: Each listing item links to the full provider detail page.
- AC-CON-003-4: If no providers are found, the system shows a helpful empty state with next steps.
- AC-CON-003-5: The listing supports pagination or infinite scroll for large result sets.
- AC-CON-003-6: If a provider uploaded a main image, the listing card shows that image instead of the neutral fallback.

---

## Epic 11: Search filters (Booker)

### US-CON-004: Filter by music genre

**As a** booker, **I want to** filter providers by music genre, **so that** I can find options that match the atmosphere of my event.

#### Acceptance criteria

- AC-CON-004-1: The genre filter is visible and accessible on the search/listing page.
- AC-CON-004-2: The user can select one or multiple genres.
- AC-CON-004-3: The results list updates according to the selected genres.
- AC-CON-004-4: The user can remove individual genre filters or clear all at once.

---

### US-CON-004A: Quick keyword search from home

**As a** booker, **I want to** type a genre, event, or city directly from the home search bar, **so that** I can reach relevant provider results without opening filters first.

#### Acceptance criteria

- AC-CON-004A-1: The home search control is an editable text input, not only a link to the listing page.
- AC-CON-004A-2: Pressing Enter submits the search and opens the provider listing.
- AC-CON-004A-3: Pressing the "Buscar" button submits the same search.
- AC-CON-004A-4: The listing applies the search term through the `q` query parameter.
- AC-CON-004A-5: The search matches public provider fields: stage name, provider type, base location, description, music genres, and event types.
- AC-CON-004A-6: Contact details are never included in quick-search results.
- AC-CON-004A-7: Applying advanced filters after a quick search preserves the search term until the user clears it.
- AC-CON-004A-8: On search results, advanced filters are collapsed by default and open only after the user clicks a button labeled "Filtros".

---

### US-CON-005: Filter by event type

**As a** booker, **I want to** filter providers by event type, **so that** I can find musicians with experience in events similar to mine.

#### Acceptance criteria

- AC-CON-005-1: The event type filter is visible on the search/listing page.
- AC-CON-005-2: The user can select one event type to filter results.
- AC-CON-005-3: The results update to show only providers who serve the selected event type.
- AC-CON-005-4: The filter is reversible without reloading the page.

---

### US-CON-006: Filter by cost

**As a** booker, **I want to** filter providers by cost, **so that** I can focus on options within my budget.

#### Acceptance criteria

- AC-CON-006-1: The cost filter allows defining a minimum and/or maximum budget.
- AC-CON-006-2: The platform communicates whether the price reference is hourly, event-based, or approximate.
- AC-CON-006-3: Providers without a price set are not shown when a cost filter is active.
- AC-CON-006-4: The user can modify the range without losing other active filters.

---

### US-CON-007: Combined filters

**As a** booker, **I want to** combine genre, event type, and cost filters, **so that** I can find providers closest to what I need.

#### Acceptance criteria

- AC-CON-007-1: All filters can be applied simultaneously.
- AC-CON-007-2: Active filters are visibly displayed so the user knows what is applied.
- AC-CON-007-3: A "clear all filters" option is available when one or more filters are active.
- AC-CON-007-4: When no results match the combination, the system shows a useful empty state with a suggestion to adjust filters.
- AC-CON-007-5: Filter controls are hidden behind a "Filtros" button by default on the listing page to keep search results visually lightweight.

---

## Epic 12: Provider detail (Booker)

### US-CON-008: Public provider profile for bookers

**As a** booker, **I want to** see the detailed profile of a musician or band, **so that** I can evaluate whether they fit my event.

#### Acceptance criteria

- AC-CON-008-1: The profile shows: name, description, provider type, genres, event types, booking durations, repertoire, and prices.
- AC-CON-008-2: Contact details are not shown without payment or active subscription.
- AC-CON-008-3: The profile visibly explains how to unlock contact details (one-time payment or subscription).
- AC-CON-008-4: The user can return to the listing without losing their active filters.
- AC-CON-008-5: An incomplete or unpublished profile is not accessible to bookers.

#### Business rules

- BR-020: Only published profiles are accessible to bookers.
- BR-021: The public profile page must never render contact information in HTML, even in hidden elements or metadata.

---

### US-CON-009: Trust signals on the profile

**As a** booker, **I want to** see signals that help me trust the provider, **so that** I can reduce risk before paying for contact access.

#### Acceptance criteria

- AC-CON-009-1: The profile indicates whether it is complete (all required fields are filled).
- AC-CON-009-2: Main information is visibly organized and not hidden behind interactions.
- AC-CON-009-3: Repertoire and categories are visible and contribute to conveying the provider's real offer.

---

## Epic 13: Contact access — one-time payment

### US-MON-001: One-time payment to reveal contact

**As a** casual booker, **I want to** pay 1 USD to reveal the contact details of one specific provider, **so that** I can communicate with them without committing to a subscription.

#### Acceptance criteria

- AC-MON-001-1: The payment flow is triggered from the provider profile.
- AC-MON-001-2: Before payment confirmation, the user sees: the provider's name, what will be revealed, and the cost (1 USD).
- AC-MON-001-3: The user must confirm the payment before being charged.
- AC-MON-001-4: After successful payment, the contact details are revealed immediately on the provider profile.
- AC-MON-001-5: The user receives a confirmation of the completed action (on-screen and/or by email).

#### Business rules

- BR-022: One-time payment reveals contact details for **one specific provider only**.
- BR-023: A booker must not be charged twice for the same provider's contact.

#### Edge cases

- EC-MON-001-1: Payment fails → contact is not revealed, user is informed and can retry.
- EC-MON-001-2: User navigates away after payment → contact remains unlocked and accessible on return.

---

### US-MON-002: Previously unlocked contact

**As a** booker, **I want to** keep access to a contact I already paid for, **so that** I do not have to pay twice for the same provider.

#### Acceptance criteria

- AC-MON-002-1: If the user has already paid for a provider, the profile shows the contact details directly.
- AC-MON-002-2: The profile indicates that this contact was previously unlocked.
- AC-MON-002-3: The payment flow is not triggered again for an already-unlocked contact.

#### Business rules

- BR-024: The system must check for an existing unlock record before presenting the payment option.

---

## Epic 14: Subscription for frequent users

### US-MON-003: Monthly subscription offer

**As a** frequent booker, **I want to** subscribe for 9.99 USD per month, **so that** I can see the contact details of all providers.

#### Acceptance criteria

- AC-MON-003-1: The subscription option is clearly presented to the user, including the monthly price of 9.99 USD.
- AC-MON-003-2: The platform clearly explains what the subscription includes (access to all providers' contacts while active).
- AC-MON-003-3: The user can choose between one-time payment and subscription at the point of contact reveal.
- AC-MON-003-4: The user is not forced into a subscription; it is presented as an option with value explanation.

---

### US-MON-004: Full contact access with active subscription

**As a** subscribed user, **I want to** see the contact details of all providers, **so that** I can work quickly without individual payments.

#### Acceptance criteria

- AC-MON-004-1: An active subscription reveals contact details on all provider profiles.
- AC-MON-004-2: The profile clearly indicates that access is through the active subscription.
- AC-MON-004-3: A subscribed user does not see the one-time payment prompt.
- AC-MON-004-4: If the subscription expires or is cancelled, the platform clearly explains the access change.

#### Business rules

- BR-025: Subscription status must be checked in real-time before rendering contact details.
- BR-026: An expired subscription reverts access to the locked state.

---

### US-MON-005: Compare payment options

**As a** booker, **I want to** compare one-time payment and subscription options, **so that** I can choose what best fits my usage.

#### Acceptance criteria

- AC-MON-005-1: Both options are shown at the point of contact reveal.
- AC-MON-005-2: One-time payment is described as: "Accede al contacto de este proveedor por $1 USD".
- AC-MON-005-3: Subscription is described as: "Accede al contacto de todos los proveedores por $9.99 USD/mes".
- AC-MON-005-4: The user can identify which option is better when they plan to contact several providers.

---

## Epic 15: Profile editing and maintenance

### US-MUS-016: Edit published profile

**As a** musician or band, **I want to** edit my profile after publishing it, **so that** I can keep my service offer updated.

#### Acceptance criteria

- AC-MUS-016-1: The user can access profile editing from their dashboard.
- AC-MUS-016-2: The editing experience is organized using the same sections as the wizard.
- AC-MUS-016-3: Changes can be saved without rebuilding the entire profile.
- AC-MUS-016-4: The platform confirms when changes have been applied.
- AC-MUS-016-5: Contact detection runs again on any edited public text field before saving.

---

## Epic 16: Contact leakage prevention

### US-MUS-017: Contact detail warning in public fields

**As the platform**, **I want to** warn providers when they try to write phone numbers, emails, or social media handles in public fields, **so that** the business model remains protected.

#### Acceptance criteria

- AC-MUS-017-1: Detection runs on all free-text public fields: description, stage name, and any custom text input.
- AC-MUS-017-2: The warning uses clear, non-accusatory language in Spanish.
- AC-MUS-017-3: The warning explains why this is restricted and where to enter contact details correctly.
- AC-MUS-017-4: The user can correct the content without losing the rest of what they wrote.

#### Business rules

- BR-027: Detection patterns must cover: standard phone number formats, email formats, URLs, and @handle patterns.
- BR-028: Detection is applied on both creation and update operations.

---

## Epic 17: Favorites or saved providers

### US-CON-010: Save favorite providers

**As a** booker, **I want to** save musicians or bands to a list, **so that** I can compare options before paying for contact access.

#### Acceptance criteria

- AC-CON-010-1: The user can save a provider from the listing or the detail page.
- AC-CON-010-2: The save action is visually clear and reversible.
- AC-CON-010-3: The user can view their list of saved providers.
- AC-CON-010-4: Saving a provider does not reveal contact details.
- AC-CON-010-5: Saved providers persist across sessions.

---

## Epic 18: Unlocked contact history

### US-MON-006: Revealed contact history

**As a** booker, **I want to** see the contacts I have already unlocked, **so that** I can access them again without searching from scratch.

#### Acceptance criteria

- AC-MON-006-1: The user has access to a list of previously unlocked provider contacts.
- AC-MON-006-2: Each entry shows the provider name and approximate unlock date.
- AC-MON-006-3: The user can navigate to the provider profile from the history.
- AC-MON-006-4: The history prevents the user from seeing a payment prompt for an already-unlocked provider.

---

## Epic 19: Status and empty states

### US-CON-011: Empty states in search

**As a** booker, **I want to** see useful messages when there are no results, **so that** I can adjust my search without frustration.

#### Acceptance criteria

- AC-CON-011-1: The empty state message does not blame the user.
- AC-CON-011-2: The platform suggests concrete actions: remove a filter, expand the budget, or try a different genre.
- AC-CON-011-3: The user can clear filters directly from the empty state view.

---

### US-MUS-018: Incomplete profile guidance

**As a** musician or band, **I want** guidance when my profile is incomplete, **so that** I know exactly what to complete.

#### Acceptance criteria

- AC-MUS-018-1: The platform specifies which section or field is missing.
- AC-MUS-018-2: Messages are specific (e.g., "Falta añadir al menos un género musical") and not generic.
- AC-MUS-018-3: The user can navigate directly to the pending section.

---

# 2. Non-functional requirements

### NFR-001: Contact data never exposed

Contact information (phone numbers, emails, social handles) must never appear in:
- Public HTML responses
- API responses to unauthenticated or unauthorized users
- Search engine indexable content
- Any public field or metadata

### NFR-002: Performance

- Search results must load within 2 seconds under normal conditions.
- Profile pages must load within 2 seconds under normal conditions.

### NFR-003: Security

- Payment flows must use a PCI-compliant payment provider (e.g., Stripe).
- Contact data must be stored encrypted at rest.
- All API endpoints serving contact data must require authenticated session + payment/subscription verification.

### NFR-004: Language

- All user-facing interface text must be in Spanish.
- Internal code, database fields, and API identifiers must be in English.

### NFR-005: Mobile responsiveness

- The platform must be usable on mobile devices (phones and tablets).
- Critical flows (registration, wizard, search, payment) must function correctly on small screens.

### NFR-006: Accessibility

- Forms must include proper labels and ARIA attributes.
- Color contrast must meet WCAG AA standards for primary text and interactive elements.

---

# 3. Business rules summary

| ID     | Rule |
|--------|------|
| BR-001 | A single email can only be associated with one account. |
| BR-002 | The registration email is the protected contact email for the profile. |
| BR-003 | A profile can only be published when all required fields are complete. |
| BR-004 | Wizard progress must be saved automatically to prevent data loss. |
| BR-005 | Completion percentage is based on required fields only. |
| BR-006 | Optional fields improve score but do not block publication. |
| BR-007 | Description and other public text fields must be scanned for contact patterns before saving. |
| BR-008 | If contact information is detected in a public field, saving is blocked until corrected. |
| BR-009 | Profile image is optional and must not block publication. |
| BR-010 | Maximum image file size is 5 MB. |
| BR-011 | Event types are used as filterable metadata in search. |
| BR-012 | Music genres are used as filterable metadata in search. |
| BR-013 | Minimum booking duration must always be ≤ maximum booking duration. |
| BR-014 | Booking duration values must be whole numbers between 1 and 10. |
| BR-015 | Repertoire is optional but recommended; does not block publication. |
| BR-016 | Contact fields are stored as protected and must never appear in public-facing responses. |
| BR-017 | Profile email is always taken from the registration account. |
| BR-018 | Contact detection runs on save for all public free-text fields. |
| BR-019 | Detection patterns cover: phone numbers (including international), emails, URLs, @handles. |
| BR-020 | Only published profiles are accessible to bookers. |
| BR-021 | Public profile HTML must never include contact data, even in hidden elements. |
| BR-022 | One-time payment unlocks contact for one specific provider only. |
| BR-023 | A booker cannot be charged twice for the same provider contact. |
| BR-024 | System checks for existing unlock record before presenting payment option. |
| BR-025 | Subscription status is verified in real-time before rendering contact data. |
| BR-026 | An expired subscription reverts all contacts to the locked state. |
| BR-027 | Contact detection patterns: phone formats, email formats, URLs, @handles. |
| BR-028 | Contact detection applies on both creation and update operations. |

---

# 4. Required fields for profile publication

A provider profile cannot be published unless the following fields are complete:

- Stage name or provider name *(required)*
- Provider type *(required)*
- Short description *(required)*
- Base location *(required)*
- At least one music genre *(required)*
- At least one event type *(required)*
- Minimum booking duration *(required)*
- Maximum booking duration *(required)*
- At least one pricing model: hourly or event-based *(required)*
- At least one contact point: phone or email *(required)*

---

# 5. Publicly visible vs. protected information

## Visible on the public profile (no payment required)

- Stage name
- Provider type
- Description (after contact scan)
- Base location
- Music genres
- Event types
- Booking durations
- Repertoire
- Prices or price references
- Main image (if uploaded)

## Protected — only visible after payment or active subscription

- Phone numbers
- Email addresses
- Social media handles or direct contact links
- Any text that bypasses the contact model

---

# 6. Prioritized implementation scope

## Priority 1 — Marketplace functional foundation

Covers: US-MUS-001 through US-MUS-015, US-CON-001 through US-CON-009, US-SEO-001

## Priority 2 — Initial monetization

Covers: US-MON-001 through US-MON-006

## Priority 3 — Trust and efficiency

Covers: US-MUS-016 through US-MUS-018, US-CON-010 through US-CON-011

## Priority 4 — Future evolution (out of current scope)

- Verified reviews
- Availability calendar
- Custom quotes
- Internal chat
- Booking packages
- Provider analytics
- Advanced profile verification

---

*Document created: 2026-05-07*
*Source: behavioral_experience.md*
*Status: confirmed*
