# Phase 2: Authentication (المصادقة وتسجيل الدخول)

## الهدف والمغزى
إدارة هويات المستخدمين بشكل آمن وموثوق. الاعتماد على Supabase Auth لتوفير حماية بمعايير عالمية بدلاً من كتابة نظام مصادقة من الصفر وإدارة التشفير والجلسات (Sessions) يدوياً.

## الملفات المرتبطة
- **Validators**: `src/validators/auth.validator.ts` (لفحص المدخلات مثل صحة الإيميل وقوة كلمة المرور).
- **Controllers**: `src/controllers/auth.controller.ts` (يستقبل الطلبات من الـ Router ويرد عليها).
- **Services**: `src/services/auth.service.ts` (يتواصل مع Supabase Auth لتنفيذ اللوجيك).
- **Routes**: `src/routes/auth.routes.ts` (يحدد الـ Endpoints ويطبق الـ Middleware).
- **Middleware**: `src/middleware/auth.middleware.ts` (لفحص الـ JWT Token في الطلبات المحمية).

## اللوجيك (كيف تعمل)
1. **التسجيل (Registration)**:
   - المستخدم يرسل بياناته (إيميل/هاتف، كلمة سر، نوع الحساب، إلخ).
   - الـ Validator يتأكد أن البيانات صحيحة.
   - الـ Service يطلب من `supabaseAdmin.auth.signUp` إنشاء المستخدم.
   - Supabase ينشئ المستخدم في نظام الـ Auth الخاص به، ويطلق Trigger ينشئ الـ Profile الخاص به في قاعدة البيانات.
2. **تسجيل الدخول (Login)**:
   - يرسل المستخدم بيانات الدخول.
   - الـ Service يتأكد منها عبر `supabaseAdmin.auth.signInWithPassword`.
   - يتم إرجاع `access_token` (JWT) و `refresh_token` للمستخدم.
3. **الطلبات المحمية (Protected Routes)**:
   - أي طلب لميزة تتطلب تسجيل دخول يجب أن يحمل الـ `access_token` في الـ Header (Authorization: Bearer).
   - الـ `auth.middleware.ts` يقرأ هذا الـ Token ويتأكد من صحته عبر `supabase.auth.getUser(token)`. إذا كان صالحاً، يمرر الطلب؛ وإلا يرفضه بـ 401 Unauthorized.

## الـ User Flow (رحلة المستخدم في التطبيق)
- يفتح التطبيق ويرى شاشة التسجيل/الدخول.
- يختار "تسجيل جديد"، يُدخل إيميله وكلمة المرور ونوع حسابه (مؤثر، شركة، إلخ).
- يضغط تسجيل، التطبيق يتصل بـ `POST /api/v1/auth/register/email`.
- ينجح التسجيل، فيحفظ التطبيق الـ Token في جهازه.
- الآن، كلما أراد مثلاً "نشر إعلان"، التطبيق يرسل الـ Token مع الطلب لكي يعرف السيرفر من هو المستخدم.
- إذا انتهت صلاحية الـ Token، التطبيق يستخدم الـ `refresh_token` لجلب واحد جديد بصمت دون إزعاج المستخدم.

## كيفية الصيانة والتعديل (Maintenance)
- **لإضافة طريقة تسجيل جديدة** (مثلاً برقم الهوية): ستحتاج لتحديث الـ Validator، وإضافة Endpoint في `auth.routes.ts` و Method في `auth.controller.ts` و `auth.service.ts`.
- **مشاكل تسجيل الدخول**: تأكد دائماً أن إعدادات Supabase Dashboard (مثل تفعيل تسجيل الدخول بالهاتف أو Google) مطابقة لما تتوقعه في الكود.
- **تحديث مدة الجلسة (Session Duration)**: يتم ذلك من خلال لوحة تحكم Supabase وليس من كود الـ Backend.
