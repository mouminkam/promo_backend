مبدايا نظام ال auth بكل ال apis الخاصة فيو مؤجل لحد ما يصير الفرونت

تاني شي ال profiles

{{baseUrl}}/profiles/me

{
"success": true,
"data": {
"id": "d39c9683-b572-4a77-affe-7f682dcab9a8",
"email": "moumen.kam.work@gmail.com",
"phone": null,
"full_name": "Moumin Alkamsheh",
"username": null,
"avatar_url": "https://mqklargyjispbcyxzdjo.supabase.co/storage/v1/object/public/general/d39c9683-b572-4a77-affe-7f682dcab9a8/215a3f95-8870-46c4-abda-e2c922d89c01.jpeg",
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
"stripe_customer_id": "cus_UjppknZHu0wNXt",
"is_admin": false,
"created_at": "2026-06-18T14:34:26.752305+00:00",
"updated_at": "2026-06-20T10:29:23.324668+00:00",
"is_active": true,
"categories": null
},
"message": "Profile retrieved successfully"
}

{{baseUrl}}/profiles/me

{
"full_name": "Updated Name",
"bio": "New bio"
}

{
"success": true,
"data": {
"id": "d39c9683-b572-4a77-affe-7f682dcab9a8",
"email": "moumen.kam.work@gmail.com",
"phone": null,
"full_name": "Updated Name",
"username": null,
"avatar_url": "https://mqklargyjispbcyxzdjo.supabase.co/storage/v1/object/public/general/d39c9683-b572-4a77-affe-7f682dcab9a8/215a3f95-8870-46c4-abda-e2c922d89c01.jpeg",
"cover_url": "https://example.com/cover.jpg",
"bio": "New bio",
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
"stripe_customer_id": "cus_UjppknZHu0wNXt",
"is_admin": false,
"created_at": "2026-06-18T14:34:26.752305+00:00",
"updated_at": "2026-06-22T14:09:48.093255+00:00",
"is_active": true
},
"message": "Profile updated successfully"
}

{{baseUrl}}/profiles/me/avatar

{
"avatar_url": "https://example.com/avatar.png"
}

{
"success": true,
"data": {
"id": "d39c9683-b572-4a77-affe-7f682dcab9a8",
"email": "moumen.kam.work@gmail.com",
"phone": null,
"full_name": "Updated Name",
"username": null,
"avatar_url": "https://example.com/avatar.png",
"cover_url": "https://example.com/cover.jpg",
"bio": "New bio",
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
"stripe_customer_id": "cus_UjppknZHu0wNXt",
"is_admin": false,
"created_at": "2026-06-18T14:34:26.752305+00:00",
"updated_at": "2026-06-22T14:28:00.538485+00:00",
"is_active": true
},
"message": "Avatar updated successfully"
}

{{baseUrl}}/profiles/me/cover

{
"cover_url": "https://example.com/cover.png"
}

{
"success": true,
"data": {
"id": "d39c9683-b572-4a77-affe-7f682dcab9a8",
"email": "moumen.kam.work@gmail.com",
"phone": null,
"full_name": "Updated Name",
"username": null,
"avatar_url": "https://example.com/avatar.png",
"cover_url": "https://example.com/cover.png",
"bio": "New bio",
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
"stripe_customer_id": "cus_UjppknZHu0wNXt",
"is_admin": false,
"created_at": "2026-06-18T14:34:26.752305+00:00",
"updated_at": "2026-06-22T14:28:17.047796+00:00",
"is_active": true
},
"message": "Cover updated successfully"
}

{{baseUrl}}/profiles/me/verify-request

{
"document_url": "https://example.com/doc.pdf",
"notes": "Please verify"
}

{
"success": true,
"data": null,
"message": "Verification requested successfully"
}

{{baseUrl}}/profiles/me شغال هاد بس ما برجب response لانو حذف

القسم ال 3 ال follows

{{baseUrl}}/follows/{{profileId}}

{
"success": true,
"data": null,
"message": "Successfully followed profile"
}

{{baseUrl}}/follows/{{profileId}}

{
"success": true,
"data": null,
"message": "Successfully unfollowed profile"
}

{{baseUrl}}/follows/{{profileId}}/status

{
"success": true,
"data": {
"isFollowing": true
},
"message": "Status retrieved successfully"
}

{{baseUrl}}/follows/followers/{{profileId}}?page=1&limit=20

{
"success": true,
"data": [
{
"created_at": "2026-06-22T14:52:45.137684+00:00",
"follower": {
"id": "2fe4e7b0-93c1-46cc-a6ea-42e173722b81",
"username": null,
"full_name": "Moumin Alkamsheh",
"avatar_url": null,
"account_type": "user"
}
}
],
"message": "Followers retrieved successfully",
"meta": {
"page": 1,
"limit": 20,
"total": 1,
"totalPages": 1
}
}

{{baseUrl}}/follows/following/{{profileId}}?page=1&limit=20

{
"success": true,
"data": [],
"message": "Following retrieved successfully",
"meta": {
"page": 1,
"limit": 20,
"total": 0,
"totalPages": 0
}
}

القسم الرابع offers

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
"title": "Sale",
"description": "50% off test test",
"offer_price": 50,
"original_price": 100,
"category_id": "20361ed2-ab58-427a-ad12-a8ace962b09f",
"start_date": "2026-06-22T18:00:00Z",
"end_date": "2026-12-31T00:00:00Z"
}

{
"success": true,
"data": {
"id": "d1c4b680-98b7-4c0a-a6d7-96c8203a94c0",
"profile_id": "2fe4e7b0-93c1-46cc-a6ea-42e173722b81",
"category_id": "20361ed2-ab58-427a-ad12-a8ace962b09f",
"title": "Sale",
"description": "50% off test test",
"original_price": 100,
"offer_price": 50,
"discount_percentage": null,
"media_urls": [],
"start_date": "2026-06-22T18:00:00+00:00",
"end_date": "2026-12-31T00:00:00+00:00",
"status": "active",
"is_featured": false,
"views_count": 0,
"created_at": "2026-06-22T15:06:21.613251+00:00",
"updated_at": "2026-06-22T15:06:21.613251+00:00",
"category": {
"id": "20361ed2-ab58-427a-ad12-a8ace962b09f",
"slug": "technology",
"name_ar": "تكنولوجيا",
"name_en": "Technology"
}
},
"message": "Offer created successfully"
}

{{baseUrl}}/offers/{{offerId}}

{
"title": "Updated Sale"
}

{
"success": true,
"data": {
"id": "d1c4b680-98b7-4c0a-a6d7-96c8203a94c0",
"profile_id": "2fe4e7b0-93c1-46cc-a6ea-42e173722b81",
"category_id": "20361ed2-ab58-427a-ad12-a8ace962b09f",
"title": "Updated Sale",
"description": "50% off test test",
"original_price": 100,
"offer_price": 50,
"discount_percentage": null,
"media_urls": [],
"start_date": "2026-06-22T18:00:00+00:00",
"end_date": "2026-12-31T00:00:00+00:00",
"status": "active",
"is_featured": false,
"views_count": 0,
"created_at": "2026-06-22T15:06:21.613251+00:00",
"updated_at": "2026-06-22T15:07:12.150382+00:00",
"category": {
"id": "20361ed2-ab58-427a-ad12-a8ace962b09f",
"slug": "technology",
"name_ar": "تكنولوجيا",
"name_en": "Technology"
}
},
"message": "Offer updated successfully"
}

{{baseUrl}}/offers/{{offerId}}/feature

{
"duration_days": 7
}

{
"success": true,
"data": {
"id": "d1c4b680-98b7-4c0a-a6d7-96c8203a94c0",
"profile_id": "2fe4e7b0-93c1-46cc-a6ea-42e173722b81",
"category_id": "20361ed2-ab58-427a-ad12-a8ace962b09f",
"title": "Updated Sale",
"description": "50% off test test",
"original_price": 100,
"offer_price": 50,
"discount_percentage": null,
"media_urls": [],
"start_date": "2026-06-22T18:00:00+00:00",
"end_date": "2026-12-31T00:00:00+00:00",
"status": "active",
"is_featured": true,
"views_count": 0,
"created_at": "2026-06-22T15:06:21.613251+00:00",
"updated_at": "2026-06-22T15:07:42.023256+00:00"
},
"message": "Offer featured successfully"
}

{{baseUrl}}/offers/profile/{{profileId}}?page=1&limit=20

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

{{baseUrl}}/offers/{{offerId}}

{
"success": true,
"data": {
"id": "d1c4b680-98b7-4c0a-a6d7-96c8203a94c0",
"profile_id": "2fe4e7b0-93c1-46cc-a6ea-42e173722b81",
"category_id": "20361ed2-ab58-427a-ad12-a8ace962b09f",
"title": "Updated Sale",
"description": "50% off test test",
"original_price": 100,
"offer_price": 50,
"discount_percentage": null,
"media_urls": [],
"start_date": "2026-06-22T18:00:00+00:00",
"end_date": "2026-12-31T00:00:00+00:00",
"status": "active",
"is_featured": true,
"views_count": 0,
"created_at": "2026-06-22T15:06:21.613251+00:00",
"updated_at": "2026-06-22T15:07:42.023256+00:00",
"profile": {
"id": "2fe4e7b0-93c1-46cc-a6ea-42e173722b81",
"location": null,
"username": null,
"full_name": "Moumin Alkamsheh",
"avatar_url": null
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

{{baseUrl}}/offers/{{offerId}}

{
"success": true,
"data": null,
"message": "Offer deleted successfully"
}

القسم الخامس ads

{{baseUrl}}/ads

{
"title": "New Banner Ad",
"description": "Promotional banner for summer campaign",
"media_url": "https://example.com/ad-banner.jpg",
"ad_type": "banner",
"target_url": "https://example.com",
"budget": 100,
"start_date": "2026-06-01T00:00:00.000Z",
"end_date": "2026-12-31T23:59:59.000Z"
}

{
"success": true,
"data": {
"id": "9a8c88c6-0813-41a6-9929-f934c6177cff",
"profile_id": "2fe4e7b0-93c1-46cc-a6ea-42e173722b81",
"title": "New Banner Ad",
"description": "Promotional banner for summer campaign",
"media_url": "https://example.com/ad-banner.jpg",
"ad_type": "banner",
"target_url": "https://example.com",
"budget": 100,
"spent": 0,
"start_date": "2026-06-01T00:00:00+00:00",
"end_date": "2026-12-31T23:59:59+00:00",
"status": "pending",
"impressions": 0,
"clicks": 0,
"created_at": "2026-06-22T15:20:12.113197+00:00",
"updated_at": "2026-06-22T15:20:12.113197+00:00"
},
"message": "Ad campaign created successfully. Waiting for activation/payment."
}

{{baseUrl}}/ads/{{adId}}

{
"title": "Updated Banner Ad",
"budget": 150
}

{
"success": true,
"data": {
"id": "9a8c88c6-0813-41a6-9929-f934c6177cff",
"profile_id": "2fe4e7b0-93c1-46cc-a6ea-42e173722b81",
"title": "Updated Banner Ad",
"description": "Promotional banner for summer campaign",
"media_url": "https://example.com/ad-banner.jpg",
"ad_type": "banner",
"target_url": "https://example.com",
"budget": 150,
"spent": 0,
"start_date": "2026-06-01T00:00:00+00:00",
"end_date": "2026-12-31T23:59:59+00:00",
"status": "pending",
"impressions": 0,
"clicks": 0,
"created_at": "2026-06-22T15:20:12.113197+00:00",
"updated_at": "2026-06-22T15:20:55.10282+00:00"
},
"message": "Ad campaign updated successfully"
}

{{baseUrl}}/ads/{{adId}}/click

{
"success": true,
"data": {
"clicks": 1,
"status": "active",
"targetUrl": "https://example.com"
},
"message": "Ad click recorded successfully"
}

{{baseUrl}}/ads/{{adId}}/impression

{
"success": true,
"data": {
"impressions": 1,
"status": "active"
},
"message": "Ad impression recorded successfully"
}

{{baseUrl}}/ads/active

{
"success": true,
"data": [
{
"id": "9a8c88c6-0813-41a6-9929-f934c6177cff",
"profile_id": "2fe4e7b0-93c1-46cc-a6ea-42e173722b81",
"title": "Updated Banner Ad",
"description": "Promotional banner for summer campaign",
"media_url": "https://example.com/ad-banner.jpg",
"ad_type": "banner",
"target_url": "https://example.com"
}
],
"message": "Active ads retrieved successfully"
}

{{baseUrl}}/ads/{{adId}}/toggle

{
"success": true,
"data": {
"id": "9a8c88c6-0813-41a6-9929-f934c6177cff",
"profile_id": "2fe4e7b0-93c1-46cc-a6ea-42e173722b81",
"title": "Updated Banner Ad",
"description": "Promotional banner for summer campaign",
"media_url": "https://example.com/ad-banner.jpg",
"ad_type": "banner",
"target_url": "https://example.com",
"budget": 150,
"spent": 0.11,
"start_date": "2026-06-01T00:00:00+00:00",
"end_date": "2026-12-31T23:59:59+00:00",
"status": "paused",
"impressions": 1,
"clicks": 1,
"created_at": "2026-06-22T15:20:12.113197+00:00",
"updated_at": "2026-06-22T15:30:30.593717+00:00"
},
"message": "Ad status toggled successfully to paused"
}

{{baseUrl}}/ads/{{adId}}/stats

{
"success": true,
"data": {
"impressions": 1,
"clicks": 1,
"budget": 150,
"spent": 0.11,
"status": "active",
"ctr": 100
},
"message": "Ad statistics retrieved successfully"
}

{{baseUrl}}/ads/profile/{{profileId}}?page=1&limit=20

{
"success": true,
"data": [
{
"id": "9a8c88c6-0813-41a6-9929-f934c6177cff",
"profile_id": "2fe4e7b0-93c1-46cc-a6ea-42e173722b81",
"title": "Updated Banner Ad",
"description": "Promotional banner for summer campaign",
"media_url": "https://example.com/ad-banner.jpg",
"ad_type": "banner",
"target_url": "https://example.com",
"budget": 150,
"spent": 0.11,
"start_date": "2026-06-01T00:00:00+00:00",
"end_date": "2026-12-31T23:59:59+00:00",
"status": "active",
"impressions": 1,
"clicks": 1,
"created_at": "2026-06-22T15:20:12.113197+00:00",
"updated_at": "2026-06-22T15:38:35.005483+00:00"
}
],
"message": "Profile ads campaigns retrieved successfully",
"meta": {
"page": 1,
"limit": 20,
"total": 1,
"totalPages": 1
}
}

المرحلة ال 6 ال subscriptions

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
"plan_id": "a951eaab-66db-4e58-a843-f08709741ec1",
"return_url": "http://localhost:3000/dashboard/billing"
}

{
"success": true,
"data": {
"url": "http://localhost:3000/dashboard/billing?success=true&session_id=mock_session_123"
},
"message": "Checkout session created successfully"
}

{{baseUrl}}/subscriptions/me

{
"success": true,
"data": null,
"message": "Subscription retrieved successfully"
}

{{baseUrl}}/subscriptions/manage

{
"return_url": "http://localhost:3000/dashboard/billing"
}

{
"success": true,
"data": {
"url": "https://billing.stripe.com/p/session/test_YWNjdF8xVGpQQ2c2MmFnOFNobTlSLF9Va2ZOY1hvclpyRnhOWlFOMWNwQXlLS1F3ZGZtY1A50100kyzSODlB"
},
"message": "Customer portal session created successfully"
}

القسم ال 7 ال chats

{{baseUrl}}/chats

{
"participant_id": "cad07724-3ca3-4468-827a-0ebb6e46a3f3"
}

{
"success": true,
"data": {
"room": {
"id": "fa30545b-18f2-44e5-9b4e-759cbff41509",
"type": "direct",
"name": null,
"created_at": "2026-06-22T16:22:24.447639+00:00",
"last_message_at": "2026-06-22T16:22:24.447639+00:00"
},
"participant": {
"id": "cad07724-3ca3-4468-827a-0ebb6e46a3f3",
"full_name": "Test User 2",
"avatar_url": null
},
"isNew": true
},
"message": "Chat created successfully"
}

{{baseUrl}}/chats/{{roomId}}/messages

{
"content": "Hello!",
"type": "text"
}

{
"success": true,
"data": {
"id": "3bd4458b-4f09-40c0-82b6-4406703d1bb9",
"room_id": "fa30545b-18f2-44e5-9b4e-759cbff41509",
"sender_id": "2fe4e7b0-93c1-46cc-a6ea-42e173722b81",
"content": "Hello!",
"type": "text",
"media_url": null,
"is_read": false,
"created_at": "2026-06-22T16:22:57.82125+00:00",
"sender": {
"id": "2fe4e7b0-93c1-46cc-a6ea-42e173722b81",
"full_name": "Moumin Alkamsheh",
"avatar_url": null
}
},
"message": "Message sent successfully"
}

{{baseUrl}}/chats/{{roomId}}/messages?page=1&limit=50

{
"success": true,
"data": [
{
"id": "3bd4458b-4f09-40c0-82b6-4406703d1bb9",
"room_id": "fa30545b-18f2-44e5-9b4e-759cbff41509",
"sender_id": "2fe4e7b0-93c1-46cc-a6ea-42e173722b81",
"content": "Hello!",
"type": "text",
"media_url": null,
"is_read": false,
"created_at": "2026-06-22T16:22:57.82125+00:00",
"sender": {
"id": "2fe4e7b0-93c1-46cc-a6ea-42e173722b81",
"full_name": "Moumin Alkamsheh",
"avatar_url": null
}
}
],
"message": "Messages retrieved",
"meta": {
"page": 1,
"limit": 50,
"total": 1,
"totalPages": 1
}
}

{{baseUrl}}/chats?page=1&limit=20

{
"success": true,
"data": [
{
"room": {
"id": "fa30545b-18f2-44e5-9b4e-759cbff41509",
"type": "direct",
"name": null,
"created_at": "2026-06-22T16:22:24.447639+00:00",
"last_message_at": "2026-06-22T16:22:57.82125+00:00"
},
"otherParticipant": {
"id": "cad07724-3ca3-4468-827a-0ebb6e46a3f3",
"full_name": "Test User 2",
"avatar_url": null
},
"lastMessage": {
"id": "3bd4458b-4f09-40c0-82b6-4406703d1bb9",
"content": "Hello!",
"type": "text",
"created_at": "2026-06-22T16:22:57.82125+00:00",
"sender_id": "2fe4e7b0-93c1-46cc-a6ea-42e173722b81"
},
"unreadCount": 0
},
{
"room": {
"id": "57de94db-fc2b-4343-9c2f-6ef4c120d4fe",
"type": "direct",
"name": null,
"created_at": "2026-06-20T13:00:04.339134+00:00",
"last_message_at": "2026-06-20T13:00:04.339134+00:00"
},
"otherParticipant": null,
"lastMessage": null,
"unreadCount": 0
}
],
"message": "Chats retrieved",
"meta": {
"page": 1,
"limit": 20,
"total": 2,
"totalPages": 1
}
}

{{baseUrl}}/chats/{{roomId}}/read

{
"success": true,
"data": null,
"message": "Messages marked as read"
}

{{baseUrl}}/chats/{{roomId}} - DELETE تم الحذف بس مافي response

القسم 8 الNotifications

{{baseUrl}}/notifications?page=1&limit=20

{
"success": true,
"data": [
{
"id": "d0dda8b7-cbe6-43cc-bf9e-95e183f2db12",
"profile_id": "2fe4e7b0-93c1-46cc-a6ea-42e173722b81",
"title": "Test Notification",
"body": "This is a test notification for you",
"type": "system",
"data": {},
"is_read": false,
"created_at": "2026-06-21T00:38:55.098107+00:00"
}
],
"message": "Notifications retrieved",
"meta": {
"page": 1,
"limit": 20,
"total": 1,
"totalPages": 1
}
}

{{baseUrl}}/notifications/read-all

{
"success": true,
"data": null,
"message": "All notifications marked as read"
}

{{baseUrl}}/notifications/{{notificationId}}/read

{
"success": true,
"data": null,
"message": "Notification marked as read"
}

{{baseUrl}}/notifications/token

{
"token": "FCM_TOKEN_HERE",
"device_type": "ios"
}

{
"success": true,
"data": null,
"message": "FCM token registered successfully"
}

{{baseUrl}}/notifications/{{notificationId}} - DELETE تم الحذف بس مافي response

القسم ال 9 General

{{baseUrl}}/health

{
"success": true,
"data": {
"status": "healthy",
"timestamp": "2026-06-22T16:31:05.347Z",
"uptime": 3266.4382789
},
"message": "Server is running"
}

{{baseUrl}}/search?q=test&type=all&page=1&limit=20

{
"success": true,
"data": {
"profiles": [
{
"id": "cad07724-3ca3-4468-827a-0ebb6e46a3f3",
"full_name": "Test User 2",
"username": null,
"avatar_url": null,
"bio": null,
"account_type": "user",
"is_verified": false,
"location": null
},
{
"id": "103bf040-a02b-47e9-8f82-e74825b7ef9e",
"full_name": "Test User 3",
"username": null,
"avatar_url": null,
"bio": null,
"account_type": "user",
"is_verified": false,
"location": null
},
{
"id": "bbf62469-896f-433c-8d1d-3561637cbe96",
"full_name": "Test User 4",
"username": null,
"avatar_url": null,
"bio": null,
"account_type": "user",
"is_verified": false,
"location": null
},
{
"id": "02c03982-bcb8-43af-bdab-4952c4b7602f",
"full_name": "Test User 5",
"username": null,
"avatar_url": null,
"bio": null,
"account_type": "user",
"is_verified": false,
"location": null
},
{
"id": "17c88df6-5081-4114-9b85-7f278d23894a",
"full_name": "Updated Name",
"username": "testuser",
"avatar_url": "https://example.com/avatar.png",
"bio": "New bio text here",
"account_type": "user",
"is_verified": false,
"location": null
}
],
"offers": [],
"ads": []
},
"message": "Search results retrieved"
}

{{baseUrl}}/categories

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

{{baseUrl}}/categories/{{categoryId}}/content?page=1&limit=20

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

{{baseUrl}}/featured?placement=home&page=1&limit=20

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
"duration_days": 7
}

{
"success": true,
"data": {
"url": "https://checkout.stripe.com/c/pay/cs_test_a1VYHaXNXyUnejbiAZKhBj8sPn8RJgvvXG4jG5UYaxV0OqJUElxgkWbWpU#fidnandhYHdWcXxpYCc%2FJ2FgY2RwaXEnKSdicGRmZGhqaWBTZHdsZGtxJz8nZmprcXdqaScpJ2R1bE5gfCc%2FJ3VuWnFgdnFaMDRRb1VGYjM3ZGI9Vm1oPFdnSElxcF9kNWlvQ0FpU0pnQlJrNEAwVWwzMnRQTU19fV9nMGlnSVJsYldLXEBCcTV%2FUH89ZmpjTkg1QmFuXzJuN3BgRG9kQVQ1NW1cUlFHTEdQJyknY3dqaFZgd3Ngdyc%2FcXdwYCknZ2RmbmJ3anBrYUZqaWp3Jz8nJmNjY2NjYycpJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl"
},
"message": "Featured checkout session created"
}

{{baseUrl}}/upload/image

{
    "success": true,
    "data": {
        "id": "54060fdf-a1ce-41c8-ae6e-f05a1f182ad9",
        "profile_id": "2fe4e7b0-93c1-46cc-a6ea-42e173722b81",
        "file_name": "1e22bdac-7b3c-4b4b-be43-67f57e49ea22.jpg",
        "file_url": "https://mqklargyjispbcyxzdjo.supabase.co/storage/v1/object/public/general/2fe4e7b0-93c1-46cc-a6ea-42e173722b81/1e22bdac-7b3c-4b4b-be43-67f57e49ea22.jpg",
        "file_type": "image/jpeg",
        "file_size": 42335,
        "related_to": "offer",
        "related_id": null,
        "created_at": "2026-06-22T16:35:48.710816+00:00"
    },
    "message": "Image uploaded successfully"
}

{{baseUrl}}/upload/video

{
    "success": true,
    "data": {
        "id": "0bb46303-29fb-4fef-863f-cfe28f4aa598",
        "profile_id": "2fe4e7b0-93c1-46cc-a6ea-42e173722b81",
        "file_name": "5e036a32-3e14-4015-9333-0ecd437aad07.mp4",
        "file_url": "https://mqklargyjispbcyxzdjo.supabase.co/storage/v1/object/public/general/2fe4e7b0-93c1-46cc-a6ea-42e173722b81/5e036a32-3e14-4015-9333-0ecd437aad07.mp4",
        "file_type": "video/mp4",
        "file_size": 1944374,
        "related_to": "offer",
        "related_id": null,
        "created_at": "2026-06-22T16:41:43.369902+00:00"
    },
    "message": "Video uploaded successfully"
}


{{baseUrl}}/upload/{{fileId}} تم الحذف بس مافي response


{{baseUrl}}/payments/history?page=1&limit=20

{
    "success": true,
    "data": [],
    "message": "Payments retrieved",
    "meta": {
        "page": 1,
        "limit": 20,
        "total": 0,
        "totalPages": 0
    }
}

{{baseUrl}}/payments/portal

{
    "success": true,
    "data": {
        "url": "https://billing.stripe.com/p/session/test_YWNjdF8xVGpQQ2c2MmFnOFNobTlSLF9Va2dRM1lBY2ZZUFdnTXBNQWtMVzRqRlc4TE5sczZN0100Vz3i7bfc"
    },
    "message": "Portal session created"
}



{{baseUrl}}/payments/{{paymentId}}

{
    "success": true,
    "data": {
        "id": "125cab06-1b39-4621-9162-7dba28902f5d",
        "profile_id": "2fe4e7b0-93c1-46cc-a6ea-42e173722b81",
        "stripe_payment_id": "pi_mock_345303bf",
        "amount": 150,
        "currency": "usd",
        "type": "featured",
        "status": "succeeded",
        "metadata": {
            "placement": "home",
            "duration_days": "7"
        },
        "created_at": "2026-06-22T16:55:23.310004+00:00"
    },
    "message": "Payment details retrieved"
}

{{baseUrl}}/webhooks/stripe هاد جربتو مع اداة Stripe CLI ومشي حالو 

القسم ال 10 قسم ال reports

{{baseUrl}}/reports

{
  "reported_id": "02c03982-bcb8-43af-bdab-4952c4b7602f",
  "reported_type": "profile",
  "reason": "spam content",
  "details": "Optional additional details about the report"
}

{
    "success": true,
    "data": {
        "id": "358386fb-cdd0-4a82-bde2-3213570524cb",
        "reporter_id": "2fe4e7b0-93c1-46cc-a6ea-42e173722b81",
        "reported_id": "02c03982-bcb8-43af-bdab-4952c4b7602f",
        "reported_type": "profile",
        "reason": "spam content",
        "details": "Optional additional details about the report",
        "status": "pending",
        "admin_note": null,
        "created_at": "2026-06-22T17:00:34.715249+00:00",
        "resolved_at": null
    },
    "message": "Report submitted successfully"
}

{{baseUrl}}/reports/me?page=1&limit=20

{
    "success": true,
    "data": [
        {
            "id": "358386fb-cdd0-4a82-bde2-3213570524cb",
            "reporter_id": "2fe4e7b0-93c1-46cc-a6ea-42e173722b81",
            "reported_id": "02c03982-bcb8-43af-bdab-4952c4b7602f",
            "reported_type": "profile",
            "reason": "spam content",
            "details": "Optional additional details about the report",
            "status": "pending",
            "admin_note": null,
            "created_at": "2026-06-22T17:00:34.715249+00:00",
            "resolved_at": null
        }
    ],
    "message": "Reports retrieved",
    "meta": {
        "page": 1,
        "limit": 20,
        "total": 1,
        "totalPages": 1
    }
}

القسم ال 11 قسم ال admin 

{{baseUrl}}/admin/stats

{
    "success": true,
    "data": {
        "totalUsers": 6,
        "activeAds": 0,
        "pendingReports": 4,
        "totalRevenue": 150
    },
    "message": "Global statistics retrieved successfully"
}

{{baseUrl}}/admin/categories


{
  "name_en": "meow",
  "name_ar": "مياو",
  "icon_url": "https://example.com/icons/tech.png"
}



{
    "success": true,
    "data": {
        "id": "22bb31f1-7601-4867-a2f4-d98532055217",
        "name_ar": "مياو",
        "name_en": "meow",
        "slug": "meow",
        "icon_url": "https://example.com/icons/tech.png",
        "parent_id": null,
        "sort_order": 0,
        "is_active": true,
        "created_at": "2026-06-22T17:13:13.154612+00:00",
        "updated_at": "2026-06-22T17:13:13.154612+00:00"
    },
    "message": "Category created successfully"
}

{{baseUrl}}/admin/categories/{{categoryId}}

{
  "name_en": "Tech & Innovation"
}

{
    "success": true,
    "data": {
        "id": "22bb31f1-7601-4867-a2f4-d98532055217",
        "name_ar": "مياو",
        "name_en": "Tech & Innovation",
        "slug": "meow",
        "icon_url": "https://example.com/icons/tech.png",
        "parent_id": null,
        "sort_order": 0,
        "is_active": true,
        "created_at": "2026-06-22T17:13:13.154612+00:00",
        "updated_at": "2026-06-22T17:13:45.874497+00:00"
    },
    "message": "Category updated successfully"
}

{{baseUrl}}/admin/categories/{{categoryId}}

{
    "success": true,
    "data": null,
    "message": "Category deleted successfully"
}

{{baseUrl}}/admin/content/offers/{{offerId}}/status

{
  "status": "active"
}

{
    "success": true,
    "data": {
        "id": "adbdca0f-c9af-4735-9c55-0b861f1cd8ca",
        "profile_id": "2fe4e7b0-93c1-46cc-a6ea-42e173722b81",
        "category_id": "20361ed2-ab58-427a-ad12-a8ace962b09f",
        "title": "Summer Sale",
        "description": "This is a detailed description of the summer sale offer.",
        "original_price": 100,
        "offer_price": 50,
        "discount_percentage": 50,
        "media_urls": [
            "https://example.com/offer.jpg"
        ],
        "start_date": "2026-06-01T00:00:00+00:00",
        "end_date": "2026-12-31T23:59:59+00:00",
        "status": "active",
        "is_featured": false,
        "views_count": 0,
        "created_at": "2026-06-22T17:15:11.411495+00:00",
        "updated_at": "2026-06-22T17:17:29.661204+00:00"
    },
    "message": "Offer status updated to active"
}


{{baseUrl}}/admin/content/offers/{{offerId}}

{
    "success": true,
    "data": null,
    "message": "Offer deleted successfully"
}

{{baseUrl}}/admin/content/ads/{{adId}}/status

{
  "status": "active"
}

{
    "success": true,
    "data": {
        "id": "9a8c88c6-0813-41a6-9929-f934c6177cff",
        "profile_id": "2fe4e7b0-93c1-46cc-a6ea-42e173722b81",
        "title": "Updated Banner Ad",
        "description": "Promotional banner for summer campaign",
        "media_url": "https://example.com/ad-banner.jpg",
        "ad_type": "banner",
        "target_url": "https://example.com",
        "budget": 150,
        "spent": 0.11,
        "start_date": "2026-06-01T00:00:00+00:00",
        "end_date": "2026-12-31T23:59:59+00:00",
        "status": "active",
        "impressions": 1,
        "clicks": 1,
        "created_at": "2026-06-22T15:20:12.113197+00:00",
        "updated_at": "2026-06-22T17:20:10.433318+00:00"
    },
    "message": "Ad status updated to active"
}

{{baseUrl}}/admin/content/ads/{{adId}}

{
    "success": true,
    "data": null,
    "message": "Ad deleted successfully"
}


{{baseUrl}}/admin/plans


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
    "message": "Subscription plans retrieved successfully"
}

{{baseUrl}}/admin/plans

{
  "stripe_price_id": "price_1234567890",
  "name_en": "Pro Plan",
  "name_ar": "الخطة الاحترافية",
  "description_en": "Full access to all features for professionals",
  "description_ar": "وصول كامل لجميع الميزات للمحترفين",
  "price": 9.99,
  "currency": "usd",
  "interval": "monthly",
  "features_en": [
    "Unlimited offers",
    "Priority support",
    "Analytics dashboard"
  ],
  "features_ar": [
    "إضافة عروض غير محدودة",
    "دعم فني بأولوية عالية",
    "لوحة تحكم إحصائيات"
  ],
  "is_active": true
}


{
    "success": true,
    "data": {
        "id": "764f0575-2764-4703-ad24-c581110fdd9a",
        "name_ar": "الخطة الاحترافية",
        "name_en": "Pro Plan",
        "description_ar": "وصول كامل لجميع الميزات للمحترفين",
        "description_en": "Full access to all features for professionals",
        "price": 9.99,
        "interval": "monthly",
        "features_en": [
            "Unlimited offers",
            "Priority support",
            "Analytics dashboard"
        ],
        "stripe_price_id": "price_1234567890",
        "is_active": true,
        "sort_order": 0,
        "created_at": "2026-06-22T18:13:40.882443+00:00",
        "updated_at": "2026-06-22T18:13:40.882443+00:00",
        "currency": "usd",
        "features_ar": [
            "إضافة عروض غير محدودة",
            "دعم فني بأولوية عالية",
            "لوحة تحكم إحصائيات"
        ]
    },
    "message": "Subscription plan created successfully"
}


{{baseUrl}}/admin/plans/{{planId}}


{
  "is_active": false
}

{
    "success": true,
    "data": {
        "id": "764f0575-2764-4703-ad24-c581110fdd9a",
        "name_ar": "الخطة الاحترافية",
        "name_en": "Pro Plan",
        "description_ar": "وصول كامل لجميع الميزات للمحترفين",
        "description_en": "Full access to all features for professionals",
        "price": 9.99,
        "interval": "monthly",
        "features_en": [],
        "stripe_price_id": "price_1234567890",
        "is_active": false,
        "sort_order": 0,
        "created_at": "2026-06-22T18:13:40.882443+00:00",
        "updated_at": "2026-06-22T18:15:11.342703+00:00",
        "currency": "usd",
        "features_ar": []
    },
    "message": "Subscription plan updated successfully"
}


{{baseUrl}}/admin/plans/{{planId}}

{
    "success": true,
    "data": null,
    "message": "Subscription plan deleted successfully"
}


{{baseUrl}}/admin/users?page=1&limit=20

{
    "success": true,
    "data": [
        {
            "id": "02c03982-bcb8-43af-bdab-4952c4b7602f",
            "email": "test5@example.com",
            "phone": null,
            "full_name": "Test User 5",
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
            "created_at": "2026-06-22T14:47:48.171958+00:00",
            "updated_at": "2026-06-22T14:47:48.171958+00:00",
            "is_active": true
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
            "updated_at": "2026-06-22T14:47:47.783332+00:00",
            "is_active": true
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
            "is_active": true
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
            "stripe_customer_id": null,
            "is_admin": false,
            "created_at": "2026-06-22T14:47:47.131094+00:00",
            "updated_at": "2026-06-22T14:47:47.131094+00:00",
            "is_active": true
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
            "is_active": true
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
            "stripe_customer_id": "cus_UkfMqd8NDT4Hxk",
            "is_admin": true,
            "created_at": "2026-06-18T13:17:21.88733+00:00",
            "updated_at": "2026-06-22T17:02:21.018495+00:00",
            "is_active": true
        }
    ],
    "message": "Users retrieved",
    "meta": {
        "page": 1,
        "limit": 20,
        "total": 6,
        "totalPages": 1
    }
}

{{baseUrl}}/admin/users/{{userId}}

{
    "success": true,
    "data": {
        "id": "02c03982-bcb8-43af-bdab-4952c4b7602f",
        "email": "test5@example.com",
        "phone": null,
        "full_name": "Test User 5",
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
        "created_at": "2026-06-22T14:47:48.171958+00:00",
        "updated_at": "2026-06-22T14:47:48.171958+00:00",
        "is_active": true
    },
    "message": "User details retrieved"
}

{{baseUrl}}/admin/users/{{userId}}/ban

{
  "isActive": false
}

{
    "success": true,
    "data": {
        "id": "02c03982-bcb8-43af-bdab-4952c4b7602f",
        "email": "test5@example.com",
        "phone": null,
        "full_name": "Test User 5",
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
        "created_at": "2026-06-22T14:47:48.171958+00:00",
        "updated_at": "2026-06-22T18:17:26.147992+00:00",
        "is_active": false
    },
    "message": "User status updated to banned"
}

{{baseUrl}}/admin/users/{{userId}}/verify

{
  "isVerified": true
}

{
    "success": true,
    "data": {
        "id": "02c03982-bcb8-43af-bdab-4952c4b7602f",
        "email": "test5@example.com",
        "phone": null,
        "full_name": "Test User 5",
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
        "stripe_customer_id": null,
        "is_admin": false,
        "created_at": "2026-06-22T14:47:48.171958+00:00",
        "updated_at": "2026-06-22T18:17:55.090312+00:00",
        "is_active": false
    },
    "message": "User verification status updated to true"
}



{{baseUrl}}/admin/users/{{userId}}

{
    "success": true,
    "data": null,
    "message": "User deleted permanently"
}

{{baseUrl}}/admin/reports?page=1&limit=20

{
    "success": true,
    "data": [
        {
            "id": "358386fb-cdd0-4a82-bde2-3213570524cb",
            "reporter_id": "2fe4e7b0-93c1-46cc-a6ea-42e173722b81",
            "reported_id": "02c03982-bcb8-43af-bdab-4952c4b7602f",
            "reported_type": "profile",
            "reason": "spam content",
            "details": "Optional additional details about the report",
            "status": "pending",
            "admin_note": null,
            "created_at": "2026-06-22T17:00:34.715249+00:00",
            "resolved_at": null,
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
        "total": 4,
        "totalPages": 1
    }
}

{{baseUrl}}/admin/reports/{{reportId}}/status

{
    "success": true,
    "data": {
        "id": "358386fb-cdd0-4a82-bde2-3213570524cb",
        "reporter_id": "2fe4e7b0-93c1-46cc-a6ea-42e173722b81",
        "reported_id": "02c03982-bcb8-43af-bdab-4952c4b7602f",
        "reported_type": "profile",
        "reason": "spam content",
        "details": "Optional additional details about the report",
        "status": "resolved",
        "admin_note": "Issue has been addressed",
        "created_at": "2026-06-22T17:00:34.715249+00:00",
        "resolved_at": "2026-06-22T18:22:17.247+00:00"
    },
    "message": "Report status updated to resolved"
}

{{baseUrl}}/admin/payments?page=1&limit=20

{
    "success": true,
    "data": [
        {
            "id": "125cab06-1b39-4621-9162-7dba28902f5d",
            "profile_id": "2fe4e7b0-93c1-46cc-a6ea-42e173722b81",
            "stripe_payment_id": "pi_mock_345303bf",
            "amount": 150,
            "currency": "usd",
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
                "account_type": "user"
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

