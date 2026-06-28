# Saved Items — API Test Results

> Live responses captured against `http://localhost:3000/api/v1`. Base URL shown as `{{baseUrl}}`.

## 1. Save Item

- **Method / Route:** `POST {{baseUrl}}/saved`
- **Auth:** Bearer (user)
- **Status:** `201` ✅

**Payload:**

```json
{
  "item_id": "9ac874d9-b209-42a5-aaac-f2c2592c5107",
  "item_type": "offer"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "f8e293c5-9efb-462f-b466-2e6c06981c74",
    "profile_id": "1157c029-3952-46c0-8a14-074bcd604c45",
    "item_id": "9ac874d9-b209-42a5-aaac-f2c2592c5107",
    "item_type": "offer",
    "created_at": "2026-06-28T18:17:11.925864+00:00"
  },
  "message": "Item saved successfully"
}
```

---

## 2. Get Saved Items

- **Method / Route:** `GET {{baseUrl}}/saved`
- **Auth:** Bearer (user)
- **Status:** `200` ✅

**Payload:**

_— none —_

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "f8e293c5-9efb-462f-b466-2e6c06981c74",
      "profile_id": "1157c029-3952-46c0-8a14-074bcd604c45",
      "item_id": "9ac874d9-b209-42a5-aaac-f2c2592c5107",
      "item_type": "offer",
      "created_at": "2026-06-28T18:17:11.925864+00:00"
    }
  ],
  "message": "Saved items retrieved successfully"
}
```

---

## 3. Unsave Item

- **Method / Route:** `DELETE {{baseUrl}}/saved/f8e293c5-9efb-462f-b466-2e6c06981c74`
- **Auth:** Bearer (user)
- **Status:** `200` ✅

**Payload:**

_— none —_

**Response:**

```json
{
  "success": true,
  "data": null,
  "message": "Item removed from saved list"
}
```

---

