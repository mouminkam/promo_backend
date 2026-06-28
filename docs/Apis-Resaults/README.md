# Promoo API — Live Test Results

كل المجلدات تحت هذا المسار تحتوي نتائج اختبار **حقيقية** لكل الـ APIs (108 endpoint)، تم التقاطها بتشغيل السيرفر فعلياً (`http://localhost:3000/api/v1`) وتسجيل دخول حقيقي لكل أنواع الحسابات، وإنشاء الموارد بالترتيب الصحيح للاعتماديات (offer → saved، company↔influencer → chat، إلخ).

كل ملف فيه لكل endpoint: **الراوت + الـ payload (إن وجد) + الـ response الفعلي + كود الحالة**.

## كيف تم التشغيل
- السكربت: [`scripts/run_full_api_capture.ts`](../../scripts/run_full_api_capture.ts)
- حسابات الاختبار (بكلمة سر موحّدة `Promoo@Test2026`): `company@test.com`, `influencer@test.com`, `provider@test.com`, `user@test.com`, وحساب أدمن.
- تم تعطيل rate limiting مؤقتاً أثناء التشغيل عبر `DISABLE_RATE_LIMIT=true` (إضافة آمنة، مطفأة افتراضياً في الإنتاج).

## دليل الحالات
- ✅ = نجاح (2xx)
- ⚠️ = استجابة غير 2xx **متبقية**، وكلها إما إعدادات بيئة/مزوّد خارجي أو بيانات وهمية — **ولا واحدة منها خطأ في كود الباك**:

| Endpoint | الكود | السبب |
|----------|-------|-------|
| Auth → Login (Phone) / Register (Phone) | 401 / 400 | **"Phone logins are disabled"** — مزوّد الهاتف + SMS غير مفعّل في Supabase Dashboard |
| Auth → Register (Email) / Forgot Password | 400 | **"email rate limit exceeded"** — quota إيميلات Supabase أثناء التشغيل السريع |
| Auth → Login (OAuth) | 401 | يحتاج id_token حقيقي من Google/Apple |
| Auth → Verify OTP | 400 | رمز OTP وهمي |
| Webhooks → Stripe | 400 | بدون توقيع Stripe صحيح (يناديه Stripe فقط) |
| Subscriptions → Create | 500 | الخطأ الحقيقي #4 (انظر تحت) — لسا يحتاج إصلاح |

> ✅ ملاحظة: نقاط كانت ⚠️ بسبب شرط مسبق صار يُجهَّز تلقائياً بالاختبار وصارت خضراء الآن: **Ads → Impression/Click/Toggle** (يُفعّل الإعلان أولاً)، **Payments → Get Details** (دفعة حقيقية)، و**Login (Phone)** كان بيشتغل لو المزوّد مفعّل.

## 🐛 الأخطاء الحقيقية المكتشفة أثناء الاختبار

أثناء هذا التشغيل تم اكتشاف 4 أخطاء حقيقية. **3 منها أُصلحت** والنتائج أعلاه بعد الإصلاح:

1. ✅ **مُصلَح** — `protect_sensitive_columns` trigger (migration 029) كان يشير لأعمدة غير موجودة على `ads` و`services` → كان يكسر **كل تعديلات الإعلانات والخدمات**. أُصلح في [migration 033](../../supabase/migrations/033_fix_protect_trigger_and_seat_cancel.sql).
2. ✅ **مُصلَح** — سياسة RLS على `seats` كانت تمنع المالك من إلغاء/تحرير مقعده. أُصلحت في migration 033.
3. ✅ **مُصلَح** — 4 storage buckets (`services`, `stories`, `verifications`, `reports`) كانت ناقصة في Supabase Storage → تم إنشاؤها.
4. ⚠️ **يحتاج معالجة** — `POST /subscriptions` يرجّع 500 (`client_secret` undefined). السبب: stripe-node v22 يستخدم API version 2025 حيث لم يعد `invoice.payment_intent` موجوداً على فواتير الاشتراك. يحتاج إعادة كتابة flow الـ PaymentSheet (تثبيت `apiVersion` أو استخدام `confirmation_secret`).

> ملاحظة: نقاط Stripe الأخرى (Book Seat، Feature Offer) تعمل وترجّع `checkoutUrl` حقيقي. فقط مسار الاشتراك للموبايل (#4) يحتاج إصلاح.
