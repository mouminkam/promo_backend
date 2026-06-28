# Search & Categories — API Test Results

> Live responses captured against `http://localhost:3000/api/v1`. Base URL shown as `{{baseUrl}}`.

## 1. Search

- **Method / Route:** `GET {{baseUrl}}/search?q=design&type=all&page=1&limit=20`
- **Auth:** Public (no auth)
- **Status:** `200` ✅

**Payload:**

_— none —_

**Response:**

```json
{
  "success": true,
  "data": {
    "profiles": [],
    "offers": [],
    "ads": [],
    "services": [
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
          "username": null,
          "full_name": "Moumin Alkamsheh",
          "avatar_url": null,
          "is_verified": false,
          "account_type": "company"
        }
      }
    ]
  },
  "message": "Search results retrieved"
}
```

---

## 2. Get Categories

- **Method / Route:** `GET {{baseUrl}}/categories`
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
      "id": "20361ed2-ab58-427a-ad12-a8ace962b09f",
      "name_ar": "تكنولوجيا",
      "name_en": "Technology",
      "slug": "technology",
      "icon_url": "https://example.com/icons/tech.png",
      "parent_id": null,
      "sort_order": 1,
      "is_active": true,
      "created_at": "2026-06-17T12:58:11.292569+00:00",
      "updated_at": "2026-06-17T12:58:11.292569+00:00"
    },
    {
      "id": "7917160b-3036-4b81-9bcc-adc52405fe44",
      "name_ar": "تسويق",
      "name_en": "Marketing",
      "slug": "marketing",
      "icon_url": "https://example.com/icons/marketing.png",
      "parent_id": null,
      "sort_order": 2,
      "is_active": true,
      "created_at": "2026-06-17T12:58:11.292569+00:00",
      "updated_at": "2026-06-17T12:58:11.292569+00:00"
    },
    {
      "id": "f837e20a-eba4-41d3-bb14-b0ebb8ae0329",
      "name_ar": "تصميم",
      "name_en": "Design",
      "slug": "design",
      "icon_url": "https://example.com/icons/design.png",
      "parent_id": null,
      "sort_order": 3,
      "is_active": true,
      "created_at": "2026-06-17T12:58:11.292569+00:00",
      "updated_at": "2026-06-17T12:58:11.292569+00:00"
    },
    {
      "id": "e4704620-2516-4e23-81e8-fb94ccfba2f3",
      "name_ar": "برمجة",
      "name_en": "Programming",
      "slug": "programming",
      "icon_url": "https://example.com/icons/programming.png",
      "parent_id": null,
      "sort_order": 4,
      "is_active": true,
      "created_at": "2026-06-17T12:58:11.292569+00:00",
      "updated_at": "2026-06-17T12:58:11.292569+00:00"
    },
    {
      "id": "b6618b3a-cdd2-47bd-b270-d3761a8c0739",
      "name_ar": "استشارات",
      "name_en": "Consulting",
      "slug": "consulting",
      "icon_url": "https://example.com/icons/consulting.png",
      "parent_id": null,
      "sort_order": 5,
      "is_active": true,
      "created_at": "2026-06-17T12:58:11.292569+00:00",
      "updated_at": "2026-06-17T12:58:11.292569+00:00"
    },
    {
      "id": "33aa5d76-362b-4b8d-9743-e890bfda274f",
      "name_ar": "أخرى",
      "name_en": "Other",
      "slug": "other",
      "icon_url": "https://example.com/icons/other.png",
      "parent_id": null,
      "sort_order": 99,
      "is_active": true,
      "created_at": "2026-06-17T12:58:11.292569+00:00",
      "updated_at": "2026-06-17T12:58:11.292569+00:00"
    }
  ],
  "message": "Categories retrieved"
}
```

---

## 3. Get Category Content

- **Method / Route:** `GET {{baseUrl}}/categories/20361ed2-ab58-427a-ad12-a8ace962b09f/content?page=1&limit=20`
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
      "profile": {
        "username": null,
        "full_name": "Test Company",
        "avatar_url": "https://example.com/avatar.jpg",
        "is_verified": false,
        "account_type": "company"
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
        "username": null,
        "full_name": "Moumin Alkamsheh",
        "avatar_url": null,
        "is_verified": false,
        "account_type": "company"
      }
    }
  ],
  "message": "Category content retrieved",
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 2,
    "totalPages": 1
  }
}
```

---

