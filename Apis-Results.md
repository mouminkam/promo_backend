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
                "providers": [
                    "email"
                ]
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


> ⚠️ **ملاحظة:** هاد ال api غالبا مو شغال لان ببساطة مالي رابط otp عال supa base  بالاضافة الباك ايند لساتو عال local:3000



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
                "providers": [
                    "email"
                ]
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
                    "providers": [
                        "email"
                    ]
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

> ⚠️ **ملاحظة:** نحنا حاليا حنتاجل ال profile 1  يلي هوي بمثل ال auth  بشكل كامل 



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

