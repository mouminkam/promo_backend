# Phase 8: Notifications (الإشعارات)

## الهدف والمغزى
إبقاء المستخدمين على تواصل دائم مع الأحداث المهمة في التطبيق (مثل الحصول على متابع جديد، أو تلقي رسالة جديدة) عبر الإشعارات داخل التطبيق (In-App) والإشعارات الفورية (Push Notifications) حتى عندما يكون التطبيق مغلقاً.

## الملفات المرتبطة
- **Validators**: `src/validators/notification.validator.ts`
- **Controllers**: `src/controllers/notification.controller.ts`
- **Services**: `src/services/notification.service.ts`
- **Routes**: `src/routes/notification.routes.ts`
- **Config**: `src/config/firebase.ts` (للاتصال بخدمة Firebase Cloud Messaging - FCM)
- **Database**: `supabase/migrations/007_create_notifications.sql` (جداول `notifications` و `fcm_tokens`)
- **تم التعديل على**: `follow.service.ts` و `chat.service.ts` لربط الإشعارات بها.

## اللوجيك (كيف تعمل)
1. **تسجيل الجهاز (FCM Token)**:
   - لكي يرسل السيرفر إشعاراً لهاتف معين، يجب أن يعرف "معرّف" هذا الهاتف.
   - التطبيق (React Native) يطلب من نظام التشغيل (iOS/Android) صلاحية الإشعارات ويستلم رمزاً يسمى `FCM Token`.
   - يقوم التطبيق بإرسال هذا الرمز للسيرفر عبر `POST /api/v1/notifications/token`.
   - السيرفر يحفظه في جدول `fcm_tokens` ويربطه بحساب المستخدم الحالي.

2. **إرسال إشعار جديد**:
   - بدلاً من الاعتماد على Database Triggers (والتي لا يمكنها إرسال Push Notification للهاتف بسهولة)، قمنا بتصميم دالة مركزية `sendNotification` في الـ `notification.service.ts`.
   - **مثال (عند المتابعة)**: عندما تتابع شخصاً عبر `follow.service.ts`، يقوم الكود باستدعاء `sendNotification` ليخبر الشخص الآخر.
   - **العملية من الداخل**:
     أ) يقوم السيرفر بإنشاء سجل في جدول `notifications` ليظهر في "جرس الإشعارات" داخل التطبيق.
     ب) يبحث السيرفر في جدول `fcm_tokens` عن أجهزة هذا الشخص.
     ج) يستخدم `firebase-admin` لإرسال Push Notification لتلك الأجهزة في لحظتها.

3. **إدارة الإشعارات**:
   - `GET /api/v1/notifications`: يجلب الإشعارات مرتبة من الأحدث للأقدم.
   - `PATCH /api/v1/notifications/:id/read`: يحوّل إشعاراً معيناً إلى "مقروء".
   - `PATCH /api/v1/notifications/read-all`: يحدد كل الإشعارات كـ "مقروءة" بضغطة زر.
   - `DELETE /api/v1/notifications/:id`: يحذف الإشعار.

## الـ User Flow (رحلة المستخدم في التطبيق)
- يسجل المستخدم دخولاً في التطبيق، وتلقائياً بالخلفية يتم إرسال جهازه لـ `/token` ليصبح مستعداً لاستقبال الإشعارات.
- يغلق المستخدم التطبيق أو يضعه في الخلفية.
- شخص آخر يضغط "متابعة" على حسابه.
- يصل للمستخدم تنبيه (Push) على شاشة هاتفه "فلان قام بمتابعتك".
- يضغط المستخدم على التنبيه، فيفتح التطبيق ويذهب لصفحة الإشعارات، ويرى الإشعار الجديد غير المقروء. بمجرد رؤيته يتحول لمقروء.

## كيفية الصيانة والتعديل (Maintenance)
- **إضافة نوع إشعار جديد**: أولاً قم بتحديث العمود `type` في الـ Database ليقبل الكلمة الجديدة (مثل 'system_alert')، ثم استخدم دالة `sendNotification` من أي مكان في الكود بالنوع الجديد.
- **في حال لم تصل الإشعارات للهاتف**:
  1. تأكد أن التطبيق يرسل الـ Token الصحيح لـ `/token`.
  2. تأكد أن ملف Service Account الخاص بـ Firebase (والذي تم تعريفه في الـ `.env`) يطابق المشروع الفعلي في Firebase Console.
