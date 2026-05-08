# behavioral_experience.md

## Project: Musician and Band Booking Marketplace

## Purpose of this document

This document defines the expected user experience for the platform through **Job Stories**, **User Stories**, and **UX-level acceptance criteria**.

The goal is to clarify what each user needs to accomplish, why they need it, and how the experience should behave and feel so the product remains clear, trustworthy, and useful from its first versions.

This document intentionally avoids technical language. Its purpose is to guide product decisions, UX design, content, validation, and development from real user behavior.

---

# 1. Product overview

The platform allows musicians, bands, and musical service providers to publish their services so they can be discovered by people looking to hire live music for events.

There are two main user types:

1. **Musician, band, or musical service provider**  
   A user who creates a public profile to offer services, display repertoire, define prices, categories, and basic booking conditions.

2. **Booker / Client**  
   A user who searches for musicians or bands for an event, filters options according to their needs, and pays to access the provider’s contact details.

A single person may need both experiences. For example, a booker who also performs music must be able to activate a musical provider profile from the same account, using the account name and email already registered, instead of creating a duplicate account with another email.

The business model is based on controlled access to contact information:

- Casual users pay **1 USD** to reveal the contact details of one specific provider.
- Frequent or professional users can subscribe for **9.99 USD per month** to access the contact details of all providers.

---

# 2. Experience principles

## 2.1 Clarity before complexity

The platform must explain each step in simple language. No user should feel they need technical, administrative, or advanced music industry knowledge to complete an action.

## 2.2 Guide without overwhelming

Forms, filters, and flows must progress step by step. The experience should feel guided, not like an endless wall of fields.

## 2.3 Trust from the first interaction

Both providers and bookers must feel that the platform protects their interests:

- The provider must trust that their information will be displayed correctly.
- The booker must trust that they will find real, clear, and comparable options.
- The platform must protect contact details in order to support the payment model.

## 2.4 Fast discovery

Bookers must be able to find relevant options without excessive navigation. Filters must be visible, understandable, and useful.

## 2.5 Indexable and shareable profiles

Musician and band profiles must be prepared to be discovered both inside and outside the platform, while ensuring contact details are not revealed without payment or subscription.

## 2.6 Flexibility for different levels of organization

Some musicians will have small repertoires and will prefer to add songs manually. Others will have long lists and need to upload them through CSV or Excel. The platform must support both paths without penalizing either one.

---

# 3. Main users

## 3.1 Musician, band, or musical service provider

### Description

A person or group that wants to offer musical services for events. This can include a solo artist, duo, mariachi group, versatile band, norteño group, DJ, classical ensemble, choir, jazz group, rock band, and others.

### Main needs

- Register easily.
- Create an attractive and clear profile.
- Define which event types they serve.
- Indicate music genres.
- Define booking durations.
- Upload or manually enter their repertoire.
- Set prices by hour or by event.
- Add protected contact points.
- Be discovered by bookers.
- Update their information when their offer changes.

### Possible fears or frictions

- Not knowing what information to provide.
- Feeling that the form is too long.
- Not having their repertoire in a specific format.
- Worrying that their contact details may be exposed without control.
- Not understanding how their published profile will look.
- Not knowing whether their profile is complete or ready to publish.

---

## 3.2 Booker / Client

### Description

A person who needs to hire music for an event. This can be a casual user organizing a party, wedding, or gathering, or a frequent user such as a wedding planner, event planner, agency, venue, restaurant, hotel, or company.

### Main needs

- Search for musicians or bands quickly.
- Filter by music genre.
- Filter by event type.
- Filter by cost.
- Compare options.
- Review repertoire, description, and basic conditions.
- Access contact details once they find a useful option.
- Clearly understand when and why they need to pay.
- Choose between one-time payment and monthly subscription.

### Possible fears or frictions

- Paying before knowing whether the provider is relevant.
- Not understanding what the payment includes.
- Finding incomplete or unreliable profiles.
- Not being able to compare prices easily.
- Feeling that the platform hides too much information.
- Not finding options for their event type.

---

# 4. Initial experience scope

## Included in this first definition

- Musician or band registration.
- Guided profile creation through a wizard-style form.
- Required information capture.
- Category assignment.
- Manual and bulk repertoire upload.
- Price definition.
- Contact point management.
- Public indexable profile without revealing contact details.
- Search and filtering for bookers.
- Contact reveal flow through one-time payment.
- Monthly subscription flow for frequent users.
- Basic profile states: incomplete, published, or pending completion.

## Out of scope for now, but recommended for future iterations

- Availability calendar.
- Full booking and payment inside the platform.
- Verified review system.
- Internal chat between booker and provider.
- Custom quotes.
- Promotional packages.
- Provider document verification.
- Automatic recommendation system.
- Advanced analytics dashboard for providers.

---

# 5. General Jobs To Be Done

## 5.1 Musician or band

When I want to offer my musical services online, I want to create a clear and complete profile without feeling lost, so potential clients can find me and quickly understand what I offer.

## 5.2 Casual booker

When I am organizing an event and need live music, I want to find trustworthy options and compare prices before paying, so I only contact providers who could actually work for me.

## 5.3 Frequent booker

When I regularly hire musicians for events, I want to access multiple contacts without paying one by one, so I can work faster and more profitably.

---

# 6. Musician or band experience

## Epic 1: Registration and account creation

### Job Story

When I want to offer my musical services on the platform, I want to create an account quickly and clearly, so I can start building my profile without confusion.

### User Story 1.1: Musical provider registration

As a musician or band, I want to register on the platform, so I can create and manage my service profile.

#### UX acceptance criteria

- The user understands from the beginning that they are creating an account as a musical provider.
- The registration form asks only for the information needed to start.
- The email address is associated with the profile and will be used as the base contact email.
- The user receives clear confirmation that the account was created.
- After registration, the user is guided to the profile creation process without having to search for the next step.
- If the user already has a booker account, they can create a musical provider profile from that same account without registering a second email.
- When an existing account activates a provider profile, the platform clearly explains that the current account name and email will be reused.

---

## Epic 2: Profile creation wizard

### Job Story

When I am creating my musical profile, I want the platform to guide me step by step, so I know what information to provide and avoid abandoning the process.

### User Story 2.1: Step-by-step guided form

As a musician or band, I want to complete my profile through a wizard-style form, so I can move through clear and manageable sections.

#### UX acceptance criteria

- The user sees which step of the process they are in.
- Each step has a clear title and a short explanation of what should be captured.
- The user can move forward, go back, and review information without losing what they entered.
- Required fields are clearly distinguished from optional fields.
- If required information is missing, the system explains what is missing and how to fix it.
- The form does not show too many questions at the same time.
- The user can save progress if they do not finish in one session.

### User Story 2.2: Profile completion status

As a musician or band, I want to know how complete my profile is, so I can understand whether it can already be published or what information is still missing.

#### UX acceptance criteria

- The user sees a clear profile progress indicator.
- The platform indicates which sections are complete and which need attention.
- If the profile cannot be published yet, the reason is clearly explained.
- The user can go directly to the section that needs correction.

---

## Epic 3: Basic provider information

### Job Story

When someone views my profile, I want them to understand who I am and what type of musical service I offer, so they can decide whether I am a good fit for their event.

### User Story 3.1: Artistic identity capture

As a musician or band, I want to add my stage name, description, and base location, so I can present myself correctly to potential bookers.

#### UX acceptance criteria

- The user can indicate whether they are a solo artist, band, group, DJ, or another type of musical provider.
- The user can write a short description of their musical proposal.
- The platform guides the user with examples of a good description.
- The base location is requested clearly to help bookers evaluate proximity or coverage.
- The public description does not include visible contact details.

### User Story 3.2: Photos or main image

As a musician or band, I want to add a main image to my profile, so I can build trust and make my listing more attractive.

#### UX acceptance criteria

- The user understands what type of image they should upload.
- The platform recommends clear, professional images related to the service.
- If no image is added, the system shows a neutral visual fallback without breaking the experience.
- The user can preview how the image will look on their profile.

---

## Epic 4: Service categories

### Job Story

When I register my service, I want to classify it by event types and music genres, so I can appear in relevant searches.

### User Story 4.1: Event type selection

As a musician or band, I want to select the event types I serve, so bookers can find me according to their needs.

#### UX acceptance criteria

- The user can choose one or multiple event types.
- Options use recognizable market language, such as weddings, quinceañeras, birthdays, corporate events, bars, restaurants, serenades, private parties, festivals, and religious events.
- The user can find options easily without reading an overwhelming list.
- If an option does not exist, the user has a clear way to indicate “other.”
- The selected categories are later shown on the public profile.

### User Story 4.2: Music genre selection

As a musician or band, I want to select my music genres, so I can be found by bookers looking for a specific style.

#### UX acceptance criteria

- The user can choose one or multiple music genres.
- Options may include regional Mexican, mariachi, norteño, banda, pop, rock, jazz, classical music, salsa, cumbia, reggaeton, versatile, electronic, and acoustic.
- The selection may distinguish between main genre and secondary genres if needed.
- The platform avoids making the user feel they must choose too many options to appear in searches.
- Selected genres are clearly shown on the profile.

---

## Epic 5: Booking durations

### Job Story

When I define my services, I want to indicate how long I can be booked for, so I can avoid requests that do not fit how I work.

### User Story 5.1: Minimum and maximum booking duration

As a musician or band, I want to define my booking durations between 1 and 10 hours, so I can set clear expectations with bookers.

#### UX acceptance criteria

- The user can select a minimum and maximum duration.
- The experience explains that these durations help estimate or understand the booking.
- The system avoids confusing combinations, such as a minimum duration greater than the maximum duration.
- The selected durations are clearly shown on the public profile.
- The booker can use these durations as a reference when comparing providers.

---

## Epic 6: Musical repertoire

### Job Story

When I show my repertoire, I want to upload my songs in the way that is easiest for me, so clients know what I can perform without forcing me to enter everything manually.

### User Story 6.1: Manual repertoire entry

As a musician or band, I want to add songs one by one, so I can build my repertoire directly on the platform.

#### UX acceptance criteria

- The user can add a song through simple fields.
- Each song can include at least song name and artist or reference.
- The user can add, edit, or remove songs before publishing.
- The experience allows the user to keep adding songs without restarting the form.
- If the repertoire is short, the process feels quick and light.

### User Story 6.2: Bulk repertoire upload

As a musician or band, I want to upload a CSV or Excel file with my repertoire, so I can load many songs without entering them one by one.

#### UX acceptance criteria

- The user understands that they can upload their repertoire through CSV or Excel.
- The platform explains what information the file should contain.
- A simple reference for the expected format is provided.
- After uploading the file, the user can review the list before confirming it.
- If there are errors in the file, the platform explains which songs need correction.
- An error in one song should not make the entire experience feel lost.
- The user can manually correct imported items.

### User Story 6.3: Public repertoire display

As a booker, I want to review a musician’s or band’s repertoire, so I can know whether they perform songs suitable for my event.

#### UX acceptance criteria

- The repertoire is shown in an organized and easy-to-explore way.
- If the list is long, the user can search or navigate within the repertoire.
- The display does not reveal provider contact details.
- The repertoire helps build trust before the user pays for contact access.

---

## Epic 7: Prices and costs

### Job Story

When I publish my services, I want to define how much I charge in a flexible way, so my profile reflects how I actually work.

### User Story 7.1: Hourly cost

As a musician or band, I want to assign an hourly cost, so bookers can estimate how much it would cost to hire me.

#### UX acceptance criteria

- The user can indicate an hourly cost.
- The platform explains that this price will be visible to bookers.
- The user understands whether the cost is approximate or fixed.
- The price is shown clearly on the profile and in search results.
- The system avoids publishing empty or confusing prices when they are required.

### User Story 7.2: Event-based cost

As a musician or band, I want to define a cost per event, so I can offer a fixed rate when my service does not depend only on hours.

#### UX acceptance criteria

- The user can choose whether they charge by hour, by event, or both.
- The platform explains the difference between both options.
- The public profile shows the pricing model in an understandable way.
- The booker can compare providers even if they use different pricing models.

### User Story 7.3: Range or starting price

As a booker, I want to understand the starting price for hiring a provider, so I know whether they fit my budget before paying for contact details.

#### UX acceptance criteria

- Search results show a clear price reference.
- When the price may vary, it is communicated as “starting at” or “approximate.”
- The platform avoids creating false expectations about the final cost.
- The user understands they must contact the provider to confirm specific details.

---

## Epic 8: Protected contact points

### Job Story

When I add my contact details, I want the platform to protect them, so only users who pay or subscribe can see them.

### User Story 8.1: Contact point capture

As a musician or band, I want to add phone numbers and other allowed contact points, so bookers can contact me after paying or subscribing.

#### UX acceptance criteria

- The user can add one or multiple phone numbers.
- The email is taken from the created profile and this is clearly communicated to the user.
- The platform explains that these details will not be publicly open.
- The user can review which details will be revealed after payment.
- Contact fields include understandable validations and clear messages.

### User Story 8.2: Contact protection on public profile

As a musician or band, I want my contact details to not appear freely on my public profile, so the platform respects the controlled access model.

#### UX acceptance criteria

- The public profile does not show phone numbers or email before payment or subscription.
- Description, repertoire, or visible fields must not be used to display contact details.
- If the provider tries to write contact details in public fields, the platform must warn them clearly.
- The booker understands they can access contact details through one-time payment or subscription.

---

## Epic 9: Profile publishing

### Job Story

When I finish entering my information, I want to review how my profile will look before publishing it, so I feel confident that my offer is well presented.

### User Story 9.1: Profile preview

As a musician or band, I want to preview my profile before publishing it, so I can confirm that the information will be displayed correctly.

#### UX acceptance criteria

- The user can see a preview version of their public profile.
- The preview clearly indicates what information will be public and what information will be protected.
- The user can go back to edit any section from the preview.
- The user receives clear confirmation when publishing the profile.

### User Story 9.2: Indexable profile

As a musician or band, I want my profile to be discoverable through search engines and inside the platform, so I can increase my booking opportunities.

#### UX acceptance criteria

- The published profile has a clear and complete presentation for visitors.
- Visible information helps users understand the service without revealing contact details.
- The profile can be shared through a clear link.
- The stage name, genres, event types, and base location help discovery.
- The user understands that the more complete the profile is, the easier it will be to find.

---

# 7. Booker experience

## Epic 10: Provider exploration

### Job Story

When I need music for an event, I want to explore available providers quickly, so I can find options that match my needs.

### User Story 10.1: View musician and band listings

As a booker, I want to see a list of musicians and bands, so I can compare options before deciding whom to contact.

#### UX acceptance criteria

- The listing shows enough information to compare options without revealing contact details.
- Each result includes name, provider type, genres, event types, base location, and price reference.
- Results are presented in a scannable and clear way.
- The user can open a provider detail page to learn more.
- If there are no results, the platform shows a useful explanation and options to adjust the search.

---

## Epic 11: Search filters

### Job Story

When I search for musicians for an event, I want to filter by what I actually need, so I do not waste time reviewing irrelevant options.

### User Story 11.1: Filter by music genre

As a booker, I want to filter providers by music genre, so I can find options that match the atmosphere of my event.

#### UX acceptance criteria

- The genre filter is visible and easy to understand.
- The user can select one or multiple genres.
- The results list changes clearly according to the selection.
- The user can remove filters without losing search context.

### User Story 11.1A: Quick search from home

As a booker, I want to type a genre, event, or city directly from the home search bar, so I can reach matching providers without opening advanced filters first.

#### UX acceptance criteria

- The home search bar accepts text immediately when the user clicks it.
- Pressing Enter or the "Buscar" button takes the user to matching provider results.
- Matching results can come from provider name, genre, event type, city, provider type, or public description.
- The results page explains the active search and allows the user to clear it.
- Advanced filters remain available after the quick search without forcing the user to restart.
- Advanced filters stay collapsed on search results until the user opens them with a "Filtros" button, so the result cards remain easy to scan.

### User Story 11.2: Filter by event type

As a booker, I want to filter providers by event type, so I can find musicians with experience or focus on events similar to mine.

#### UX acceptance criteria

- The user can choose the type of event they are organizing.
- Event options use everyday language.
- Results show providers compatible with that event type.
- The user understands when there are no matches and can modify the filter.

### User Story 11.3: Filter by cost

As a booker, I want to filter providers by cost, so I can focus on options within my budget.

#### UX acceptance criteria

- The cost filter allows the user to define a budget range.
- The platform explains whether the price is hourly, event-based, or starting at a certain amount.
- Results show prices consistently and in a way that is easy to compare.
- The user can change the range without restarting the entire search.

### User Story 11.4: Combined filters

As a booker, I want to combine genre, event type, and cost filters, so I can find providers closer to what I need.

#### UX acceptance criteria

- The user can apply multiple filters at the same time.
- The platform clearly shows which filters are active.
- The user can clear all filters easily.
- The experience prevents users from feeling trapped in a search with no results.
- Filter controls do not visually compete with result cards; they can be opened only when the user asks for them.

---

## Epic 12: Provider detail

### Job Story

When I find an interesting provider, I want to review their full profile before paying for their contact details, so I can decide whether they are worth contacting.

### User Story 12.1: Public provider profile for bookers

As a booker, I want to see the detailed profile of a musician or band, so I can evaluate whether they fit my event.

#### UX acceptance criteria

- The profile shows name, description, genres, event types, booking durations, repertoire, and prices.
- Contact details remain hidden before payment or subscription.
- The platform visibly explains how to access contact details.
- The user can return to the listing without losing their search.
- The profile feels trustworthy and does not look incomplete.

### User Story 12.2: Trust signals on the profile

As a booker, I want to see signals that help me trust the provider, so I can reduce risk before paying for contact access.

#### UX acceptance criteria

- The profile indicates whether it is complete or verified according to the rules available at the current stage.
- Main information is organized and not hidden.
- Repertoire and categories help explain the provider’s real offer.
- The platform avoids exaggerating promises it cannot guarantee.

---

# 8. Contact access model

## Epic 13: Reveal contact through one-time payment

### Job Story

When I find a provider I am interested in, I want to pay only to reveal their contact details, so I can communicate with them without committing to a subscription.

### User Story 13.1: One-time payment for contact

As a casual booker, I want to pay 1 USD to reveal the contact details of one specific provider, so I can communicate with them directly.

#### UX acceptance criteria

- The user understands that the payment reveals only the contact details of the selected provider.
- The 1 USD price is shown before confirmation.
- The platform explains which details will be revealed after payment.
- The user does not feel they are paying without knowing what they will receive.
- After payment, contact details appear clearly and accessibly.
- The user receives confirmation of the completed action.

### User Story 13.2: Previously unlocked contact

As a booker, I want to keep access to a contact I already paid for, so I do not have to pay twice for the same provider.

#### UX acceptance criteria

- If the user has already paid for a contact, the platform recognizes it.
- The profile shows that the contact is already unlocked.
- The user can see the details again without repeating the payment.
- The experience avoids duplicate charges by mistake.

---

## Epic 14: Subscription for frequent users

### Job Story

When I need to contact providers regularly, I want to pay a monthly subscription, so I can access multiple contacts without paying one by one.

### User Story 14.1: Monthly subscription offer

As a frequent booker, I want to subscribe for 9.99 USD per month, so I can see the contact points of all providers.

#### UX acceptance criteria

- The platform clearly explains what the subscription includes.
- The monthly price of 9.99 USD is shown visibly.
- The user understands the difference between one-time payment and subscription.
- The subscription is presented as a useful option for users who contact several providers.
- The user can decide without feeling forced.

### User Story 14.2: Full contact access with active subscription

As a subscribed user, I want to see the contact details of all providers, so I can work quickly without individual payments.

#### UX acceptance criteria

- While the subscription is active, contacts appear available on profiles.
- The platform indicates that access comes from the active subscription.
- The user does not see unnecessary one-time payment prompts while subscribed.
- If the subscription is no longer active, the platform clearly explains the access change.

### User Story 14.3: Compare one-time payment and subscription

As a booker, I want to compare access options, so I can choose the one that best fits my usage.

#### UX acceptance criteria

- The platform shows both options clearly.
- One-time payment is explained as access to a single provider.
- Subscription is explained as access to all providers while active.
- The user can quickly identify which option is better if they plan to contact several providers.

---

# 9. Recommended missing flows

## Epic 15: Profile editing and maintenance

### Job Story

When my repertoire, prices, or contact details change, I want to update my profile easily, so my information remains current.

### User Story 15.1: Edit published profile

As a musician or band, I want to edit my profile after publishing it, so I can keep my service offer updated.

#### UX acceptance criteria

- The user can easily access profile editing.
- Changes are organized using the same sections as the wizard.
- The user can save changes without rebuilding the entire profile.
- The platform confirms when changes have been applied.
- The user can preview important changes before publishing them.

---

## Epic 16: Contact leakage prevention

### Job Story

When the platform protects contact details, I want the experience to prevent accidental publication of those details, so the business model remains sustainable.

### User Story 16.1: Contact detail warning in public fields

As the platform, I want to warn providers when they try to write phone numbers, emails, or social media handles in public fields, so contact details are not revealed without payment.

#### UX acceptance criteria

- The warning uses clear and non-accusatory language.
- The provider understands why they should not publish contact details in descriptions, repertoire, or visible fields.
- The platform indicates where they should place protected contact points instead.
- The user can correct the content without losing what they wrote.

---

## Epic 17: Favorites or saved providers

### Job Story

When I am comparing providers, I want to save interesting options, so I can review them before deciding whom to contact.

### User Story 17.1: Save favorite providers

As a booker, I want to save musicians or bands to a list, so I can compare options before paying for contact access.

#### UX acceptance criteria

- The user can save a provider from the listing or profile.
- The save action is clear and reversible.
- The user can view their saved providers.
- Saving a provider does not reveal contact details.
- The experience helps the user compare without pressuring them to pay immediately.

---

## Epic 18: Unlocked contact history

### Job Story

When I have already paid for contacts, I want to see my unlocked provider history, so I can recover information without searching from scratch.

### User Story 18.1: Revealed contact history

As a booker, I want to see the contacts I have already unlocked, so I can access them again when I need them.

#### UX acceptance criteria

- The user can see a list of previously unlocked contacts.
- Each item shows the provider and approximate unlock date.
- The user can return to the provider profile from the history.
- The experience prevents the user from paying again for the same contact.

---

## Epic 19: Status and empty states

### Job Story

When something is unavailable or I cannot find results, I want a useful explanation, so I know what I can do next.

### User Story 19.1: Empty states in search

As a booker, I want to see useful messages when there are no results, so I can adjust my search without frustration.

#### UX acceptance criteria

- The message avoids blaming the user.
- The platform suggests concrete actions, such as removing filters or expanding the budget.
- The user can clear filters easily from the empty state.
- The empty state maintains trust in the platform.

### User Story 19.2: Incomplete profile states

As a musician or band, I want guidance when my profile is incomplete, so I know exactly what I need to complete.

#### UX acceptance criteria

- The platform shows which section is missing.
- Messages are specific and actionable.
- The user can go directly to the pending section.
- The experience avoids generic messages such as “error” or “missing data.”

---

# 10. Key experience rules

## 10.1 Minimum required information to publish a profile

For a musician or band to publish their profile, it must include at least:

- Stage name or provider name.
- Musical provider type.
- Short description.
- Base location.
- At least one music genre.
- At least one event type.
- Minimum and maximum booking duration.
- At least one pricing model.
- At least one protected contact point.

Repertoire may be recommended but not necessarily required for a first version, although the platform should explain that adding it improves booker trust.

## 10.2 Publicly visible information

The public profile may show:

- Stage name.
- Provider type.
- Description.
- Base location.
- Music genres.
- Event types.
- Booking durations.
- Repertoire.
- Prices or price references.
- Main image.

The public profile must not show:

- Phone numbers.
- Emails.
- Social media accounts used as direct contact channels.
- Provider-written messages that attempt to bypass the access model.

## 10.3 Contact access

Contact details are revealed only when:

- The booker pays 1 USD for a specific provider.
- The booker has an active monthly subscription of 9.99 USD.

## 10.4 Difference between casual and frequent users

The platform should communicate this difference through value, not internal labels.

- Casual user: “I only need to contact this provider.”
- Frequent user: “I need to contact several providers during the month.”

---

# 11. Suggested experience metrics

These metrics help evaluate whether the experience fulfills its purpose.

## For musicians or bands

- Percentage of users who complete the wizard.
- Percentage of profiles published.
- Sections with the highest abandonment.
- Average number of songs added to repertoire.
- Manual upload usage versus file upload usage.
- Number of profiles with complete pricing information.

## For bookers

- Usage of genre, event type, and cost filters.
- Percentage of searches with results.
- Percentage of profiles viewed from results.
- Percentage of contacts unlocked through one-time payment.
- Percentage of users who choose subscription.
- Number of contacts unlocked per subscribed user.
- Repeat usage after the first unlocked contact.

---

# 12. Experience risks

## Risk 1: The musician abandons the wizard because it feels too long

Mitigation:

- Divide the form into short steps.
- Show progress.
- Allow save and continue later.
- Explain why each section matters.

## Risk 2: The booker does not want to pay because they do not trust the profile

Mitigation:

- Show enough information before payment.
- Improve presentation of repertoire, prices, and categories.
- Add completion or verification signals when possible.

## Risk 3: Providers try to publish contact details in visible fields

Mitigation:

- Explain from the form how the model works.
- Detect and warn about phone numbers, emails, or social media in public fields.
- Provide correct protected fields for contact points.

## Risk 4: Prices are not comparable

Mitigation:

- Clearly distinguish between hourly price, event-based price, and starting price.
- Allow flexible filters.
- Communicate that final price may depend on the event.

## Risk 5: The booker does not understand the difference between one-time payment and subscription

Mitigation:

- Present both options at the moment of revealing contact.
- Use clear convenience examples.
- Avoid aggressive sales language.

---

# 13. Suggested initial backlog by priority

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

## Priority 3: Trust and efficiency improvements

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
- Provider analytics.
- Advanced profile verification.

---

# 14. Definition of successful experience

The experience will be successful when:

- A musician or band can create a complete profile without external help.
- The user understands which information will be public and which will be protected.
- The booker can find relevant options using simple filters.
- The booker can evaluate enough information before paying.
- The contact access payment model feels like a natural part of the experience.
- The platform prevents contact details from being revealed without payment or subscription.
- Published profiles are clear, comparable, and indexable.

---

# 15. Product note

This document should grow as new behaviors, business rules, and edge cases are discovered.

Every new screen, flow, or important adjustment must connect to a Job Story, User Story, or acceptance criterion in this file.

The intention is not documentation for documentation’s sake, but a clear foundation for product decisions without losing sight of real user behavior.
