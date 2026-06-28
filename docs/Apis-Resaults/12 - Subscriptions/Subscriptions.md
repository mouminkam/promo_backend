# Subscriptions — API Test Results

> Live responses captured against `http://localhost:3000/api/v1`. Base URL shown as `{{baseUrl}}`.

## 1. Get Plans

- **Method / Route:** `GET {{baseUrl}}/subscriptions/plans`
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
      "id": "a951eaab-66db-4e58-a843-f08709741ec1",
      "name_ar": "الباقة الأساسية",
      "name_en": "Basic Plan",
      "description_ar": "مثالية للمبتدئين",
      "description_en": "Perfect for beginners",
      "price": 10,
      "interval": "monthly",
      "features_en": [
        "5 offers per month",
        "Basic support",
        "Standard profile"
      ],
      "stripe_price_id": "price_1TlHAe62ag8Shm9R48d6Dl8n",
      "is_active": true,
      "sort_order": 1,
      "created_at": "2026-06-17T12:58:11.292569+00:00",
      "updated_at": "2026-06-25T13:21:22.168168+00:00",
      "currency": "AED",
      "features_ar": []
    },
    {
      "id": "37398dcd-112a-4643-85f4-aa5e5f127ce1",
      "name_ar": "الباقة المميزة",
      "name_en": "Premium Plan",
      "description_ar": "للمحترفين والشركات",
      "description_en": "For professionals and companies",
      "price": 29,
      "interval": "monthly",
      "features_en": [
        "Unlimited offers",
        "Priority support",
        "Verified badge",
        "Analytics"
      ],
      "stripe_price_id": "price_1TlHAg62ag8Shm9RCwpwBO4n",
      "is_active": true,
      "sort_order": 2,
      "created_at": "2026-06-17T12:58:11.292569+00:00",
      "updated_at": "2026-06-25T13:21:22.168168+00:00",
      "currency": "AED",
      "features_ar": []
    }
  ],
  "message": "Plans retrieved successfully"
}
```

---

## 2. Create Subscription (Stripe)

- **Method / Route:** `POST {{baseUrl}}/subscriptions`
- **Auth:** Bearer (user)
- **Status:** `500` ⚠️

**Payload:**

```json
{
  "plan_id": "a951eaab-66db-4e58-a843-f08709741ec1"
}
```

**Response:**

```json
{
  "success": false,
  "data": null,
  "message": "Failed to initialize subscription: Cannot read properties of undefined (reading 'client_secret')",
  "error": {
    "code": "INTERNAL_ERROR"
  }
}
```

---

## 3. Get My Subscription

- **Method / Route:** `GET {{baseUrl}}/subscriptions/me`
- **Auth:** Bearer (user)
- **Status:** `200` ✅

**Payload:**

_— none —_

**Response:**

```json
{
  "success": true,
  "data": null,
  "message": "Subscription retrieved successfully"
}
```

---

## 4. Manage Subscription (Portal)

- **Method / Route:** `POST {{baseUrl}}/subscriptions/manage`
- **Auth:** Bearer (user)
- **Status:** `200` ✅

**Payload:**

```json
{
  "return_url": "https://example.com/billing"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "url": "https://billing.stripe.com/p/session/test_YWNjdF8xVGpQQ2c2MmFnOFNobTlSLF9VbXhBMERlQlphSUp3d3lrS0dtTERJWkh1YlNWQ2pt0100StLNDEuQ"
  },
  "message": "Customer portal session created successfully"
}
```

---

