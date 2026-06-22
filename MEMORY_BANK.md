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

---

## Current Context

**Currently working on**: Front-End Integration / Mobile App Prototype
**Next up**: Mobile App Development
**Blockers**: Client UI/UX approval
**Notes**: All Backend Phases (1-12) are 100% complete. Database schema, RLS policies, triggers, realtime settings, storage buckets, and seed data have been successfully pushed to the Supabase Cloud Production project via MCP. The backend is fully operational and ready for Front-End integration.

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
