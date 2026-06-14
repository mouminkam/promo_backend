# Promoo Backend — Memory Bank

> Dynamic project memory. Updated after every phase/milestone to track progress,
> decisions, and context for continuity across sessions.

---

## Project Status

| Phase | Name | Status | Date |
|-------|------|--------|------|
| 0 | Foundation & Setup | ✅ Completed | 2026-06-14 |
| 1 | Database Migrations | ✅ Completed | 2026-06-14 |
| 2 | Authentication | 🔄 In Progress | 2026-06-14 |
| 3 | Profiles | ⬜ Not Started | — |
| 4 | Follow System | ⬜ Not Started | — |
| 5 | Offers & Ads | ⬜ Not Started | — |
| 6 | Subscriptions & Stripe | ⬜ Not Started | — |
| 7 | Chat System | ⬜ Not Started | — |
| 8 | Notifications | ⬜ Not Started | — |
| 9 | Upload & Search | ⬜ Not Started | — |
| 10 | Featured & Payments | ⬜ Not Started | — |
| 11 | Reports | ⬜ Not Started | — |
| 12 | Admin Dashboard APIs | ⬜ Not Started | — |

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

---

## Completed Work

### Phase 0 — Foundation (In Progress)
- [ ] Project initialized with npm
- [ ] TypeScript configured
- [ ] Express app setup with middleware
- [ ] Supabase client configured
- [ ] Utility files created (apiResponse, apiError, logger)
- [ ] Environment validation with Zod
- [ ] Folder structure created

---

## Current Context

**Currently working on**: Phase 2 — Authentication
**Next up**: Phase 3 — Profiles
**Blockers**: Need to push migrations to Supabase project when created.
**Notes**: Phase 1 (Database Migrations) completed successfully. 9 migration files and 1 seed file created with full RLS, constraints, triggers, and schema definitions. Ready to implement Auth APIs.

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
