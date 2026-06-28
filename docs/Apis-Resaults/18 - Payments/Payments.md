# Payments — API Test Results

> Live responses captured against `http://localhost:3000/api/v1`. Base URL shown as `{{baseUrl}}`.

## 1. Get Payment History

- **Method / Route:** `GET {{baseUrl}}/payments/history?page=1&limit=20`
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
      "id": "b7c3afbd-a84e-4b7b-9b23-08d2f1299848",
      "profile_id": "1157c029-3952-46c0-8a14-074bcd604c45",
      "stripe_payment_id": "pi_test_1782670661406",
      "amount": 99,
      "currency": "AED",
      "type": "subscription",
      "status": "succeeded",
      "metadata": {},
      "created_at": "2026-06-28T18:17:33.570434+00:00"
    }
  ],
  "message": "Payments retrieved",
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

---

## 2. Create Customer Portal Session

- **Method / Route:** `POST {{baseUrl}}/payments/portal`
- **Auth:** Bearer (user)
- **Status:** `200` ✅

**Payload:**

_— none —_

**Response:**

```json
{
  "success": true,
  "data": {
    "url": "https://billing.stripe.com/p/session/test_YWNjdF8xVGpQQ2c2MmFnOFNobTlSLF9VbXhCUjJhNGVJWWRmeHc0amlXUDlIQm9PVmFrOHVZ0100Y7Lhjgk9"
  },
  "message": "Portal session created"
}
```

---

## 3. Get Payment Details

- **Method / Route:** `GET {{baseUrl}}/payments/b7c3afbd-a84e-4b7b-9b23-08d2f1299848`
- **Auth:** Bearer (user)
- **Status:** `200` ✅

**Payload:**

_— none —_

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "b7c3afbd-a84e-4b7b-9b23-08d2f1299848",
    "profile_id": "1157c029-3952-46c0-8a14-074bcd604c45",
    "stripe_payment_id": "pi_test_1782670661406",
    "amount": 99,
    "currency": "AED",
    "type": "subscription",
    "status": "succeeded",
    "metadata": {},
    "created_at": "2026-06-28T18:17:33.570434+00:00"
  },
  "message": "Payment details retrieved"
}
```

---

