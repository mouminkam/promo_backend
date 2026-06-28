# Reports — API Test Results

> Live responses captured against `http://localhost:3000/api/v1`. Base URL shown as `{{baseUrl}}`.

## 1. Create Report

- **Method / Route:** `POST {{baseUrl}}/reports`
- **Auth:** Bearer (user)
- **Status:** `201` ✅

**Payload:**

```json
{
  "reported_id": "8481b89e-43c2-47c8-a90e-7823c516f926",
  "reported_type": "profile",
  "reason": "Spam content",
  "details": "Repeated spam offers."
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
    "status": "pending",
    "admin_note": null,
    "created_at": "2026-06-28T18:17:36.768714+00:00",
    "resolved_at": null
  },
  "message": "Report submitted successfully"
}
```

---

## 2. Get My Reports

- **Method / Route:** `GET {{baseUrl}}/reports/me`
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
      "id": "c8b93714-d9b5-40e0-ba76-0010a54626bf",
      "reporter_id": "1157c029-3952-46c0-8a14-074bcd604c45",
      "reported_id": "8481b89e-43c2-47c8-a90e-7823c516f926",
      "reported_type": "profile",
      "reason": "Spam content",
      "details": "Repeated spam offers.",
      "status": "pending",
      "admin_note": null,
      "created_at": "2026-06-28T18:17:36.768714+00:00",
      "resolved_at": null
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
      "resolved_at": "2026-06-28T18:08:16.636+00:00"
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
      "resolved_at": "2026-06-28T17:56:58.741+00:00"
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
      "resolved_at": "2026-06-28T17:52:20.306+00:00"
    }
  ],
  "message": "Reports retrieved",
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 4,
    "totalPages": 1
  }
}
```

---

