# 📂 تقرير نتائج اختبارات الـ APIs (Promoo Backend)

هذا الملف حيكون مشان نتائج ال apis كلن
حيكون محطوط الرابط والمحتويات والنتائج المتمثلة بال response

---

## 🔐 1. Auth (نظام المصادقة)

### 🔗 `{{baseUrl}}/auth/register/email`

```json
{
  "email": "mo2min.2001@gmail.com",
  "password": "123123123",
  "fullName": "Moumin Alkamsheh",
  "accountType": "user"
}
```

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "2fe4e7b0-93c1-46cc-a6ea-42e173722b81",
      "aud": "authenticated",
      "role": "authenticated",
      "email": "mo2min.2001@gmail.com",
      "phone": "",
      "confirmation_sent_at": "2026-06-18T13:17:21.927377308Z",
      "app_metadata": {
        "provider": "email",
        "providers": ["email"]
      },
      "user_metadata": {
        "account_type": "user",
        "email": "mo2min.2001@gmail.com",
        "email_verified": false,
        "full_name": "Moumin Alkamsheh",
        "phone_verified": false,
        "sub": "2fe4e7b0-93c1-46cc-a6ea-42e173722b81"
      },
      "identities": [
        {
          "identity_id": "79c014c3-3fc3-41a3-9e82-1c098e6b3b65",
          "id": "2fe4e7b0-93c1-46cc-a6ea-42e173722b81",
          "user_id": "2fe4e7b0-93c1-46cc-a6ea-42e173722b81",
          "identity_data": {
            "account_type": "user",
            "email": "mo2min.2001@gmail.com",
            "email_verified": false,
            "full_name": "Moumin Alkamsheh",
            "phone_verified": false,
            "sub": "2fe4e7b0-93c1-46cc-a6ea-42e173722b81"
          },
          "provider": "email",
          "last_sign_in_at": "2026-06-18T13:17:21.91720187Z",
          "created_at": "2026-06-18T13:17:21.917251Z",
          "updated_at": "2026-06-18T13:17:21.917251Z",
          "email": "mo2min.2001@gmail.com"
        }
      ],
      "created_at": "2026-06-18T13:17:21.887689Z",
      "updated_at": "2026-06-18T13:17:22.472415Z",
      "is_anonymous": false
    },
    "session": null
  },
  "message": "Registration successful. Please check your email to verify your account."
}
```

> ⚠️ **ملاحظة:** هاد ال api غالبا مو شغال لان ببساطة مالي رابط otp عال supa base بالاضافة الباك ايند لساتو عال local:3000

### 🔗 `{{baseUrl}}/auth/register/phone`

```json
{
  "phone": "+963932579805",
  "password": "123123123",
  "fullName": "Moumin Alkamsheh",
  "accountType": "user"
}
```

```json
{
  "success": false,
  "data": null,
  "message": "Phone signups are disabled",
  "error": {
    "code": "VALIDATION_ERROR"
  }
}
```

### 🔗 `{{baseUrl}}/auth/login/email`

```json
{
  "email": "Moumen.kam.work@gmail.com",
  "password": "123123123"
}
```

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "985b241b-d0ec-477e-b103-2c1083498633",
      "aud": "authenticated",
      "role": "authenticated",
      "email": "moumen.kam.work@gmail.com",
      "email_confirmed_at": "2026-06-18T13:35:47.636368Z",
      "phone": "",
      "confirmation_sent_at": "2026-06-18T13:35:26.550094Z",
      "confirmed_at": "2026-06-18T13:35:47.636368Z",
      "last_sign_in_at": "2026-06-18T13:38:01.60866602Z",
      "app_metadata": {
        "provider": "email",
        "providers": ["email"]
      },
      "user_metadata": {
        "account_type": "user",
        "email": "moumen.kam.work@gmail.com",
        "email_verified": true,
        "full_name": "Moumin Alkamsheh",
        "phone_verified": false,
        "sub": "985b241b-d0ec-477e-b103-2c1083498633"
      },
      "identities": [
        {
          "identity_id": "09057958-d253-47a3-8384-92a813c2e1ca",
          "id": "985b241b-d0ec-477e-b103-2c1083498633",
          "user_id": "985b241b-d0ec-477e-b103-2c1083498633",
          "identity_data": {
            "account_type": "user",
            "email": "moumen.kam.work@gmail.com",
            "email_verified": true,
            "full_name": "Moumin Alkamsheh",
            "phone_verified": false,
            "sub": "985b241b-d0ec-477e-b103-2c1083498633"
          },
          "provider": "email",
          "last_sign_in_at": "2026-06-18T13:35:26.545599Z",
          "created_at": "2026-06-18T13:35:26.545651Z",
          "updated_at": "2026-06-18T13:35:26.545651Z",
          "email": "moumen.kam.work@gmail.com"
        }
      ],
      "created_at": "2026-06-18T13:35:26.523713Z",
      "updated_at": "2026-06-18T13:38:01.629556Z",
      "is_anonymous": false
    },
    "session": {
      "access_token": "eyJhbGciOiJFUzI1NiIsImtpZCI6IjhkNTQ0MTVkLTc3MjQtNGM4My05NWM5LTYwODk2MjI1OWMyYiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL21xa2xhcmd5amlzcGJjeXh6ZGpvLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI5ODViMjQxYi1kMGVjLTQ3N2UtYjEwMy0yYzEwODM0OTg2MzMiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzgxNzkzNDgxLCJpYXQiOjE3ODE3ODk4ODEsImVtYWlsIjoibW91bWVuLmthbS53b3JrQGdtYWlsLmNvbSIsInBob25lIjoiIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZW1haWwiLCJwcm92aWRlcnMiOlsiZW1haWwiXX0sInVzZXJfbWV0YWRhdGEiOnsiYWNjb3VudF90eXBlIjoidXNlciIsImVtYWlsIjoibW91bWVuLmthbS53b3JrQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmdWxsX25hbWUiOiJNb3VtaW4gQWxrYW1zaGVoIiwicGhvbmVfdmVyaWZpZWQiOmZhbHNlLCJzdWIiOiI5ODViMjQxYi1kMGVjLTQ3N2UtYjEwMy0yYzEwODM0OTg2MzMifSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJwYXNzd29yZCIsInRpbWVzdGFtcCI6MTc4MTc4OTg4MX1dLCJzZXNzaW9uX2lkIjoiMTNiM2QyZTgtZmQ1Ny00YTkyLWJiZjctMjAxNGIwOGMwY2M2IiwiaXNfYW5vbnltb3VzIjpmYWxzZX0.NNpMQ9n29-jKpzKO0NR7PeST9g4oMTrithlBqXn07WIK2S-C_6zMeAy1ohM1_J5-GR0E3EbfgmCa84P9XdM89Q",
      "token_type": "bearer",
      "expires_in": 3600,
      "expires_at": 1781793481,
      "refresh_token": "iw4nueryelh4",
      "user": {
        "id": "985b241b-d0ec-477e-b103-2c1083498633",
        "aud": "authenticated",
        "role": "authenticated",
        "email": "moumen.kam.work@gmail.com",
        "email_confirmed_at": "2026-06-18T13:35:47.636368Z",
        "phone": "",
        "confirmation_sent_at": "2026-06-18T13:35:26.550094Z",
        "confirmed_at": "2026-06-18T13:35:47.636368Z",
        "last_sign_in_at": "2026-06-18T13:38:01.60866602Z",
        "app_metadata": {
          "provider": "email",
          "providers": ["email"]
        },
        "user_metadata": {
          "account_type": "user",
          "email": "moumen.kam.work@gmail.com",
          "email_verified": true,
          "full_name": "Moumin Alkamsheh",
          "phone_verified": false,
          "sub": "985b241b-d0ec-477e-b103-2c1083498633"
        },
        "identities": [
          {
            "identity_id": "09057958-d253-47a3-8384-92a813c2e1ca",
            "id": "985b241b-d0ec-477e-b103-2c1083498633",
            "user_id": "985b241b-d0ec-477e-b103-2c1083498633",
            "identity_data": {
              "account_type": "user",
              "email": "moumen.kam.work@gmail.com",
              "email_verified": true,
              "full_name": "Moumin Alkamsheh",
              "phone_verified": false,
              "sub": "985b241b-d0ec-477e-b103-2c1083498633"
            },
            "provider": "email",
            "last_sign_in_at": "2026-06-18T13:35:26.545599Z",
            "created_at": "2026-06-18T13:35:26.545651Z",
            "updated_at": "2026-06-18T13:35:26.545651Z",
            "email": "moumen.kam.work@gmail.com"
          }
        ],
        "created_at": "2026-06-18T13:35:26.523713Z",
        "updated_at": "2026-06-18T13:38:01.629556Z",
        "is_anonymous": false
      },
      "weak_password": null
    }
  },
  "message": "Login successful"
}
```

---

## 👤 2. Profiles (الملفات الشخصية)

> ⚠️ **ملاحظة:** نحنا حاليا حنتاجل ال profile 1 يلي هوي بمثل ال auth بشكل كامل

حاليا حننتقل عال Profiles

### 🔗 `{{baseUrl}}/profiles/me`

```json
{
  "success": true,
  "data": {
    "id": "985b241b-d0ec-477e-b103-2c1083498633",
    "email": "moumen.kam.work@gmail.com",
    "phone": null,
    "full_name": "Moumin Alkamsheh",
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
    "created_at": "2026-06-18T13:35:26.522133+00:00",
    "updated_at": "2026-06-18T13:35:26.522133+00:00",
    "is_active": true,
    "categories": null
  },
  "message": "Profile retrieved successfully"
}
```

### 🔗 `{{baseUrl}}/profiles/me`

```json
{
  "bio": "New bio",
  "location": "Dubai"
}
```

```json
{
  "success": true,
  "data": {
    "id": "985b241b-d0ec-477e-b103-2c1083498633",
    "email": "moumen.kam.work@gmail.com",
    "phone": null,
    "full_name": "Moumin Alkamsheh",
    "username": null,
    "avatar_url": null,
    "cover_url": null,
    "bio": "New bio",
    "account_type": "user",
    "is_verified": false,
    "is_featured": false,
    "category_id": null,
    "location": "Dubai",
    "website": null,
    "social_links": {},
    "company_details": {},
    "influencer_details": {},
    "service_provider_details": {},
    "stripe_customer_id": null,
    "is_admin": false,
    "created_at": "2026-06-18T13:35:26.522133+00:00",
    "updated_at": "2026-06-18T14:32:07.81723+00:00",
    "is_active": true
  },
  "message": "Profile updated successfully"
}
```

### 🔗 `{{baseUrl}}/profiles/me`

```json
{
  "success": true,
  "data": null,
  "message": "Account deleted successfully"
}
```

### 🔗 `{{baseUrl}}/profiles/:idOrUsername`

```json
{
  "success": true,
  "data": {
    "id": "d39c9683-b572-4a77-affe-7f682dcab9a8",
    "email": "moumen.kam.work@gmail.com",
    "phone": null,
    "full_name": "Moumin Alkamsheh",
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
    "created_at": "2026-06-18T14:34:26.752305+00:00",
    "updated_at": "2026-06-18T14:34:26.752305+00:00",
    "is_active": true,
    "categories": null
  },
  "message": "Profile retrieved successfully"
}
```

### 🔗 `{{baseUrl}}/profiles/me/avatar`

```json
{
  "avatarUrl": "https://example.com/image.jpg"
}
```

```json
{
  "success": true,
  "data": {
    "id": "d39c9683-b572-4a77-affe-7f682dcab9a8",
    "email": "moumen.kam.work@gmail.com",
    "phone": null,
    "full_name": "Moumin Alkamsheh",
    "username": null,
    "avatar_url": "https://example.com/image.jpg",
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
    "created_at": "2026-06-18T14:34:26.752305+00:00",
    "updated_at": "2026-06-18T15:10:25.211912+00:00",
    "is_active": true
  },
  "message": "Avatar updated successfully"
}
```

### 🔗 `{{baseUrl}}/profiles/me/cover`

```json
{
  "coverUrl": "https://example.com/cover.jpg"
}
```

```json
{
  "success": true,
  "data": {
    "id": "d39c9683-b572-4a77-affe-7f682dcab9a8",
    "email": "moumen.kam.work@gmail.com",
    "phone": null,
    "full_name": "Moumin Alkamsheh",
    "username": null,
    "avatar_url": "https://example.com/image.jpg",
    "cover_url": "https://example.com/cover.jpg",
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
    "created_at": "2026-06-18T14:34:26.752305+00:00",
    "updated_at": "2026-06-18T15:11:34.061304+00:00",
    "is_active": true
  },
  "message": "Cover updated successfully"
}
```

> ⏳ **مؤجل:** {{baseUrl}}/profiles/me/verify-request هاد مؤجل لان بيعتمد ع كذا قصة

---

## 👥 3. Follows (المتابعات)

### 🔗 `{{baseUrl}}/follows/:profileId`

```json
{
  "success": true,
  "data": null,
  "message": "Successfully followed profile"
}
```

### 🔗 `{{baseUrl}}/follows/:profileId`

```json
{
  "success": true,
  "data": null,
  "message": "Successfully unfollowed profile"
}
```

### 🔗 `{{baseUrl}}/follows/:profileId/status`

```json
{
  "success": true,
  "data": {
    "isFollowing": true
  },
  "message": "Status retrieved successfully"
}
```

### 🔗 `{{baseUrl}}/follows/followers/:profileId`

```json
{
  "success": true,
  "data": [],
  "message": "Followers retrieved successfully",
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 0,
    "totalPages": 0
  }
}
```

### 🔗 `{{baseUrl}}/follows/following/:profileId`

```json
{
  "success": true,
  "data": [
    {
      "created_at": "2026-06-18T15:42:17.826158+00:00",
      "following": {
        "id": "2fe4e7b0-93c1-46cc-a6ea-42e173722b81",
        "username": null,
        "full_name": "Moumin Alkamsheh",
        "avatar_url": null,
        "account_type": "user"
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

## 🗂️ 4. Categories (التصنيفات)

### 🔗 `{{baseUrl}}/categories`

```json
{
  "success": true,
  "data": [
    {
      "id": "20361ed2-ab58-427a-ad12-a8ace962b09f",
      "name_ar": "تكنولوجيا",
      "name_en": "Technology",
      "slug": "technology",
      "icon_url": "https://example.com/icons/tech.png",
      "parent_id": null,
      "sort_order": 1,
      "is_active": true,
      "created_at": "2026-06-17T12:58:11.292569+00:00",
      "updated_at": "2026-06-17T12:58:11.292569+00:00"
    },
    {
      "id": "7917160b-3036-4b81-9bcc-adc52405fe44",
      "name_ar": "تسويق",
      "name_en": "Marketing",
      "slug": "marketing",
      "icon_url": "https://example.com/icons/marketing.png",
      "parent_id": null,
      "sort_order": 2,
      "is_active": true,
      "created_at": "2026-06-17T12:58:11.292569+00:00",
      "updated_at": "2026-06-17T12:58:11.292569+00:00"
    },
    {
      "id": "f837e20a-eba4-41d3-bb14-b0ebb8ae0329",
      "name_ar": "تصميم",
      "name_en": "Design",
      "slug": "design",
      "icon_url": "https://example.com/icons/design.png",
      "parent_id": null,
      "sort_order": 3,
      "is_active": true,
      "created_at": "2026-06-17T12:58:11.292569+00:00",
      "updated_at": "2026-06-17T12:58:11.292569+00:00"
    },
    {
      "id": "e4704620-2516-4e23-81e8-fb94ccfba2f3",
      "name_ar": "برمجة",
      "name_en": "Programming",
      "slug": "programming",
      "icon_url": "https://example.com/icons/programming.png",
      "parent_id": null,
      "sort_order": 4,
      "is_active": true,
      "created_at": "2026-06-17T12:58:11.292569+00:00",
      "updated_at": "2026-06-17T12:58:11.292569+00:00"
    },
    {
      "id": "b6618b3a-cdd2-47bd-b270-d3761a8c0739",
      "name_ar": "استشارات",
      "name_en": "Consulting",
      "slug": "consulting",
      "icon_url": "https://example.com/icons/consulting.png",
      "parent_id": null,
      "sort_order": 5,
      "is_active": true,
      "created_at": "2026-06-17T12:58:11.292569+00:00",
      "updated_at": "2026-06-17T12:58:11.292569+00:00"
    },
    {
      "id": "33aa5d76-362b-4b8d-9743-e890bfda274f",
      "name_ar": "أخرى",
      "name_en": "Other",
      "slug": "other",
      "icon_url": "https://example.com/icons/other.png",
      "parent_id": null,
      "sort_order": 99,
      "is_active": true,
      "created_at": "2026-06-17T12:58:11.292569+00:00",
      "updated_at": "2026-06-17T12:58:11.292569+00:00"
    }
  ],
  "message": "Categories retrieved"
}
```

### 🔗 `{{baseUrl}}/categories/:categoryId/content?page=1&limit=20`

```json
{
  "success": true,
  "data": [],
  "message": "Category content retrieved",
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 0,
    "totalPages": 0
  }
}
```

---

## 🔍 5. Search (البحث)

### 🔗 `{{baseUrl}}/search?q=test&type=all&page=1&limit=20`

```json
{
  "success": true,
  "data": {
    "profiles": [],
    "offers": [],
    "ads": []
  },
  "message": "Search results retrieved"
}
```

{{baseUrl}}/offers?page=1&limit=20

{
"success": true,
"data": [],
"message": "Offers retrieved successfully",
"meta": {
"page": 1,
"limit": 20,
"total": 0,
"totalPages": 0
}
}

{{baseUrl}}/offers

{

    "category_id": "20361ed2-ab58-427a-ad12-a8ace962b09f",

    "title": "Offer 1",

    "description": "Desc.testtesttest",

    "offer_price": 100,

    "start_date": "2026-06-01T00:00:00Z"

}

{

    "success": true,

    "data": {

        "id": "fd7589f4-5810-4eb9-8c11-70e509ee4f71",

        "profile_id": "d39c9683-b572-4a77-affe-7f682dcab9a8",

        "category_id": "20361ed2-ab58-427a-ad12-a8ace962b09f",

        "title": "Offer 1",

        "description": "Desc.testtesttest",

        "original_price": null,

        "offer_price": 100,

        "discount_percentage": null,

        "media_urls": [],

        "start_date": "2026-06-01T00:00:00+00:00",

        "end_date": null,

        "status": "active",

        "is_featured": false,

        "views_count": 0,

        "created_at": "2026-06-19T19:51:21.554315+00:00",

        "updated_at": "2026-06-19T19:51:21.554315+00:00",

        "category": {

            "id": "20361ed2-ab58-427a-ad12-a8ace962b09f",

            "slug": "technology",

            "name_ar": "تكنولوجيا",

            "name_en": "Technology"

        }

    },

    "message": "Offer created successfully"

}

{{baseUrl}}/offers/:offerId

{
"success": true,
"data": {
"id": "fd7589f4-5810-4eb9-8c11-70e509ee4f71",
"profile_id": "d39c9683-b572-4a77-affe-7f682dcab9a8",
"category_id": "20361ed2-ab58-427a-ad12-a8ace962b09f",
"title": "Offer 1",
"description": "Desc.testtesttest",
"original_price": null,
"offer_price": 100,
"discount_percentage": null,
"media_urls": [],
"start_date": "2026-06-01T00:00:00+00:00",
"end_date": null,
"status": "active",
"is_featured": false,
"views_count": 0,
"created_at": "2026-06-19T19:51:21.554315+00:00",
"updated_at": "2026-06-19T19:51:21.554315+00:00",
"profile": {
"id": "d39c9683-b572-4a77-affe-7f682dcab9a8",
"location": null,
"username": null,
"full_name": "Moumin Alkamsheh",
"avatar_url": "https://mqklargyjispbcyxzdjo.supabase.co/storage/v1/object/public/general/d39c9683-b572-4a77-affe-7f682dcab9a8/215a3f95-8870-46c4-abda-e2c922d89c01.jpeg"
},
"category": {
"id": "20361ed2-ab58-427a-ad12-a8ace962b09f",
"slug": "technology",
"name_ar": "تكنولوجيا",
"name_en": "Technology"
}
},
"message": "Offer details retrieved successfully"
}

{{baseUrl}}/offers/:offerId ( Put )

{
"title": "Updated Offer"
}

{
"success": true,
"data": {
"id": "fd7589f4-5810-4eb9-8c11-70e509ee4f71",
"profile_id": "d39c9683-b572-4a77-affe-7f682dcab9a8",
"category_id": "20361ed2-ab58-427a-ad12-a8ace962b09f",
"title": "Updated Offer",
"description": "Desc.testtesttest",
"original_price": null,
"offer_price": 100,
"discount_percentage": null,
"media_urls": [],
"start_date": "2026-06-01T00:00:00+00:00",
"end_date": null,
"status": "active",
"is_featured": false,
"views_count": 2,
"created_at": "2026-06-19T19:51:21.554315+00:00",
"updated_at": "2026-06-20T09:23:42.630963+00:00",
"category": {
"id": "20361ed2-ab58-427a-ad12-a8ace962b09f",
"slug": "technology",
"name_ar": "تكنولوجيا",
"name_en": "Technology"
}
},
"message": "Offer updated successfully"
}

{{baseUrl}}/offers/:offerId ( Delete )

{
"success": true,
"data": null,
"message": "Offer deleted successfully"
}



{{baseUrl}}/offers/profile/:profileId


{
    "success": true,
    "data": [],
    "message": "User offers retrieved successfully",
    "meta": {
        "page": 1,
        "limit": 20,
        "total": 0,
        "totalPages": 0
    }
}


{{baseUrl}}/ads


{
  "title": "My Ad",
  "media_url": "https://example.com/ad-image.jpg",
  "ad_type": "banner",
  "budget": 100,
  "start_date": "2026-06-01T00:00:00Z"
}


{
    "success": true,
    "data": {
        "id": "2c753f31-5e24-416f-bf0f-6021d5d6e48a",
        "profile_id": "d39c9683-b572-4a77-affe-7f682dcab9a8",
        "title": "My Ad",
        "description": null,
        "media_url": "https://example.com/ad-image.jpg",
        "ad_type": "banner",
        "target_url": null,
        "budget": 100,
        "spent": 0,
        "start_date": "2026-06-01T00:00:00+00:00",
        "end_date": null,
        "status": "pending",
        "impressions": 0,
        "clicks": 0,
        "created_at": "2026-06-20T09:55:08.643978+00:00",
        "updated_at": "2026-06-20T09:55:08.643978+00:00"
    },
    "message": "Ad campaign created successfully. Waiting for activation/payment."
}


{{baseUrl}}/ads/:adId

{
    "title": "Updated Ad"
}

{
    "success": true,
    "data": {
        "id": "2c753f31-5e24-416f-bf0f-6021d5d6e48a",
        "profile_id": "d39c9683-b572-4a77-affe-7f682dcab9a8",
        "title": "Updated Ad",
        "description": null,
        "media_url": "https://example.com/ad-image.jpg",
        "ad_type": "banner",
        "target_url": null,
        "budget": 100,
        "spent": 0,
        "start_date": "2026-06-01T00:00:00+00:00",
        "end_date": null,
        "status": "pending",
        "impressions": 0,
        "clicks": 0,
        "created_at": "2026-06-20T09:55:08.643978+00:00",
        "updated_at": "2026-06-20T09:56:17.2142+00:00"
    },
    "message": "Ad campaign updated successfully"
}


{{baseUrl}}/ads/:adId/toggle


{
    "success": true,
    "data": {
        "id": "2c753f31-5e24-416f-bf0f-6021d5d6e48a",
        "profile_id": "d39c9683-b572-4a77-affe-7f682dcab9a8",
        "title": "Updated Ad",
        "description": null,
        "media_url": "https://example.com/ad-image.jpg",
        "ad_type": "banner",
        "target_url": null,
        "budget": 100,
        "spent": 0,
        "start_date": "2026-06-01T00:00:00+00:00",
        "end_date": null,
        "status": "paused",
        "impressions": 0,
        "clicks": 0,
        "created_at": "2026-06-20T09:55:08.643978+00:00",
        "updated_at": "2026-06-20T10:01:14.804919+00:00"
    },
    "message": "Ad status toggled successfully to paused"
}


{{baseUrl}}/ads/:adId/stats

{
    "success": true,
    "data": {
        "impressions": 0,
        "clicks": 0,
        "budget": 100,
        "spent": 0,
        "status": "paused",
        "ctr": 0
    },
    "message": "Ad statistics retrieved successfully"
}


{{baseUrl}}/ads/:adId/impression


{
    "success": true,
    "data": {
        "impressions": 1,
        "status": "active"
    },
    "message": "Ad impression recorded successfully"
}


{{baseUrl}}/ads/:adId/click

{
    "success": true,
    "data": {
        "clicks": 1,
        "status": "active",
        "targetUrl": null
    },
    "message": "Ad click recorded successfully"
}


{{baseUrl}}/subscriptions/plans


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
            "features": [
                "5 offers per month",
                "Basic support",
                "Standard profile"
            ],
            "stripe_price_id": "price_basic_monthly_placeholder",
            "is_active": true,
            "sort_order": 1,
            "created_at": "2026-06-17T12:58:11.292569+00:00",
            "updated_at": "2026-06-17T12:58:11.292569+00:00"
        },
        {
            "id": "37398dcd-112a-4643-85f4-aa5e5f127ce1",
            "name_ar": "الباقة المميزة",
            "name_en": "Premium Plan",
            "description_ar": "للمحترفين والشركات",
            "description_en": "For professionals and companies",
            "price": 29,
            "interval": "monthly",
            "features": [
                "Unlimited offers",
                "Priority support",
                "Verified badge",
                "Analytics"
            ],
            "stripe_price_id": "price_premium_monthly_placeholder",
            "is_active": true,
            "sort_order": 2,
            "created_at": "2026-06-17T12:58:11.292569+00:00",
            "updated_at": "2026-06-17T12:58:11.292569+00:00"
        },
        {
            "id": "68917e4a-19cd-4a3b-b2e1-11e0f7ec1fc0",
            "name_ar": "باقة الشركات",
            "name_en": "Enterprise Plan",
            "description_ar": "دعم كامل وميزات غير محدودة",
            "description_en": "Full support and unlimited features",
            "price": 290,
            "interval": "yearly",
            "features": [
                "Everything in Premium",
                "Dedicated account manager",
                "Custom API access"
            ],
            "stripe_price_id": "price_enterprise_yearly_placeholder",
            "is_active": true,
            "sort_order": 3,
            "created_at": "2026-06-17T12:58:11.292569+00:00",
            "updated_at": "2026-06-17T12:58:11.292569+00:00"
        }
    ],
    "message": "Plans retrieved successfully"
}


{{baseUrl}}/subscriptions


{
    "plan_id": "a951eaab-66db-4e58-a843-f08709741ec1"
}


{
    "success": true,
    "data": {
        "url": "https://checkout.stripe.mock/pay/price_basic_monthly_placeholder"
    },
    "message": "Checkout session created successfully"
}

{{baseUrl}}/subscriptions/me

{
    "success": true,
    "data": null,
    "message": "Subscription retrieved successfully"
}



{{baseUrl}}/featured


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


{{baseUrl}}/featured


{
    "placement": "home",
    "durationDays": 7
}


{
    "success": true,
    "data": {
        "url": "https://checkout.stripe.com/c/pay/cs_test_a1hX0TKRL3ob5yO9yROW6wJigEOEBFBXSpuzMewRblXau4c9uj94UvT97S#fidnandhYHdWcXxpYCc%2FJ2FgY2RwaXEnKSdicGRmZGhqaWBTZHdsZGtxJz8nZmprcXdqaScpJ2R1bE5gfCc%2FJ3VuWnFgdnFaMDRRb1VGYjM3ZGI9Vm1oPFdnSElxcF9kNWlvQ0FpU0pnQlJrNEAwVWwzMnRQTU19fV9nMGlnSVJsYldLXEBCcTV%2FUH89ZmpjTkg1QmFuXzJuN3BgRG9kQVQ1NW1cUlFHTEdQJyknY3dqaFZgd3Ngdyc%2FcXdwYCknZ2RmbmJ3anBrYUZqaWp3Jz8nJmNjY2NjYycpJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl"
    },
    "message": "Featured checkout session created"
}


{{baseUrl}}/chats

{
    "participant_id": "2fe4e7b0-93c1-46cc-a6ea-42e173722b81"
}

{
    "success": true,
    "data": {
        "room": {
            "id": "57de94db-fc2b-4343-9c2f-6ef4c120d4fe",
            "type": "direct",
            "name": null,
            "created_at": "2026-06-20T13:00:04.339134+00:00",
            "last_message_at": "2026-06-20T13:00:04.339134+00:00"
        },
        "participant": {
            "id": "2fe4e7b0-93c1-46cc-a6ea-42e173722b81",
            "full_name": "Moumin Alkamsheh",
            "avatar_url": null
        },
        "isNew": false
    },
    "message": "Chat opened successfully"
}



{{baseUrl}}/chats


{
    "success": true,
    "data": [
        {
            "room": {
                "id": "57de94db-fc2b-4343-9c2f-6ef4c120d4fe",
                "type": "direct",
                "name": null,
                "created_at": "2026-06-20T13:00:04.339134+00:00",
                "last_message_at": "2026-06-20T13:00:04.339134+00:00"
            },
            "otherParticipant": {
                "id": "2fe4e7b0-93c1-46cc-a6ea-42e173722b81",
                "full_name": "Moumin Alkamsheh",
                "avatar_url": null
            },
            "lastMessage": null,
            "unreadCount": 0
        }
    ],
    "message": "Chats retrieved",
    "meta": {
        "page": 1,
        "limit": 20,
        "total": 1,
        "totalPages": 1
    }
}


{{baseUrl}}/chats/:roomId/messages

{
    "content": "Hello!"
}

{
    "success": true,
    "data": {
        "id": "5753e6dc-df98-4d73-9b3f-9a15fe5728a6",
        "room_id": "57de94db-fc2b-4343-9c2f-6ef4c120d4fe",
        "sender_id": "d39c9683-b572-4a77-affe-7f682dcab9a8",
        "content": "Hello!",
        "type": "text",
        "media_url": null,
        "is_read": false,
        "created_at": "2026-06-21T00:26:45.09251+00:00",
        "sender": {
            "id": "d39c9683-b572-4a77-affe-7f682dcab9a8",
            "full_name": "Moumin Alkamsheh",
            "avatar_url": "https://mqklargyjispbcyxzdjo.supabase.co/storage/v1/object/public/general/d39c9683-b572-4a77-affe-7f682dcab9a8/215a3f95-8870-46c4-abda-e2c922d89c01.jpeg"
        }
    },
    "message": "Message sent successfully"
}


{{baseUrl}}/chats/:roomId/messages?page=1


{
    "success": true,
    "data": [
        {
            "id": "5753e6dc-df98-4d73-9b3f-9a15fe5728a6",
            "room_id": "57de94db-fc2b-4343-9c2f-6ef4c120d4fe",
            "sender_id": "d39c9683-b572-4a77-affe-7f682dcab9a8",
            "content": "Hello!",
            "type": "text",
            "media_url": null,
            "is_read": false,
            "created_at": "2026-06-21T00:26:45.09251+00:00",
            "sender": {
                "id": "d39c9683-b572-4a77-affe-7f682dcab9a8",
                "full_name": "Moumin Alkamsheh",
                "avatar_url": "https://mqklargyjispbcyxzdjo.supabase.co/storage/v1/object/public/general/d39c9683-b572-4a77-affe-7f682dcab9a8/215a3f95-8870-46c4-abda-e2c922d89c01.jpeg"
            }
        }
    ],
    "message": "Messages retrieved",
    "meta": {
        "page": 1,
        "limit": 20,
        "total": 1,
        "totalPages": 1
    }
}


{{baseUrl}}/notifications?page=1


{
    "success": true,
    "data": [],
    "message": "Notifications retrieved",
    "meta": {
        "page": 1,
        "limit": 20,
        "total": 0,
        "totalPages": 0
    }
}


{{baseUrl}}/notifications/token

{
    "token": "FCM_TOKEN",
    "deviceType": "ios"
}


{
    "success": true,
    "data": null,
    "message": "FCM token registered successfully"
}


{{baseUrl}}/notifications/read-all


{
    "success": true,
    "data": null,
    "message": "All notifications marked as read"
}


{{baseUrl}}/notifications/:notificationId/read

{
    "success": true,
    "data": null,
    "message": "Notification marked as read"
}



{{baseUrl}}/notifications/:notificationId هاد api حذف الاشعار وشغال من ال postman


{{baseUrl}}/upload/image

{
    "success": true,
    "data": {
        "id": "9eb30377-aa12-4ea1-8034-ff52201f6a2d",
        "profile_id": "d39c9683-b572-4a77-affe-7f682dcab9a8",
        "file_name": "f38e9059-8ed2-4706-a509-e6429a8f3693.jpg",
        "file_url": "https://mqklargyjispbcyxzdjo.supabase.co/storage/v1/object/public/general/d39c9683-b572-4a77-affe-7f682dcab9a8/f38e9059-8ed2-4706-a509-e6429a8f3693.jpg",
        "file_type": "image/jpeg",
        "file_size": 6961,
        "related_to": null,
        "related_id": null,
        "created_at": "2026-06-21T01:27:53.817419+00:00"
    },
    "message": "Image uploaded successfully"
}


{{baseUrl}}/upload/video

{
    "success": true,
    "data": {
        "id": "9053b67e-f562-4696-a5d2-56acbd35345e",
        "profile_id": "d39c9683-b572-4a77-affe-7f682dcab9a8",
        "file_name": "0e0458c6-7ef7-417f-8a03-e673ce13b6d5.mp4",
        "file_url": "https://mqklargyjispbcyxzdjo.supabase.co/storage/v1/object/public/general/d39c9683-b572-4a77-affe-7f682dcab9a8/0e0458c6-7ef7-417f-8a03-e673ce13b6d5.mp4",
        "file_type": "video/mp4",
        "file_size": 1944374,
        "related_to": null,
        "related_id": null,
        "created_at": "2026-06-21T01:30:38.542475+00:00"
    },
    "message": "Video uploaded successfully"
}


{{baseUrl}}/upload/file

{
    "success": true,
    "data": {
        "id": "b52d2f65-84cf-41f6-8af0-5af3520f8661",
        "profile_id": "d39c9683-b572-4a77-affe-7f682dcab9a8",
        "file_name": "a5de5120-71b5-4cb3-a4ee-74421622fbcf.pdf",
        "file_url": "https://mqklargyjispbcyxzdjo.supabase.co/storage/v1/object/public/general/d39c9683-b572-4a77-affe-7f682dcab9a8/a5de5120-71b5-4cb3-a4ee-74421622fbcf.pdf",
        "file_type": "application/pdf",
        "file_size": 605388,
        "related_to": null,
        "related_id": null,
        "created_at": "2026-06-21T01:32:05.529783+00:00"
    },
    "message": "File uploaded successfully"
}

{{baseUrl}}/upload/:fileId هاد الحذف وشغال ما احلاه

