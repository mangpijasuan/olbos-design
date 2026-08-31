# OLBOS DESIGN — Master Product Vision & Technical Audit

**Status:** Vision captured. Phase 0 audit complete. **Phase 1a (rebrand & cleanup) complete. Phase 1b (event-type registry) complete. Phase 1c (theme system) complete — Theme only, Fabric explicitly deferred.** Phase 1d–1e (generic invitation renderer, organizations) not yet started.

**Phase 1c — done (2026-08-31):** added a real `Theme` model (key, name, description, category, `tokens: Json`, swatch, sortOrder, isActive) holding a token contract of `{ colors: { background, primary, secondary, text, border }, typography: { heroFont: "script" | "display" } }`. Seeded 6 themes: the 5 existing templates' palettes extracted faithfully (Luxury Blush, Modern Editorial, Floral Romance, Minimal Emerald, Navy Elegance), plus one new "Midnight Luxe" theme that exists specifically to prove a theme is independently selectable from layout. `Invitation.themeId` is a required FK; `Invitation.theme: Json` (previously dead — flagged in the Phase 0 audit) now holds the *resolved token snapshot* at the time the theme was chosen, so a creator later editing a theme's tokens won't retroactively change an already-published invitation's look — a first, minimal instance of the §65 versioning principle.

All 5 template components were rewired to render from theme tokens via CSS custom properties (`--event-bg`, `--event-primary`, `--event-secondary`, `--event-text`, `--event-border`) set on each template's root element, replacing hard-coded Tailwind brand-color classes (`text-rose-gold`, `text-emerald`, navy's `GOLD`/`SILVER` JS constants, etc.) with `text-[var(--event-primary)]`-style arbitrary values — including opacity-modified variants, which work correctly against CSS custom properties under Tailwind v4's `color-mix()`-based opacity handling. Scope was deliberately bounded to the "big 5" universal touchpoints (background, primary/secondary accent, body text, border) plus the H1 headline's font family (`heroFont`) — bespoke per-template decorative details (radial glows aside, which do pick up the new tokens; modern's neutral-gray structural borders; a couple of secondary muted-text tones with no direct token equivalent) were deliberately left as template-native styling rather than forced into the token contract, consistent with 1c's scope boundary (full per-pixel theming is 1d's generic-renderer job, not this step's).

A `Theme` picker was added to the invitation builder alongside the existing `Template` picker, live-reactive in the preview pane. `GET /api/themes` + `use-themes.ts` follow the same pattern as 1b's event-type registry. **Fabric (material/texture — a comparably-sized feature) was deliberately not attempted in this pass**, to avoid rushing two double-scoped features into one slice; it's tracked as open work for a future 1c-2 or folded into 1d.

Verified: typecheck/lint clean, 36/36 unit tests, E2E smoke test, and a thorough browser pass — confirmed via direct API calls that a new event auto-resolves its layout's default theme with a correct token snapshot, confirmed switching an existing invitation's theme via `PATCH .../invitation` correctly re-resolves and re-snapshots tokens, and confirmed the *same* `luxury` layout renders dramatically differently between "Luxury Blush" (light cream/rose-gold) and "Midnight Luxe" (dark charcoal/champagne-gold) — the actual architectural proof point for this phase. Also confirmed the builder's Theme picker renders all 6 swatches correctly and updates the live preview instantly on selection. One real bug was caught and fixed along the way: a stale `PrismaClient` singleton in the already-running dev server (the `globalForPrisma` pattern that deliberately survives Fast Refresh) didn't pick up the new `Theme` model until the server process was restarted — not a code defect, but worth knowing when adding new Prisma models mid-session.

**Phase 1b — done (2026-08-31):** the hard-coded 14-value `EventType` Prisma enum is gone. Event types are now rows in a real `event_types` table (`EventTypeDefinition` model: `key`, `label`, `category`, `sortOrder`, `isActive`), seeded with the full ~63-entry catalog from the master prompt's §4 (Life & Family, Church & Faith, Education, Business, Social, Custom — a few labels that appeared in more than one of the prompt's example lists, like "Celebration," "Seminar," and "Fundraiser," were deduped to one category each rather than repeated). `Event.eventTypeId` is a required FK to it. Migrated via Prisma's expand/contract pattern: an additive migration added the new table + nullable FK alongside the old enum column, a seed script (`prisma/seed-event-types.ts`) populated the catalog and backfilled every existing event's `eventTypeId` from its legacy enum value (0 nulls confirmed before proceeding), then a finalizing migration dropped the old `type` column and enum entirely. `resolveEventType()` in `event-service.ts` now rejects unknown keys as a real validation error (400) instead of silently accepting anything — the registry, not a compile-time union, is the source of truth. The create/edit event forms now render a live `GET /api/event-types`-backed grouped-by-category `<Select>` (`EventTypeSelect`) instead of a hard-coded list; event cards, the admin events table, and the public invite page all read the real `eventType.label`/`.key` instead of guessing a label via `titleCase()`. Verified: typecheck/lint clean, 36/36 unit tests, E2E smoke test, and a full manual browser pass (created a live event through the new grouped picker, confirmed it round-trips through the edit form, the dashboard card, the admin table, and the public invite page — plus confirmed all 5 pre-existing demo events and prior E2E-test-created events display correct backfilled labels).

**Phase 1a — done (2026-08-30):** product renamed "Olbos Event" → "OLBOS DESIGN" across all user-facing text (logo, page metadata, hero, footer, billing page, transactional email sender, README, demo-seed host account) — infra identifiers (npm package name, Docker container/volume names, S3 bucket name, Postgres DB name) intentionally left unchanged since they're not user-facing and changing them risks breaking running local infrastructure for no user benefit. Unused starter SVGs deleted from `public/`. Unused `gsap` dependency removed. `next.config.ts` now sends `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, and `Strict-Transport-Security` on every response — CSP's `img-src` is derived from the same `REMOTE_IMAGE_HOSTS` list that feeds `next/image`'s `remotePatterns` so they can't drift apart, and `script-src` conditionally adds `'unsafe-eval'` only in dev (Next's webpack HMR runtime needs it; production doesn't get it). Verified: typecheck/lint clean, 36/36 unit tests pass, E2E smoke test passes, zero CSP console violations across signup/homepage/a full demo invitation page including its embedded Google Maps iframe.

This document is the living reference for evolving the current codebase (shipped under the product name **Olbos Event**, a single-tenant wedding/event-invitation vertical slice) into the much larger **OLBOS DESIGN** vision: a design ecosystem connecting creators, event organizers, organizations, and guests, with a creator marketplace, AI design tools, church/organization platform, and multi-tenant billing.

The current app is real and working — auth, event CRUD, 5 invitation templates, RSVP, guest management, QR check-in, analytics, Stripe billing, admin dashboard, 5 live demo invitations, 36 passing unit tests, and a passing E2E smoke test, all committed to `main`. Nothing here should be read as "the app is a prototype" — it's a genuine foundation. The gap is between that foundation and the ecosystem described below.

---

## A. Master Vision (as given)

> OLBOS DESIGN — MASTER PRODUCT & ENGINEERING PROMPT
> Create. Design. Celebrate.

The full master prompt is preserved here verbatim so future work (and future sessions, which do not retain this conversation's context) can act on it without re-deriving it.

<details>
<summary>Click to expand the full master prompt (76 sections)</summary>

You are now acting as the:

* Principal Software Architect
* Senior Full-Stack Engineer
* Product Designer
* UX Architect
* Design-System Engineer
* Database Architect
* Security Engineer
* AI Engineer
* Marketplace Architect
* SaaS Architect
* DevOps Engineer
* QA Engineer
* Accessibility Engineer
* Product Manager

Your responsibility is to transform the existing project into a production-ready SaaS platform called OLBOS DESIGN.

### 1. PRODUCT IDENTITY

Product: **OLBOS DESIGN**
Primary tagline: **Create. Design. Celebrate.**
Alternative positioning: *Design beautiful experiences for life's most meaningful moments.*

OLBOS DESIGN is a digital design and event experience platform where users can: create events; create digital invitations; design event pages; customize templates; choose themes; choose fabrics/textures; customize typography; create artwork; sell artwork; sell templates; sell themes; follow creators; discover designs; purchase designs; manage guests; collect RSVPs; share memories; manage church events; manage organizational events; use AI to create designs; build professional creator storefronts.

Do NOT build this as a simple invitation generator. The long-term vision is: OLBOS DESIGN is a design ecosystem connecting creators, event organizers, organizations, and guests.

### 2. IMPORTANT — INSPECT BEFORE MODIFYING

DO NOT immediately rebuild the existing application. First inspect the repository. Understand: current framework; frontend; backend; database; routes; components; CSS; JavaScript/TypeScript; authentication; APIs; existing invitation implementation; existing envelope implementation; existing assets; dependencies; tests; deployment configuration.

Identify what can be reused. Preserve working functionality. Improve incrementally. Do not delete functioning systems simply to replace them with your preferred architecture.

### 3. EXISTING INVITATION

The existing wedding invitation/envelope implementation is the foundation for the first OLBOS DESIGN experience. Preserve and improve: envelope; 3D flaps; wax seal; embossed texture; invitation card; opening animation; responsive behavior; typography; RSVP button.

Convert the existing implementation into reusable components, e.g. `<InvitationEnvelope theme={theme} fabric={fabric} seal="wax" animation="luxury" />`. Do not leave the envelope as one giant HTML/CSS block. Componentize it.

### 4. EVENT CATEGORIES

OLBOS DESIGN must support many types of experiences. The underlying architecture must be EVENT-TYPE AGNOSTIC.

**Life & Family:** Wedding, Engagement, Anniversary, Birthday, Baby Shower, Baby Announcement, Bridal Shower, Quinceañera, Family Reunion, Housewarming, Retirement, Celebration.

**Church & Faith** (a major first-class category): Sunday Worship, Sunday Service, Worship Night, Revival, Prayer Meeting, Bible Study, Church Conference, Youth Conference, Women's Conference, Men's Conference, Gospel Concert, Choir Program, Christmas Service, Easter Service, Baptism, Communion, Church Anniversary, Pastor Appreciation, Ordination, Mission Event, Fundraising, Church Retreat, Vacation Bible School, Fellowship, Community Outreach, Leadership Conference.

**Education:** Graduation, Graduation Party, School Event, Class Reunion, Award Ceremony, Academic Conference, Seminar, Student Organization Event.

**Business:** Corporate Event, Conference, Seminar, Workshop, Networking, Product Launch, Company Anniversary, Awards Ceremony, Fundraiser, Employee Event, Client Event.

**Social:** Dinner Party, Holiday Party, Reunion, Community Event, Fundraiser, Cultural Event, Concert, Celebration.

**Custom:** Allow users to create a Custom Event. Never hard-code the event types into the application architecture.

### 5. CORE ARCHITECTURE

```
OLBOS DESIGN
│
├── Event Engine
├── Design Engine
├── Theme Engine
├── Fabric Engine
├── Template Engine
├── Invitation Renderer
├── Design Studio
├── RSVP Engine
├── Guest Engine
├── Memories
├── Planning
├── Social
├── Creator Platform
├── Marketplace
├── AI Design Assistant
├── Organization Platform
├── Church Platform
├── Billing
└── Administration
```

Keep these systems modular.

### 6. EVENT MODEL

```json
{
  "id": "...", "ownerId": "...", "type": "wedding", "title": "Sophia & Liam",
  "slug": "sophia-liam", "date": "2026-10-24", "time": "16:00",
  "timezone": "America/Chicago",
  "location": { "name": "The Grand Pavilion Estate", "address": "1040 Willow Creek Lane" },
  "themeId": "...", "fabricId": "...", "status": "draft"
}
```

Do not mix event content with design configuration.

### 7. EVENT CONTENT SYSTEM

Events consist of reusable sections: Hero, Introduction, Story, Schedule, Venue, Gallery, Speakers, Countdown, FAQ, RSVP, Footer. Users can add, delete, duplicate, hide, reorder, customize sections. Use drag-and-drop where appropriate.

### 8. BLOCK SYSTEM

Sections contain reusable blocks. **General:** Hero, Heading, Text, Image, Video, Gallery, Countdown, Button, Divider, Quote, Timeline, Schedule, Map, RSVP, FAQ, Contact. **Wedding:** Couple, Our Story, Wedding Party, Ceremony, Reception, Dress Code, Registry, Accommodation, Transportation. **Graduation:** Graduate, School, Degree, Class Year, Achievements, Ceremony, Family Message. **Birthday:** Birthday Person, Age, Party Details, Wishlist, Dress Code. **Church:** Church Name, Ministry, Scripture, Pastor, Speaker, Worship Leader, Service Time, Sermon, Conference Schedule, Guest Speaker, Prayer Information, Registration, Giving, Volunteer, Location, Parking, Livestream, Church Ministries. **Corporate:** Company, Speakers, Agenda, Sessions, Sponsors, Registration, Location, Networking.

New blocks must be addable without rewriting the Event Engine.

### 9. CHURCH ORGANIZATION SYSTEM

Churches should not have to operate as ordinary personal accounts. Create an Organization system:

```
Grace Community Church
Organization
│
├── Dashboard
├── Profile
├── Events
├── Calendar
├── Ministries
├── Members
├── Volunteers
├── Announcements
├── Design Library
├── Templates
├── Analytics
└── Settings
```

Support organization members. Roles: Owner, Administrator, Pastor, Ministry Leader, Event Manager, Designer, Editor, Viewer. Use RBAC.

### 10. CHURCH EVENT EXPERIENCE

A church can create "Sunday Worship" with: Church Name, Service Date, Service Time, Location, Pastor, Worship Leader, Scripture, Speaker, Schedule, Map, Parking, Livestream, RSVP. The public event page should feel like a beautiful digital church announcement, not a generic SaaS page.

### 11. CHURCH DESIGN MARKETPLACE

Marketplace categories specifically for churches: Revival templates, Worship night templates, Youth ministry templates, Women's ministry templates, Men's ministry templates, Bible study templates, Easter templates, Christmas templates, Baptism templates, Church anniversary templates, Pastor appreciation templates, Gospel concert templates, Conference templates, Retreat templates, VBS templates, Outreach templates, Fundraising templates, Scripture graphics, Church social media templates. Creators can specialize in church design.

### 12. DESIGN STUDIO

Create OLBOS DESIGN STUDIO. The editor should feel premium and modern:

```
┌─────────────────────────────────────────────────────┐
│ OLBOS DESIGN                 Preview    Save Publish │
├──────────────┬──────────────────────┬───────────────┤
│ DESIGN       │                      │ PROPERTIES    │
│ Templates    │                      │ Colors        │
│ Themes       │    LIVE CANVAS       │ Typography    │
│ Fabrics      │                      │ Spacing       │
│ Colors       │                      │ Background    │
│ Typography   │                      │ Animation     │
│ Envelope     │                      │               │
│ Decorations  │                      │               │
│ Sections     │                      │               │
└──────────────┴──────────────────────┴───────────────┘
```

### 13. FABRIC SYSTEM

Fabric controls the material/tactile appearance of a design (independent of Theme). Examples: Ivory Paper, Champagne Silk, Black Velvet, Rose Linen, Pearl, Handmade Paper, Botanical Paper, Midnight, Cotton, Parchment, Satin, Canvas, Metallic, Embossed. Fabric controls texture, grain, surface, light, shadow, background, border, material appearance.

### 14. THEME SYSTEM

**Luxury:** Sacred Ivory, Royal Heritage, Midnight Luxe. **Romantic:** Garden Romance, Rose Garden, Champagne Bloom. **Modern:** Modern Editorial, Minimal White, Black & Pearl. **Church:** Sacred Light, Worship & Grace, Kingdom Heritage, Modern Ministry, Sunday Morning, Revival Fire, Gospel Heritage. **Graduation:** Graduation Prestige, Academic Editorial, Class of 2027. **Birthday:** Birthday Celebration, Modern Party, Elegant Celebration.

Themes should modify design tokens rather than generate uncontrolled CSS.

### 15. DESIGN TOKENS

colors, typography, spacing, radius, shadows, motion, breakpoints, textures, borders. Example:

```css
:root {
  --event-background: #f4eee2;
  --event-surface: #ffffff;
  --event-primary: #c49a45;
  --event-text: #3a342c;
}
```

Theme changes should override tokens.

### 16. CSS ARCHITECTURE

```
styles/
├── reset.css / variables.css / globals.css / typography.css / layout.css
├── accessibility.css / animations.css
├── components/ (buttons, cards, forms, modal, navigation, dropdown)
├── invitation/ (envelope, invitation, hero, countdown, gallery, timeline, venue, rsvp, church)
├── editor/ (editor, toolbar, sidebar, canvas, property-panel)
├── marketplace/ (marketplace, product-card, creator, storefront)
├── organization/ (organization, church, members)
└── responsive/ (mobile, tablet, desktop)
```

Avoid duplicated CSS. Use CSS variables. Use component-level styling where appropriate.

### 17. MOBILE-FIRST

The public invitation experience is mobile-first. Optimize for iPhone, Android, small/large phones, tablet, desktop. Do not simply scale the desktop interface down.

### 18. ENVELOPE EXPERIENCE

Sequence: Envelope appears → subtle animation → Tap to Open → wax seal disappears → top flap opens → invitation rises → invitation becomes interactive. Support `prefers-reduced-motion`. Animation must never prevent access to event information.

### 19. PUBLIC EVENT URL

`olbosdesign.com/e/[slug]`, e.g. `olbosdesign.com/e/sophia-liam`. Eventually support `customdomain.com`.

### 20. RSVP

Yes/No/Maybe, number attending, plus-one, meal preference, dietary restrictions, transportation, accommodation, song request, custom questions. Organizer can create custom questions.

### 21. GUEST MANAGEMENT

Fields: name, email, phone, category, status, plusOneAllowed, plusOneLimit, language, notes. Statuses: Invited, Opened, Pending, Confirmed, Declined. Support CSV import/export, filtering, search, bulk operations.

### 22. TRACKED INVITATION LINKS

Invitation groups: Family, Friends, VIP, Coworkers, Church Members, Day Guests, Evening Guests, Custom. Use secure opaque tokens. Never expose private guest information in URLs.

### 23. MEMORIES

OLBOS MEMORIES — guests can upload photos/short videos, write messages, view gallery. Support QR code ("SCAN TO SHARE YOUR MEMORIES — no app required"). Organizer controls approval, visibility, upload limits, video permissions, expiration.

### 24. EVENT PLANNING

PLANNING CENTER: Checklist, Budget, Timeline, Vendors, Seating, Tasks, Notes. For churches: volunteers, ministry assignments, service schedule, speaker schedule, worship schedule.

### 25. OLBOS DISCOVER

Browse: Trending, New, Popular, Editor's Picks, Best Sellers. Categories: Wedding, Birthday, Graduation, Church, Baby, Corporate, Luxury, Minimal, Floral, Modern, Traditional.

### 26. FOLLOWERS

Users can follow creators. Support follow/unfollow, likes, saves, shares, notifications, reporting.

### 27. CREATOR MARKETPLACE

Users can create and sell: themes, templates, invitations, artwork, backgrounds, envelopes, illustrations, patterns, digital stationery, event packs, church graphics, social media graphics, design collections.

### 28. CREATOR STUDIO

Sections: Overview, My Designs, Drafts, Published, Under Review, Sales, Earnings, Analytics, Followers, Reviews, Payouts, Settings.

### 29. CREATOR STOREFRONT

`olbosdesign.com/@username`.

### 30. CREATOR PRODUCT CREATION

Theme, Template, Invitation, Envelope, Artwork, Background, Decoration, Pattern, Collection, Event Pack. Support SVG/PNG/JPG/WebP, transparent assets. Validate all uploads.

### 31. MARKETPLACE WORKFLOW

Creator → Creates Design → Save Draft → Submit → Automated Validation → Moderation → Approved → Published → Customer discovers → purchases → uses design → Creator earns.

### 32. MARKETPLACE PRODUCT PAGE

Preview, Product Name, Creator, Rating, Uses, Price, Event Types, Description, What's Included, License, [Preview], [Use This Design]. Allow interactive preview.

### 33. CUSTOMER ENTITLEMENTS

Creator Master Design → Licensed Product → Customer Design Instance → Customer Event. Never modify the creator's original design. Customer customizations must create an independent instance.

### 34. LICENSING

Personal Event Use, Single Event License, Commercial License, Organization License. Creator confirms ownership or appropriate rights before submission.

### 35. COMMISSION ENGINE

OLBOS earns a configurable percentage from marketplace transactions (Creator Share / OLBOS Share / Payment Processing). Do NOT hard-code commission percentages — create Commission Rules configurable by administrators. Historical transactions must retain the commission rule used at purchase time.

### 36. FINANCIAL LEDGER

Immutable transaction ledger tracking gross amount, platform fee, payment processing fee, creator share, tax, refund, chargeback, net amount. Use integer minor currency units. Never use floating-point calculations for money.

### 37. CREATOR PAYOUTS

Use a marketplace-capable payment system such as Stripe Connect for live payouts. Support creator onboarding, identity verification, payout account, tax information, payout status, available/pending balance, payout history, refunds, chargebacks. Do not store unnecessary financial information.

### 38. CREATOR ANALYTICS

Views, Preview Opens, Uses, Purchases, Conversion, Revenue, OLBOS Fees, Creator Earnings, Favorites, Followers.

### 39. REVIEWS

Ratings, written reviews, verified purchases, creator responses, reporting. Prevent obvious review manipulation.

### 40. CREATOR COLLECTIONS

Creators organize products into named collections (e.g. Luxury Wedding, Church Collection, Birthday, Graduation, Holiday).

### 41. DESIGN BUNDLES

Sell bundles, e.g. Wedding Collection (Invitation, Save the Date, RSVP, Menu, Program, Thank You Card — $24.99) or Church Conference Pack (Main Invitation, Social Media Graphic, Speaker Card, Schedule, Registration, Thank You).

### 42. COPYRIGHT & MODERATION

Creators must confirm they own or have rights to uploaded assets. Implement copyright reporting, takedown process, moderation, product/creator suspension, dispute workflow, audit logs. Do not permit obvious copyrighted material to be resold without appropriate rights.

### 43. MARKETPLACE MODERATION STATES

DRAFT, SUBMITTED, UNDER_REVIEW, APPROVED, PUBLISHED, REJECTED, SUSPENDED, ARCHIVED. Admin controls: approve, reject, feature, suspend, remove, investigate.

### 44. AI EVENT CREATOR

OLBOS AI — user types a natural-language brief (e.g. "Create an elegant wedding invitation for Sophia and Liam on October 24, 2026 at 4 PM with ivory and champagne gold" or, for church, "Create a modern church revival invitation for Grace Community Church with navy, ivory, and gold"). AI generates event type/details, theme, fabric, palette, typography, sections, copy, RSVP, animation (church: church event, theme, typography, scripture section, speaker section, schedule, location, registration, design). Never automatically publish. Require user confirmation before publishing, purchases, sending invitations, deleting content, billing changes.

### 45. AI DESIGN ASSISTANT

Natural-language edits ("Make this more elegant," "Change the colors to ivory and burgundy," "Turn this wedding invitation into a birthday invitation"). AI should modify structured design tokens. Do not allow AI to inject arbitrary executable CSS or scripts.

### 46. MULTILINGUAL

Build i18n from the beginning. Initial languages: English, Spanish, Zomi, Burmese. Architecture must support future languages. Event owners can provide translated content. Guests can select language when enabled.

### 47. ORGANIZATION SYSTEM

Beyond churches: School, Company, Nonprofit, Event Planner, Community Organization. Structure: Members, Roles, Events, Templates, Designs, Calendar, Analytics, Settings.

### 48. USER ROLES

Guest, User, Creator, Professional Designer, Event Planner, Organization Owner, Organization Admin, Editor, Viewer, Admin, Super Admin. Use RBAC everywhere.

### 49. DATABASE

PostgreSQL. Core tables: users, organizations, organization_members, organization_roles, event_types, events, event_sections, event_blocks, themes, theme_versions, fabrics, palettes, fonts, envelopes, animations, guests, guest_categories, rsvps, rsvp_questions, rsvp_answers, tracked_links, photos, videos, messages, checklist_tasks, budgets, budget_items, vendors, seating_tables, seating_assignments, creator_profiles, creator_applications, creator_collections, marketplace_products, marketplace_product_versions, marketplace_assets, marketplace_categories, marketplace_licenses, marketplace_submissions, product_purchases, product_entitlements, product_reviews, creator_followers, product_favorites, product_likes, commission_rules, commission_transactions, creator_payouts, subscriptions, payments, notifications, analytics_events, audit_logs. Use foreign keys, indexes, unique constraints, migrations, transactions.

### 50. SECURITY

Secure authentication, password hashing, secure sessions, MFA-ready architecture, RBAC, authorization checks, rate limiting, API throttling, input validation, output encoding, SQL injection/XSS/CSRF protection, secure cookies, security headers, CSP, environment variables, encrypted secrets, audit logging, secure webhooks. Never expose passwords, private keys, API secrets, payment secrets, private guest data.

### 51. FILE SECURITY

Validate extension, MIME, file signature, size, dimensions, metadata. Sanitize SVG. Prevent embedded scripts, executable content, malicious files, path traversal. Use object storage.

### 52. PRIVACY

Public, Unlisted, Password Protected, Invitation Only. Organizers can delete events, export event data, delete guest data, control gallery visibility, disable analytics. Private events must not be indexed.

### 53. PUBLIC EVENT PERFORMANCE

Optimize images, video, fonts, CSS, JS, caching, CDN, lazy loading, responsive images. Do not load the complete design editor on a guest invitation page — separate public rendering from editor functionality.

### 54. SEO

Dynamic title, meta description, Open Graph, canonical URLs, structured metadata, sitemap. Private events use no-index controls.

### 55. ACCESSIBILITY

Target WCAG 2.2 AA where practical: semantic HTML, keyboard navigation, focus states, screen readers, ARIA, accessible forms/dialogs/RSVP, reduced motion, sufficient contrast.

### 56. ROUTES

```
/  /discover  /marketplace  /themes  /creators  /pricing  /login  /signup
/dashboard  /dashboard/events  /dashboard/events/[id]/{design,guests,rsvp,planning,seating,memories,analytics,settings}
/create  /create/[eventType]
/creator  /creator/{designs,sales,earnings,analytics}
/creator/[username]
/marketplace/[slug]
/organization/[id]/{events,members,calendar,designs}
/e/[slug]
/admin
```

### 57. BILLING

FREE (basic event, basic themes, limited guests, OLBOS branding), CREATOR (advanced creator tools, analytics, storefront customization, premium design tools), EVENT PRO (advanced RSVP, planning, memories, seating, analytics, premium features), ORGANIZATION (churches/schools/nonprofits/businesses/planners — multiple users, multiple events, org branding, advanced permissions, analytics). Do not hard-code prices.

### 58. DESIGN SYSTEM

Buttons, Inputs, Cards, Dialogs, Tabs, Tables, Dropdowns, Navigation, Badges, Toasts, Tooltips, Forms, Loading/Empty/Error states. Coherent visual language.

### 59. VISUAL DIRECTION

Premium, elegant, editorial, creative, emotional, modern, sophisticated. Avoid generic SaaS dashboards, excessive gradients/rounded cards/shadows, clutter, poor typography, unnecessary animation. Use whitespace intentionally.

### 60–63. PUBLIC INVITATION / HOMEPAGE / CREATOR ECONOMY / NETWORK EFFECT

See original prompt for full ASCII mockups. Homepage should communicate the tagline, [Create an Event] / [Create with AI] CTAs, category browse, featured themes/creators/trending designs, and a "Become a Creator" CTA. Creator flywheel: more creators → more designs → more customers → more purchases → more creator earnings → more creators. Followers/likes/saves/sales/discovery should reinforce each other.

### 64. EXTENSIBILITY

Adding a new event type ("Pastor Appreciation") should require configuration (Event Type, Default Sections, Default Blocks, Suggested Themes, Suggested Content), not a new application. Same for new themes.

### 65. VERSIONING

Draft/Published/Archived, versioned (v1, v2, v3...). Creators updating a marketplace product must not unexpectedly modify existing customer events — customer events stay tied to the licensed product/version unless explicitly upgraded.

### 66. AUTOSAVE

"Saving…" / "Saved ✓", debounced. Handle network interruption, failed save, retry, conflict, recovery. Never silently lose user work.

### 67. UNDO/REDO

For content, sections, colors, typography, layout, design/theme/fabric changes.

### 68. TESTING

**Unit:** theme engine, fabric engine, event configuration, RSVP logic, pricing, commissions, permissions, rendering, licensing. **Integration:** auth, event creation, publishing, RSVP, guest management, marketplace purchase, creator earnings, file upload, org permissions. **E2E:** (1) Register → Create Wedding → Choose Theme → Choose Fabric → Customize → Publish → Open Public Invitation → Submit RSVP → Organizer Views RSVP. (2) Church: Create Org → Add Ministry → Create Worship Event → Choose Church Theme → Customize → Publish → Guest Opens → Guest Registers. (3) Marketplace: Create Creator → Create Design → Submit → Admin Approves → Product Published → Customer Purchases → Customer Uses Design → Creator Receives Earnings.

### 69. SEED DATA

Polished demo data: Sophia & Liam (wedding), David's 30th Birthday, Emily — Class of 2027 (graduation), Grace Community Church — Worship Night, New Life Church — Annual Revival, OLBOS Annual Celebration (corporate). At least 15 professional sample themes.

### 70. INITIAL THEME COLLECTION

**Wedding:** Sacred Ivory, Royal Heritage, Garden Romance, Champagne Bloom, Midnight Luxe, Modern Editorial. **Church:** Sacred Light, Worship & Grace, Kingdom Heritage, Modern Ministry, Sunday Morning, Revival. **Graduation:** Graduation Prestige, Academic Editorial. **Birthday:** Elegant Celebration, Modern Party. Themes must differ in typography, layout, spacing, imagery, decorations, background, animation, envelope, fabric — not merely color.

### 71. DEVELOPMENT PHASES

**Phase 0 — Audit.** Inspect the existing project; return Current Stack, Architecture, Invitation System, CSS, Components, Database, APIs, Authentication, Assets, Reusable Code, Technical Debt, Security Issues, Performance Issues, Recommended Architecture, Phase 1 Plan.
**Phase 1 — Foundation.** Auth, users, events, event types, database, theme engine, fabric engine, invitation renderer, responsive invitation, envelope, publishing, sharing.
**Phase 2 — Design Studio.** Editor, sections, blocks, themes, fabrics, typography, colors, backgrounds, envelope customization, animations, autosave, undo/redo.
**Phase 3 — RSVP.** Guests, RSVP, questions, plus-ones, tracked links, guest dashboard, analytics.
**Phase 4 — Organizations.** Organizations, members, roles, church profiles, ministry management, org events, org calendar.
**Phase 5 — Planning & Memories.** Checklist, budget, vendors, seating, QR memories, photos, videos, guest messages.
**Phase 6 — Creator Marketplace.** Creator profiles, creator studio, submissions, moderation, products, marketplace, storefronts, purchases, entitlements, licensing, commissions, payouts, reviews.
**Phase 7 — Social.** Followers, likes, saves, discovery, creator profiles, trending, recommendations.
**Phase 8 — AI.** AI Event Creator, AI Design Assistant, AI copywriting, AI theme recommendations.
**Phase 9 — Scale.** Custom domains, advanced analytics, professional planner accounts, org subscriptions, white-label, vendor ecosystem, mobile apps.

### 72. DEVELOPMENT RULES

Inspect first. Check existing dependencies before adding new ones. Check existing components before creating new ones. Check design tokens before creating CSS. Check existing migrations before changing the database. Never: rebuild unnecessarily, duplicate functionality, hard-code event types/themes/prices/commission rates, expose secrets, ignore errors, create fake functionality.

### 73. QUALITY GATE

After each major implementation: type check, lint, unit tests, integration tests, build, database validation, responsive testing, accessibility testing, security checks. Also inspect browser console, network requests, mobile/desktop layout, loading/error/empty states. Do not move forward with known build-breaking issues.

### 74. PRODUCTION STANDARD

Do not deliver static HTML, fake dashboards, fake marketplace, fake payments, fake creator earnings, fake analytics, or mock functionality presented as real. Build real architecture. Label unimplemented functionality "Coming Soon."

### 75. FINAL PRODUCT VISION

```
                         OLBOS DESIGN
          ┌───────────────────┼───────────────────┐
       EVENTS              CREATORS          ORGANIZATIONS
     Weddings              Themes             Churches
     Birthdays             Templates          Schools
     Graduation            Artwork            Companies
     Church                Graphics           Nonprofits
     Corporate             Fabrics            Planners
          └───────────────────┼───────────────────┘
                         MARKETPLACE
                  Designs / Products / Purchases / Licensing
                       Creator Earnings / OLBOS Revenue
```

Ecosystem loop: CREATE → DESIGN → PUBLISH → DISCOVER → PURCHASE → CUSTOMIZE → CELEBRATE → SHARE → REMEMBER.

Serves individuals, families, churches, schools, businesses, nonprofits, event planners, professional designers, digital artists. Feels like a combination of premium invitation platform + design studio + creator marketplace + event platform + organization platform.

### 76. FIRST COMMAND

Inspect the existing repository first. Do NOT rewrite the application. Do NOT delete the existing invitation. Do NOT replace the existing envelope without understanding it. Produce a **OLBOS DESIGN — TECHNICAL AUDIT** (Current Stack, Existing Architecture, Existing Invitation, Existing Envelope, Existing CSS, Existing Components, Existing Database, Existing APIs, Existing Authentication, Existing Assets, Reusable Code, Problems, Security Risks, Performance Risks, Architecture Recommendations, Phase 1 Implementation Plan). Then begin implementation incrementally. Build OLBOS DESIGN as a real scalable product, not a prototype.

</details>

---

## B. Phase 0 — Technical Audit

*Performed 2026-08-30 by direct inspection of the repository at `/Users/mangpijasuan/Projects/olbosevents` (git remote: none configured yet; 3 commits on `main`).*

### 1. Current Stack

- **Runtime/framework:** Next.js 15.5.22 (App Router), React 19.2.4, TypeScript 5, dev server on port 3002 (3000 is occupied by an unrelated project's Docker container on this machine).
- **Styling:** Tailwind CSS v4 (`@theme inline` tokens in `src/app/globals.css`), shadcn/ui (`radix-ui` primitives), `class-variance-authority`, `tailwind-merge`.
- **Animation:** Framer Motion 12 (primary), GSAP present as a dependency but currently unused in application code.
- **Database/ORM:** PostgreSQL via Prisma ORM 7.9 with `@prisma/adapter-pg` driver adapter (`prisma.config.ts`, not the legacy `package.json#prisma` config), generator `prisma-client` outputting to `src/generated/prisma`.
- **Auth:** Better Auth 1.6.25 — email/password + Google OAuth wired; Apple OAuth code path exists but gated off (`appleEnabled` check) pending real credentials.
- **Cache/rate limiting:** Redis via `ioredis`, a hand-rolled fixed-window limiter (`src/lib/rate-limit.ts`).
- **Object storage:** S3-compatible (`@aws-sdk/client-s3` + presigned POST), MinIO locally via Docker Compose, real S3 in prod via env.
- **Payments:** Stripe (Checkout + webhooks) — single-tenant subscription billing only, no Connect/marketplace payout capability yet.
- **Email:** Resend, degrades gracefully (`isEmailConfigured`) when unset.
- **QR:** `qrcode` (generation, HMAC-signed tokens) + `@zxing/browser` (camera scanning).
- **Local infra:** Docker Compose (Postgres :5433, Redis :6379, MinIO :9000/:9001), all three containers currently running and healthy.
- **Testing:** Vitest 4 (36 unit tests across 6 files, `vite-tsconfig-paths` + `@vitejs/plugin-react`), Playwright (1 E2E smoke test).
- **CI:** GitHub Actions (`.github/workflows/ci.yml`) — install, `prisma generate`, lint, typecheck, unit tests, build. No deploy step yet.
- **Deployment:** `Dockerfile` (multi-stage, Next `output: "standalone"`), documented Vercel path in README. Nothing actually deployed — this has only run locally so far.

### 2. Existing Architecture

Single Next.js app, no monorepo. Layered as:

```
src/
  app/            route groups: (marketing), (auth), (dashboard), admin, invite/[slug], checkin/[eventId], api/*
  components/     ui/ (shadcn primitives), invitation/, dashboard/, marketing/, auth/, checkin/, admin/, providers/
  server/         service layer (*-service.ts) — one file per domain, called from route handlers and server components
  lib/            cross-cutting: db, auth, redis, stripe, resend, s3, qr, rate-limit, password, slug, templates, api-error
  validations/    Zod schemas, shared client/server (careful `z.input` vs `z.output` split for react-hook-form)
  hooks/          TanStack Query hooks per domain (use-events, use-guests, use-billing, etc.)
  generated/prisma/  generated client (gitignored)
```

This is a clean, conventional layered architecture (route → service → Prisma) for a **single-tenant, single-product** app. It has no multi-tenant organization concept, no plugin/registry system for event types, and no separation between "design configuration" and "event content" (see §7 below) — all of which the OLBOS DESIGN vision requires as first-class primitives.

### 3. Existing Invitation

Each of the 5 templates (`src/components/invitation/templates/{luxury,modern,floral,minimal,navy}.tsx`) is a **standalone React component** that takes `{ event, content, rsvpSlot }` and hard-codes its own JSX structure section-by-section (hero → story → schedule → venue → dress code → gallery → accommodation/transportation → RSVP → footer), each with template-specific Tailwind classes and inline color values. `template-registry.tsx` maps a `templateKey` string to one of these components.

This is **not yet the "sections + blocks" composable model** the master prompt describes (§7–8). It's effectively "one big template component per look," parameterized by a single `content: InvitationContent` JSON blob (`src/validations/invitation.ts`) with a fixed shape (`hostNames`, `greeting`, `schedule[]`, `storyTimeline[]`, `galleryUrls[]`, `dressCode`, `accommodation`, `transportation`, contact fields, `backgroundEffect`, `showEnvelopeIntro`). Every template renders every populated field in the same fixed order — there's no per-section add/remove/reorder, and no block-level extensibility (a "Scripture" or "Speaker" block for church events doesn't exist and can't be added without editing the Zod schema and every template file).

**This is directly reusable** as the Invitation Renderer's fallback/default composition, but the section-order and content-shape rigidity is the first real refactor needed for §7/§8 (event-type-agnostic sections/blocks).

### 4. Existing Envelope

`src/components/invitation/envelope-intro.tsx` is **already componentized** as a single reusable component: `<EnvelopeIntro eventKey title hostNames greeting>{children}</EnvelopeIntro>`, used identically by all 5 templates via the public invite page. It already implements the full sequence from §18 (closed → tap → opening → flap rotates via Framer Motion `rotateX` → wax seal breaks/fades → revealed), gated by `sessionStorage` per event so repeat visits skip straight to revealed.

Sub-parts, each already its own component: `<WaxSeal initials broken size>` (now supports `size: "md" | "lg"`, radial-gradient gold circle, initials in script font, breaks via `scale/rotate/opacity` animation), `<FloralFlourish color flip>` (hand-authored SVG line-art sprig, reused at multiple scales/rotations), `<EnvelopeWallpaper color opacity>` (SVG `<pattern>` tiled vine texture added this session for the full-bleed "fabric" background feel).

**Gaps vs. the vision:** the envelope is a single hard-coded visual style (cream/gold) independent of the invitation template's own palette — it doesn't yet accept a `theme`/`fabric` prop the way `<InvitationEnvelope theme={theme} fabric={fabric} seal="wax" animation="luxury" />` implies. No `prefers-reduced-motion` handling yet (a real accessibility gap called out explicitly in §18/§55). No non-wax seal styles, no non-"luxury" animation variants.

### 5. Existing CSS

**Not** the `styles/` directory tree from §16. Styling is:

- One `src/app/globals.css` with Tailwind v4 `@theme inline` design tokens (colors: `--champagne`, `--rose-gold`, `--emerald`, `--luxury-black`, `--cream`, etc.; also light/dark mode via `next-themes`).
- Otherwise 100% Tailwind utility classes co-located in each component, plus a handful of inline `style={{ background: "linear-gradient(...)" }}` for gradients Tailwind can't express directly, plus hand-authored SVG markup for decorative elements.
- No component-scoped `.css` files anywhere, no `styles/invitation/`, `styles/editor/`, `styles/marketplace/` structure.

This is a defensible, modern Tailwind-first approach and **doesn't need to become a big CSS-file tree** to satisfy the spirit of §16 (avoid duplicated CSS, use variables, component-level styling) — Tailwind v4's `@theme` tokens already are the "design tokens" system from §15. The real gap is that tokens today are a **fixed global palette**, not yet a per-Theme token *set* that a Theme Engine can swap at render time (see §14/§15 below).

### 6. Existing Components

Organized by domain under `src/components/`: `ui/` (23 shadcn primitives: button, dialog, form, table, tabs, etc.), `invitation/` (17 files: 5 templates + envelope/seal/flourish/wallpaper + countdown/schedule/story/gallery/venue-map/rsvp-form/share-buttons/password-gate/background-effect/template-registry/types), `dashboard/` (18 files: event CRUD forms, guest management, analytics, billing, invitation builder), `marketing/` (14 files: hero, hero-preview-card, pricing, testimonials, FAQ, template-gallery + card, templates-showcase, contact), `auth/`, `checkin/`, `admin/`, `providers/`.

All components are reasonably small and single-purpose. `invitation-builder.tsx` (the host-facing editor) is currently a **form-based editor**, not the drag-and-drop canvas + properties-panel Design Studio from §12 — it edits the fixed `InvitationContent` shape via react-hook-form fields, not a sections/blocks tree.

### 7. Existing Database

PostgreSQL via Prisma, single schema file (`prisma/schema.prisma`, 482 lines). Current tables map roughly to a subset of §49's list:

- **Auth:** `users` (with `platformRole: USER|ADMIN|SUPER_ADMIN` — a start on RBAC, but only 3 flat roles, all global, no per-organization/per-resource roles), `sessions`, `accounts`, `verifications`.
- **Tenancy:** `organizations`, `memberships` (role: `OWNER|ADMIN|MEMBER` — present but **unused by any UI or API today**; no organization dashboard, no church-specific fields, no ministries).
- **Events:** `events` (`type: EventType` enum — **hard-coded** to 14 fixed values, directly contradicting §4's "never hard-code event types"; `status`, `visibility`, `slug`, venue fields), `templates` (key/name/category/description — a simple lookup, not the versioned Theme/Fabric system of §14/§65), `invitations` (one-to-one with event, `content: Json` + `theme: Json` — the `theme` field exists in the schema but is **never read or written** by any code path today; every visual property instead lives in hard-coded template component JSX).
- **Guests/RSVP:** `guests`, `guest_groups`, `rsvp_responses` (fixed columns, not the flexible `rsvp_questions`/`rsvp_answers` model from §49), `check_ins`.
- **Media:** `media_assets` (photo/video, has `albumName`/`caption`/`sortOrder` — closer to a Memories model than it looks, just not guest-facing-uploadable yet).
- **Billing:** `subscriptions`, `payments` — single-tenant Stripe subscription model, no `commission_rules`, `commission_transactions`, `creator_payouts`, `product_purchases`, `product_entitlements`.
- **Analytics/audit:** `analytics_events` (VIEW/RSVP_SUBMITTED/QR_SCAN/SHARE_CLICK), `audit_logs` (schema exists, **never written to** by any service today).
- **Marketplace scaffold:** `vendors`/`vendor_category` enum exist ("schema only, no UI" per README) — this is the *only* marketplace-adjacent table, and it's for event vendors (florists, photographers), not creator-sold design products. None of §49's `marketplace_*`, `creator_*`, `product_*` tables exist.

**Net:** the DB has real foreign keys, indexes, and enum-based typing (good hygiene), but is architecturally a single-tenant "one host, one event, one template" model wearing a couple of unused multi-tenant fields (`organizationId` nullable on `Event`, `Membership` table with no consumers). None of the marketplace, creator, commission/ledger, church-specific, or flexible-block schema exists yet.

### 8. Existing APIs

Next.js Route Handlers under `src/app/api/`, REST-ish, one file per resource action: `events/`, `events/[id]/{guests,checkin,analytics,invitation,publish,unpublish,duplicate}`, `invite/[slug]/{rsvp,verify-password}`, `admin/{users,events,payments,stats}`, `billing/{checkout,summary}`, `webhooks/stripe`, `upload`, `contact`, `auth/[...all]` (Better Auth catch-all). All parse input with Zod, call a `server/*-service.ts` function (which itself calls `requireUser()`/`requireEventAccess()` for auth), and return via a shared `handleApiError` helper. This is a solid, consistent pattern — **directly extensible** to new resources (marketplace products, creator payouts, organization members) by following the same file-per-action + service-layer convention. No GraphQL, no tRPC — plain REST, which is fine and doesn't need to change.

### 9. Existing Authentication

Better Auth with a Prisma adapter, email/password (min length 8, no forced email verification yet) + Google OAuth, Apple OAuth code-complete but disabled pending credentials. Sessions: 30-day expiry, refreshed daily, cookie-based (`getSessionCookie` checked in `middleware.ts` for `/dashboard`, `/admin`, `/checkin` prefixes — redirects to `/login?redirect=...` if absent). `platformRole` is a Better Auth "additional field" on `User`, input-locked (can't be set by the client, only server-side). No MFA today, but Better Auth supports it as a plugin, so "MFA-ready" (§50) is realistic to add later without a rewrite. No session revocation UI, no audit log of auth events yet.

### 10. Existing Assets

`public/` currently holds only the default Next.js starter SVGs (`file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg` — unused leftovers from scaffolding) plus `public/demo-gallery/` (15 hand-generated abstract gradient SVG placeholders for the 5 demo templates' galleries, added this session specifically to avoid depending on an external image host). No real photography, no font files bundled (fonts are loaded via `next/font` from Google Fonts per `layout.tsx`, not self-hosted). No brand assets (logo is a small inline `<Logo>` component, not an image file) for either "Olbos Event" or "OLBOS DESIGN."

### 11. Reusable Code

High-value, keep-as-is or extend-in-place:

- **Service layer pattern** (`server/*-service.ts` + `requireUser`/`requireEventAccess` guards) — extend directly for organizations, marketplace, creator domains.
- **Envelope/seal/flourish/wallpaper components** — already componentized per §3/§4's explicit instruction; need a `theme`/`fabric` prop added, not a rewrite.
- **Zod validation split pattern** (`z.input` for forms, `z.output` for server) — reuse for every new domain.
- **`api-error.ts` + typed error classes** (`BillingError`, etc.) — reuse for marketplace/commission errors.
- **Rate limiter, S3 presigned-upload flow, QR HMAC signing, password hashing (scrypt, timing-safe compare)** — all solid, directly reusable for creator uploads, church check-ins, etc.
- **TanStack Query hook-per-domain pattern** (`use-events.ts` etc.) — extend for `use-marketplace.ts`, `use-organizations.ts`.
- **Tailwind v4 `@theme` token system** — the right foundation for a Theme Engine; needs to become *per-theme* token sets instead of one global set.
- **Demo-seeding pattern** (`prisma/seed-templates.ts`, idempotent upsert-by-slug) — directly extensible to seed §69's Sophia & Liam / Grace Community Church / etc. demo data.

### 12. Problems (Technical Debt)

- `EventType` is a **hard-coded Prisma enum** (14 values) — adding "Pastor Appreciation" today means a schema migration + touching every switch/select that lists event types. Directly contradicts §4 and §64.
- `Invitation.theme: Json` **exists in the schema but is dead** — no reader, no writer. All visual configuration is hard-coded per-template-component instead, so there is currently no way to have "one template, many themes" — each of the 5 "templates" is really a fused (layout + theme + fabric) bundle.
- Invitation content is one **fixed-shape JSON blob**, not composable sections/blocks — adding a church-specific field (Scripture, Speaker) means editing a shared Zod schema that every event type pays the cost of, forever.
- `Membership`/`Organization` tables are unused dead schema — either finish them or they'll rot further.
- `audit_logs` table is unused dead schema — no service writes to it despite existing.
- `public/` has leftover unused starter-template SVGs that should be deleted as part of any real cleanup pass.
- No i18n scaffolding at all (no `next-intl`/`next-i18next`, no message catalogs) — §46 is a from-scratch addition, not an extension.
- GSAP is an installed, unused dependency — either use it or remove it (dead weight in the bundle).

### 13. Security Risks

- **No security headers / CSP configured** (`next.config.ts` has no `headers()` function). No `Content-Security-Policy`, `X-Frame-Options`, `Referrer-Policy`, `Strict-Transport-Security`, etc. anywhere in the app. This is the single most important gap relative to §50 and should be fixed early regardless of which phase comes next — it's cheap and touches no business logic.
- Rate limiting exists but is only wired to a handful of routes (`upload`, presumably auth — not audited exhaustively here); a pass to confirm coverage on all public-write endpoints (RSVP submit, contact form, password-gate verify) is warranted before any public marketplace/creator-upload surface is added.
- SVG uploads are not part of the current app (uploads are restricted to `image/jpeg|png|webp|gif` via a Zod enum in `upload/route.ts`), so the §51 "sanitize SVG" concern doesn't yet exist as a live risk — but it **will** the moment creators can upload SVG assets for the marketplace (§30), so SVG sanitization needs to be designed in before that phase, not bolted on after.
- No MFA, no session-revocation UI, no audit logging of security-relevant events (login, role change, payout change) — acceptable for the current single-tenant scope, but blocking for §37 (payouts) and §47 (org RBAC).
- Password hashing (`scrypt`, per-user salt, timing-safe compare) is solid and does not need to change.
- `BETTER_AUTH_URL` defaults to `http://localhost:3000` in `auth.ts` even though the app runs on `3002` — a latent misconfiguration risk if that env var is ever left unset in a real deploy.

### 14. Performance Risks

- The public `/invite/[slug]` page and the host-facing `/dashboard/events/[id]` editor currently share the same component tree conventions (both are ordinary Next.js pages under the same app), but **do not yet share a bundle** in a way that would leak editor-only JS to guests — this is fine today because there is no heavy "Design Studio" bundle yet. §53's warning ("do not load the complete design editor on a guest invitation page") becomes a real constraint the moment Phase 2 (Design Studio) ships a canvas/properties-panel editor — that work should be code-split from day one, not retrofitted.
- Demo gallery images are local SVGs (fast, no external network dependency) — good present-state performance, no action needed.
- No CDN/edge caching strategy configured yet (fine for the current stage; becomes relevant once there's real public traffic).
- No image optimization audit performed beyond confirming `next/image` + `remotePatterns` are configured correctly (fixed this session for the demo gallery bug).

### 15. Architecture Recommendations

1. **Keep the Next.js/Prisma/Better Auth/Tailwind stack.** It's a good match for the full vision — nothing here needs to be thrown away for a different framework.
2. **Introduce an Event-Type Registry** as data, not code: a `event_types` table (or a versioned config file backing it) with `key`, `label`, `category`, `defaultSections`, `defaultBlocks`, `suggestedThemeIds` — replacing the hard-coded `EventType` Prisma enum with a string FK. This single change unlocks §4/§64 without touching the render pipeline.
3. **Split "Template" into Theme + Fabric + Layout**, each independently selectable and stored as its own versioned row (`themes`, `theme_versions`, `fabrics`), with the `Invitation.theme: Json` field finally becoming the resolved token-override payload a renderer reads — instead of five fused template components, one generic `<InvitationRenderer sections themeTokens fabricTokens envelope />` reads composable data.
4. **Introduce a Section/Block model** (`event_sections`, `event_blocks`) so hosts can add/remove/reorder content, and so new block types (Scripture, Speaker, Registry) are additive rows/config, not new template JSX.
5. **Make `<EnvelopeIntro>` theme-aware**: accept `seal`, `fabric`, `animation` props (as the master prompt's own example signature shows) instead of its current hard-coded gold/cream styling, so it can render Sacred Ivory vs. Midnight Luxe vs. a future church "Sacred Light" theme from the same component.
6. **Add security headers/CSP now** — independent of everything else, low-risk, high-value, and explicitly called out as a gap.
7. **Treat Organizations as a real Phase 1-adjacent feature**, not deferred to Phase 4 as the master prompt's own phase plan suggests — the schema already has `Organization`/`Membership` sitting unused, and the church use case is explicitly called a "major first-class category" (§4/§9), so building on top of dead schema first is lower-risk than leaving it dead longer.
8. **Do not attempt Marketplace/Creator/AI (Phases 6–8) until Phases 1–3 are re-architected**, because the entitlement model (§33) explicitly depends on the Theme/Fabric/Version system from Phase 1 existing first — building the marketplace on top of today's fused-template model would mean rebuilding the marketplace again later.
9. **Rename decision is separable from architecture work.** Renaming "Olbos Event" → "OLBOS DESIGN" (product name, `package.json`, README, marketing copy, `.env.example` defaults, demo data) is pure find-and-replace + copy work with no technical dependency on the schema refactor — it can happen in parallel or be deferred without blocking engineering.

### 16. Phase 1 Implementation Plan (proposed, realistic scope)

The master prompt's own Phase 1 ("auth, users, events, event types, database, theme engine, fabric engine, invitation renderer, responsive invitation, envelope, publishing, sharing") is itself a multi-week rewrite of the event/content data model. Breaking it into reviewable slices:

- **1a — Rebrand & cleanup** (low risk, no schema changes): rename product across `package.json`/README/marketing copy/`.env.example`; delete unused starter SVGs in `public/`; remove or adopt GSAP; add `headers()`/CSP to `next.config.ts`.
- **1b — Event-Type Registry**: replace the hard-coded `EventType` enum with a string FK to a seeded `event_types` table/config (life & family, church & faith, education, business, social, custom categories from §4); migrate existing `Event.type` values; update every UI surface that lists event types to read from the registry.
- **1c — Theme/Fabric split**: add `themes`, `theme_versions`, `fabrics` tables; define the initial token shape (§15 colors/typography/spacing/etc.); make `Invitation.theme: Json` the resolved override payload; migrate the 5 existing templates' hard-coded colors into theme token data (Luxury Blush, Modern Editorial, Floral Romance, Minimal Emerald, Navy Elegance become the first 5 seeded themes, not separate template components).
- **1d — Generic Invitation Renderer**: build one `<InvitationRenderer>` driven by section/block config + resolved theme/fabric tokens, replacing the 5 fused template components; make `<EnvelopeIntro>` accept theme/fabric/seal/animation props per the master prompt's own example.
- **1e — Organization foundation**: activate the existing `Organization`/`Membership` schema with a real dashboard, expand `OrgRole` toward the roles list in §9/§48, and build the first church-specific event experience (§10) on top of the Section/Block model from 1d.

Each slice ends with the existing quality gate (typecheck, lint, unit tests, E2E, manual browser verification) before moving to the next, per §73.

---

## Recommended Path Forward

This audit surfaces a real tension worth naming explicitly: earlier this session you chose **"foundation-first, then iterate"** over the original ~20-feature mega-request, and explicitly deferred AI features. This master prompt asks for a much larger scope (creator marketplace, commission ledger, Stripe Connect payouts, org/church RBAC, AI design assistant, i18n) than that earlier decision — it doesn't contradict "foundation-first" as a *method*, but it does mean the target foundation is now much bigger than what's shipped.

Given the master prompt's own instruction ("do NOT immediately rebuild... first inspect... produce an audit... then begin implementation incrementally," §2/§76), each lettered slice has been built, tested, and reported before moving to the next — 1a (rebrand & cleanup), 1b (event-type registry), and 1c (theme system) are now done. Remaining Phase 1 work:

- **Fabric** (material/texture — deferred out of 1c, see above) — a real, comparably-sized feature, not yet started.
- **1d — Generic Invitation Renderer**: the actual architectural payoff of 1c/Fabric — one `<InvitationRenderer>` driven by section/block config + resolved theme/fabric tokens, replacing the 5 fused template components; `<EnvelopeIntro>` accepting theme/fabric/seal/animation props per the master prompt's own example signature. This is where per-pixel theming (the decorative details 1c left template-native) actually becomes possible.
- **1e — Organizations**: activating the already-present but unused `Organization`/`Membership` schema with a real dashboard and the first church-specific event experience (§9/§10).
