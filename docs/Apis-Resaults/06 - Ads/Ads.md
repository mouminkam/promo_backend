# Ads — API Test Results

> Live responses captured against `http://localhost:3000/api/v1`. Base URL shown as `{{baseUrl}}`.

## 1. Create Ad

- **Method / Route:** `POST {{baseUrl}}/ads`
- **Auth:** Bearer (company, required: company/influencer)
- **Status:** `201` ✅

**Payload:**

```json
{
  "title": "Grand Opening Sale",
  "description": "Visit our new branch this weekend.",
  "media_url": "https://example.com/ad-banner.jpg",
  "ad_type": "banner",
  "target_url": "https://example.com",
  "budget": 500,
  "start_date": "2026-07-01T00:00:00.000Z",
  "end_date": "2026-07-15T00:00:00.000Z",
  "phone": "+971500000000",
  "contact_email": "ads@example.com",
  "city": "Dubai",
  "price": 99,
  "currency": "AED",
  "tags": [
    "opening"
  ]
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "4e9b06f8-694e-4442-9b80-712e7bc6b379",
    "profile_id": "3a909ef5-9f3f-427d-b530-f332d916418c",
    "title": "Grand Opening Sale",
    "description": "Visit our new branch this weekend.",
    "media_url": "https://example.com/ad-banner.jpg",
    "ad_type": "banner",
    "target_url": "https://example.com",
    "budget": 500,
    "spent": 0,
    "start_date": "2026-07-01T00:00:00+00:00",
    "end_date": "2026-07-15T00:00:00+00:00",
    "status": "pending",
    "impressions": 0,
    "clicks": 0,
    "created_at": "2026-06-28T18:16:59.877444+00:00",
    "updated_at": "2026-06-28T18:16:59.877444+00:00",
    "phone": "+971500000000",
    "whatsapp": null,
    "contact_email": "ads@example.com",
    "instagram_link": null,
    "city": "Dubai",
    "area": null,
    "full_address": null,
    "location_map_url": null,
    "price": 99,
    "currency": "AED",
    "service_type": null,
    "payment_method": null,
    "tags": [
      "opening"
    ]
  },
  "message": "Ad campaign created successfully. Waiting for activation/payment."
}
```

---

## 2. Get Active Ads

- **Method / Route:** `GET {{baseUrl}}/ads/active`
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
      "id": "4e9b06f8-694e-4442-9b80-712e7bc6b379",
      "profile_id": "3a909ef5-9f3f-427d-b530-f332d916418c",
      "title": "Grand Opening Sale",
      "description": "Visit our new branch this weekend.",
      "media_url": "https://example.com/ad-banner.jpg",
      "ad_type": "banner",
      "target_url": "https://example.com"
    }
  ],
  "message": "Active ads retrieved successfully"
}
```

---

## 3. Record Impression

- **Method / Route:** `POST {{baseUrl}}/ads/4e9b06f8-694e-4442-9b80-712e7bc6b379/impression`
- **Auth:** Public (no auth)
- **Status:** `200` ✅

**Payload:**

_— none —_

**Response:**

```json
{
  "success": true,
  "data": {
    "impressions": 1,
    "status": "active"
  },
  "message": "Ad impression recorded successfully"
}
```

---

## 4. Record Click

- **Method / Route:** `POST {{baseUrl}}/ads/4e9b06f8-694e-4442-9b80-712e7bc6b379/click`
- **Auth:** Public (no auth)
- **Status:** `200` ✅

**Payload:**

_— none —_

**Response:**

```json
{
  "success": true,
  "data": {
    "clicks": 1,
    "status": "active",
    "targetUrl": "https://example.com"
  },
  "message": "Ad click recorded successfully"
}
```

---

## 5. Update Ad

- **Method / Route:** `PUT {{baseUrl}}/ads/4e9b06f8-694e-4442-9b80-712e7bc6b379`
- **Auth:** Bearer (company)
- **Status:** `200` ✅

**Payload:**

```json
{
  "title": "Extended Grand Opening Sale"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "4e9b06f8-694e-4442-9b80-712e7bc6b379",
    "profile_id": "3a909ef5-9f3f-427d-b530-f332d916418c",
    "title": "Extended Grand Opening Sale",
    "description": "Visit our new branch this weekend.",
    "media_url": "https://example.com/ad-banner.jpg",
    "ad_type": "banner",
    "target_url": "https://example.com",
    "budget": 500,
    "spent": 0.11,
    "start_date": "2026-07-01T00:00:00+00:00",
    "end_date": "2026-07-15T00:00:00+00:00",
    "status": "active",
    "impressions": 1,
    "clicks": 1,
    "created_at": "2026-06-28T18:16:59.877444+00:00",
    "updated_at": "2026-06-28T18:17:02.115555+00:00",
    "phone": "+971500000000",
    "whatsapp": null,
    "contact_email": "ads@example.com",
    "instagram_link": null,
    "city": "Dubai",
    "area": null,
    "full_address": null,
    "location_map_url": null,
    "price": 99,
    "currency": "AED",
    "service_type": null,
    "payment_method": null,
    "tags": [
      "opening"
    ]
  },
  "message": "Ad campaign updated successfully"
}
```

---

## 6. Toggle Ad

- **Method / Route:** `PATCH {{baseUrl}}/ads/4e9b06f8-694e-4442-9b80-712e7bc6b379/toggle`
- **Auth:** Bearer (company)
- **Status:** `200` ✅

**Payload:**

_— none —_

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "4e9b06f8-694e-4442-9b80-712e7bc6b379",
    "profile_id": "3a909ef5-9f3f-427d-b530-f332d916418c",
    "title": "Extended Grand Opening Sale",
    "description": "Visit our new branch this weekend.",
    "media_url": "https://example.com/ad-banner.jpg",
    "ad_type": "banner",
    "target_url": "https://example.com",
    "budget": 500,
    "spent": 0.11,
    "start_date": "2026-07-01T00:00:00+00:00",
    "end_date": "2026-07-15T00:00:00+00:00",
    "status": "paused",
    "impressions": 1,
    "clicks": 1,
    "created_at": "2026-06-28T18:16:59.877444+00:00",
    "updated_at": "2026-06-28T18:17:02.831001+00:00",
    "phone": "+971500000000",
    "whatsapp": null,
    "contact_email": "ads@example.com",
    "instagram_link": null,
    "city": "Dubai",
    "area": null,
    "full_address": null,
    "location_map_url": null,
    "price": 99,
    "currency": "AED",
    "service_type": null,
    "payment_method": null,
    "tags": [
      "opening"
    ]
  },
  "message": "Ad status toggled successfully to paused"
}
```

---

## 7. Get Ad Stats

- **Method / Route:** `GET {{baseUrl}}/ads/4e9b06f8-694e-4442-9b80-712e7bc6b379/stats`
- **Auth:** Bearer (company)
- **Status:** `200` ✅

**Payload:**

_— none —_

**Response:**

```json
{
  "success": true,
  "data": {
    "impressions": 1,
    "clicks": 1,
    "budget": 500,
    "spent": 0.11,
    "status": "paused",
    "ctr": 100
  },
  "message": "Ad statistics retrieved successfully"
}
```

---

## 8. Get Ads by Profile

- **Method / Route:** `GET {{baseUrl}}/ads/profile/3a909ef5-9f3f-427d-b530-f332d916418c`
- **Auth:** Bearer (company)
- **Status:** `200` ✅

**Payload:**

_— none —_

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "4e9b06f8-694e-4442-9b80-712e7bc6b379",
      "profile_id": "3a909ef5-9f3f-427d-b530-f332d916418c",
      "title": "Extended Grand Opening Sale",
      "description": "Visit our new branch this weekend.",
      "media_url": "https://example.com/ad-banner.jpg",
      "ad_type": "banner",
      "target_url": "https://example.com",
      "budget": 500,
      "spent": 0.11,
      "start_date": "2026-07-01T00:00:00+00:00",
      "end_date": "2026-07-15T00:00:00+00:00",
      "status": "paused",
      "impressions": 1,
      "clicks": 1,
      "created_at": "2026-06-28T18:16:59.877444+00:00",
      "updated_at": "2026-06-28T18:17:02.831001+00:00",
      "phone": "+971500000000",
      "whatsapp": null,
      "contact_email": "ads@example.com",
      "instagram_link": null,
      "city": "Dubai",
      "area": null,
      "full_address": null,
      "location_map_url": null,
      "price": 99,
      "currency": "AED",
      "service_type": null,
      "payment_method": null,
      "tags": [
        "opening"
      ]
    }
  ],
  "message": "Profile ads campaigns retrieved successfully",
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

---

