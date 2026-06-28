# Auth — API Test Results

> Live responses captured against `http://localhost:3000/api/v1`. Base URL shown as `{{baseUrl}}`.

## 1. Register (Email)

- **Method / Route:** `POST {{baseUrl}}/auth/register/email`
- **Auth:** Public (no auth)
- **Status:** `400` ⚠️

**Payload:**

```json
{
  "email": "apitest_1782670607512@example.com",
  "password": "Promoo@Test2026",
  "full_name": "API Test User",
  "account_type": "company"
}
```

**Response:**

```json
{
  "success": false,
  "data": null,
  "message": "email rate limit exceeded",
  "error": {
    "code": "VALIDATION_ERROR"
  }
}
```

---

## 2. Register (Phone)

- **Method / Route:** `POST {{baseUrl}}/auth/register/phone`
- **Auth:** Public (no auth)
- **Status:** `400` ⚠️

**Payload:**

```json
{
  "phone": "+971588038012",
  "password": "Promoo@Test2026",
  "full_name": "API Test Phone",
  "account_type": "influencer"
}
```

**Response:**

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

---

## 3. Login (Email)

- **Method / Route:** `POST {{baseUrl}}/auth/login/email`
- **Auth:** Public (no auth)
- **Status:** `200` ✅

**Payload:**

```json
{
  "email": "company@test.com",
  "password": "Promoo@Test2026"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "3a909ef5-9f3f-427d-b530-f332d916418c",
      "aud": "authenticated",
      "role": "authenticated",
      "email": "company@test.com",
      "email_confirmed_at": "2026-06-24T16:40:25.919258Z",
      "phone": "",
      "confirmed_at": "2026-06-24T16:40:25.919258Z",
      "last_sign_in_at": "2026-06-28T18:16:39.874768215Z",
      "app_metadata": {
        "provider": "email",
        "providers": [
          "email"
        ]
      },
      "user_metadata": {
        "account_type": "company",
        "email_verified": true,
        "full_name": "Test Company"
      },
      "identities": [
        {
          "identity_id": "d369377b-d44d-4448-a334-062ac2cfe073",
          "id": "3a909ef5-9f3f-427d-b530-f332d916418c",
          "user_id": "3a909ef5-9f3f-427d-b530-f332d916418c",
          "identity_data": {
            "email": "company@test.com",
            "email_verified": false,
            "phone_verified": false,
            "sub": "3a909ef5-9f3f-427d-b530-f332d916418c"
          },
          "provider": "email",
          "last_sign_in_at": "2026-06-24T16:40:25.917741Z",
          "created_at": "2026-06-24T16:40:25.917797Z",
          "updated_at": "2026-06-24T16:40:25.917797Z",
          "email": "company@test.com"
        }
      ],
      "created_at": "2026-06-24T16:40:25.916182Z",
      "updated_at": "2026-06-28T18:16:39.877777Z",
      "is_anonymous": false
    },
    "session": {
      "access_token": "eyJhbGciOiJFUzI1NiIsImtpZCI6IjhkNTQ0MTVkLTc3MjQtNGM4My05NWM5LTYwODk2MjI1OWMyYiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL21xa2xhcmd5amlzcGJjeXh6ZGpvLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiIzYTkwOWVmNS05ZjNmLTQyN2QtYjUzMC1mMzMyZDkxNjQxOGMiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzgyNjc0MTk5LCJpYXQiOjE3ODI2NzA1OTksImVtYWlsIjoiY29tcGFueUB0ZXN0LmNvbSIsInBob25lIjoiIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZW1haWwiLCJwcm92aWRlcnMiOlsiZW1haWwiXX0sInVzZXJfbWV0YWRhdGEiOnsiYWNjb3VudF90eXBlIjoiY29tcGFueSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmdWxsX25hbWUiOiJUZXN0IENvbXBhbnkifSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJwYXNzd29yZCIsInRpbWVzdGFtcCI6MTc4MjY3MDU5OX1dLCJzZXNzaW9uX2lkIjoiZDhkNDVmZTgtMTZkNC00YjJmLThmOTEtZmNmZThjMDE2ZjRmIiwiaXNfYW5vbnltb3VzIjpmYWxzZX0.hgKppfZw4ph4VIb1RmiMOLCkE20SDzQZEG244JwH1c4kvzQoyBI3btvXO9ygyP826F7-hBxGZf20JvmWUjpgrw",
      "token_type": "bearer",
      "expires_in": 3600,
      "expires_at": 1782674199,
      "refresh_token": "46sfudghttgs",
      "user": {
        "id": "3a909ef5-9f3f-427d-b530-f332d916418c",
        "aud": "authenticated",
        "role": "authenticated",
        "email": "company@test.com",
        "email_confirmed_at": "2026-06-24T16:40:25.919258Z",
        "phone": "",
        "confirmed_at": "2026-06-24T16:40:25.919258Z",
        "last_sign_in_at": "2026-06-28T18:16:39.874768215Z",
        "app_metadata": {
          "provider": "email",
          "providers": [
            "email"
          ]
        },
        "user_metadata": {
          "account_type": "company",
          "email_verified": true,
          "full_name": "Test Company"
        },
        "identities": [
          {
            "identity_id": "d369377b-d44d-4448-a334-062ac2cfe073",
            "id": "3a909ef5-9f3f-427d-b530-f332d916418c",
            "user_id": "3a909ef5-9f3f-427d-b530-f332d916418c",
            "identity_data": {
              "email": "company@test.com",
              "email_verified": false,
              "phone_verified": false,
              "sub": "3a909ef5-9f3f-427d-b530-f332d916418c"
            },
            "provider": "email",
            "last_sign_in_at": "2026-06-24T16:40:25.917741Z",
            "created_at": "2026-06-24T16:40:25.917797Z",
            "updated_at": "2026-06-24T16:40:25.917797Z",
            "email": "company@test.com"
          }
        ],
        "created_at": "2026-06-24T16:40:25.916182Z",
        "updated_at": "2026-06-28T18:16:39.877777Z",
        "is_anonymous": false
      },
      "weak_password": null
    }
  },
  "message": "Login successful"
}
```

---

## 4. Login (Phone)

- **Method / Route:** `POST {{baseUrl}}/auth/login/phone`
- **Auth:** Public (no auth)
- **Status:** `401` ⚠️

**Payload:**

```json
{
  "phone": "+971540573756",
  "password": "Promoo@Test2026"
}
```

**Response:**

```json
{
  "success": false,
  "data": null,
  "message": "Phone logins are disabled",
  "error": {
    "code": "UNAUTHORIZED"
  }
}
```

---

## 5. Login (OAuth)

- **Method / Route:** `POST {{baseUrl}}/auth/login/oauth`
- **Auth:** Public (no auth)
- **Status:** `401` ⚠️

**Payload:**

```json
{
  "provider": "google",
  "id_token": "fake_id_token_for_testing",
  "nonce": "test-nonce"
}
```

**Response:**

```json
{
  "success": false,
  "data": null,
  "message": "Provider (issuer \"https://accounts.google.com\") is not enabled",
  "error": {
    "code": "UNAUTHORIZED"
  }
}
```

---

## 6. Verify OTP

- **Method / Route:** `POST {{baseUrl}}/auth/verify-otp`
- **Auth:** Public (no auth)
- **Status:** `400` ⚠️

**Payload:**

```json
{
  "phone": "+971500000000",
  "token": "123456",
  "type": "sms"
}
```

**Response:**

```json
{
  "success": false,
  "data": null,
  "message": "Token has expired or is invalid",
  "error": {
    "code": "VALIDATION_ERROR"
  }
}
```

---

## 7. Refresh Token

- **Method / Route:** `POST {{baseUrl}}/auth/refresh`
- **Auth:** Public (no auth)
- **Status:** `200` ✅

**Payload:**

```json
{
  "refresh_token": "5vwwxtnavxuj"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "3a909ef5-9f3f-427d-b530-f332d916418c",
      "aud": "authenticated",
      "role": "authenticated",
      "email": "company@test.com",
      "email_confirmed_at": "2026-06-24T16:40:25.919258Z",
      "phone": "",
      "confirmed_at": "2026-06-24T16:40:25.919258Z",
      "last_sign_in_at": "2026-06-28T18:16:41.939056Z",
      "app_metadata": {
        "provider": "email",
        "providers": [
          "email"
        ]
      },
      "user_metadata": {
        "account_type": "company",
        "email_verified": true,
        "full_name": "Test Company"
      },
      "identities": [
        {
          "identity_id": "d369377b-d44d-4448-a334-062ac2cfe073",
          "id": "3a909ef5-9f3f-427d-b530-f332d916418c",
          "user_id": "3a909ef5-9f3f-427d-b530-f332d916418c",
          "identity_data": {
            "email": "company@test.com",
            "email_verified": false,
            "phone_verified": false,
            "sub": "3a909ef5-9f3f-427d-b530-f332d916418c"
          },
          "provider": "email",
          "last_sign_in_at": "2026-06-24T16:40:25.917741Z",
          "created_at": "2026-06-24T16:40:25.917797Z",
          "updated_at": "2026-06-24T16:40:25.917797Z",
          "email": "company@test.com"
        }
      ],
      "created_at": "2026-06-24T16:40:25.916182Z",
      "updated_at": "2026-06-28T18:16:42.388383Z",
      "is_anonymous": false
    },
    "session": {
      "access_token": "eyJhbGciOiJFUzI1NiIsImtpZCI6IjhkNTQ0MTVkLTc3MjQtNGM4My05NWM5LTYwODk2MjI1OWMyYiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL21xa2xhcmd5amlzcGJjeXh6ZGpvLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiIzYTkwOWVmNS05ZjNmLTQyN2QtYjUzMC1mMzMyZDkxNjQxOGMiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzgyNjc0MjAyLCJpYXQiOjE3ODI2NzA2MDIsImVtYWlsIjoiY29tcGFueUB0ZXN0LmNvbSIsInBob25lIjoiIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZW1haWwiLCJwcm92aWRlcnMiOlsiZW1haWwiXX0sInVzZXJfbWV0YWRhdGEiOnsiYWNjb3VudF90eXBlIjoiY29tcGFueSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmdWxsX25hbWUiOiJUZXN0IENvbXBhbnkifSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJwYXNzd29yZCIsInRpbWVzdGFtcCI6MTc4MjY3MDYwMX1dLCJzZXNzaW9uX2lkIjoiNjYyMTY0M2EtZDQ4Yy00NzExLWIzYmYtOTZjODJkN2YxYzRiIiwiaXNfYW5vbnltb3VzIjpmYWxzZX0.l9yZZGPUGkK9Nvy5e4xPcG0O9C9DkSFVMFKqcPV6XR4lJ3MKdjnFF89DW9ufs1QQ18MFXMJLyX9JuhNjciZwww",
      "token_type": "bearer",
      "expires_in": 3600,
      "expires_at": 1782674202,
      "refresh_token": "ki535vfmfuva",
      "user": {
        "id": "3a909ef5-9f3f-427d-b530-f332d916418c",
        "aud": "authenticated",
        "role": "authenticated",
        "email": "company@test.com",
        "email_confirmed_at": "2026-06-24T16:40:25.919258Z",
        "phone": "",
        "confirmed_at": "2026-06-24T16:40:25.919258Z",
        "last_sign_in_at": "2026-06-28T18:16:41.939056Z",
        "app_metadata": {
          "provider": "email",
          "providers": [
            "email"
          ]
        },
        "user_metadata": {
          "account_type": "company",
          "email_verified": true,
          "full_name": "Test Company"
        },
        "identities": [
          {
            "identity_id": "d369377b-d44d-4448-a334-062ac2cfe073",
            "id": "3a909ef5-9f3f-427d-b530-f332d916418c",
            "user_id": "3a909ef5-9f3f-427d-b530-f332d916418c",
            "identity_data": {
              "email": "company@test.com",
              "email_verified": false,
              "phone_verified": false,
              "sub": "3a909ef5-9f3f-427d-b530-f332d916418c"
            },
            "provider": "email",
            "last_sign_in_at": "2026-06-24T16:40:25.917741Z",
            "created_at": "2026-06-24T16:40:25.917797Z",
            "updated_at": "2026-06-24T16:40:25.917797Z",
            "email": "company@test.com"
          }
        ],
        "created_at": "2026-06-24T16:40:25.916182Z",
        "updated_at": "2026-06-28T18:16:42.388383Z",
        "is_anonymous": false
      }
    }
  },
  "message": "Token refreshed successfully"
}
```

---

## 8. Forgot Password

- **Method / Route:** `POST {{baseUrl}}/auth/forgot-password`
- **Auth:** Public (no auth)
- **Status:** `400` ⚠️

**Payload:**

```json
{
  "email": "company@test.com"
}
```

**Response:**

```json
{
  "success": false,
  "data": null,
  "message": "email rate limit exceeded",
  "error": {
    "code": "VALIDATION_ERROR"
  }
}
```

---

## 9. Reset Password

- **Method / Route:** `POST {{baseUrl}}/auth/reset-password`
- **Auth:** Bearer (throwaway user)
- **Status:** `200` ✅

**Payload:**

```json
{
  "password": "NewPassword123!"
}
```

**Response:**

```json
{
  "success": true,
  "data": null,
  "message": "Password updated successfully"
}
```

---

## 10. Logout

- **Method / Route:** `POST {{baseUrl}}/auth/logout`
- **Auth:** Bearer (throwaway session)
- **Status:** `200` ✅

**Payload:**

_— none —_

**Response:**

```json
{
  "success": true,
  "data": null,
  "message": "Logged out successfully"
}
```

---

## 11. Delete Account

- **Method / Route:** `DELETE {{baseUrl}}/auth/account`
- **Auth:** Bearer (throwaway user)
- **Status:** `200` ✅

**Payload:**

_— none —_

**Response:**

```json
{
  "success": true,
  "data": null,
  "message": "Account deleted successfully"
}
```

---

