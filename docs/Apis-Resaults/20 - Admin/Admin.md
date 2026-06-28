# Admin — API Test Results

> Live responses captured against `http://localhost:3000/api/v1`. Base URL shown as `{{baseUrl}}`.

## 1. Get Global Stats

- **Method / Route:** `GET {{baseUrl}}/admin/stats`
- **Auth:** Bearer (admin)
- **Status:** `200` ✅

**Payload:**

_— none —_

**Response:**

```json
{
  "success": true,
  "data": {
    "totalUsers": 9,
    "activeAds": 0,
    "pendingReports": 4,
    "totalRevenue": 150
  },
  "message": "Global statistics retrieved successfully"
}
```

---

## 2. Get Users

- **Method / Route:** `GET {{baseUrl}}/admin/users?page=1&limit=20`
- **Auth:** Bearer (admin)
- **Status:** `200` ✅

**Payload:**

_— none —_

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "1157c029-3952-46c0-8a14-074bcd604c45",
      "email": "user@test.com",
      "phone": null,
      "full_name": "Test User",
      "username": null,
      "avatar_url": null,
      "cover_url": null,
      "bio": null,
      "account_type": "user",
      "is_verified": false,
      "is_featured": false,
      "category_id": null,
      "location": null,
      "website": null,
      "social_links": {},
      "company_details": {},
      "influencer_details": {},
      "service_provider_details": {},
      "stripe_customer_id": "cus_Umwl8TRTUdM94j",
      "is_admin": false,
      "created_at": "2026-06-24T16:40:26.964352+00:00",
      "updated_at": "2026-06-28T18:07:57.767581+00:00",
      "is_active": true,
      "followers_count": 0
    },
    {
      "id": "447f3dc7-783e-4c3f-b10e-b0c2d4ddd2c9",
      "email": "provider@test.com",
      "phone": null,
      "full_name": "Test Provider",
      "username": null,
      "avatar_url": null,
      "cover_url": null,
      "bio": null,
      "account_type": "service_provider",
      "is_verified": false,
      "is_featured": false,
      "category_id": null,
      "location": null,
      "website": null,
      "social_links": {},
      "company_details": {},
      "influencer_details": {},
      "service_provider_details": {},
      "stripe_customer_id": null,
      "is_admin": false,
      "created_at": "2026-06-24T16:40:26.416114+00:00",
      "updated_at": "2026-06-25T14:05:18.378605+00:00",
      "is_active": true,
      "followers_count": 230000
    },
    {
      "id": "3a909ef5-9f3f-427d-b530-f332d916418c",
      "email": "company@test.com",
      "phone": null,
      "full_name": "Test Company",
      "username": null,
      "avatar_url": "https://example.com/avatar.jpg",
      "cover_url": "https://example.com/cover.jpg",
      "bio": "Leading marketing agency in Dubai.",
      "account_type": "company",
      "is_verified": false,
      "is_featured": false,
      "category_id": null,
      "location": "Dubai, UAE",
      "website": "https://promoo.example.com",
      "social_links": {},
      "company_details": {},
      "influencer_details": {},
      "service_provider_details": {},
      "stripe_customer_id": "cus_UmwpID1ojToGzM",
      "is_admin": false,
      "created_at": "2026-06-24T16:40:25.915853+00:00",
      "updated_at": "2026-06-28T18:16:49.602462+00:00",
      "is_active": true,
      "followers_count": 1200000
    },
    {
      "id": "8481b89e-43c2-47c8-a90e-7823c516f926",
      "email": "influencer@test.com",
      "phone": null,
      "full_name": "Test Influencer",
      "username": null,
      "avatar_url": null,
      "cover_url": null,
      "bio": null,
      "account_type": "influencer",
      "is_verified": false,
      "is_featured": false,
      "category_id": null,
      "location": null,
      "website": null,
      "social_links": {},
      "company_details": {},
      "influencer_details": {},
      "service_provider_details": {},
      "stripe_customer_id": null,
      "is_admin": false,
      "created_at": "2026-06-24T16:40:25.347348+00:00",
      "updated_at": "2026-06-28T18:16:53.736048+00:00",
      "is_active": true,
      "followers_count": 980000
    },
    {
      "id": "bbf62469-896f-433c-8d1d-3561637cbe96",
      "email": "test4@example.com",
      "phone": null,
      "full_name": "Test User 4",
      "username": null,
      "avatar_url": null,
      "cover_url": null,
      "bio": null,
      "account_type": "user",
      "is_verified": false,
      "is_featured": false,
      "category_id": null,
      "location": null,
      "website": null,
      "social_links": {},
      "company_details": {},
      "influencer_details": {},
      "service_provider_details": {},
      "stripe_customer_id": null,
      "is_admin": false,
      "created_at": "2026-06-22T14:47:47.783332+00:00",
      "updated_at": "2026-06-23T00:08:27.449044+00:00",
      "is_active": true,
      "followers_count": 0
    },
    {
      "id": "103bf040-a02b-47e9-8f82-e74825b7ef9e",
      "email": "test3@example.com",
      "phone": null,
      "full_name": "Test User 3",
      "username": null,
      "avatar_url": null,
      "cover_url": null,
      "bio": null,
      "account_type": "user",
      "is_verified": false,
      "is_featured": false,
      "category_id": null,
      "location": null,
      "website": null,
      "social_links": {},
      "company_details": {},
      "influencer_details": {},
      "service_provider_details": {},
      "stripe_customer_id": null,
      "is_admin": false,
      "created_at": "2026-06-22T14:47:47.517942+00:00",
      "updated_at": "2026-06-22T14:47:47.517942+00:00",
      "is_active": true,
      "followers_count": 0
    },
    {
      "id": "cad07724-3ca3-4468-827a-0ebb6e46a3f3",
      "email": "test2@example.com",
      "phone": null,
      "full_name": "Test User 2",
      "username": null,
      "avatar_url": null,
      "cover_url": null,
      "bio": null,
      "account_type": "user",
      "is_verified": false,
      "is_featured": false,
      "category_id": null,
      "location": null,
      "website": null,
      "social_links": {},
      "company_details": {},
      "influencer_details": {},
      "service_provider_details": {},
      "stripe_customer_id": "cus_Ukml0flTA9UUfR",
      "is_admin": false,
      "created_at": "2026-06-22T14:47:47.131094+00:00",
      "updated_at": "2026-06-22T23:23:21.379227+00:00",
      "is_active": true,
      "followers_count": 0
    },
    {
      "id": "17c88df6-5081-4114-9b85-7f278d23894a",
      "email": "test1@example.com",
      "phone": null,
      "full_name": "Updated Name",
      "username": "testuser",
      "avatar_url": "https://example.com/avatar.png",
      "cover_url": "https://example.com/cover.png",
      "bio": "New bio text here",
      "account_type": "user",
      "is_verified": false,
      "is_featured": false,
      "category_id": null,
      "location": null,
      "website": null,
      "social_links": {},
      "company_details": {},
      "influencer_details": {},
      "service_provider_details": {},
      "stripe_customer_id": "cus_Ukf8rEmL7ur65v",
      "is_admin": false,
      "created_at": "2026-06-22T14:47:46.753445+00:00",
      "updated_at": "2026-06-22T15:31:12.286905+00:00",
      "is_active": true,
      "followers_count": 0
    },
    {
      "id": "2fe4e7b0-93c1-46cc-a6ea-42e173722b81",
      "email": "mo2min.2001@gmail.com",
      "phone": null,
      "full_name": "Moumin Alkamsheh",
      "username": null,
      "avatar_url": null,
      "cover_url": null,
      "bio": null,
      "account_type": "company",
      "is_verified": false,
      "is_featured": false,
      "category_id": null,
      "location": null,
      "website": null,
      "social_links": {},
      "company_details": {},
      "influencer_details": {},
      "service_provider_details": {},
      "stripe_customer_id": "cus_UkfMqd8NDT4Hxk",
      "is_admin": true,
      "created_at": "2026-06-18T13:17:21.88733+00:00",
      "updated_at": "2026-06-25T14:05:18.378605+00:00",
      "is_active": true,
      "followers_count": 760000
    }
  ],
  "message": "Users retrieved",
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 9,
    "totalPages": 1
  }
}
```

---

## 3. Get User Details

- **Method / Route:** `GET {{baseUrl}}/admin/users/8481b89e-43c2-47c8-a90e-7823c516f926`
- **Auth:** Bearer (admin)
- **Status:** `200` ✅

**Payload:**

_— none —_

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "8481b89e-43c2-47c8-a90e-7823c516f926",
    "email": "influencer@test.com",
    "phone": null,
    "full_name": "Test Influencer",
    "username": null,
    "avatar_url": null,
    "cover_url": null,
    "bio": null,
    "account_type": "influencer",
    "is_verified": false,
    "is_featured": false,
    "category_id": null,
    "location": null,
    "website": null,
    "social_links": {},
    "company_details": {},
    "influencer_details": {},
    "service_provider_details": {},
    "stripe_customer_id": null,
    "is_admin": false,
    "created_at": "2026-06-24T16:40:25.347348+00:00",
    "updated_at": "2026-06-28T18:16:53.736048+00:00",
    "is_active": true,
    "followers_count": 980000
  },
  "message": "User details retrieved"
}
```

---

## 4. Toggle Ban

- **Method / Route:** `PATCH {{baseUrl}}/admin/users/1157c029-3952-46c0-8a14-074bcd604c45/ban`
- **Auth:** Bearer (admin)
- **Status:** `200` ✅

**Payload:**

```json
{
  "isActive": false
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "1157c029-3952-46c0-8a14-074bcd604c45",
    "email": "user@test.com",
    "phone": null,
    "full_name": "Test User",
    "username": null,
    "avatar_url": null,
    "cover_url": null,
    "bio": null,
    "account_type": "user",
    "is_verified": false,
    "is_featured": false,
    "category_id": null,
    "location": null,
    "website": null,
    "social_links": {},
    "company_details": {},
    "influencer_details": {},
    "service_provider_details": {},
    "stripe_customer_id": "cus_Umwl8TRTUdM94j",
    "is_admin": false,
    "created_at": "2026-06-24T16:40:26.964352+00:00",
    "updated_at": "2026-06-28T18:17:41.972802+00:00",
    "is_active": false,
    "followers_count": 0
  },
  "message": "User status updated to banned"
}
```

---

## 5. Toggle Verify

- **Method / Route:** `PATCH {{baseUrl}}/admin/users/1157c029-3952-46c0-8a14-074bcd604c45/verify`
- **Auth:** Bearer (admin)
- **Status:** `200` ✅

**Payload:**

```json
{
  "isVerified": true
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "1157c029-3952-46c0-8a14-074bcd604c45",
    "email": "user@test.com",
    "phone": null,
    "full_name": "Test User",
    "username": null,
    "avatar_url": null,
    "cover_url": null,
    "bio": null,
    "account_type": "user",
    "is_verified": true,
    "is_featured": false,
    "category_id": null,
    "location": null,
    "website": null,
    "social_links": {},
    "company_details": {},
    "influencer_details": {},
    "service_provider_details": {},
    "stripe_customer_id": "cus_Umwl8TRTUdM94j",
    "is_admin": false,
    "created_at": "2026-06-24T16:40:26.964352+00:00",
    "updated_at": "2026-06-28T18:17:43.369501+00:00",
    "is_active": true,
    "followers_count": 0
  },
  "message": "User verification status updated to true"
}
```

---

## 6. Delete User

- **Method / Route:** `DELETE {{baseUrl}}/admin/users/aa371c45-fc72-4f3c-906c-dba5c648d1ab`
- **Auth:** Bearer (admin)
- **Status:** `200` ✅

**Payload:**

_— none —_

**Response:**

```json
{
  "success": true,
  "data": null,
  "message": "User deleted permanently"
}
```

---

## 7. Update Offer Status

- **Method / Route:** `PATCH {{baseUrl}}/admin/content/offers/9ac874d9-b209-42a5-aaac-f2c2592c5107/status`
- **Auth:** Bearer (admin)
- **Status:** `200` ✅

**Payload:**

```json
{
  "status": "active"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "9ac874d9-b209-42a5-aaac-f2c2592c5107",
    "profile_id": "3a909ef5-9f3f-427d-b530-f332d916418c",
    "category_id": "20361ed2-ab58-427a-ad12-a8ace962b09f",
    "title": "60% Off Summer Collection",
    "description": "Limited time discount on all summer items, valid in-store and online.",
    "original_price": 200,
    "offer_price": 80,
    "discount_percentage": 50,
    "media_urls": [
      "https://example.com/offer1.jpg"
    ],
    "start_date": "2026-07-01T00:00:00+00:00",
    "end_date": "2026-08-01T00:00:00+00:00",
    "status": "active",
    "is_featured": false,
    "views_count": 1,
    "created_at": "2026-06-28T18:16:54.516128+00:00",
    "updated_at": "2026-06-28T18:17:45.581925+00:00",
    "tags": [
      "summer",
      "sale"
    ]
  },
  "message": "Offer status updated to active"
}
```

---

## 8. Update Ad Status

- **Method / Route:** `PATCH {{baseUrl}}/admin/content/ads/4e9b06f8-694e-4442-9b80-712e7bc6b379/status`
- **Auth:** Bearer (admin)
- **Status:** `200` ✅

**Payload:**

```json
{
  "status": "active"
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
    "updated_at": "2026-06-28T18:17:46.310513+00:00",
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
  "message": "Ad status updated to active"
}
```

---

## 9. Delete Offer (Admin)

- **Method / Route:** `DELETE {{baseUrl}}/admin/content/offers/9ff6b934-18e3-4b62-b016-589248a910af`
- **Auth:** Bearer (admin)
- **Status:** `200` ✅

**Payload:**

_— none —_

**Response:**

```json
{
  "success": true,
  "data": null,
  "message": "Offer deleted successfully"
}
```

---

## 10. Delete Ad (Admin)

- **Method / Route:** `DELETE {{baseUrl}}/admin/content/ads/8e662d0b-63f4-4cde-9eba-42ecbab8351f`
- **Auth:** Bearer (admin)
- **Status:** `200` ✅

**Payload:**

_— none —_

**Response:**

```json
{
  "success": true,
  "data": null,
  "message": "Ad deleted successfully"
}
```

---

## 11. Get Plans (Admin)

- **Method / Route:** `GET {{baseUrl}}/admin/plans`
- **Auth:** Bearer (admin)
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
  "message": "Subscription plans retrieved successfully"
}
```

---

## 12. Create Plan

- **Method / Route:** `POST {{baseUrl}}/admin/plans`
- **Auth:** Bearer (admin)
- **Status:** `201` ✅

**Payload:**

```json
{
  "stripe_price_id": "price_test_1782670678875",
  "name_ar": "باقة اختبار",
  "name_en": "Test Plan",
  "price": 199,
  "currency": "aed",
  "interval": "monthly",
  "features_ar": [
    "ميزة"
  ],
  "features_en": [
    "Feature"
  ],
  "is_active": true
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "ce51908c-71db-49f4-8b50-d4e8fe439095",
    "name_ar": "باقة اختبار",
    "name_en": "Test Plan",
    "description_ar": null,
    "description_en": null,
    "price": 199,
    "interval": "monthly",
    "features_en": [
      "Feature"
    ],
    "stripe_price_id": "price_test_1782670678875",
    "is_active": true,
    "sort_order": 0,
    "created_at": "2026-06-28T18:17:51.474026+00:00",
    "updated_at": "2026-06-28T18:17:51.474026+00:00",
    "currency": "aed",
    "features_ar": [
      "ميزة"
    ]
  },
  "message": "Subscription plan created successfully"
}
```

---

## 13. Update Plan

- **Method / Route:** `PUT {{baseUrl}}/admin/plans/ce51908c-71db-49f4-8b50-d4e8fe439095`
- **Auth:** Bearer (admin)
- **Status:** `200` ✅

**Payload:**

```json
{
  "price": 249
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "ce51908c-71db-49f4-8b50-d4e8fe439095",
    "name_ar": "باقة اختبار",
    "name_en": "Test Plan",
    "description_ar": null,
    "description_en": null,
    "price": 249,
    "interval": "monthly",
    "features_en": [],
    "stripe_price_id": "price_test_1782670678875",
    "is_active": true,
    "sort_order": 0,
    "created_at": "2026-06-28T18:17:51.474026+00:00",
    "updated_at": "2026-06-28T18:17:52.919498+00:00",
    "currency": "aed",
    "features_ar": []
  },
  "message": "Subscription plan updated successfully"
}
```

---

## 14. Delete Plan

- **Method / Route:** `DELETE {{baseUrl}}/admin/plans/ce51908c-71db-49f4-8b50-d4e8fe439095`
- **Auth:** Bearer (admin)
- **Status:** `200` ✅

**Payload:**

_— none —_

**Response:**

```json
{
  "success": true,
  "data": null,
  "message": "Subscription plan deleted successfully"
}
```

---

## 15. Get Payments (Admin)

- **Method / Route:** `GET {{baseUrl}}/admin/payments?page=1&limit=20`
- **Auth:** Bearer (admin)
- **Status:** `200` ✅

**Payload:**

_— none —_

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "125cab06-1b39-4621-9162-7dba28902f5d",
      "profile_id": "2fe4e7b0-93c1-46cc-a6ea-42e173722b81",
      "stripe_payment_id": "pi_mock_345303bf",
      "amount": 150,
      "currency": "AED",
      "type": "featured",
      "status": "succeeded",
      "metadata": {
        "placement": "home",
        "duration_days": "7"
      },
      "created_at": "2026-06-22T16:55:23.310004+00:00",
      "profile": {
        "id": "2fe4e7b0-93c1-46cc-a6ea-42e173722b81",
        "username": null,
        "full_name": "Moumin Alkamsheh",
        "account_type": "company"
      }
    }
  ],
  "message": "Payments retrieved successfully",
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

---

## 16. Get Reports (Admin)

- **Method / Route:** `GET {{baseUrl}}/admin/reports?page=1&limit=20`
- **Auth:** Bearer (admin)
- **Status:** `200` ✅

**Payload:**

_— none —_

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "c8b93714-d9b5-40e0-ba76-0010a54626bf",
      "reporter_id": "1157c029-3952-46c0-8a14-074bcd604c45",
      "reported_id": "8481b89e-43c2-47c8-a90e-7823c516f926",
      "reported_type": "profile",
      "reason": "Spam content",
      "details": "Repeated spam offers.",
      "status": "pending",
      "admin_note": null,
      "created_at": "2026-06-28T18:17:36.768714+00:00",
      "resolved_at": null,
      "reporter": {
        "id": "1157c029-3952-46c0-8a14-074bcd604c45",
        "username": null,
        "full_name": "Test User"
      }
    },
    {
      "id": "f20a86eb-03a7-493b-8d8f-a07f5ec3cebb",
      "reporter_id": "1157c029-3952-46c0-8a14-074bcd604c45",
      "reported_id": "8481b89e-43c2-47c8-a90e-7823c516f926",
      "reported_type": "profile",
      "reason": "Spam content",
      "details": "Repeated spam offers.",
      "status": "resolved",
      "admin_note": "Reviewed and resolved.",
      "created_at": "2026-06-28T18:07:50.987929+00:00",
      "resolved_at": "2026-06-28T18:08:16.636+00:00",
      "reporter": {
        "id": "1157c029-3952-46c0-8a14-074bcd604c45",
        "username": null,
        "full_name": "Test User"
      }
    },
    {
      "id": "2f9943a8-b707-42dc-b718-85913eea16d3",
      "reporter_id": "1157c029-3952-46c0-8a14-074bcd604c45",
      "reported_id": "8481b89e-43c2-47c8-a90e-7823c516f926",
      "reported_type": "profile",
      "reason": "Spam content",
      "details": "Repeated spam offers.",
      "status": "resolved",
      "admin_note": "Reviewed and resolved.",
      "created_at": "2026-06-28T17:56:17.515373+00:00",
      "resolved_at": "2026-06-28T17:56:58.741+00:00",
      "reporter": {
        "id": "1157c029-3952-46c0-8a14-074bcd604c45",
        "username": null,
        "full_name": "Test User"
      }
    },
    {
      "id": "35646beb-092d-4719-8186-29144188bffb",
      "reporter_id": "1157c029-3952-46c0-8a14-074bcd604c45",
      "reported_id": "8481b89e-43c2-47c8-a90e-7823c516f926",
      "reported_type": "profile",
      "reason": "Spam content",
      "details": "Repeated spam offers.",
      "status": "resolved",
      "admin_note": "Reviewed and resolved.",
      "created_at": "2026-06-28T17:51:55.592917+00:00",
      "resolved_at": "2026-06-28T17:52:20.306+00:00",
      "reporter": {
        "id": "1157c029-3952-46c0-8a14-074bcd604c45",
        "username": null,
        "full_name": "Test User"
      }
    },
    {
      "id": "358386fb-cdd0-4a82-bde2-3213570524cb",
      "reporter_id": "2fe4e7b0-93c1-46cc-a6ea-42e173722b81",
      "reported_id": "02c03982-bcb8-43af-bdab-4952c4b7602f",
      "reported_type": "profile",
      "reason": "spam content",
      "details": "Optional additional details about the report",
      "status": "resolved",
      "admin_note": "Issue has been addressed",
      "created_at": "2026-06-22T17:00:34.715249+00:00",
      "resolved_at": "2026-06-22T18:22:17.247+00:00",
      "reporter": {
        "id": "2fe4e7b0-93c1-46cc-a6ea-42e173722b81",
        "username": null,
        "full_name": "Moumin Alkamsheh"
      }
    },
    {
      "id": "1387c90e-6c1c-4a76-957f-f7e2511c4186",
      "reporter_id": "17c88df6-5081-4114-9b85-7f278d23894a",
      "reported_id": "17c88df6-5081-4114-9b85-7f278d23894a",
      "reported_type": "profile",
      "reason": "verification_request",
      "details": "{\"documentUrl\":\"https://example.com/doc.pdf\",\"notes\":\"Please verify my account\"}",
      "status": "pending",
      "admin_note": null,
      "created_at": "2026-06-22T15:30:48.296865+00:00",
      "resolved_at": null,
      "reporter": {
        "id": "17c88df6-5081-4114-9b85-7f278d23894a",
        "username": "testuser",
        "full_name": "Updated Name"
      }
    },
    {
      "id": "6f7229aa-a134-4ac1-a4f6-5b1b5d24b2df",
      "reporter_id": null,
      "reported_id": "d39c9683-b572-4a77-affe-7f682dcab9a8",
      "reported_type": "profile",
      "reason": "verification_request",
      "details": "{\"documentUrl\":\"https://example.com/doc.pdf\",\"notes\":\"Please verify\"}",
      "status": "pending",
      "admin_note": null,
      "created_at": "2026-06-22T14:28:31.59007+00:00",
      "resolved_at": null,
      "reporter": null
    },
    {
      "id": "42268950-8ada-4f7b-84d6-28dc77917f72",
      "reporter_id": null,
      "reported_id": "2fe4e7b0-93c1-46cc-a6ea-42e173722b81",
      "reported_type": "profile",
      "reason": "Inappropriate content",
      "details": "More info",
      "status": "pending",
      "admin_note": null,
      "created_at": "2026-06-21T02:14:34.883127+00:00",
      "resolved_at": null,
      "reporter": null
    }
  ],
  "message": "Reports retrieved successfully",
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 8,
    "totalPages": 1
  }
}
```

---

## 17. Update Report Status

- **Method / Route:** `PATCH {{baseUrl}}/admin/reports/c8b93714-d9b5-40e0-ba76-0010a54626bf/status`
- **Auth:** Bearer (admin)
- **Status:** `200` ✅

**Payload:**

```json
{
  "status": "resolved",
  "admin_note": "Reviewed and resolved."
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "c8b93714-d9b5-40e0-ba76-0010a54626bf",
    "reporter_id": "1157c029-3952-46c0-8a14-074bcd604c45",
    "reported_id": "8481b89e-43c2-47c8-a90e-7823c516f926",
    "reported_type": "profile",
    "reason": "Spam content",
    "details": "Repeated spam offers.",
    "status": "resolved",
    "admin_note": "Reviewed and resolved.",
    "created_at": "2026-06-28T18:17:36.768714+00:00",
    "resolved_at": "2026-06-28T18:18:06.83+00:00"
  },
  "message": "Report status updated to resolved"
}
```

---

## 18. Create Category

- **Method / Route:** `POST {{baseUrl}}/admin/categories`
- **Auth:** Bearer (admin)
- **Status:** `201` ✅

**Payload:**

```json
{
  "name_ar": "تصنيف اختبار",
  "name_en": "Test Category",
  "icon_url": "https://example.com/icon.png"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "f4879e2c-1804-4ca7-83b6-acb86409ebff",
    "name_ar": "تصنيف اختبار",
    "name_en": "Test Category",
    "slug": "test-category",
    "icon_url": "https://example.com/icon.png",
    "parent_id": null,
    "sort_order": 0,
    "is_active": true,
    "created_at": "2026-06-28T18:17:59.374642+00:00",
    "updated_at": "2026-06-28T18:17:59.374642+00:00"
  },
  "message": "Category created successfully"
}
```

---

## 19. Update Category

- **Method / Route:** `PUT {{baseUrl}}/admin/categories/f4879e2c-1804-4ca7-83b6-acb86409ebff`
- **Auth:** Bearer (admin)
- **Status:** `200` ✅

**Payload:**

```json
{
  "name_en": "Test Category Updated"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "f4879e2c-1804-4ca7-83b6-acb86409ebff",
    "name_ar": "تصنيف اختبار",
    "name_en": "Test Category Updated",
    "slug": "test-category",
    "icon_url": "https://example.com/icon.png",
    "parent_id": null,
    "sort_order": 0,
    "is_active": true,
    "created_at": "2026-06-28T18:17:59.374642+00:00",
    "updated_at": "2026-06-28T18:18:00.017851+00:00"
  },
  "message": "Category updated successfully"
}
```

---

## 20. Delete Category

- **Method / Route:** `DELETE {{baseUrl}}/admin/categories/f4879e2c-1804-4ca7-83b6-acb86409ebff`
- **Auth:** Bearer (admin)
- **Status:** `200` ✅

**Payload:**

_— none —_

**Response:**

```json
{
  "success": true,
  "data": null,
  "message": "Category deleted successfully"
}
```

---

