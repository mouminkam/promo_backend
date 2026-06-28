# Featured — API Test Results

> Live responses captured against `http://localhost:3000/api/v1`. Base URL shown as `{{baseUrl}}`.

## 1. Get Featured Listings

- **Method / Route:** `GET {{baseUrl}}/featured?page=1&limit=20`
- **Auth:** Public (no auth)
- **Status:** `200` ✅

**Payload:**

_— none —_

**Response:**

```json
{
  "success": true,
  "data": [],
  "message": "Featured listings retrieved",
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 0,
    "totalPages": 0
  }
}
```

---

## 2. Request Featured

- **Method / Route:** `POST {{baseUrl}}/featured`
- **Auth:** Bearer (company)
- **Status:** `200` ✅

**Payload:**

```json
{
  "placement": "home",
  "duration_days": 30
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "checkoutUrl": "https://checkout.stripe.com/c/pay/cs_test_a1fU2DuhpcwbN1ZUVJhrpgBww25IAAeiOD3w4heT0brOo6hCUXLGPAsZ0L#fidnandhYHdWcXxpYCc%2FJ2FgY2RwaXEnKSdicGRmZGhqaWBTZHdsZGtxJz8nZmprcXdqaScpJ2R1bE5gfCc%2FJ3VuWnFgdnFaMDRRb1VGYjM3ZGI9Vm1oPFdnSElxcF9kNWlvQ0FpU0pnQlJrNEAwVWwzMnRQTU19fV9nMGlnSVJsYldLXEBCcTV%2FUH89ZmpjTkg1QmFuXzJuN3BgRG9kQVQ1NW1cUlFHTEdQJyknY3dqaFZgd3Ngdyc%2FcXdwYCknZ2RmbmJ3anBrYUZqaWp3Jz8nJmNjY2NjYycpJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl",
    "sessionId": "cs_test_a1fU2DuhpcwbN1ZUVJhrpgBww25IAAeiOD3w4heT0brOo6hCUXLGPAsZ0L",
    "paymentId": null,
    "status": "pending"
  },
  "message": "Featured checkout session created"
}
```

---

