# Health — API Test Results

> Live responses captured against `http://localhost:3000/api/v1`. Base URL shown as `{{baseUrl}}`.

## 1. Health Check

- **Method / Route:** `GET {{baseUrl}}/health`
- **Auth:** Public (no auth)
- **Status:** `200` ✅

**Payload:**

_— none —_

**Response:**

```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2026-06-28T18:16:47.512Z",
    "uptime": 34.8443535
  },
  "message": "Server is running"
}
```

---

