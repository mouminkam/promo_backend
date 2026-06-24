# Promoo Realtime Chat — Flutter Implementation Guide

This document outlines how to integrate the real-time chat functionality in the Flutter app using Supabase Realtime WebSocket connections.

## 1. Setup Supabase Client
Ensure you have the `supabase_flutter` package installed. Initialize your Supabase client with the URL and Anon Key.

```dart
import 'package:supabase_flutter/supabase_flutter.dart';

void main() async {
  await Supabase.initialize(
    url: 'YOUR_SUPABASE_URL',
    anonKey: 'YOUR_SUPABASE_ANON_KEY',
  );
  runApp(MyApp());
}

final supabase = Supabase.instance.client;
```

## 2. Realtime Architecture
The chat system relies on the `messages` table. When a user sends a message via the REST API (`POST /chat/:roomId/messages`), it gets inserted into the database. Supabase Realtime broadcasts this insertion to anyone subscribed to that specific room.

- **Table**: `messages`
- **Channel Name Pattern**: `public:messages:room_id=eq.{YOUR_ROOM_ID}`
- **Event**: `INSERT`

## 3. Subscribing to Messages
When a user opens a chat room, subscribe to changes on the `messages` table filtered by the current `room_id`.

```dart
RealtimeChannel? _chatSubscription;

void subscribeToRoom(String roomId) {
  _chatSubscription = supabase
      .channel('public:messages:room_id=eq.$roomId')
      .onPostgresChanges(
        event: PostgresChangeEvent.insert,
        schema: 'public',
        table: 'messages',
        filter: PostgresChangeFilter(
          type: PostgresChangeFilterType.eq,
          column: 'room_id',
          value: roomId,
        ),
        callback: (PostgresChangePayload payload) {
          final newMessage = payload.newRecord;
          print('New message received: ${newMessage['content']}');
          
          // Add this new message to your UI list
          // setState(() { messages.add(newMessage); });
        },
      )
      .subscribe();
}
```

## 4. Sending Messages
Always send messages through the Promoo REST API (not directly via Supabase client insert) to ensure backend business logic and notifications are triggered.

```dart
import 'package:http/http.dart' as http;

Future<void> sendMessage(String roomId, String content) async {
  final url = Uri.parse('YOUR_BACKEND_URL/chat/$roomId/messages');
  
  final response = await http.post(
    url,
    headers: {
      'Authorization': 'Bearer YOUR_AUTH_TOKEN',
      'Content-Type': 'application/json',
    },
    body: jsonEncode({
      'content': content,
      'type': 'text', // or 'image', 'video', 'file'
      // 'media_url': 'url_if_applicable'
    }),
  );

  if (response.statusCode == 201) {
    // Message sent! 
    // You DO NOT need to add it manually to the UI if your realtime subscription catches it.
    // However, for better UX (optimistic UI), you can display it immediately.
  }
}
```

## 5. Cleaning Up (Unsubscribing)
Always unsubscribe from the channel when the user leaves the chat screen to avoid memory leaks and duplicate listeners.

```dart
@override
void dispose() {
  _chatSubscription?.unsubscribe();
  super.dispose();
}
```

## 6. Typing Indicators (Optional)
If you wish to add typing indicators, you can use Supabase Presence or Broadcast on the same channel:

```dart
// Sending typing event
_chatSubscription?.sendBroadcastMessage(
  event: 'typing',
  payload: {'userId': myUserId, 'isTyping': true},
);

// Receiving typing event
_chatSubscription?.onBroadcast(
  event: 'typing',
  callback: (payload) {
    print('User is typing: ${payload['isTyping']}');
  },
);
```
