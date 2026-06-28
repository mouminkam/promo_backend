# Offers — API Test Results

> Live responses captured against `http://localhost:3000/api/v1`. Base URL shown as `{{baseUrl}}`.

## 1. Create Offer

- **Method / Route:** `POST {{baseUrl}}/offers`
- **Auth:** Bearer (company, required: company/service_provider)
- **Status:** `201` ✅

**Payload:**

```json
{
  "category_id": "20361ed2-ab58-427a-ad12-a8ace962b09f",
  "title": "50% Off Summer Collection",
  "description": "Limited time discount on all summer items, valid in-store and online.",
  "original_price": 200,
  "offer_price": 100,
  "discount_percentage": 50,
  "media_urls": [
    "https://example.com/offer1.jpg"
  ],
  "start_date": "2026-07-01T00:00:00.000Z",
  "end_date": "2026-08-01T00:00:00.000Z",
  "status": "active",
  "tags": [
    "summer",
    "sale"
  ]
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "9ac874d9-b209-42a5-aaac-f2c2592c5107",
    "profile_id": "3a909ef5-9f3f-427d-b530-f332d916418c",
    "category_id": "20361ed2-ab58-427a-ad12-a8ace962b09f",
    "title": "50% Off Summer Collection",
    "description": "Limited time discount on all summer items, valid in-store and online.",
    "original_price": 200,
    "offer_price": 100,
    "discount_percentage": 50,
    "media_urls": [
      "https://example.com/offer1.jpg"
    ],
    "start_date": "2026-07-01T00:00:00+00:00",
    "end_date": "2026-08-01T00:00:00+00:00",
    "status": "active",
    "is_featured": false,
    "views_count": 0,
    "created_at": "2026-06-28T18:16:54.516128+00:00",
    "updated_at": "2026-06-28T18:16:54.516128+00:00",
    "tags": [
      "summer",
      "sale"
    ],
    "category": {
      "id": "20361ed2-ab58-427a-ad12-a8ace962b09f",
      "slug": "technology",
      "name_ar": "تكنولوجيا",
      "name_en": "Technology"
    }
  },
  "message": "Offer created successfully"
}
```

---

## 2. List Offers

- **Method / Route:** `GET {{baseUrl}}/offers?page=1&limit=20`
- **Auth:** Public (no auth)
- **Status:** `200` ✅

**Payload:**

_— none —_

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "9ac874d9-b209-42a5-aaac-f2c2592c5107",
      "profile_id": "3a909ef5-9f3f-427d-b530-f332d916418c",
      "category_id": "20361ed2-ab58-427a-ad12-a8ace962b09f",
      "title": "50% Off Summer Collection",
      "description": "Limited time discount on all summer items, valid in-store and online.",
      "original_price": 200,
      "offer_price": 100,
      "discount_percentage": 50,
      "media_urls": [
        "https://example.com/offer1.jpg"
      ],
      "start_date": "2026-07-01T00:00:00+00:00",
      "end_date": "2026-08-01T00:00:00+00:00",
      "status": "active",
      "is_featured": false,
      "views_count": 0,
      "created_at": "2026-06-28T18:16:54.516128+00:00",
      "updated_at": "2026-06-28T18:16:54.516128+00:00",
      "tags": [
        "summer",
        "sale"
      ],
      "profile": {
        "id": "3a909ef5-9f3f-427d-b530-f332d916418c",
        "location": "Dubai, UAE",
        "username": null,
        "full_name": "Test Company",
        "avatar_url": "https://example.com/avatar.jpg"
      },
      "category": {
        "id": "20361ed2-ab58-427a-ad12-a8ace962b09f",
        "slug": "technology",
        "name_ar": "تكنولوجيا",
        "name_en": "Technology"
      }
    },
    {
      "id": "5e2572b4-2128-4737-81c2-32c656d0e108",
      "profile_id": "2fe4e7b0-93c1-46cc-a6ea-42e173722b81",
      "category_id": "20361ed2-ab58-427a-ad12-a8ace962b09f",
      "title": "50% Off Summer Collection",
      "description": "Limited time discount on all summer items, valid in-store and online.",
      "original_price": 200,
      "offer_price": 100,
      "discount_percentage": 50,
      "media_urls": [
        "https://example.com/offer1.jpg"
      ],
      "start_date": "2026-07-01T00:00:00+00:00",
      "end_date": "2026-08-01T00:00:00+00:00",
      "status": "active",
      "is_featured": false,
      "views_count": 0,
      "created_at": "2026-06-28T17:33:56.037178+00:00",
      "updated_at": "2026-06-28T17:33:56.037178+00:00",
      "tags": [
        "summer",
        "sale"
      ],
      "profile": {
        "id": "2fe4e7b0-93c1-46cc-a6ea-42e173722b81",
        "location": null,
        "username": null,
        "full_name": "Moumin Alkamsheh",
        "avatar_url": null
      },
      "category": {
        "id": "20361ed2-ab58-427a-ad12-a8ace962b09f",
        "slug": "technology",
        "name_ar": "تكنولوجيا",
        "name_en": "Technology"
      }
    }
  ],
  "message": "Offers retrieved successfully",
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 2,
    "totalPages": 1
  }
}
```

---

## 3. Get Offer by ID

- **Method / Route:** `GET {{baseUrl}}/offers/9ac874d9-b209-42a5-aaac-f2c2592c5107`
- **Auth:** Public (no auth)
- **Status:** `200` ✅

**Payload:**

_— none —_

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "9ac874d9-b209-42a5-aaac-f2c2592c5107",
    "profile_id": "3a909ef5-9f3f-427d-b530-f332d916418c",
    "category_id": "20361ed2-ab58-427a-ad12-a8ace962b09f",
    "title": "50% Off Summer Collection",
    "description": "Limited time discount on all summer items, valid in-store and online.",
    "original_price": 200,
    "offer_price": 100,
    "discount_percentage": 50,
    "media_urls": [
      "https://example.com/offer1.jpg"
    ],
    "start_date": "2026-07-01T00:00:00+00:00",
    "end_date": "2026-08-01T00:00:00+00:00",
    "status": "active",
    "is_featured": false,
    "views_count": 0,
    "created_at": "2026-06-28T18:16:54.516128+00:00",
    "updated_at": "2026-06-28T18:16:54.516128+00:00",
    "tags": [
      "summer",
      "sale"
    ],
    "profile": {
      "id": "3a909ef5-9f3f-427d-b530-f332d916418c",
      "location": "Dubai, UAE",
      "username": null,
      "full_name": "Test Company",
      "avatar_url": "https://example.com/avatar.jpg"
    },
    "category": {
      "id": "20361ed2-ab58-427a-ad12-a8ace962b09f",
      "slug": "technology",
      "name_ar": "تكنولوجيا",
      "name_en": "Technology"
    }
  },
  "message": "Offer details retrieved successfully"
}
```

---

## 4. Get Offers by Profile

- **Method / Route:** `GET {{baseUrl}}/offers/profile/3a909ef5-9f3f-427d-b530-f332d916418c?page=1&limit=20`
- **Auth:** Public (no auth)
- **Status:** `200` ✅

**Payload:**

_— none —_

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "9ac874d9-b209-42a5-aaac-f2c2592c5107",
      "profile_id": "3a909ef5-9f3f-427d-b530-f332d916418c",
      "category_id": "20361ed2-ab58-427a-ad12-a8ace962b09f",
      "title": "50% Off Summer Collection",
      "description": "Limited time discount on all summer items, valid in-store and online.",
      "original_price": 200,
      "offer_price": 100,
      "discount_percentage": 50,
      "media_urls": [
        "https://example.com/offer1.jpg"
      ],
      "start_date": "2026-07-01T00:00:00+00:00",
      "end_date": "2026-08-01T00:00:00+00:00",
      "status": "active",
      "is_featured": false,
      "views_count": 1,
      "created_at": "2026-06-28T18:16:54.516128+00:00",
      "updated_at": "2026-06-28T18:16:55.303968+00:00",
      "tags": [
        "summer",
        "sale"
      ],
      "category": {
        "id": "20361ed2-ab58-427a-ad12-a8ace962b09f",
        "slug": "technology",
        "name_ar": "تكنولوجيا",
        "name_en": "Technology"
      }
    }
  ],
  "message": "User offers retrieved successfully",
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

---

## 5. Update Offer

- **Method / Route:** `PUT {{baseUrl}}/offers/9ac874d9-b209-42a5-aaac-f2c2592c5107`
- **Auth:** Bearer (company)
- **Status:** `200` ✅

**Payload:**

```json
{
  "title": "60% Off Summer Collection",
  "offer_price": 80
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "9ac874d9-b209-42a5-aaac-f2c2592c5107",
    "profile_id": "3a909ef5-9f3f-427d-b530-f332d916418c",
    "category_id": "20361ed2-ab58-427a-ad12-a8ace962b09f",
    "title": "60% Off Summer Collection",
    "description": "Limited time discount on all summer items, valid in-store and online.",
    "original_price": 200,
    "offer_price": 80,
    "discount_percentage": 50,
    "media_urls": [
      "https://example.com/offer1.jpg"
    ],
    "start_date": "2026-07-01T00:00:00+00:00",
    "end_date": "2026-08-01T00:00:00+00:00",
    "status": "active",
    "is_featured": false,
    "views_count": 1,
    "created_at": "2026-06-28T18:16:54.516128+00:00",
    "updated_at": "2026-06-28T18:16:56.194189+00:00",
    "tags": [
      "summer",
      "sale"
    ],
    "category": {
      "id": "20361ed2-ab58-427a-ad12-a8ace962b09f",
      "slug": "technology",
      "name_ar": "تكنولوجيا",
      "name_en": "Technology"
    }
  },
  "message": "Offer updated successfully"
}
```

---

## 6. Feature Offer (Stripe Checkout)

- **Method / Route:** `POST {{baseUrl}}/offers/9ac874d9-b209-42a5-aaac-f2c2592c5107/feature`
- **Auth:** Bearer (company)
- **Status:** `200` ✅

**Payload:**

_— none —_

**Response:**

```json
{
  "success": true,
  "data": {
    "checkoutUrl": "https://checkout.stripe.com/c/pay/cs_test_a1G9H8B0PmtcSI3vykokj3zH0LAR5RmFfnU8mNYMIImE460ZlplgRnBXtP#fidnandhYHdWcXxpYCc%2FJ2FgY2RwaXEnKSdicGRmZGhqaWBTZHdsZGtxJz8nZmprcXdqaScpJ2R1bE5gfCc%2FJ3VuWnFgdnFaMDRRb1VGYjM3ZGI9Vm1oPFdnSElxcF9kNWlvQ0FpU0pnQlJrNEAwVWwzMnRQTU19fV9nMGlnSVJsYldLXEBCcTV%2FUH89ZmpjTkg1QmFuXzJuN3BgRG9kQVQ1NW1cUlFHTEdQJyknY3dqaFZgd3Ngdyc%2FcXdwYCknZ2RmbmJ3anBrYUZqaWp3Jz8nJmNjY2NjYycpJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl",
    "sessionId": "cs_test_a1G9H8B0PmtcSI3vykokj3zH0LAR5RmFfnU8mNYMIImE460ZlplgRnBXtP",
    "paymentId": null,
    "status": "pending"
  },
  "message": "Offer featured successfully"
}
```

---

## 7. Delete Offer

- **Method / Route:** `DELETE {{baseUrl}}/offers/f01d1d76-fc4b-4ae1-bf61-5b59a59d5ba5`
- **Auth:** Bearer (company)
- **Status:** `200` ✅

**Payload:**

_— none —_

**Response:**

```json
{
  "success": true,
  "data": null,
  "message": "Offer deleted successfully"
}
```

---

