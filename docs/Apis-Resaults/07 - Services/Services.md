# Services — API Test Results

> Live responses captured against `http://localhost:3000/api/v1`. Base URL shown as `{{baseUrl}}`.

## 1. Create Service

- **Method / Route:** `POST {{baseUrl}}/services`
- **Auth:** Bearer (provider, required: service_provider/company)
- **Status:** `201` ✅

**Payload:**

```json
{
  "category_id": "20361ed2-ab58-427a-ad12-a8ace962b09f",
  "title": "Professional Logo Design",
  "description": "Custom logo design with unlimited revisions.",
  "price": 350,
  "currency": "AED",
  "delivery_days": 5,
  "media_urls": [
    "https://example.com/portfolio.jpg"
  ],
  "tags": [
    "design"
  ]
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "4a9a8c77-6539-41c2-8454-64313c510276",
    "profile_id": "447f3dc7-783e-4c3f-b10e-b0c2d4ddd2c9",
    "category_id": "20361ed2-ab58-427a-ad12-a8ace962b09f",
    "title": "Professional Logo Design",
    "description": "Custom logo design with unlimited revisions.",
    "price": 350,
    "currency": "AED",
    "delivery_days": 5,
    "media_urls": [
      "https://example.com/portfolio.jpg"
    ],
    "tags": [
      "design"
    ],
    "status": "active",
    "views_count": 0,
    "created_at": "2026-06-28T18:17:04.413393+00:00",
    "updated_at": "2026-06-28T18:17:04.413393+00:00",
    "category": {
      "id": "20361ed2-ab58-427a-ad12-a8ace962b09f",
      "slug": "technology",
      "name_ar": "تكنولوجيا",
      "name_en": "Technology"
    }
  },
  "message": "Service created successfully"
}
```

---

## 2. List Services

- **Method / Route:** `GET {{baseUrl}}/services`
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
      "id": "4a9a8c77-6539-41c2-8454-64313c510276",
      "profile_id": "447f3dc7-783e-4c3f-b10e-b0c2d4ddd2c9",
      "category_id": "20361ed2-ab58-427a-ad12-a8ace962b09f",
      "title": "Professional Logo Design",
      "description": "Custom logo design with unlimited revisions.",
      "price": 350,
      "currency": "AED",
      "delivery_days": 5,
      "media_urls": [
        "https://example.com/portfolio.jpg"
      ],
      "tags": [
        "design"
      ],
      "status": "active",
      "views_count": 0,
      "created_at": "2026-06-28T18:17:04.413393+00:00",
      "updated_at": "2026-06-28T18:17:04.413393+00:00",
      "profile": {
        "id": "447f3dc7-783e-4c3f-b10e-b0c2d4ddd2c9",
        "username": null,
        "full_name": "Test Provider",
        "avatar_url": null,
        "is_verified": false,
        "account_type": "service_provider"
      },
      "category": {
        "id": "20361ed2-ab58-427a-ad12-a8ace962b09f",
        "slug": "technology",
        "name_ar": "تكنولوجيا",
        "name_en": "Technology"
      }
    },
    {
      "id": "24b4e071-c326-4dd2-a2ed-0525c57d444a",
      "profile_id": "2fe4e7b0-93c1-46cc-a6ea-42e173722b81",
      "category_id": "20361ed2-ab58-427a-ad12-a8ace962b09f",
      "title": "Professional Logo Design",
      "description": "High quality custom logo design for your brand identity.",
      "price": 500,
      "currency": "AED",
      "delivery_days": 3,
      "media_urls": [
        "https://example.com/service.jpg"
      ],
      "tags": [
        "design",
        "logo"
      ],
      "status": "active",
      "views_count": 0,
      "created_at": "2026-06-24T21:49:12.43313+00:00",
      "updated_at": "2026-06-24T21:49:12.43313+00:00",
      "profile": {
        "id": "2fe4e7b0-93c1-46cc-a6ea-42e173722b81",
        "username": null,
        "full_name": "Moumin Alkamsheh",
        "avatar_url": null,
        "is_verified": false,
        "account_type": "company"
      },
      "category": {
        "id": "20361ed2-ab58-427a-ad12-a8ace962b09f",
        "slug": "technology",
        "name_ar": "تكنولوجيا",
        "name_en": "Technology"
      }
    }
  ],
  "message": "Services retrieved successfully",
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 2,
    "totalPages": 1
  }
}
```

---

## 3. Get Service by ID

- **Method / Route:** `GET {{baseUrl}}/services/4a9a8c77-6539-41c2-8454-64313c510276`
- **Auth:** Public (no auth)
- **Status:** `200` ✅

**Payload:**

_— none —_

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "4a9a8c77-6539-41c2-8454-64313c510276",
    "profile_id": "447f3dc7-783e-4c3f-b10e-b0c2d4ddd2c9",
    "category_id": "20361ed2-ab58-427a-ad12-a8ace962b09f",
    "title": "Professional Logo Design",
    "description": "Custom logo design with unlimited revisions.",
    "price": 350,
    "currency": "AED",
    "delivery_days": 5,
    "media_urls": [
      "https://example.com/portfolio.jpg"
    ],
    "tags": [
      "design"
    ],
    "status": "active",
    "views_count": 0,
    "created_at": "2026-06-28T18:17:04.413393+00:00",
    "updated_at": "2026-06-28T18:17:04.413393+00:00",
    "profile": {
      "id": "447f3dc7-783e-4c3f-b10e-b0c2d4ddd2c9",
      "username": null,
      "full_name": "Test Provider",
      "avatar_url": null,
      "is_verified": false,
      "account_type": "service_provider"
    },
    "category": {
      "id": "20361ed2-ab58-427a-ad12-a8ace962b09f",
      "slug": "technology",
      "name_ar": "تكنولوجيا",
      "name_en": "Technology"
    }
  },
  "message": "Service retrieved successfully"
}
```

---

## 4. Update Service

- **Method / Route:** `PUT {{baseUrl}}/services/4a9a8c77-6539-41c2-8454-64313c510276`
- **Auth:** Bearer (provider)
- **Status:** `200` ✅

**Payload:**

```json
{
  "price": 400,
  "delivery_days": 7
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "4a9a8c77-6539-41c2-8454-64313c510276",
    "profile_id": "447f3dc7-783e-4c3f-b10e-b0c2d4ddd2c9",
    "category_id": "20361ed2-ab58-427a-ad12-a8ace962b09f",
    "title": "Professional Logo Design",
    "description": "Custom logo design with unlimited revisions.",
    "price": 400,
    "currency": "AED",
    "delivery_days": 7,
    "media_urls": [
      "https://example.com/portfolio.jpg"
    ],
    "tags": [
      "design"
    ],
    "status": "active",
    "views_count": 0,
    "created_at": "2026-06-28T18:17:04.413393+00:00",
    "updated_at": "2026-06-28T18:17:05.748866+00:00",
    "category": {
      "id": "20361ed2-ab58-427a-ad12-a8ace962b09f",
      "slug": "technology",
      "name_ar": "تكنولوجيا",
      "name_en": "Technology"
    }
  },
  "message": "Service updated successfully"
}
```

---

## 5. Delete Service

- **Method / Route:** `DELETE {{baseUrl}}/services/4a9a8c77-6539-41c2-8454-64313c510276`
- **Auth:** Bearer (provider)
- **Status:** `200` ✅

**Payload:**

_— none —_

**Response:**

```json
{
  "success": true,
  "data": null,
  "message": "Service deleted successfully"
}
```

---

