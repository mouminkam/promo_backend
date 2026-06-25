# Promoo Backend — Memory Bank

> Dynamic project memory. Updated after every phase/milestone to track progress,
> decisions, and context for continuity across sessions.

---

## Project Status

| Phase | Name | Status | Date |
|-------|------|--------|------|
| 0 | Foundation & Setup | ✅ Completed | 2026-06-14 |
| 1 | Database Migrations | ✅ Completed | 2026-06-14 |
| 2 | Authentication | ✅ Completed | 2026-06-14 |
| 3 | Profiles | ✅ Completed | 2026-06-14 |
| 4 | Follow System | ✅ Completed | 2026-06-14 |
| 5 | Offers & Ads | ✅ Completed | 2026-06-14 |
| 6 | Subscriptions & Stripe | ✅ Completed | 2026-06-14 |
| 7 | Chat System | ✅ Completed | 2026-06-14 |
| 8 | Notifications | ✅ Completed | 2026-06-15 |
| 9 | Upload & Search | ✅ Completed | 2026-06-15 |
| 10 | Featured & Payments | ✅ Completed | 2026-06-16 |
| 11 | Reports | ✅ Completed | 2026-06-16 |
| 12 | Admin Dashboard APIs | ✅ Completed | 2026-06-16 |
| 13 | Gap Fixes & Deep Audit | ✅ Completed | 2026-06-25 |
| 14 | Final Deep Audit Bug Fixes | ✅ Completed | 2026-06-25 |

---

## Key Decisions Log

| # | Decision | Reason | Date |
|---|----------|--------|------|
| 1 | Supabase as BaaS | Auth + Storage + Realtime built-in, saves dev time | 2026-06-14 |
| 2 | 4-Layer Architecture | Controller → Service → Repository → DB for clean separation | 2026-06-14 |
| 3 | TypeScript strict mode | Type safety, fewer runtime errors | 2026-06-14 |
| 4 | Zod for validation | Runtime validation + TypeScript inference | 2026-06-14 |
| 5 | 1-to-1 Chat only | Client requirement, no group chats needed | 2026-06-14 |
| 6 | Bilingual (ar + en) | Accept-Language header, dual DB columns | 2026-06-14 |
| 7 | Stripe Checkout Sessions | Standard flow, client has Stripe account ready | 2026-06-14 |
| 8 | FCM for Push | Industry standard, works with React Native | 2026-06-14 |
| 9 | Postponed Multi-Currency Support | Decided to postpone adding a 'currency' column to 'subscription_plans' (e.g. USD/AED) due to local DB migration hang. Removed 'currency' from API validation to unblock testing for now. | 2026-06-22 |
| 10 | Migration Safe Handling | Converted migration 012 to a NO-OP instead of deleting it to maintain migration continuity without causing duplicate column errors. | 2026-06-25 |
| 11 | Explicit Constraint Naming | Explicitly named `media_related_to_check` constraint to allow robust future migrations (017). | 2026-06-25 |
| 10 | Postman Dynamic Generation | Created a manual Node script to generate Postman Collection instead of auto-discovery due to Express routing structure. | 2026-06-24 |
| 11 | Webhook Delegation | One-time payments (Seats) handled directly in `webhook.controller` mapping to `seat.service.ts` rather than crowding the `subscription.service.ts`. | 2026-06-24 |
| 12 | Zero-Trust Security Patches | Patched mass assignment vulnerability in profile updates, fixed Storage folder hijacking by explicitly enforcing auth.uid() in RLS, and fixed unbooked seat tampering. | 2026-06-25 |
| 13 | Post-Audit Fixes | Resolved Chat list sorting, Chat cross-talk in direct messages, and Offer featuring Stripe flow based on the deep surgical audit report. | 2026-06-25 |
| 14 | Deep Surgical Audit Patching | Patched state mutation bugs in offer/ad/service, prevented Stripe placeholder crash, fixed ilike PostgREST syntax | 2026-06-25 |
| 15 | Release Mode Locked | Concluded all deep audits. Applied surgical fix (024) for feature_offer payment type. Backend marked production-ready. | 2026-06-25 |

---

## Completed Work

### Phase 4 — Follow System
- [x] Follow, unfollow, check follow status endpoints.
- [x] Get followers and following list endpoints with pagination.
- [x] Full validation and integration.

### Phase 5 — Offers & Ads
- [x] Offer CRUD, detail view with views counting, and listing with filters.
- [x] Ad creation, updating, activation toggle, and status-based query views.
- [x] Public analytics tracking endpoints for recording impressions and clicks.

### Phase 6 — Subscriptions & Stripe
- [x] `stripe.service.ts` — Stripe customer management, Checkout Sessions, Customer Portal.
- [x] `subscription.service.ts` — Plans listing, subscription checkout, webhook handler (upsert/cancel sync).
- [x] `subscription.controller.ts` + `webhook.controller.ts` — API layer.
- [x] `subscription.routes.ts` — Mounted at `/api/v1/subscriptions`.
- [x] Stripe webhook mounted in `app.ts` with `express.raw()` before JSON parser.
- [x] Cancel/Upgrade/Downgrade handled via Stripe Customer Portal (no custom endpoints needed).

### Phase 7 — Chat System
- [x] `chat.validator.ts` — Zod schemas for start chat, send message, get messages, mark read, delete.
- [x] `chat.service.ts` — Start/open direct chat (reuses existing room), send message, get messages (paginated), chat list with last message + unread count, mark read, delete chat.
- [x] `chat.controller.ts` — Full CRUD controller.
- [x] `chat.routes.ts` — Mounted at `/api/v1/chats`.

### Phase 8 — Notifications
- [x] FCM Token registration endpoint.
- [x] In-app notification endpoints (Get, Mark as read, Delete).
- [x] Integrated push notifications into follow and chat services using Firebase Admin.

### Phase 9 — Upload & Search
- [x] File upload via Multer memory storage direct to Supabase Storage.
- [x] Created `media` database records for tracking uploads.
- [x] Global search endpoint returning profiles, offers, and ads in parallel.
- [x] Categories retrieval and related content.

### Phase 10 — Featured & Payments
- [x] Stripe Checkout Sessions for requesting featured status.
- [x] Featured listings retrieval logic filtered by `is_active` and dates.
- [x] Payment history and Stripe Customer Portal integration for card management.

### Phase 13 — Gap Fixes & Deep Audit
- [x] Implemented missing core modules: `Services`, `Seats`, `Stories`, `Saved Items`, `Home API`.
- [x] Generated 107-endpoint Postman Collection for extensive testing.
- [x] Fixed Database Constraints for `subscriptions.status` to allow Stripe states (`incomplete`, `unpaid`).
- [x] Fixed Database Constraints for `reports.reported_type` to allow `service`, `story`, `seat`.
- [x] Fixed `media.related_to` check constraint to support `service`, `story`, `report`, `verification`.
- [x] Refactored Webhook Architecture to properly delegate one-time payments (`seat_booking`) directly to `seat.service.ts`.
- [x] Upgraded Global Search to query and return `services` along with other content.
- [x] Fixed mass assignment privilege escalation in `profile.service.ts`.
- [x] Hardened Storage Bucket RLS to prevent cross-folder file hijacking.
- [x] Secured Unbooked Seats by restricting updates solely to the current seat owner.
- [x] Corrected Stripe Checkout metadata for Seat Bookings to ensure successful payment recording.
- [x] Added database-level UNIQUE constraint to prevent duplicate saved items.
- [x] Fixed Chat Service Cross-Talk by properly filtering direct chat queries.
- [x] Refactored Chat List Sorting to correctly order by `last_message_at`.
- [x] Routed Seat Bookings to subscription webhook to correctly record payments in the database.
- [x] Implemented Offer Featuring via Stripe Checkout with accurate webhooks.
- [x] Applied missing `category_id` index to `profiles` table.

### Phase 14 — Final Deep Audit Bug Fixes
- [x] Fixed state mutation blocks allowing safe 'status' transitions for offers, ads, and services.
- [x] Added Stripe placeholder crash protection to avoid 500 errors on unconfigured subscriptions.
- [x] Fixed OTP type validation in auth service to exactly match Zod schemas.
- [x] Fixed Supabase `ilike` syntax for embedded relations (`profiles.location`).
- [x] Deployed `024_fix_feature_offer_payment.sql` via MCP to fix Webhook Crash for the `feature_offer` type.
- [x] Transitioned permanently to BUILD MODE. No further backend audits required.

---

## Current Context

**Currently working on**: Front-End Integration / Mobile App Prototype
**Next up**: Mobile App Development
**Blockers**: None. Awaiting APK screenshots for the next phase.
**Notes**: All Backend Phases (1-13) are 100% complete. Database schema, RLS policies, triggers, realtime settings, storage buckets, and seed data have been successfully pushed to the Supabase Cloud Production project. The backend is fully operational, thoroughly audited, and ready for Front-End integration.

---

## API Endpoints Registry

> Updated as endpoints are built.

| Method | Path | Module | Status |
|--------|------|--------|--------|
| — | — | — | — |

---

## Database Tables Registry

> Updated as migrations are created.

| Table | Migration File | Status |
|-------|---------------|--------|
| — | — | — |
