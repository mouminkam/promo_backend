# Upload — API Test Results

> Live responses captured against `http://localhost:3000/api/v1`. Base URL shown as `{{baseUrl}}`.

## 1. Upload Image

- **Method / Route:** `POST {{baseUrl}}/upload/image`
- **Auth:** Bearer (company)
- **Status:** `201` ✅

**Payload:**

_(multipart/form-data — file upload)_

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "04c2b5a1-c13d-47dd-8749-5677a2b32f3f",
    "profile_id": "3a909ef5-9f3f-427d-b530-f332d916418c",
    "file_name": "be74a8dc-2660-4fe7-a3cb-af572bc5720c.png",
    "file_url": "https://mqklargyjispbcyxzdjo.supabase.co/storage/v1/object/public/avatars/3a909ef5-9f3f-427d-b530-f332d916418c/be74a8dc-2660-4fe7-a3cb-af572bc5720c.png",
    "file_type": "image/png",
    "file_size": 70,
    "related_to": "profile",
    "related_id": null,
    "created_at": "2026-06-28T18:17:27.510311+00:00",
    "views_count": 0
  },
  "message": "Image uploaded successfully"
}
```

---

## 2. Upload Video

- **Method / Route:** `POST {{baseUrl}}/upload/video`
- **Auth:** Bearer (company)
- **Status:** `201` ✅

**Payload:**

_(multipart/form-data — file upload)_

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "ccaba0ec-3177-4c64-bc23-0a44f933c511",
    "profile_id": "3a909ef5-9f3f-427d-b530-f332d916418c",
    "file_name": "13cee376-55e6-44fe-9e56-6d8e470163a4.mp4",
    "file_url": "https://mqklargyjispbcyxzdjo.supabase.co/storage/v1/object/public/stories/3a909ef5-9f3f-427d-b530-f332d916418c/13cee376-55e6-44fe-9e56-6d8e470163a4.mp4",
    "file_type": "video/mp4",
    "file_size": 4,
    "related_to": "story",
    "related_id": null,
    "created_at": "2026-06-28T18:17:28.494366+00:00",
    "views_count": 0
  },
  "message": "Video uploaded successfully"
}
```

---

## 3. Upload File

- **Method / Route:** `POST {{baseUrl}}/upload/file`
- **Auth:** Bearer (company)
- **Status:** `201` ✅

**Payload:**

_(multipart/form-data — file upload)_

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "de0fd989-c48c-4c46-b2fe-20a6d08c3de6",
    "profile_id": "3a909ef5-9f3f-427d-b530-f332d916418c",
    "file_name": "6a79b9a8-f48d-4cba-9cd4-427707e31828.pdf",
    "file_url": "https://mqklargyjispbcyxzdjo.supabase.co/storage/v1/object/public/verifications/3a909ef5-9f3f-427d-b530-f332d916418c/6a79b9a8-f48d-4cba-9cd4-427707e31828.pdf",
    "file_type": "application/pdf",
    "file_size": 13,
    "related_to": "verification",
    "related_id": null,
    "created_at": "2026-06-28T18:17:29.0654+00:00",
    "views_count": 0
  },
  "message": "File uploaded successfully"
}
```

---

## 4. Delete File

- **Method / Route:** `DELETE {{baseUrl}}/upload/04c2b5a1-c13d-47dd-8749-5677a2b32f3f`
- **Auth:** Bearer (company)
- **Status:** `200` ✅

**Payload:**

_— none —_

**Response:**

```json
{
  "success": true,
  "data": null,
  "message": "File deleted successfully"
}
```

---

