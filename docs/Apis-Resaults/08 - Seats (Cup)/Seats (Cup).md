# Seats (Cup) — API Test Results

> Live responses captured against `http://localhost:3000/api/v1`. Base URL shown as `{{baseUrl}}`.

## 1. Get Seats

- **Method / Route:** `GET {{baseUrl}}/seats?tier=gold`
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
      "id": "6168c692-ae96-4af7-8695-281a2395783c",
      "tier": "gold",
      "price": 499,
      "influencer_id": null,
      "status": "available",
      "expires_at": null,
      "position": 1,
      "created_at": "2026-06-25T13:24:28.169178+00:00",
      "updated_at": "2026-06-28T18:07:28.589+00:00",
      "profile": null
    }
  ],
  "message": "Seats retrieved successfully"
}
```

---

## 2. Get My Seats

- **Method / Route:** `GET {{baseUrl}}/seats/me`
- **Auth:** Bearer (influencer)
- **Status:** `200` ✅

**Payload:**

_— none —_

**Response:**

```json
{
  "success": true,
  "data": [],
  "message": "Your booked seats retrieved successfully"
}
```

---

## 3. Book Seat (Stripe Checkout)

- **Method / Route:** `POST {{baseUrl}}/seats/6168c692-ae96-4af7-8695-281a2395783c/book`
- **Auth:** Bearer (influencer)
- **Status:** `200` ✅

**Payload:**

_— none —_

**Response:**

```json
{
  "success": true,
  "data": {
    "checkoutUrl": "https://checkout.stripe.com/c/pay/cs_test_a1b3aY6X514OnqLXKJUPTA3JdfouzDm8bR6pdm3935ZfCIY8FPybFkfQtm#fidnandhYHdWcXxpYCc%2FJ2FgY2RwaXEnKSdicGRmZGhqaWBTZHdsZGtxJz8nZmprcXdqaScpJ2R1bE5gfCc%2FJ3VuWnFgdnFaMDRRb1VGYjM3ZGI9Vm1oPFdnSElxcF9kNWlvQ0FpU0pnQlJrNEAwVWwzMnRQTU19fV9nMGlnSVJsYldLXEBCcTV%2FUH89ZmpjTkg1QmFuXzJuN3BgRG9kQVQ1NW1cUlFHTEdQJyknY3dqaFZgd3Ngdyc%2FcXdwYCknZ2RmbmJ3anBrYUZqaWp3Jz8nJmNjY2NjYycpJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl",
    "sessionId": "cs_test_a1b3aY6X514OnqLXKJUPTA3JdfouzDm8bR6pdm3935ZfCIY8FPybFkfQtm",
    "paymentId": null,
    "status": "pending"
  },
  "message": "Checkout session created successfully"
}
```

---

## 4. Cancel Seat

- **Method / Route:** `DELETE {{baseUrl}}/seats/6168c692-ae96-4af7-8695-281a2395783c/cancel`
- **Auth:** Bearer (influencer)
- **Status:** `200` ✅

**Payload:**

_— none —_

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "6168c692-ae96-4af7-8695-281a2395783c",
    "tier": "gold",
    "price": 499,
    "influencer_id": null,
    "status": "available",
    "expires_at": null,
    "position": 1,
    "created_at": "2026-06-25T13:24:28.169178+00:00",
    "updated_at": "2026-06-28T18:17:16.288+00:00"
  },
  "message": "Seat cancelled successfully"
}
```

---

