# Notifications — API Test Results

> Live responses captured against `http://localhost:3000/api/v1`. Base URL shown as `{{baseUrl}}`.

## 1. Register FCM Token

- **Method / Route:** `POST {{baseUrl}}/notifications/token`
- **Auth:** Bearer (company)
- **Status:** `200` ✅

**Payload:**

```json
{
  "token": "fcm_test_token_123",
  "device_type": "android"
}
```

**Response:**

```json
{
  "success": true,
  "data": null,
  "message": "FCM token registered successfully"
}
```

---

## 2. Get Notifications

- **Method / Route:** `GET {{baseUrl}}/notifications?page=1&limit=20`
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
      "id": "bd43f299-04e4-4ac6-8b0a-7eb58160388e",
      "profile_id": "8481b89e-43c2-47c8-a90e-7823c516f926",
      "title": "New Follower",
      "body": "Someone started following you.",
      "type": "follow",
      "data": {
        "follower_id": "3a909ef5-9f3f-427d-b530-f332d916418c"
      },
      "is_read": false,
      "created_at": "2026-06-28T18:16:51.28212+00:00"
    }
  ],
  "message": "Notifications retrieved",
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

---

## 3. Mark All as Read

- **Method / Route:** `PATCH {{baseUrl}}/notifications/read-all`
- **Auth:** Bearer (influencer)
- **Status:** `200` ✅

**Payload:**

_— none —_

**Response:**

```json
{
  "success": true,
  "data": null,
  "message": "All notifications marked as read"
}
```

---

## 4. Mark One as Read

- **Method / Route:** `PATCH {{baseUrl}}/notifications/bd43f299-04e4-4ac6-8b0a-7eb58160388e/read`
- **Auth:** Bearer (influencer)
- **Status:** `200` ✅

**Payload:**

_— none —_

**Response:**

```json
{
  "success": true,
  "data": null,
  "message": "Notification marked as read"
}
```

---

## 5. Delete Notification

- **Method / Route:** `DELETE {{baseUrl}}/notifications/bd43f299-04e4-4ac6-8b0a-7eb58160388e`
- **Auth:** Bearer (influencer)
- **Status:** `200` ✅

**Payload:**

_— none —_

**Response:**

```json
{
  "success": true,
  "data": null,
  "message": "Notification deleted successfully"
}
```

---

