# Follows — API Test Results

> Live responses captured against `http://localhost:3000/api/v1`. Base URL shown as `{{baseUrl}}`.

## 1. Follow Profile

- **Method / Route:** `POST {{baseUrl}}/follows/8481b89e-43c2-47c8-a90e-7823c516f926`
- **Auth:** Bearer (company)
- **Status:** `200` ✅

**Payload:**

_— none —_

**Response:**

```json
{
  "success": true,
  "data": null,
  "message": "Successfully followed profile"
}
```

---

## 2. Check Follow Status

- **Method / Route:** `GET {{baseUrl}}/follows/8481b89e-43c2-47c8-a90e-7823c516f926/status`
- **Auth:** Bearer (company)
- **Status:** `200` ✅

**Payload:**

_— none —_

**Response:**

```json
{
  "success": true,
  "data": {
    "isFollowing": true
  },
  "message": "Status retrieved successfully"
}
```

---

## 3. Get Followers

- **Method / Route:** `GET {{baseUrl}}/follows/followers/8481b89e-43c2-47c8-a90e-7823c516f926?page=1&limit=20`
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
      "created_at": "2026-06-28T18:16:50.98388+00:00",
      "follower": {
        "id": "3a909ef5-9f3f-427d-b530-f332d916418c",
        "username": null,
        "full_name": "Test Company",
        "avatar_url": "https://example.com/avatar.jpg",
        "account_type": "company"
      }
    },
    {
      "created_at": "2026-06-28T17:32:53.934523+00:00",
      "follower": {
        "id": "2fe4e7b0-93c1-46cc-a6ea-42e173722b81",
        "username": null,
        "full_name": "Moumin Alkamsheh",
        "avatar_url": null,
        "account_type": "company"
      }
    }
  ],
  "message": "Followers retrieved successfully",
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 2,
    "totalPages": 1
  }
}
```

---

## 4. Get Following

- **Method / Route:** `GET {{baseUrl}}/follows/following/3a909ef5-9f3f-427d-b530-f332d916418c?page=1&limit=20`
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
      "created_at": "2026-06-28T18:16:50.98388+00:00",
      "following": {
        "id": "8481b89e-43c2-47c8-a90e-7823c516f926",
        "username": null,
        "full_name": "Test Influencer",
        "avatar_url": null,
        "account_type": "influencer"
      }
    }
  ],
  "message": "Following retrieved successfully",
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

---

## 5. Unfollow Profile

- **Method / Route:** `DELETE {{baseUrl}}/follows/8481b89e-43c2-47c8-a90e-7823c516f926`
- **Auth:** Bearer (company)
- **Status:** `200` ✅

**Payload:**

_— none —_

**Response:**

```json
{
  "success": true,
  "data": null,
  "message": "Successfully unfollowed profile"
}
```

---

