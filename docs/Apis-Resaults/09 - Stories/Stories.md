# Stories — API Test Results

> Live responses captured against `http://localhost:3000/api/v1`. Base URL shown as `{{baseUrl}}`.

## 1. Create Story

- **Method / Route:** `POST {{baseUrl}}/stories`
- **Auth:** Bearer (influencer)
- **Status:** `201` ✅

**Payload:**

```json
{
  "media_url": "https://example.com/story.jpg"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "ebaa886a-c3ac-49f9-824b-4aadaca19a90",
    "profile_id": "8481b89e-43c2-47c8-a90e-7823c516f926",
    "media_url": "https://example.com/story.jpg",
    "expires_at": "2026-06-29T18:17:17.918+00:00",
    "views_count": 0,
    "created_at": "2026-06-28T18:17:09.697973+00:00"
  },
  "message": "Story created successfully"
}
```

---

## 2. Get Active Stories

- **Method / Route:** `GET {{baseUrl}}/stories`
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
      "id": "ebaa886a-c3ac-49f9-824b-4aadaca19a90",
      "profile_id": "8481b89e-43c2-47c8-a90e-7823c516f926",
      "media_url": "https://example.com/story.jpg",
      "expires_at": "2026-06-29T18:17:17.918+00:00",
      "views_count": 0,
      "created_at": "2026-06-28T18:17:09.697973+00:00",
      "profile": {
        "id": "8481b89e-43c2-47c8-a90e-7823c516f926",
        "username": null,
        "full_name": "Test Influencer",
        "avatar_url": null,
        "account_type": "influencer"
      }
    }
  ],
  "message": "Active stories retrieved successfully"
}
```

---

## 3. Get User Stories

- **Method / Route:** `GET {{baseUrl}}/stories/user/8481b89e-43c2-47c8-a90e-7823c516f926`
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
      "id": "ebaa886a-c3ac-49f9-824b-4aadaca19a90",
      "profile_id": "8481b89e-43c2-47c8-a90e-7823c516f926",
      "media_url": "https://example.com/story.jpg",
      "expires_at": "2026-06-29T18:17:17.918+00:00",
      "views_count": 0,
      "created_at": "2026-06-28T18:17:09.697973+00:00",
      "profile": {
        "id": "8481b89e-43c2-47c8-a90e-7823c516f926",
        "username": null,
        "full_name": "Test Influencer",
        "avatar_url": null,
        "account_type": "influencer"
      }
    }
  ],
  "message": "User stories retrieved successfully"
}
```

---

## 4. Get My Stories

- **Method / Route:** `GET {{baseUrl}}/stories/me`
- **Auth:** Bearer (influencer)
- **Status:** `200` ✅

**Payload:**

_— none —_

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "ebaa886a-c3ac-49f9-824b-4aadaca19a90",
      "profile_id": "8481b89e-43c2-47c8-a90e-7823c516f926",
      "media_url": "https://example.com/story.jpg",
      "expires_at": "2026-06-29T18:17:17.918+00:00",
      "views_count": 0,
      "created_at": "2026-06-28T18:17:09.697973+00:00"
    }
  ],
  "message": "Your stories retrieved successfully"
}
```

---

## 5. Delete Story

- **Method / Route:** `DELETE {{baseUrl}}/stories/ebaa886a-c3ac-49f9-824b-4aadaca19a90`
- **Auth:** Bearer (influencer)
- **Status:** `200` ✅

**Payload:**

_— none —_

**Response:**

```json
{
  "success": true,
  "data": null,
  "message": "Story deleted successfully"
}
```

---

