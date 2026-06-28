# Webhooks — API Test Results

> Live responses captured against `http://localhost:3000/api/v1`. Base URL shown as `{{baseUrl}}`.

## 1. Stripe Webhook (no signature)

- **Method / Route:** `POST {{baseUrl}}/webhooks/stripe`
- **Auth:** Public (no auth)
- **Status:** `400` ⚠️

**Payload:**

```json
{
  "id": "evt_test",
  "type": "checkout.session.completed",
  "data": {
    "object": {}
  }
}
```

**Response:**

```json
"Webhook Error: No stripe-signature header value was provided."
```

---

