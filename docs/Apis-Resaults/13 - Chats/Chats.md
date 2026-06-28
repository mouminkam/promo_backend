# Chats — API Test Results

> Live responses captured against `http://localhost:3000/api/v1`. Base URL shown as `{{baseUrl}}`.

## 1. Start Chat

- **Method / Route:** `POST {{baseUrl}}/chats`
- **Auth:** Bearer (company)
- **Status:** `201` ✅

**Payload:**

```json
{
  "participant_id": "8481b89e-43c2-47c8-a90e-7823c516f926"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "room": {
      "id": "536ee510-7885-4b27-8014-d8f5cbb0f161",
      "type": "direct",
      "name": null,
      "created_at": "2026-06-28T18:17:19.242407+00:00",
      "last_message_at": "2026-06-28T18:17:19.242407+00:00"
    },
    "participant": {
      "id": "8481b89e-43c2-47c8-a90e-7823c516f926",
      "full_name": "Test Influencer",
      "avatar_url": null
    },
    "isNew": true
  },
  "message": "Chat created successfully"
}
```

---

## 2. Get Chat List

- **Method / Route:** `GET {{baseUrl}}/chats?page=1&limit=20`
- **Auth:** Bearer (company)
- **Status:** `200` ✅

**Payload:**

_— none —_

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "room": {
        "id": "536ee510-7885-4b27-8014-d8f5cbb0f161",
        "type": "direct",
        "name": null,
        "created_at": "2026-06-28T18:17:19.242407+00:00",
        "last_message_at": "2026-06-28T18:17:19.242407+00:00",
        "chat_participants": [
          {
            "profile_id": "3a909ef5-9f3f-427d-b530-f332d916418c",
            "last_read_at": "2026-06-28T18:17:19.39996+00:00"
          }
        ]
      },
      "otherParticipant": {
        "id": "8481b89e-43c2-47c8-a90e-7823c516f926",
        "full_name": "Test Influencer",
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
```

---

## 3. Send Message

- **Method / Route:** `POST {{baseUrl}}/chats/536ee510-7885-4b27-8014-d8f5cbb0f161/messages`
- **Auth:** Bearer (company)
- **Status:** `201` ✅

**Payload:**

```json
{
  "content": "Hello, is this offer still available?",
  "type": "text"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "e56b1860-7117-4ece-890f-14109518d342",
    "room_id": "536ee510-7885-4b27-8014-d8f5cbb0f161",
    "sender_id": "3a909ef5-9f3f-427d-b530-f332d916418c",
    "content": "Hello, is this offer still available?",
    "type": "text",
    "media_url": null,
    "is_read": false,
    "created_at": "2026-06-28T18:17:21.408049+00:00",
    "sender": {
      "id": "3a909ef5-9f3f-427d-b530-f332d916418c",
      "full_name": "Test Company",
      "avatar_url": "https://example.com/avatar.jpg"
    }
  },
  "message": "Message sent successfully"
}
```

---

## 4. Get Messages

- **Method / Route:** `GET {{baseUrl}}/chats/536ee510-7885-4b27-8014-d8f5cbb0f161/messages?page=1&limit=20`
- **Auth:** Bearer (company)
- **Status:** `200` ✅

**Payload:**

_— none —_

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "e56b1860-7117-4ece-890f-14109518d342",
      "room_id": "536ee510-7885-4b27-8014-d8f5cbb0f161",
      "sender_id": "3a909ef5-9f3f-427d-b530-f332d916418c",
      "content": "Hello, is this offer still available?",
      "type": "text",
      "media_url": null,
      "is_read": false,
      "created_at": "2026-06-28T18:17:21.408049+00:00",
      "sender": {
        "id": "3a909ef5-9f3f-427d-b530-f332d916418c",
        "full_name": "Test Company",
        "avatar_url": "https://example.com/avatar.jpg"
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
```

---

## 5. Mark as Read

- **Method / Route:** `PATCH {{baseUrl}}/chats/536ee510-7885-4b27-8014-d8f5cbb0f161/read`
- **Auth:** Bearer (influencer)
- **Status:** `200` ✅

**Payload:**

_— none —_

**Response:**

```json
{
  "success": true,
  "data": null,
  "message": "Messages marked as read"
}
```

---

## 6. Delete Chat

- **Method / Route:** `DELETE {{baseUrl}}/chats/536ee510-7885-4b27-8014-d8f5cbb0f161`
- **Auth:** Bearer (company)
- **Status:** `200` ✅

**Payload:**

_— none —_

**Response:**

```json
{
  "success": true,
  "data": null,
  "message": "Chat deleted successfully"
}
```

---

