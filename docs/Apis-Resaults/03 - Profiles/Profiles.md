# Profiles — API Test Results

> Live responses captured against `http://localhost:3000/api/v1`. Base URL shown as `{{baseUrl}}`.

## 1. Get My Profile

- **Method / Route:** `GET {{baseUrl}}/profiles/me`
- **Auth:** Bearer (company)
- **Status:** `200` ✅

**Payload:**

_— none —_

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "3a909ef5-9f3f-427d-b530-f332d916418c",
    "email": "company@test.com",
    "phone": null,
    "full_name": "Test Company",
    "username": null,
    "avatar_url": "https://example.com/avatar.jpg",
    "cover_url": "https://example.com/cover.jpg",
    "bio": "Leading marketing agency in Dubai.",
    "account_type": "company",
    "is_verified": false,
    "is_featured": false,
    "category_id": null,
    "location": "Dubai, UAE",
    "website": "https://promoo.example.com",
    "social_links": {},
    "company_details": {},
    "influencer_details": {},
    "service_provider_details": {},
    "stripe_customer_id": "cus_UmwpID1ojToGzM",
    "is_admin": false,
    "created_at": "2026-06-24T16:40:25.915853+00:00",
    "updated_at": "2026-06-28T18:07:04.547688+00:00",
    "is_active": true,
    "followers_count": 1200000,
    "categories": null
  },
  "message": "Profile retrieved successfully"
}
```

---

## 2. Update My Profile

- **Method / Route:** `PUT {{baseUrl}}/profiles/me`
- **Auth:** Bearer (company)
- **Status:** `200` ✅

**Payload:**

```json
{
  "bio": "Leading marketing agency in Dubai.",
  "location": "Dubai, UAE",
  "website": "https://promoo.example.com"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "3a909ef5-9f3f-427d-b530-f332d916418c",
    "email": "company@test.com",
    "phone": null,
    "full_name": "Test Company",
    "username": null,
    "avatar_url": "https://example.com/avatar.jpg",
    "cover_url": "https://example.com/cover.jpg",
    "bio": "Leading marketing agency in Dubai.",
    "account_type": "company",
    "is_verified": false,
    "is_featured": false,
    "category_id": null,
    "location": "Dubai, UAE",
    "website": "https://promoo.example.com",
    "social_links": {},
    "company_details": {},
    "influencer_details": {},
    "service_provider_details": {},
    "stripe_customer_id": "cus_UmwpID1ojToGzM",
    "is_admin": false,
    "created_at": "2026-06-24T16:40:25.915853+00:00",
    "updated_at": "2026-06-28T18:16:48.541158+00:00",
    "is_active": true,
    "followers_count": 1200000
  },
  "message": "Profile updated successfully"
}
```

---

## 3. Update Avatar

- **Method / Route:** `POST {{baseUrl}}/profiles/me/avatar`
- **Auth:** Bearer (company)
- **Status:** `200` ✅

**Payload:**

```json
{
  "avatar_url": "https://example.com/avatar.jpg"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "3a909ef5-9f3f-427d-b530-f332d916418c",
    "email": "company@test.com",
    "phone": null,
    "full_name": "Test Company",
    "username": null,
    "avatar_url": "https://example.com/avatar.jpg",
    "cover_url": "https://example.com/cover.jpg",
    "bio": "Leading marketing agency in Dubai.",
    "account_type": "company",
    "is_verified": false,
    "is_featured": false,
    "category_id": null,
    "location": "Dubai, UAE",
    "website": "https://promoo.example.com",
    "social_links": {},
    "company_details": {},
    "influencer_details": {},
    "service_provider_details": {},
    "stripe_customer_id": "cus_UmwpID1ojToGzM",
    "is_admin": false,
    "created_at": "2026-06-24T16:40:25.915853+00:00",
    "updated_at": "2026-06-28T18:16:49.126813+00:00",
    "is_active": true,
    "followers_count": 1200000
  },
  "message": "Avatar updated successfully"
}
```

---

## 4. Update Cover

- **Method / Route:** `POST {{baseUrl}}/profiles/me/cover`
- **Auth:** Bearer (company)
- **Status:** `200` ✅

**Payload:**

```json
{
  "cover_url": "https://example.com/cover.jpg"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "3a909ef5-9f3f-427d-b530-f332d916418c",
    "email": "company@test.com",
    "phone": null,
    "full_name": "Test Company",
    "username": null,
    "avatar_url": "https://example.com/avatar.jpg",
    "cover_url": "https://example.com/cover.jpg",
    "bio": "Leading marketing agency in Dubai.",
    "account_type": "company",
    "is_verified": false,
    "is_featured": false,
    "category_id": null,
    "location": "Dubai, UAE",
    "website": "https://promoo.example.com",
    "social_links": {},
    "company_details": {},
    "influencer_details": {},
    "service_provider_details": {},
    "stripe_customer_id": "cus_UmwpID1ojToGzM",
    "is_admin": false,
    "created_at": "2026-06-24T16:40:25.915853+00:00",
    "updated_at": "2026-06-28T18:16:49.602462+00:00",
    "is_active": true,
    "followers_count": 1200000
  },
  "message": "Cover updated successfully"
}
```

---

## 5. Request Verification

- **Method / Route:** `POST {{baseUrl}}/profiles/me/verify-request`
- **Auth:** Bearer (company)
- **Status:** `200` ✅

**Payload:**

```json
{
  "document_url": "https://example.com/license.pdf",
  "notes": "Trade license attached."
}
```

**Response:**

```json
{
  "success": true,
  "data": null,
  "message": "Verification requested successfully"
}
```

---

## 6. Get Profile by ID

- **Method / Route:** `GET {{baseUrl}}/profiles/8481b89e-43c2-47c8-a90e-7823c516f926`
- **Auth:** Public (no auth)
- **Status:** `200` ✅

**Payload:**

_— none —_

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "8481b89e-43c2-47c8-a90e-7823c516f926",
    "email": "influencer@test.com",
    "phone": null,
    "full_name": "Test Influencer",
    "username": null,
    "avatar_url": null,
    "cover_url": null,
    "bio": null,
    "account_type": "influencer",
    "is_verified": false,
    "is_featured": false,
    "category_id": null,
    "location": null,
    "website": null,
    "social_links": {},
    "company_details": {},
    "influencer_details": {},
    "service_provider_details": {},
    "stripe_customer_id": null,
    "is_admin": false,
    "created_at": "2026-06-24T16:40:25.347348+00:00",
    "updated_at": "2026-06-28T18:07:08.32955+00:00",
    "is_active": true,
    "followers_count": 980000,
    "categories": null
  },
  "message": "Profile retrieved successfully"
}
```

---

## 7. Get Profile Media

- **Method / Route:** `GET {{baseUrl}}/profiles/8481b89e-43c2-47c8-a90e-7823c516f926/media`
- **Auth:** Public (no auth)
- **Status:** `200` ✅

**Payload:**

_— none —_

**Response:**

```json
{
  "success": true,
  "data": [],
  "message": "Profile media retrieved successfully",
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 0,
    "totalPages": 0
  }
}
```

---

