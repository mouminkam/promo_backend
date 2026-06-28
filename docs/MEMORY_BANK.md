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
| 15 | Prototype Audit, Currency Unify & Cup/Leaderboard | ✅ Completed | 2026-06-25 |
| 16 | Final Backend Polish & Flutter Handover | ✅ Completed | 2026-06-25 |
| 17 | Database Final Verification & Production Lock | ✅ Completed | 2026-06-25 |
| 18 | Full Live API Test Sweep & Bug Fixes | ✅ Completed | 2026-06-28 |

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
| 16 | Currency Unified to AED | Prototype prices are all AED. Migration 026 sets default currency to AED across subscription_plans/payments/services/offers and backfills old 'usd' rows. | 2026-06-25 |
| 17 | Cup = Leaderboard, Plan A | Cup tab is a followers ranking. Chose Plan A: cached `profiles.followers_count` column maintained by a trigger on `follows` (migration 028), allowing seedable real-world reach numbers that match the prototype's large counts. `type=all` excludes regular `user` accounts. | 2026-06-25 |
| 18 | Hardened validate middleware | Removed a leftover debug line in `validate.middleware.ts` that wrote `error.stack` to `scratch/api_error.log` on every non-Zod error — would throw (and mask the real error) in production where that path may not exist. | 2026-06-25 |
| 19 | RLS Hardening (Triggers) | Added `protect_sensitive_columns` DB trigger (Migration 029) to drop direct UPDATEs to fields like `is_admin`, `is_verified`, `followers_count` when called via `authenticated` role (Flutter), protecting against direct Supabase access while leaving Node backend logic unaffected. | 2026-06-25 |
| 20 | Seat Race Condition Lock | Automatically mark seat status as `pending` and assign `influencer_id` directly in the backend before creating Stripe Checkout, and free them dynamically in `getSeats` if 15 mins have passed. Prevents double booking during checkout. | 2026-06-25 |
| 21 | Strict Bucket Enumeration | Refactored `upload.validator.ts` from generic strings to an explicit `enum` representing existing storage buckets to prevent arbitrary bucket creation or upload failures. | 2026-06-25 |
| 22 | Backend Lock | Resolved all NPM audit vulnerabilities and fixed Jest imports for Firebase Admin testing. Backend is now 100% Locked for the Flutter team. | 2026-06-25 |
| 23 | Seat Status Constraint Fix | `seats_status_check` DB constraint only allowed `available`/`booked` — missing `pending`. The service was trying to set `pending` on checkout init, causing silent failures. Fixed via migration 030. | 2026-06-25 |
| 24 | Subscription Plans Cleanup | Had 6 plans — 3 with placeholder Stripe IDs (unusable) + 1 inactive Enterprise. Deleted all 4 via migration 032. Kept 2 active plans with real Stripe IDs: Basic (10 AED) and Premium (29 AED). | 2026-06-25 |
| 25 | DB Housekeeping | Removed duplicate RLS policies on `offers` and `subscription_plans`. Added missing `idx_profiles_category_id` index (was in migration file but never applied to Supabase). Fixed via migration 031. | 2026-06-25 |
| 26 | protect_sensitive_columns Trigger Bug | Migration 029's trigger referenced columns that don't exist: `is_featured`/`views_count` on `ads` (has neither), `is_featured` on `services`. This broke EVERY authenticated UPDATE to ads/services (`record "new" has no field "is_featured"`). Fixed in migration 033 to reference real columns (ads → `impressions/clicks/spent`, services → `views_count`). Found via live API testing. | 2026-06-28 |
| 27 | Seat Cancel RLS Bug | Migration 029's seats UPDATE policy `WITH CHECK (auth.uid() = influencer_id)` blocked owners from releasing their seat (cancel sets `influencer_id = NULL`). Fixed in 033: `WITH CHECK (auth.uid() = influencer_id OR influencer_id IS NULL)` — still hijack-safe via USING. | 2026-06-28 |
| 28 | Missing Storage Buckets | 4 buckets in the upload validator (`services`, `stories`, `verifications`, `reports`) were never created in Supabase Storage → uploads failed with "Bucket not found". Created all 4. | 2026-06-28 |
| 29 | Stripe Mobile Subscription Bug (OPEN) | `POST /subscriptions` → 500 (`client_secret` undefined): stripe-node v22 defaults to a 2025 API version where `invoice.payment_intent` no longer exists. Needs PaymentSheet flow rewrite (pin apiVersion or use `confirmation_secret`). Flagged, NOT yet fixed. | 2026-06-28 |
| 30 | Rate-Limit Test Bypass | Added `DISABLE_RATE_LIMIT` env guard in `rateLimit.middleware.ts` (defaults OFF, production-safe) so a full 108-endpoint sweep isn't throttled. | 2026-06-28 |

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

### Phase 15 — Prototype Audit, Currency Unify & Cup/Leaderboard
- [x] Deep audit of the client APK prototype (screenshots in `Projects-Pictures/`) against requirements + live Supabase schema.
- [x] Confirmed v1 scope; deferred to v2: Reviews/Ratings, Likes/Comments on posts, content Packages.
- [x] Unified currency to **AED** across services, validators, and DB (`026_unify_currency_to_aed.sql`).
- [x] Added `027_add_unique_seat_tier_position.sql` (unique constraint on seat tier+position).
- [x] **Built the Cup / Leaderboard module** (Plan A):
  - `028_add_leaderboard.sql` — `profiles.followers_count` column + partial index + `sync_followers_count` trigger on `follows` + backfill. Applied to Supabase.
  - `leaderboard.{routes,controller,service,validator}.ts` + registered in `routes/index.ts`.
  - `GET /api/v1/leaderboard?page&limit&type=all|company|influencer|service_provider` — ranks active non-user accounts by `followers_count DESC`, paginated, `rank` attached.
  - Verified ordering + exclusion of regular users via live SQL.
- [x] Removed leftover filesystem-write debug line in `validate.middleware.ts` (production crash risk).

### Phase 18 — Full Live API Test Sweep & Bug Fixes
- [x] Built [`scripts/run_full_api_capture.ts`](../scripts/run_full_api_capture.ts): logs in every account type, exercises ALL 108 endpoints against a live server in dependency order, captures the real request/payload/response, and writes organized markdown to `docs/Apis-Resaults/<NN - Folder>/`.
- [x] Generated full test results (21 folders + README legend) — route + payload + real response + status for every endpoint.
- [x] **Found & fixed 3 real bugs via migration 033** (trigger column mismatch on ads/services, seat-cancel RLS) + created 4 missing storage buckets.
- [x] **Flagged 1 open bug**: Stripe mobile subscription `client_secret` (decision #29) — needs a separate fix.
- [x] Confirmed remaining non-2xx are NOT code bugs: phone provider disabled in Supabase, email rate limit, fake OAuth/OTP credentials, unsigned webhook.
- [x] Hand-verified Postman collection also produced: [`docs/promoo_full_api.postman_collection.json`](promoo_full_api.postman_collection.json) (108 requests).

### Phase 17 — Database Final Verification & Production Lock
- [x] **Direct Supabase MCP audit** — فحص شامل للداتا بيز مباشرةً عبر MCP (triggers, policies, indexes, constraints, seed data).
- [x] **seats_status_check** — الـ constraint كان يمنع قيمة `pending`، مما يجعل حجز المقاعد يفشل صامتاً. أضيفت `pending` عبر migration 030.
- [x] **Duplicate migration 022** — أُعيد تسمية `022_add_profile_category_index.sql` إلى `025_add_profile_category_index.sql` محلياً.
- [x] **Duplicate RLS policies** — حُذفت السياسات المكررة على `offers` و`subscription_plans` عبر migration 031.
- [x] **idx_profiles_category_id** — الـ index كان موجوداً في ملف migration لكن لم يُطبَّق على Supabase. أُضيف عبر migration 031.
- [x] **Subscription Plans Cleanup** — حُذفت 4 خطط زائدة (3 placeholder IDs + 1 Enterprise غير نشط) عبر migration 032. تبقّت خطتان فعليتان بـ Stripe IDs حقيقية: Basic (10 AED) و Premium (29 AED).
- [x] **DB Health Confirmed** — 21 جدول، RLS مفعّل على الكل، 25+ trigger، كل الـ indexes موجودة، seed data سليم.

### Phase 16 — Final Backend Polish & Flutter Handover
- [x] **RLS Hardening:** Applied migration `029_harden_rls_and_seats.sql` dropping public `UPDATE` capabilities on `seats` and enforcing `protect_sensitive_columns` database triggers for `profiles`, `offers`, `ads`, and `services`.
- [x] **Race Conditions:** Ensured `seat.service.ts` locks a seat immediately upon checkout init and releases it if abandoned for over 15 minutes.
- [x] **Jest Setup:** Configured `jest.config.js` and `jest.setup.js` and implemented `firebase-admin` module mocking to resolve ESM import crashes in `npm test`.
- [x] **API Generators:** Inserted `Leaderboard` into `scripts/generate_api_reference.ts` and `scripts/generate_postman.ts`, successfully generating new contracts.
- [x] **NPM Audit:** Cleared all moderate/high Node vulnerabilities (`multer`, `lodash`, etc.) via `npm audit fix`.

---

## Current Context

**Currently working on**: Backend + Database verified end-to-end via a **live API test sweep** (all 108 endpoints). Results in `docs/Apis-Resaults/`.
**Next up**: Front-end Flutter integration. One open backend bug to fix: Stripe mobile subscription (decision #29). v2 backlog: Reviews/Ratings, Likes/Comments, Content Packages.
**Blockers**: `POST /subscriptions` returns 500 (Stripe API version / `client_secret`) — must fix before live subscription payments. All other paid flows (seat booking, feature offer) return real Stripe checkout URLs.
**Notes**: All Backend Phases (1-18) complete. DB verified via MCP through migration 033. Live test fixed 3 bugs (trigger columns, seat-cancel RLS, missing buckets) that static review had missed.

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
