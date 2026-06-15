# Phase 6: Subscriptions & Stripe (الاشتراكات والبوابات)

## الهدف والمغزى
إدارة الباقات المدفوعة، السماح للمستخدمين بترقية حساباتهم للاستفادة من الميزات الإضافية (مثل الظهور كحساب مميز، أو ميزات الشركات). واستخدام نظام موثوق عالمياً مثل Stripe لمعالجة الدفعات دون الحاجة لحفظ معلومات البطاقات البنكية في السيرفر.

## الملفات المرتبطة
- **Stripe Service**: `src/services/stripe.service.ts` (التعامل المباشر مع مكتبة Stripe API).
- **Subscription Service**: `src/services/subscription.service.ts` (اللوجيك الداخلي والتواصل مع قاعدة البيانات).
- **Controllers**: `src/controllers/subscription.controller.ts` و `src/controllers/webhook.controller.ts`.
- **Routes**: `src/routes/subscription.routes.ts`.
- **App setup**: التعديل في `src/app.ts` لدعم الـ Webhooks.
- **Database**: `supabase/migrations/005_create_subscriptions.sql`.

## اللوجيك (كيف تعمل)
### 1. بدء الاشتراك:
- `GET /api/v1/subscriptions/plans`: التطبيق يجلب الباقات. كل باقة في الـ DB لها `stripe_price_id` مُرتبط بها في لوحة تحكم Stripe.
- `POST /api/v1/subscriptions`: عندما يختار المستخدم باقة، السيرفر يقوم بـ:
  1. التحقق هل المستخدم لديه اشتراك فعال بالفعل؟
  2. استخراج أو إنشاء `stripe_customer_id` للمستخدم.
  3. استدعاء `stripe.checkout.sessions.create()` لإنشاء جلسة دفع.
  4. إعادة رابط الـ Session (`url`) للتطبيق.

### 2. إتمام الدفع (Webhook):
- التطبيق يفتح الـ URL، المستخدم يدفع هناك. بمجرد نجاح الدفع، يتصل Stripe בסيرفرنا بصمت عبر نقطة نهاية الـ Webhook `POST /api/v1/webhooks/stripe`.
- **أهمية الـ Webhook**: لا يمكن الاعتماد على عودة المستخدم للتطبيق لتأكيد الدفع (قد يغلق التطبيق قبل أن يرجع). الـ Webhook هو الطريقة الوحيدة الموثوقة.
- الـ `webhook.controller.ts` يستقبل الطلب، ويتأكد من الـ Signature ليتأكد أنه فعلاً من Stripe (لهذا السبب الـ Webhook يستخدم `express.raw` قبل أن يتحول الطلب لـ JSON في `app.ts`).
- إذا نجح الدفع، يتم إدخال/تحديث سجل في جدول `subscriptions` عبر `subscription.service.ts`.

### 3. إدارة الاشتراك (إلغاء، ترقية):
- `POST /api/v1/subscriptions/manage`: السيرفر لا يبرمج واجهات إلغاء. بدلاً من ذلك، نستخدم Stripe Customer Portal. السيرفر يطلب من Stripe إنشاء رابط إدارة، والتطبيق يفتح هذا الرابط ليقوم المستخدم بكل شيء هناك (الإلغاء، الترقية). عند حدوث تغيير، يصلنا إشعار على הـ Webhook لنحدث الـ DB.

## الـ User Flow (رحلة المستخدم في التطبيق)
- يدخل صفحة الباقات → يختار "باقة مميزة" → السيرفر يعطيه رابط الدفع.
- يفتح المتصفح/Webview ويدفع في صفحة Stripe المأمونة.
- ينجح الدفع، يعود للتطبيق.
- في الخلفية، Stripe يخبر السيرفر "فلان دفع". السيرفر يغير حالة اشتراكه لـ `active`.
- عندما يحاول المستخدم استخدام ميزة مدفوعة، السيرفر يتأكد من جدول `subscriptions` ليسمح له.

## كيفية الصيانة والتعديل (Maintenance)
- **إضافة باقة جديدة**: لا يتطلب الأمر كوداً. تنشئ الباقة في لوحة تحكم Stripe للحصول على Price ID، ثم تضيفها في جدول `subscription_plans` في Supabase وتضع فيها الـ Price ID. ستظهر تلقائياً في التطبيق وستعمل مع الـ Checkout.
- **تحديث الـ Webhook Secret**: الـ Secret موجود في `.env`. إذا أنشأت Webhook جديد في Stripe Dashboard، لا تنسخ وضع الـ Secret الجديد في السيرفر لكي تعمل المصادقة.
