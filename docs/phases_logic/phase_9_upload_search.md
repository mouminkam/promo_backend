# Phase 9: Upload & Search (رفع الملفات والبحث)

## الهدف والمغزى
هذه المرحلة توفر للمستخدمين قدرتين أساسيتين: 
1. **رفع الملفات (Upload)**: صور شخصية، صور العروض، ملفات الفيديو والمرفقات بكل أمان وكفاءة إلى مساحة تخزين سحابية بدلاً من استهلاك مساحة السيرفر.
2. **البحث الشامل (Search)**: قدرة المستخدم على العثور على المؤثرين، الشركات، والعروض والإعلانات بسهولة عبر محرك بحث موحد وتصنيفات مرتبة.

## الملفات المرتبطة
- **Validators**: `upload.validator.ts`, `search.validator.ts`
- **Controllers**: `upload.controller.ts`, `search.controller.ts`, `category.controller.ts`
- **Services**: `upload.service.ts`, `search.service.ts`, `category.service.ts`
- **Routes**: `upload.routes.ts`, `search.routes.ts`, `category.routes.ts`
- **Middleware**: `upload.middleware.ts` (Multer)

## اللوجيك (كيف تعمل)

### 1. رفع الملفات (Upload)
- **لماذا Multer Memory Storage؟** بدلاً من حفظ الملف على قرص السيرفر المحلي (والذي يبطئ السيرفر ويحتاج مساحات كبيرة وصيانة)، نستخدم `multer.memoryStorage()`. هذا يضع الملف في الـ RAM مؤقتاً كـ Buffer.
- **التخزين في Supabase**: يأخذ `upload.service.ts` هذا الـ Buffer، ويرفعه مباشرة إلى `Supabase Storage` عبر دالة `supabaseAdmin.storage.upload`.
- **التسجيل في قاعدة البيانات**: لكي لا تضيع الملفات المرفوعة ولتسهيل حذفها وإدارتها، نقوم بإنشاء سجل لكل ملف في جدول `media` يحتوي على اسمه، الرابط العام، حجمه، ولمن يتبع.

### 2. البحث والتصنيفات (Search & Categories)
- **التصنيفات**: هي بيانات شبه ثابتة (أضيفت عبر `seed.sql`) مثل "تكنولوجيا"، "تسويق"، الخ. نقطة النهاية `GET /api/v1/categories` تجلبها للموبايل.
- **البحث المتعدد**: `search.service.ts` يستطيع البحث في 3 أماكن:
  - `profiles`: يبحث عن الأسماء والـ bio.
  - `offers`: يبحث عن عناوين ووصف العروض ويفلتر بالأسعار والتصنيفات.
  - `ads`: يبحث عن الإعلانات المفعلة.
- **نوع البحث `all`**: يقوم الـ Service بتنفيذ الثلاث عمليات في وقت واحد عبر `Promise.all` لإرجاع خليط من أفضل النتائج (ميزة قوية لمحرك البحث الرئيسي في التطبيق).

## الـ User Flow (رحلة المستخدم في التطبيق)
- **رفع صورة عرض**: في شاشة "إضافة عرض"، يختار المستخدم صورة من جهازه.
- يرسل التطبيق الصورة عبر `POST /upload/image` كـ `multipart/form-data`.
- السيرفر يرفعها لـ Supabase ويرد بالتفاصيل (ومنها `file_url`).
- التطبيق يأخذ الـ `file_url` ويرسله مع تفاصيل العرض الأخرى لإنشاء العرض `POST /offers`.
- **البحث**: يكتب المستخدم "تصميم" في شريط البحث.
- يرسل التطبيق `GET /search?q=تصميم&type=all`.
- يجد السيرفر مصممين (profiles) وعروض تصميم (offers)، ويعيدها كلها في استجابة واحدة للمستخدم.

## كيفية الصيانة والتعديل (Maintenance)
- **إضافة صيغة ملف جديدة**: اذهب إلى `upload.middleware.ts` وأضف الصيغة (Mime Type) إلى مصفوفة `allowedMimeTypes`.
- **البحث بفلتر جديد**: إذا طلب العميل إضافة بحث بـ "عدد المتابعين"، ستذهب لـ `search.validator.ts` لإضافة المتغير، ثم في `search.service.ts` داخل دالة `searchProfiles` ستضيف `.gte('followers_count', params.minFollowers)`.
