# Promoo Backend — Project Rules & Standards

> This file is the **single source of truth** for all coding standards, architectural decisions,
> and conventions used in this project. Every contributor and AI assistant must follow these rules.

---

## 1. Project Overview

| Key | Value |
|-----|-------|
| **Name** | Promoo Backend |
| **Purpose** | REST API for a digital platform connecting companies, influencers, service providers, and regular users |
| **Stack** | Node.js + Express.js + TypeScript |
| **Database** | PostgreSQL via Supabase |
| **Auth** | Supabase Auth (Email, Phone, Google, Apple, OTP) |
| **Storage** | Supabase Storage (images, videos, attachments) |
| **Realtime** | Supabase Realtime (1-to-1 chat) |
| **Payments** | Stripe (Checkout Sessions + Webhooks) |
| **Push Notifications** | Firebase Cloud Messaging (FCM) |
| **Languages** | Bilingual: Arabic (ar) + English (en) |

### Account Types
- `company` — شركة
- `influencer` — مؤثر
- `service_provider` — مقدم خدمة
- `user` — مستخدم عادي

---

## 2. Architecture Pattern

We follow a **3-Layer Architecture**:

```
This project follows a strict **3-Layer Architecture**:
1. **Routes**: Define API endpoints and attach middleware/validators.
2. **Controllers**: Handle HTTP requests/responses, extract parameters, and call services.
3. **Services**: Contain all core business logic and interact directly with Supabase/Database.

**Note on Data Access:** 
Since Supabase acts as a powerful query builder and Backend-as-a-Service, the `Service` layer directly queries Supabase. We do not use a separate `Repository` layer to avoid unnecessary abstraction overhead and keep the architecture pragmatic.

### Rules:
- Controllers NEVER call the database directly
- Services NEVER access `req` or `res` objects
- Each module has its own route, controller, and service file

---

## 3. Project Structure

```
src/
├── app.ts                    # Express app configuration
├── server.ts                 # Entry point (starts server)
├── config/                   # External service clients
│   ├── supabase.ts           # Supabase client (singleton)
│   ├── stripe.ts             # Stripe client
│   ├── firebase.ts           # Firebase Admin SDK
│   └── env.ts                # Env validation with Zod
├── middleware/                # Express middleware
├── routes/                   # Route definitions
│   ├── index.ts              # Route aggregator
│   └── admin/                # Admin-only routes
├── controllers/              # Request handlers
│   └── admin/
├── services/                 # Business logic
├── validators/               # Zod schemas per module
├── types/                    # TypeScript types & enums
└── utils/                    # Shared utilities
```

---

## 4. Naming Conventions

| Item | Convention | Example |
|------|-----------|---------|
| Files | `kebab-case` or `camelCase.type.ts` | `auth.controller.ts`, `auth.service.ts` |
| Variables | `camelCase` | `userId`, `offerPrice` |
| Constants | `UPPER_SNAKE_CASE` | `MAX_FILE_SIZE`, `DEFAULT_PAGE_SIZE` |
| Classes | `PascalCase` | `ApiError`, `AuthService` |
| Interfaces/Types | `PascalCase` with prefix | `IUser`, `TCreateOffer` |
| Enums | `PascalCase` keys | `AccountType.Company` |
| Database tables | `snake_case` | `subscription_plans`, `chat_rooms` |
| Database columns | `snake_case` | `created_at`, `is_verified` |
| API endpoints | `kebab-case` | `/api/auth/forgot-password` |
| Environment vars | `UPPER_SNAKE_CASE` | `SUPABASE_URL`, `STRIPE_SECRET_KEY` |

---

## 5. API Design Standards

### Base URL
```
/api/v1/...
```

### Response Format — ALWAYS use this structure:
```typescript
// Success
{
  "success": true,
  "data": { ... } | [...],
  "message": "Operation completed successfully",
  "meta": {                    // Only for paginated responses
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}

// Error
{
  "success": false,
  "data": null,
  "message": "Human-readable error message",
  "error": {
    "code": "VALIDATION_ERROR",   // Machine-readable error code
    "details": [...]              // Optional: field-level errors
  }
}
```

### HTTP Status Codes:
| Code | Usage |
|------|-------|
| `200` | Success (GET, PUT, PATCH) |
| `201` | Created (POST) |
| `204` | No Content (DELETE) |
| `400` | Bad Request / Validation Error |
| `401` | Unauthorized (no token or expired) |
| `403` | Forbidden (no permission) |
| `404` | Not Found |
| `409` | Conflict (duplicate) |
| `422` | Unprocessable Entity |
| `429` | Too Many Requests |
| `500` | Internal Server Error |

### Pagination:
- All list endpoints MUST support pagination
- Default: `page=1`, `limit=20`
- Max limit: `100`
- Query params: `?page=1&limit=20`

### Internationalization (i18n):
- Accept `Accept-Language` header (`ar` or `en`, default: `en`)
- Return localized fields accordingly
- Database stores both: `name_ar`, `name_en`

---

## 6. TypeScript Rules

- **Strict mode**: Always enabled (`strict: true` in tsconfig)
- **No `any`**: Never use `any`. Use `unknown` if type is truly unknown
- **Explicit return types**: All functions must have explicit return types
- **Interfaces for objects**: Use `interface` for object shapes, `type` for unions/intersections
- **Enums**: Use string enums for readability
- **Null handling**: Always handle null/undefined cases explicitly

```typescript
// ✅ Good
async function getUserById(id: string): Promise<IProfile | null> { ... }

// ❌ Bad
async function getUserById(id: any) { ... }
```

---

## 7. Coding Standards

### Async/Await
- ALWAYS use `async/await`. NEVER use callbacks or raw `.then()` chains
- ALWAYS wrap controller logic in try/catch

### Error Handling
```typescript
// In Controllers — use the centralized error handler
const getUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await userService.getById(req.params.id);
    res.status(200).json(apiResponse.success(user, 'User fetched'));
  } catch (error) {
    next(error); // Pass to error handler middleware
  }
};
```

### Validation
- ALWAYS validate input using Zod schemas BEFORE processing
- Define schemas in `validators/` directory
- Use `validate` middleware to auto-validate requests

```typescript
// validators/auth.validator.ts
export const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
    fullName: z.string().min(2).max(100),
    accountType: z.enum(['company', 'influencer', 'service_provider', 'user']),
  }),
});
```

### Preventing Mass Assignment
- ALWAYS destructure incoming payloads to strip sensitive fields (e.g., `is_admin`, `is_verified`, `stripe_customer_id`, `account_type`) before passing them to `.update()` or `.insert()`.
- **Safe State Transitions**: When stripping fields like `status`, ensure you still allow legitimate state transitions (e.g., user pausing their own ad) by safely extracting and validating the status against permitted values instead of blindly dropping it.
- NEVER pass `req.body` or raw `payload` directly to the database layer.

### Imports
- Use ES module imports (`import/export`)
- Order: Node built-ins → External packages → Internal modules → Types
- Use path aliases if configured

---

## 8. Database Rules (Supabase)

- **UUIDs**: All primary keys are UUIDs (`gen_random_uuid()`)
- **Timestamps**: All tables have `created_at` (auto) and `updated_at` where applicable
- **Soft deletes**: Use `deleted_at` timestamp instead of hard deletes for important data
- **RLS**: Row Level Security enabled on ALL tables
- **Service role**: Only used server-side in services, NEVER exposed
- **Indexes**: Add indexes on frequently queried columns (foreign keys, status, created_at)
- **Constraints**: Use database constraints (UNIQUE, CHECK, NOT NULL) as the last line of defense. ALWAYS name constraints explicitly (e.g., `CONSTRAINT my_check CHECK (...)`) to allow safe dropping/altering in future migrations.
- **Polymorphic Relations**: When using polymorphic relations (e.g., `related_id` + `related_to`), use DB triggers (like `cascade_polymorphic_deletes`) to handle cascading deletions cleanly since pure `FOREIGN KEY` constraints cannot enforce cross-table links.
- **PostgREST Embedded Filters**: When filtering an embedded (joined) table using the Supabase JS SDK, ALWAYS use the table name (e.g. `query.ilike('profiles.location', ...)`) instead of the relation alias to prevent the SDK from misinterpreting it as a JSON path.
- **Cached Counters**: For values read far more often than written and used for sorting (e.g. `profiles.followers_count` for the Cup leaderboard), store a cached counter column kept in sync via a trigger on the source table (INSERT/DELETE), and add a partial index for the sort. Always backfill existing rows in the same migration. Use `GREATEST(count - 1, 0)` on decrement to avoid negatives.
- **SECURITY DEFINER Functions**: ALWAYS pin `SET search_path = ''` on `SECURITY DEFINER` functions and fully-qualify every object (`public.table`). Prevents the `function_search_path_mutable` advisor warning and search_path hijacking.

---

## 9. Security Rules

- NEVER expose `SUPABASE_SERVICE_ROLE_KEY` or `STRIPE_SECRET_KEY` in responses or logs
- ALWAYS verify JWT in protected routes via `auth.middleware.ts`
- ALWAYS sanitize user inputs (Zod handles this)
- ALWAYS use parameterized queries (Supabase client does this automatically)
- ALWAYS set security headers via `helmet`
- ALWAYS apply rate limiting on auth endpoints
- NEVER log sensitive data (passwords, tokens, card numbers)
- Use CORS whitelist, not wildcard, in production
- **No filesystem writes in the request path**: NEVER write debug output (e.g. `fs.writeFileSync('scratch/...')`) from middleware, controllers, or services. It throws when the path is missing (crashing the request and masking the real error) and risks leaking stack traces. Use the centralized `logger` and `next(error)` instead.
- **Stripe Placeholders**: Safely intercept `price_*_placeholder` seed data in the API and throw a controlled `400 Bad Request` to prevent catastrophic `500 resource_missing` crashes in the Stripe SDK.

---

## 10. File Upload Rules

- Max image size: **5MB**
- Max video size: **50MB**
- Max attachment size: **10MB**
- Allowed image types: `jpg, jpeg, png, webp, gif`
- Allowed video types: `mp4, mov, webm`
- Storage buckets: `avatars`, `covers`, `offers`, `ads`, `chat-media`, `services`, `stories`, `verifications`, `reports`, `general`
- File naming: `{userId}/{timestamp}_{originalName}`
- Storage RLS: ALWAYS enforce folder ownership in DB policies using `(storage.foldername(name))[1] = auth.uid()::text` to prevent folder hijacking.
- **RLS Consistency**: Ensure that `UPDATE` and `INSERT` policies explicitly list ALL active buckets in their `WITH CHECK` conditions, while `DELETE` policies can safely be global if correctly restricted by `owner = auth.uid()`.

---

## 11. Git & Code Quality

- Commit messages: `type(scope): message` (e.g., `feat(auth): add OTP verification`)
- Types: `feat`, `fix`, `refactor`, `docs`, `chore`, `test`
- One feature per branch
- Always run linting before commit

---

## 12. Environment Variables Required

```env
# Server
NODE_ENV=development
PORT=3000
API_VERSION=v1

# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Firebase
FIREBASE_PROJECT_ID=promoo-xxx
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@promoo.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# App
DEFAULT_LANGUAGE=en
MAX_PAGE_SIZE=100
DEFAULT_PAGE_SIZE=20

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

---

## 13. Testing Standards

- Unit tests for services (mock repositories)
- Integration tests for routes (test full request cycle)
- Test files: `*.test.ts` or `*.spec.ts` next to source files or in `tests/` directory
- Use descriptive test names: `should return 401 when token is missing`

---

## 14. Module Checklist (for every new feature)

When creating a new module, always create these files:
1. `validators/{module}.validator.ts` — Zod schemas
2. `services/{module}.service.ts` — Business logic
3. `controllers/{module}.controller.ts` — Request handling
4. `routes/{module}.routes.ts` — Route definitions
5. Register routes in `routes/index.ts`
6. Add types to `types/` if needed
