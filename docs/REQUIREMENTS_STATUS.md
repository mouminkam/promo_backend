# Promoo Backend — Requirements Status
> تتبع دقيق لكل متطلبات التطبيق: ما نُفِّذ، ما تبقى، وكيف يعمل اللوجيك لكل ميزة.
> آخر تحديث: 2026-06-25 | الوضع الحالي: Backend + Database مكتملان ومقفلان نهائياً ✅ — جاهزان للربط مع Flutter

---

## الأيقونات المستخدمة
| أيقونة | المعنى |
|--------|--------|
| ✅ | مُنفَّذ بالكامل |
| 🔄 | مُنفَّذ جزئياً |
| ⬜ | لم يُبدأ بعد |
| ⚠️ | مُنفَّذ لكن يحتاج تحسين |

---

## 1. تسجيل وإنشاء الحسابات ✅

**الحالة**: مُنفَّذ بالكامل — Phase 2

### المتطلب
تسجيل حساب جديد لأي من الأنواع الأربعة: شركة، مؤثر، مقدم خدمة، مستخدم عادي.

### كيف نُفِّذ
- **الملفات**: `src/services/auth.service.ts` → `src/controllers/auth.controller.ts` → `src/routes/auth.routes.ts`
- **نقطة النهاية**: `POST /api/v1/auth/register/email` و `POST /api/v1/auth/register/phone`
- **اللوجيك**:
  1. المستخدم يرسل (email أو phone) + password + fullName + accountType
  2. يتم التحقق من البيانات عبر Zod Validator
  3. يُستدعى `supabaseAdmin.auth.signUp()` لإنشاء المستخدم في Supabase Auth
  4. Supabase يُطلق Database Trigger تلقائياً يُنشئ سجل في جدول `profiles`
  5. يُرجع رمز JWT للمستخدم
- **أنواع الحسابات**: مُعرَّفة في `src/types/enums.ts` كـ enum: `company | influencer | service_provider | user`

---

## 2. تسجيل الدخول بالبريد أو الهاتف ✅

**الحالة**: مُنفَّذ بالكامل — Phase 2

### المتطلب
تسجيل الدخول باستخدام البريد الإلكتروني أو رقم الهاتف + كلمة المرور.

### كيف نُفِّذ
- **نقاط النهاية**: `POST /api/v1/auth/login/email` و `POST /api/v1/auth/login/phone`
- **اللوجيك**:
  1. يُرسل المستخدم بيانات الدخول
  2. `supabaseAdmin.auth.signInWithPassword()` تتحقق من الهوية
  3. يُرجع `access_token` + `refresh_token`
  4. كل الطلبات التالية تُرسل الـ token في `Authorization: Bearer <token>`
  5. middleware `auth.middleware.ts` يتحقق من الـ token في كل route محمية

---

## 3. تسجيل الدخول بـ Google وApple ✅

**الحالة**: مُنفَّذ — Phase 2

### المتطلب
OAuth عبر Google وApple.

### كيف نُفِّذ
- **نقطة النهاية**: `POST /api/v1/auth/login/oauth`
- **اللوجيك**:
  1. تطبيق الموبايل (React Native) يستخدم Supabase SDK لإطلاق OAuth Flow مباشرة
  2. بعد نجاح OAuth، Supabase يُرجع token جاهز
  3. الـ Backend يستقبل طلب التحقق من الـ token `POST /api/v1/auth/verify`
  4. يُتحقق من صحته ويُرجع بيانات المستخدم
- **ملاحظة**: Google/Apple OAuth يُدار في Supabase Dashboard مباشرة، لا يحتاج كود إضافي في الـ Backend

---

## 4. التحقق عبر OTP ✅

**الحالة**: مُنفَّذ — Phase 2

### المتطلب
إرسال رمز OTP للهاتف أو البريد والتحقق منه.

### كيف نُفِّذ
- **نقاط النهاية**: `POST /api/v1/auth/otp/send` و `POST /api/v1/auth/otp/verify`
- **اللوجيك**:
  1. `supabase.auth.signInWithOtp()` يُرسل OTP عبر SMS أو Email
  2. المستخدم يُرسل الكود المستلم + الهاتف/الإيميل
  3. `supabase.auth.verifyOtp()` يتحقق ويُرجع session

---

## 5. الملفات الشخصية (Profiles) ✅

**الحالة**: مُنفَّذ بالكامل — Phase 3

### المتطلب
ملف شخصي متكامل لكل نوع حساب مع إمكانية التعديل والعرض العام.

### كيف نُفِّذ
- **الملفات**: `src/services/profile.service.ts` → `src/controllers/profile.controller.ts`
- **الجدول**: `profiles` (migration 001)
- **الحقول**: id, full_name, username, bio, avatar_url, cover_url, account_type, website, location, is_verified, is_active, stripe_customer_id, ...
- **نقاط النهاية**:
  - `GET /api/v1/profiles/me` — عرض ملفي الشخصي
  - `PUT /api/v1/profiles/me` — تحديث ملفي
  - `GET /api/v1/profiles/:id` — عرض ملف عام بالـ ID
  - `POST /api/v1/profiles/me/avatar` — رفع صورة شخصية
  - `POST /api/v1/profiles/me/cover` — رفع صورة غلاف
  - `POST /api/v1/profiles/me/verify-request` — طلب التوثيق
  - `DELETE /api/v1/profiles/me` — حذف الحساب
- **اللوجيك الأساسي**:
  - الملف الشخصي يُنشأ تلقائياً عبر Trigger في Supabase عند التسجيل
  - RLS تضمن أن كل مستخدم يرى فقط بياناته الخاصة ما عدا البيانات العامة
  - `account_type` يحدد نوع الحساب ويُستخدم لفلترة المحتوى لاحقاً

---

## 6. نظام المتابعة (Follow System) ✅

**الحالة**: مُنفَّذ بالكامل — Phase 4

### المتطلب
متابعة وإلغاء متابعة الحسابات، وعرض قوائم المتابعين والمتابَعين.

### كيف نُفِّذ
- **الجدول**: `follows` (migration 003)
- **نقاط النهاية**:
  - `POST /api/v1/follows/:profileId` — متابعة حساب
  - `DELETE /api/v1/follows/:profileId` — إلغاء المتابعة
  - `GET /api/v1/profiles/:id/followers` — قائمة المتابعين (مع pagination)
  - `GET /api/v1/profiles/:id/following` — قائمة المتابَعين (مع pagination)
  - `GET /api/v1/follows/:profileId/status` — هل أنا أتابعه؟
- **اللوجيك**:
  - لا يمكن متابعة نفسك (validation في الـ service)
  - لا يمكن المتابعة مرتين (UNIQUE constraint في DB)
  - الـ followers/following count مُحسوبة في وقت الطلب بـ JOIN

---

## 7. نظام العروض (Offers) ✅

**الحالة**: مُنفَّذ بالكامل — Phase 5

### المتطلب
إنشاء عروض خدمات، وعرضها وتصفيتها وتعديلها وحذفها.

### كيف نُفِّذ
- **الجدول**: `offers` (migration 004)
- **نقاط النهاية**:
  - `POST /api/v1/offers` — إنشاء عرض
  - `PUT /api/v1/offers/:id` — تعديل عرض
  - `DELETE /api/v1/offers/:id` — حذف عرض (صاحبه فقط)
  - `GET /api/v1/offers/:id` — تفاصيل عرض + زيادة views_count
  - `GET /api/v1/offers` — قائمة العروض مع فلاتر (category, price range, location) + pagination
  - `GET /api/v1/profiles/:id/offers` — عروض مستخدم معين
- **اللوجيك**:
  - عند فتح تفاصيل عرض: يُزاد `views_count` تلقائياً
  - الفلترة: حسب category_id, min_price, max_price, location, account_type
  - التحقق من الملكية: فقط صاحب العرض يقدر يعدل أو يحذف

---

## 8. نظام الإعلانات (Ads) ✅

**الحالة**: مُنفَّذ بالكامل — Phase 5

### المتطلب
إنشاء إعلانات مع تتبع الانطباعات والنقرات وإدارة الحالة.

### كيف نُفِّذ
- **الجدول**: `ads` (migration 004)
- **نقاط النهاية**:
  - `POST /api/v1/ads` — إنشاء إعلان
  - `PUT /api/v1/ads/:id` — تعديل إعلان
  - `PATCH /api/v1/ads/:id/toggle` — تفعيل/إيقاف الإعلان
  - `GET /api/v1/ads/:id/stats` — إحصائيات (impressions, clicks, CTR)
  - `POST /api/v1/ads/:id/impression` — تسجيل ظهور (من التطبيق)
  - `POST /api/v1/ads/:id/click` — تسجيل نقرة (من التطبيق)
- **اللوجيك**:
  - `impressions_count` و `clicks_count` تُزاد مباشرة في DB عند كل طلب
  - CTR = (clicks / impressions) × 100 — مُحسوب في الـ service
  - الإعلان له status: active/paused/expired

---

## 9. نظام الاشتراكات والباقات (Subscriptions) ✅

**الحالة**: مُنفَّذ بالكامل — Phase 6

### المتطلب
باقات اشتراك مدفوعة عبر Stripe مع إدارة الاشتراكات.

### كيف نُفِّذ
- **الجداول**: `subscription_plans` + `subscriptions` (migration 005)
- **الملفات**: `stripe.service.ts` + `subscription.service.ts`
- **نقاط النهاية**:
  - `GET /api/v1/subscriptions/plans` — عرض الباقات المتاحة (عام)
  - `POST /api/v1/subscriptions` — إنشاء Checkout Session للدفع
  - `GET /api/v1/subscriptions/me` — اشتراكي الحالي
  - `POST /api/v1/subscriptions/manage` — بوابة Stripe لإلغاء/ترقية
  - `POST /api/v1/webhooks/stripe` — Webhook لاستقبال أحداث Stripe
- **اللوجيك**:
  1. المستخدم يختار باقة → Backend ينشئ Stripe Checkout Session
  2. المستخدم يدفع في صفحة Stripe
  3. Stripe يُرسل webhook → Backend يُحدِّث جدول `subscriptions`
  4. الإلغاء/الترقية يتم عبر Stripe Customer Portal (لا كود مخصص)
  5. كل تغيير في Stripe يُزامَن تلقائياً عبر Webhook

---

## 10. نظام المحادثات (Chat) ✅

**الحالة**: مُنفَّذ بالكامل — Phase 7

### المتطلب
محادثات مباشرة 1-to-1 بين المستخدمين داخل التطبيق.

### كيف نُفِّذ
- **الجداول**: `chat_rooms` + `chat_participants` + `messages` (migration 006)
- **الملفات**: `chat.service.ts` + `chat.controller.ts`
- **نقاط النهاية**:
  - `POST /api/v1/chats` — بدء محادثة أو فتح محادثة موجودة
  - `POST /api/v1/chats/:roomId/messages` — إرسال رسالة
  - `GET /api/v1/chats/:roomId/messages` — قراءة الرسائل (مع pagination)
  - `GET /api/v1/chats` — قائمة محادثاتي (مع آخر رسالة وعدد غير المقروء)
  - `PATCH /api/v1/chats/:roomId/read` — تحديد الرسائل كمقروءة
  - `DELETE /api/v1/chats/:roomId` — حذف محادثة
- **اللوجيك**:
  1. عند `POST /chats`: يتحقق هل توجد غرفة مشتركة بين المستخدمَين → يعيدها إذا وُجدت
  2. الغرف الجديدة تُنشأ مع إضافة المشاركَين في `chat_participants`
  3. عند حذف محادثة: يُزيل المستخدم من `chat_participants` فقط، لا يحذف الغرفة كلها
  4. إذا لم يتبق أي مشارك → تُحذف الغرفة تلقائياً
  5. عدد الرسائل غير المقروءة = رسائل بعد `last_read_at` من المشارك الآخر
- **Realtime**: الـ Backend جاهز للـ Realtime — التطبيق يتصل مباشرة بـ Supabase Realtime عبر SDK

---

## 11. نظام الإشعارات الفورية (Push Notifications) ✅

**الحالة**: مُنفَّذ بالكامل — Phase 8

### المتطلب
إشعارات فورية عبر FCM + سجلات إشعارات داخل التطبيق.

### ما تم تجهيزه مسبقاً
- **الجداول جاهزة**: `notifications` + `fcm_tokens` (migration 007)
- **Firebase Config**: `src/config/firebase.ts` جاهز
- **ما ينقص**:
  - `notification.service.ts` — منطق إرسال الإشعارات
  - `notification.controller.ts`
  - `notification.routes.ts`
  - نقاط النهاية: GET, PATCH read, DELETE, POST token
  - إرسال FCM عند حدث معين (رسالة جديدة، متابعة جديدة، إلخ)

---

## 12. رفع الصور والفيديوهات والمرفقات (File Upload) ✅

**الحالة**: مُنفَّذ بالكامل — Phase 9

### المتطلب
رفع الملفات (صور، فيديو، مرفقات) وتخزينها وإدارتها.

### ما تم تجهيزه مسبقاً
- **Supabase Storage**: مُجهَّز في الـ config
- **Buckets المخططة**: avatars, covers, offers, ads, chat-media
- **الجداول**: `media` (migration 008)
- **ما ينقص**:
  - `upload.middleware.ts` — Multer config
  - `upload.service.ts` — رفع لـ Supabase Storage
  - `upload.controller.ts` + `upload.routes.ts`
  - نقاط النهاية: POST /upload/image, /upload/video, /upload/file
  - حدود الأحجام: صورة 5MB، فيديو 50MB، مرفق 10MB

---

## 13. البحث والتصنيفات (Search & Categories) ✅

**الحالة**: مُنفَّذ بالكامل — Phase 9

### المتطلب
بحث عام بكلمة مفتاحية وتصفية حسب التصنيفات.

### ما تم تجهيزه مسبقاً
- **الجداول**: `categories` (migration 002) — التصنيفات جاهزة مع Seed data
- **ما ينقص**:
  - `search.service.ts` — بحث في profiles, offers, ads
  - `category.service.ts` — قائمة التصنيفات ومحتواها
  - نقاط النهاية: GET /search?q=&type=, GET /categories, GET /categories/:id/content

---

## 14. الحسابات المميزة والظهور المدفوع (Featured) ✅

**الحالة**: مُنفَّذ بالكامل — Phase 10

### المتطلب
دفع مقابل ظهور مميز في البحث أو الصفحة الرئيسية.

### ما تم تجهيزه مسبقاً
- **الجداول**: `featured_listings` (migration 009)
- **ما ينقص**:
  - `payment.service.ts` — دفعة مباشرة عبر Stripe PaymentIntent
  - منطق الظهور المميز: الحسابات/العروض المميزة تُعطى أولوية في نتائج البحث
  - نقاط النهاية: POST /featured, GET /featured

---

## 15. إدارة المدفوعات (Payments) ✅

**الحالة**: مُنفَّذ بالكامل — Phase 10

### المتطلب
ربط كامل مع Stripe لمعالجة المدفوعات وإدارة سجلاتها.

### ما تم تجهيزه مسبقاً
- **الجداول**: `payments` (migration 009)
- **ما ينقص**:
  - `payment.service.ts` — سجل الدفعات، تاريخ المعاملات
  - نقطة النهاية: GET /payments/history

---

## 16. الحسابات الموثقة (Verified Accounts) ✅

**الحالة**: مُنفَّذ بالكامل — Phase 12

### المتطلب
توثيق الحسابات مع علامة التوثيق ✓

### ما نُفِّذ
- `POST /api/v1/profiles/me/verify-request` — إرسال طلب توثيق من المستخدم ✅
- `is_verified` field موجود في جدول `profiles` ✅
- مسارات الـ Admin للموافقة/الرفض موجودة في `admin/users.routes.ts` ✅

---

## 17. التبليغات والشكاوى (Reports) ✅

**الحالة**: مُنفَّذ بالكامل — Phase 11

### المتطلب
نظام تبليغ على محتوى أو حسابات مخالفة.

### كيف نُفِّذ
- **الجداول**: `reports` (migration 008)
- `report.service.ts` + controller + routes تم بناؤها بالكامل.
- نقاط النهاية متوفرة للمستخدم (للإرسال) وللأدمن (للمراجعة والحل).

---

## 18. لوحة التحكم — إدارة المستخدمين ✅

**الحالة**: مُنفَّذ بالكامل — Phase 12

### المتطلب
Admin يشوف كل المستخدمين، يعطل/يفعل حساب، يوثق حساب.

### كيف نُفِّذ
- تم إنجاز `src/routes/admin/users.routes.ts` مع كامل الخدمات للتحكم بالمستخدمين وحظرهم.

---

## 19. لوحة التحكم — إدارة الإعلانات والعروض ✅

**الحالة**: مُنفَّذ بالكامل — Phase 12

### المتطلب
Admin يراجع ويدير الإعلانات والعروض.

---

## 20. لوحة التحكم — إدارة الاشتراكات والباقات ✅

**الحالة**: مُنفَّذ بالكامل — Phase 12

### المتطلب
Admin ينشئ ويعدل باقات الاشتراك.

---

## 21. لوحة التحكم — إدارة المدفوعات ✅

**الحالة**: مُنفَّذ بالكامل — Phase 12

---

## 22. لوحة التحكم — التقارير والإحصائيات ✅

**الحالة**: مُنفَّذ بالكامل — Phase 12

### المتطلب
إحصائيات عامة: عدد المستخدمين، الاشتراكات النشطة، الإيرادات، ...

---

---

## 23. صفحة Cup — لوحة الترتيب (Leaderboard) ✅

**الحالة**: مُنفَّذ بالكامل — Phase 15

### المتطلب
تبويب "Cup" في التطبيق يعرض ترتيب الحسابات (شركات + مؤثرين + مقدمي خدمات) تنازلياً حسب عدد المتابعين، مع ميداليات للمراكز الأولى (#1 ذهبي، #2 فضي، #3 برونزي).

### كيف نُفِّذ (Plan A — رقم متابعين مخزّن)
- **الجدول/العمود**: `profiles.followers_count` (INTEGER، cached) — migration `028_add_leaderboard.sql`
- **المزامنة**: Trigger `sync_followers_count` على جدول `follows` يزيد/ينقص العدد تلقائياً عند كل متابعة/إلغاء + backfill للبيانات الموجودة. الرقم الأساسي قابل للضبط يدوياً (يمثّل الوصول الحقيقي على السوشال ميديا).
- **الأداء**: Partial index `idx_profiles_followers_count` على `(followers_count DESC) WHERE is_active`.
- **الملفات**: `leaderboard.validator.ts` → `leaderboard.service.ts` → `leaderboard.controller.ts` → `leaderboard.routes.ts` (مسجّل في `routes/index.ts`).
- **نقطة النهاية**: `GET /api/v1/leaderboard?page=1&limit=20&type=all|company|influencer|service_provider`
  - `type=all` (افتراضي) يستثني الحسابات العادية (`user`).
  - الترتيب: `followers_count DESC` + tie-breaker `created_at`.
  - يُرفق `rank` لكل عنصر + pagination meta.
- **الفرونت**: يحوّل `rank` لميدالية ويفرمت الأرقام (1.2M / 980K). ضغط الكرت → شاشة البروفايل الموجودة عبر `id`.

---

## ميزات مؤجَّلة لـ v2 (ظاهرة في الـ Prototype، غير مطلوبة في نطاق العميل الأساسي) ⬜

| الميزة | الملاحظة |
|--------|---------|
| التقييمات والمراجعات (Reviews/Ratings) | الـ prototype يعرض نجوماً و"4.7 (1240 reviews)" — لا يوجد جدول/endpoint. يحتاج تأكيد العميل. |
| اللايكات والتعليقات على البوستات | بوستات البروفايل تعرض لايكات/تعليقات/مشاركة — غير منفّذة. |
| باقات المحتوى (Content Packages) | Basic/Standard/Premium "Includes X posts" + "MyPackages" — منطق مختلف عن `subscription_plans` الدورية. |
| تسجيل الدخول بـ Facebook | أيقونة موجودة في شاشة الدخول؛ غير مطلوبة في النطاق ولا منفّذة (google/apple فقط). |

---

## ملخص الحالة العامة

| المتطلب | الحالة | Phase |
|---------|--------|-------|
| تسجيل الحسابات | ✅ مُنفَّذ | Phase 2 |
| تسجيل الدخول (Email/Phone) | ✅ مُنفَّذ | Phase 2 |
| تسجيل الدخول (Google/Apple) | ✅ مُنفَّذ | Phase 2 |
| التحقق بـ OTP | ✅ مُنفَّذ | Phase 2 |
| الملفات الشخصية | ✅ مُنفَّذ | Phase 3 |
| نظام المتابعة | ✅ مُنفَّذ | Phase 4 |
| نظام العروض | ✅ مُنفَّذ | Phase 5 |
| نظام الإعلانات | ✅ مُنفَّذ | Phase 5 |
| الاشتراكات والباقات + Stripe | ✅ مُنفَّذ | Phase 6 |
| المحادثات (Chat) | ✅ مُنفَّذ | Phase 7 |
| الإشعارات الفورية | ✅ مُنفَّذ | Phase 8 |
| رفع الملفات | ✅ مُنفَّذ | Phase 9 |
| البحث والتصنيفات | ✅ مُنفَّذ | Phase 9 |
| الحسابات المميزة (Featured) | ✅ مُنفَّذ | Phase 10 |
| إدارة المدفوعات | ✅ مُنفَّذ | Phase 10 |
| الحسابات الموثقة (جزئي) | ✅ مُنفَّذ | Phase 12 |
| التبليغات والشكاوى | ✅ مُنفَّذ | Phase 11 |
| Admin — إدارة المستخدمين | ✅ مُنفَّذ | Phase 12 |
| Admin — إدارة الإعلانات/العروض | ✅ مُنفَّذ | Phase 12 |
| Admin — إدارة الاشتراكات | ✅ مُنفَّذ | Phase 12 |
| Admin — إدارة المدفوعات | ✅ مُنفَّذ | Phase 12 |
| Admin — التقارير والإحصائيات | ✅ مُنفَّذ | Phase 12 |
| نظام الخدمات (Services) | ✅ مُنفَّذ | Phase 13 |
| نظام حجز المقاعد (Seats) | ✅ مُنفَّذ | Phase 13 |
| نظام القصص (Stories) | ✅ مُنفَّذ | Phase 13 |
| الحفظ والمفضلة (Saved) | ✅ مُنفَّذ | Phase 13 |
| الصفحة الرئيسية (Home API) | ✅ مُنفَّذ | Phase 13 |
| صفحة Cup — لوحة الترتيب (Leaderboard) | ✅ مُنفَّذ | Phase 15 |

---

## 12. Phase 12: Admin Dashboard APIs (Current & Final)

| ID | Feature | Priority | Status |
|---|---|---|---|
| 12.1 | Admin Stats API (Totals) | Core | ✅ Completed |
| 12.2 | User Management (Ban/Verify) | Core | ✅ Completed |
| 12.3 | Global Content Management | Core | ✅ Completed |
| 12.4 | Payment History & Subscription Plans | Core | ✅ Completed |
| 12.5 | Reports Management | Core | ✅ Completed |
| 12.6 | Category Management | Core | ✅ Completed |

---

## 13. Phase 13: Gap Fixes & Deep Audit (Current & Final)

| ID | Feature | Priority | Status |
|---|---|---|---|
| 13.1 | Services Module (CRUD) | Core | ✅ Completed |
| 13.2 | Seats Booking & Webhooks | Core | ✅ Completed |
| 13.3 | Stories Module | Core | ✅ Completed |
| 13.4 | Saved Items (Bookmarks) | Core | ✅ Completed |
| 13.5 | Home API Aggregator | Core | ✅ Completed |
| 13.6 | Webhook Architecture Refactoring | High | ✅ Completed |
| 13.7 | DB Constraints Audit (Media, Reports, Subs) | Critical | ✅ Completed |
| 13.8 | Zero-Trust Security Patches (Mass Assign, RLS Hijacking) | Critical | ✅ Completed |
| 13.9 | Bug Fixes & Refactoring (Webhooks, Chat, Seats, Offers) | Critical | ✅ Completed |
| 13.10| Database Optimization (Missing Indexes) | High | ✅ Completed |
| 13.11| Final Deep Audit Bug Fixes (Status mutation, Stripe crash guards, OTP typing) | Critical | ✅ Completed |
| 13.12| Database Final Patches (Seats, Polymorphic, Currency, Orphaned Chats) | Critical | ✅ Completed |
| 13.13| Feature Offer Webhook Constraint Patch (024_fix_feature_offer_payment.sql) | Critical | ✅ Completed |

---

## 15. Phase 17: Database Final Verification & Production Lock

| ID | Feature | Priority | Status |
|---|---|---|---|
| 17.1 | Direct MCP audit — triggers, policies, indexes, constraints, seed data | Critical | ✅ Completed |
| 17.2 | seats_status_check constraint — أضيفت قيمة `pending` (migration 030) | Critical | ✅ Completed |
| 17.3 | Duplicate migration 022 — أُعيد تسميته إلى 025 محلياً | Medium | ✅ Completed |
| 17.4 | Duplicate RLS policies على offers و subscription_plans — حُذفت (migration 031) | Medium | ✅ Completed |
| 17.5 | idx_profiles_category_id — أُضيف على Supabase (migration 031) | Medium | ✅ Completed |
| 17.6 | Subscription plans cleanup — حُذفت 4 خطط زائدة/placeholders، تبقّت 2 بـ IDs حقيقية (migration 032) | High | ✅ Completed |

---

## 14. Phase 16: Final Backend Polish & Flutter Handover

| ID | Feature | Priority | Status |
|---|---|---|---|
| 16.1 | Database Triggers for Sensitive Columns (RLS Hardening) | Critical | ✅ Completed |
| 16.2 | Seat Booking Race Condition Locks | High | ✅ Completed |
| 16.3 | Upload Bucket Enum Validation | High | ✅ Completed |
| 16.4 | Jest Testing Environment Fixes | Medium | ✅ Completed |
| 16.5 | API Contract Generators Sync | High | ✅ Completed |
| 16.6 | Vulnerability Auditing & Security Fixes | High | ✅ Completed |

---

## ملاحظات معمارية مهمة

### ✅ ما نحن عليه صح تماماً
1. **4-Layer Architecture محترم 100%**: كل module فيه validator → service → controller → route. لا يوجد أي استثناء.
2. **Supabase RLS نشط**: كل جدول محمي بـ Row Level Security — المستخدم لا يصل إلا لبياناته.
3. **Stripe Webhook يعمل بشكل صحيح**: Webhook مُسجَّل قبل `express.json()` في `app.ts` لأنه يحتاج raw body.
4. **أنواع TypeScript صارمة**: لا يوجد `any` في الكود، `type-check` ينجح بدون أخطاء.
5. **Pagination على كل القوائم**: كل endpoint يُرجع قائمة يدعم `?page=&limit=`.
6. **Bilingual جاهز**: الـ DB فيه `name_ar` و `name_en` لكل الجداول التي تحتاجها.
7. **Database جاهزة 100%**: كل 18 migrations مكتوبة — وتم إصلاح التضاربات (NO-OP) لضمان بيئة آمنة للتحديثات.
8. **المراجعة النهائية (Surgical Audit)**: تم إجراء تدقيق كامل للـ Webhooks، والتأكد من توافر Services للمسارات، وتأمين RLS بشكل كامل للمحادثات والملفات، وإصلاح ثغرات Mass Assignment واختراق المجلدات (Folder Hijacking).
9. **Release Mode Locked**: تمت إضافة التعديل النهائي 024 لإصلاح قيود الدفع في الـ Database، وتم قفل الـ Backend كـ Production-Ready تماماً دون الحاجة لمزيد من التدقيق.

### ⚠️ ما يحتاج انتباه لاحقاً
1. **Front-End Integration**: الباك إند جاهز تماماً. يجب ربط تطبيق الموبايل بالـ Endpoints و Supabase SDK مباشرة (للـ Realtime و OAuth).
2. **Dashboard Configuration**: يجب على مالك المشروع تفعيل Google/Apple OAuth من داخل الـ Supabase Dashboard، ووضع Client IDs الفعلية.
3. **Stripe Plans**: تبقّت خطتان نشطتان بـ Stripe IDs حقيقية بعد حذف الـ placeholders (migration 032): Basic (10 AED) و Premium (29 AED). هاتان الخطتان جاهزتان للدفع الفعلي دون أي تعديل إضافي.
