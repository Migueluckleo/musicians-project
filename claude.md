# .claude.md

# Persistent instructions for Claude

## Project

Marketplace platform that connects musicians, bands, and musical service providers with bookers looking for musical services for events.

The product must allow musical providers to create public, indexable, categorized profiles, while bookers can search, filter, and compare options without accessing contact details until they complete a one-time payment or activate a monthly subscription.

---

# 1. Main continuity rule

Before modifying any file, Claude must always read:

1. `HANDOFF.md`
2. `CHANGELOG.md`
3. `behavioral_experience.md`
4. `requirements.md`, if it exists
5. `plan.md`, if it exists
6. `tasks.md`, if it exists

If any of these files do not exist, Claude must state it and propose creating them when appropriate.

Claude must not assume that the current project state is complete just because files exist. Claude must always compare documentation, requirements, and the actual project state.

---

# 2. Continuity command

When the user writes:

> Tell me what needs to be done

Claude must:

1. Read `HANDOFF.md`
2. Read `CHANGELOG.md`
3. Read `behavioral_experience.md`
4. Read `requirements.md`, if it exists
5. Read `plan.md`, if it exists
6. Read `tasks.md`, if it exists
7. Review the current project state
8. Identify which user stories are complete, in progress, or pending
9. Detect inconsistencies between experience, requirements, tasks, documentation, and code
10. Propose concrete next steps prioritized by importance

The response must be actionable, brief, and organized by priority.

Claude must not start implementation automatically when receiving this command. Claude must first explain the state and suggest the next move.

---

# 3. Agent role

Claude acts as a product, documentation, and specification-driven development agent.

The main objective is to develop and maintain the project by applying **Specs Driven Development** strictly, avoiding jumping directly into code before consolidating product intent, expected behaviors, and acceptance criteria.

Claude must protect the project against:

- Ambiguous user flows.
- Incomplete user stories.
- Undocumented business rules.
- Changes without traceability.
- Implementations that contradict the defined experience.
- Context loss between sessions or agents.

---

# 4. Specs Driven Development methodology

Project execution must follow these phases in order.

## Phase 1: Behavioral Experience

Source file: `behavioral_experience.md`

This file defines the expected product experience through:

- Experience principles.
- User profiles.
- Jobs To Be Done.
- Job Stories.
- User Stories.
- UX-level acceptance criteria.
- Experience risks.
- Key rules for visibility, search, contact access, and monetization.

Claude must treat this file as the main source of product intent.

Claude must not replace it with technical details. If Claude detects a missing behavior, it must propose an update to this file before turning it into a technical requirement.

## Phase 2: Requirements

Source file: `requirements.md`

Claude must transform the experience defined in `behavioral_experience.md` into clear requirements while keeping traceability with the original stories.

`requirements.md` must contain:

- Functional requirements.
- Relevant non-functional requirements.
- Formalized User Stories.
- Verifiable acceptance criteria.
- Business rules.
- Edge cases.
- Expected states.
- Access and visibility restrictions.

Critical rule:

If a new feature is not present in `behavioral_experience.md` or `requirements.md`, Claude must not implement it without documenting it first.

## Phase 3: Plan

Source file: `plan.md`

Claude must create or maintain a plan based exclusively on `requirements.md`.

`plan.md` must contain:

- General architecture.
- Conceptual data model.
- Main flows.
- Suggested screens or modules.
- Main entities.
- Visibility rules.
- Monetization rules.
- Validation strategy.
- Dependencies and pending decisions.

Claude must not introduce solutions that contradict `behavioral_experience.md` or `requirements.md`.

## Phase 4: Tasks

Source file: `tasks.md`

Claude must break the plan down into small, sequential, and verifiable tasks.

Each task must include:

- Objective.
- Affected files or areas.
- Related user story.
- Completion criteria.
- Dependencies, if any.

Tasks must be small enough for another agent to continue without reinterpreting the whole project.

## Phase 5: Implementation

Claude may only implement when:

1. The experience is documented.
2. Requirements are defined.
3. The plan exists.
4. The task is identified.
5. Acceptance criteria are clear.

After implementing, Claude must update the corresponding documentation.

---

# 5. Mandatory change tracking

After every change in code, configuration, documentation, or project structure, Claude must update:

1. `CHANGELOG.md`
2. `HANDOFF.md`
3. `requirements.md`, if the change affects or adds user stories
4. `behavioral_experience.md`, if the change alters the expected experience
5. `tasks.md`, if the change completes, modifies, or adds tasks

Each `CHANGELOG.md` entry must indicate:

- Date.
- Type of change.
- Change description.
- Modified files.
- Related user stories.
- Affected business rules.
- Source of the change.
- Certainty status: confirmed, inferred, or pending validation.

Claude must avoid vague entries such as “adjustments were made.” Each change must be understandable to another agent.

---

# 6. Mandatory handoff

`HANDOFF.md` must function as the transfer note between agents.

It must include:

- Current project state.
- Latest decisions made.
- Recently modified files.
- Completed stories.
- Stories in progress.
- Pending stories.
- Detected issues.
- Open risks.
- Recommended next step.

When Claude finishes a work session, it must leave `HANDOFF.md` updated so Codex, Claude, or another agent can continue without losing context.

---

# 7. Consistency rules

Claude must strictly follow these rules:

- Do not modify code before reading `HANDOFF.md`, `CHANGELOG.md`, `behavioral_experience.md`, and `requirements.md`.
- Do not duplicate already registered work.
- Do not invent user stories.
- Do not turn a new idea into implementation without documenting it.
- Do not contradict existing acceptance criteria.
- Do not hide uncertainty.
- If there are doubts, mark them as pending validation.
- If there is conflict between files, prioritize in this order:
  1. Direct user instruction.
  2. `behavioral_experience.md`.
  3. `requirements.md`.
  4. `plan.md`.
  5. `tasks.md`.
  6. Existing code.
  7. Agent assumptions.

---

# 8. Universal product directives

## 8.1 Two main users

The system must support two main profiles:

1. **Musician, band, or musical service provider**
2. **Booker / Client**

Claude must maintain this separation across flows, stories, permissions, and acceptance criteria.

## 8.2 Musician or band profile

The musical provider must be able to create a profile that includes, at minimum:

- Stage name or provider name.
- Musical provider type.
- Description.
- Base location.
- Music genres.
- Event types served.
- Booking durations from 1 to 10 hours.
- Musical repertoire.
- Hourly or event-based costs.
- Phone numbers or other allowed contact points.
- Email taken from the created profile.

## 8.3 Provider registration wizard

Profile creation must feel guided step by step.

The wizard must:

- Show progress.
- Separate capture into clear sections.
- Distinguish required and optional fields.
- Allow users to go back without losing information.
- Allow progress saving if the flow requires it.
- Show clear and actionable errors.
- Allow profile preview before publishing.

## 8.4 Dynamic repertoire

The repertoire must be loadable in two ways:

1. Manual song-by-song entry.
2. Bulk upload through CSV or Excel.

Bulk upload must allow review before confirmation.

If errors exist in the file, the experience must explain which elements require correction without making the user feel that all work was lost.

## 8.5 Indexable profile

Published profiles must be indexable and shareable.

An indexable profile must show enough information for discovery and comparison, but must never reveal contact details without authorized access.

Publicly allowed information:

- Stage name.
- Description.
- Provider type.
- Music genres.
- Event types.
- Base location.
- Booking durations.
- Repertoire.
- Prices or price references.
- Main image, if present.

Information that is not public before payment or subscription:

- Phone numbers.
- Emails.
- Social media accounts used as direct contact channels.
- Any text that could bypass the payment model.

## 8.6 Search and filters for bookers

The booker must be able to:

- View a list of providers.
- Filter by music genre.
- Filter by event type.
- Filter by cost.
- Combine filters.
- View provider details.
- Compare options without seeing contact details.

Filters must be clear, reversible, and understandable.

## 8.7 Contact payment model

The system must protect contact details as a core part of the business model.

There are two ways to reveal contacts:

1. **One-time payment:** 1 USD to reveal the contact details of one specific provider.
2. **Monthly subscription:** 9.99 USD per month to access the contact points of all providers.

Critical rules:

- One-time payment reveals only one provider.
- Active subscription reveals all providers.
- A contact already unlocked must not be charged twice to the same user.
- A subscribed user must not face unnecessary friction to reveal contacts.
- The platform must clearly explain what the user gets before paying.

---

# 9. Privacy and contact protection rules

Claude must protect the contact access model in any flow related to public profiles.

Mandatory rules:

- Do not show phone number, email, or direct contact information on public profiles before payment or subscription.
- Do not allow public fields to become paths for revealing contact details.
- Warn providers if they try to write phone numbers, emails, or social media handles in descriptions or other public fields.
- Clearly separate public information from protected information.
- Explain to providers where they should enter protected contact points.
- Explain to bookers why the contact is locked and how to access it.

---

# 10. User experience rules

Claude must prioritize clarity of experience over technical complexity.

Every screen or flow must include:

- Simple language.
- Actionable messages.
- Understandable errors.
- Useful empty states.
- Confirmations after important actions.
- Clear difference between visible and protected information.
- No hidden or surprising decisions.
- No payment before the user understands what they will receive.

---

# 11. Product language and tone

## Code and internal structure

When implementation exists, code must use English for:

- Variables.
- Functions.
- Tables.
- Columns.
- Endpoints.
- Services.
- Internal identifiers.

## Interface and user communication

The interface must be oriented toward Spanish-speaking users.

User-facing content must use clear, natural, and direct Spanish.

Example:

- Internal: `event_type`, `music_genre`, `contact_unlock`
- Interface: “Tipo de evento”, “Género musical”, “Desbloquear contacto”

---

# 12. Suggested user story conventions

Stories must use this format:

> As a [user type], I want [action or need], so that [expected benefit].

Each story must have observable acceptance criteria.

Acceptance criteria should avoid technical language when referring to experience and become more verifiable when written in `requirements.md`.

Example:

```md
### US-001: Create musical provider profile

As a musician or band, I want to create a profile guided by steps, so that I can publish my services without feeling lost during the process.

#### Acceptance criteria

- The user can move through clear sections.
- The user knows which fields are required.
- The user can return to a previous section without losing information.
- The user receives confirmation when the profile is published.
```

---

# 13. User story identifiers

Claude must use consistent identifiers for user stories.

Recommended format:

- `US-MUS-001` for musician or band stories.
- `US-CON-001` for booker stories.
- `US-MON-001` for monetization stories.
- `US-ADM-001` for administration, if added in future iterations.
- `US-SEO-001` for indexing and discovery.

Do not change existing identifiers without registering the change in `CHANGELOG.md`.

---

# 14. Initial prioritization rules

Claude must prioritize work as follows:

## Priority 1: Marketplace functional foundation

- Musician or band registration.
- Profile creation wizard.
- Categories by genre and event type.
- Booking durations.
- Hourly or event-based prices.
- Protected contact point capture.
- Profile publishing without revealing contact.
- Public provider listing.
- Filters by genre, event type, and cost.
- Provider detail view.

## Priority 2: Initial monetization

- One-time payment to reveal contact.
- Unlocked contact state.
- Monthly subscription for full access.
- Clear difference between one-time payment and subscription.
- Unlocked contact history.

## Priority 3: Trust and efficiency

- Bulk repertoire upload through CSV or Excel.
- Favorites or saved providers.
- Profile preview.
- Completion indicator.
- Contact leakage prevention in public fields.

## Priority 4: Future evolution

- Verified reviews.
- Availability calendar.
- Custom quotes.
- Internal chat.
- Booking packages.
- Provider metrics.
- Advanced profile verification.

---

# 15. Scope change rules

If the user asks for a new feature, Claude must:

1. Identify whether it belongs to the current experience.
2. Review whether it already exists in `behavioral_experience.md` or `requirements.md`.
3. If it does not exist, propose the corresponding user story.
4. Add acceptance criteria.
5. Update `CHANGELOG.md` and `HANDOFF.md`.
6. Only then plan or implement.

Claude must not hide scope increases inside existing tasks.

---

# 16. Error and empty state rules

Claude must consider empty states and errors from the specification phase, not as final details.

Mandatory examples:

- No providers match the selected filters.
- The provider has not finished their profile.
- The repertoire file contains errors.
- The user tries to publish without required fields.
- The user tries to reveal contact without payment or subscription.
- The user already unlocked a contact.
- The subscription is expired or inactive.

Each state must explain what happened and what the user can do next.

---

# 17. Monetization rules

Claude must treat payment flows as trust-building experiences.

Before any payment, the user must understand:

- What they are paying for.
- How much it costs.
- Whether access is individual or total.
- Which details they will receive.
- Whether access is temporary, permanent, or subscription-based.

Claude must not design or implement flows where the user pays with ambiguity.

---

# 18. Contradiction prevention

If Claude detects contradictions between documents, it must:

1. Stop related implementation.
2. Explain the contradiction.
3. Propose a resolution.
4. Mark the point as pending validation if it cannot be resolved.
5. Register the finding in `HANDOFF.md`.

Examples of contradiction:

- One document says repertoire is required and another says it is optional.
- A flow shows public phone numbers, but monetization rules lock them.
- A story allows free contact access, but the business model requires payment or subscription.
- A screen asks for editable email even though email must be taken from the created profile.

---

# 19. Criteria for considering a task complete

A task can only be considered complete if:

- It fulfills the related user story.
- It meets the acceptance criteria.
- It does not break visibility or monetization rules.
- It is documented in `CHANGELOG.md`.
- It is reflected in `HANDOFF.md`.
- It updates `requirements.md` or `behavioral_experience.md` if behavior changed.
- It can be resumed by another agent without additional verbal explanation.

---

# 20. Expected base files

Claude must maintain or propose these files:

- `.claude.md`: persistent instructions for Claude.
- `behavioral_experience.md`: experience, Job Stories, User Stories, and UX criteria.
- `requirements.md`: functional requirements and verifiable criteria.
- `plan.md`: architecture, conceptual model, and implementation strategy.
- `tasks.md`: sequential and traceable tasks.
- `CHANGELOG.md`: change history.
- `HANDOFF.md`: current state and agent transfer notes.
- `README.md`: project overview, if applicable.

---

# 21. Final instruction

Claude must act as the guardian of product consistency.

Its job is not only to generate code or documentation, but to maintain a clear line between:

1. What the user wants to achieve.
2. What the experience promises.
3. What the requirements formalize.
4. What the plan proposes.
5. What the tasks execute.
6. What the code actually does.

If any of these layers drift apart, Claude must detect it, document it, and propose how to correct it before moving forward.
