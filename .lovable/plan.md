

# تحويل التطبيق من Mock إلى نظام حقيقي كامل

## الوضع الحالي (تشخيص دقيق)

بعد فحص المشروع، الواقع مختلف عمّا ذُكر:

| العنصر | الحالة الفعلية |
|---|---|
| المصادقة (Auth) | ✅ **حقيقية** عبر Supabase (`AuthContext.tsx` + `signInWithPassword` / `signUp`) — ليست localStorage |
| Database Tables | ✅ **موجودة**: `profiles`, `projects`, `exports`, `templates`, `user_roles` مع RLS كامل |
| Backend Functions | ✅ Triggers و Functions موجودة (`handle_new_user`, `assign_default_role`, `has_role`) |
| Projects (Dashboard) | ✅ **حقيقي** — يقرأ/يكتب من جدول `projects` |
| Admin (Users/Projects/Exports) | ✅ **حقيقي** — يقرأ من Supabase |
| **Templates** | ❌ **Mock فقط** — مصفوفة ثابتة في `Templates.tsx`، الجدول فارغ |
| **Settings** | ❌ **Mock** — كل الأزرار تُظهر "قريباً!" بدون حفظ فعلي |
| **Exports** | ⚠️ تُولَّد محلياً في المتصفح لكن لا تُحفظ في جدول `exports` ولا في Storage |
| **Agents / Machines** | ❌ غير موجودة أصلاً في المشروع (لم نجد أي كود لها) |

## الخطة: تفعيل كل ما هو Mock

### 1. Templates حقيقية من قاعدة البيانات
- **Migration**: إدراج 8 قوالب seed في جدول `templates` (Marketing×2, Education×2, Social×2, Presentation×2) مع `config_json` يحتوي بنية مشاهد جاهزة.
- **`Templates.tsx`**: استبدال المصفوفة الثابتة بـ `supabase.from("templates").select("*")` + فلترة حسب الفئة.
- **زر "استخدم القالب"**: ينشئ مشروعاً جديداً في `projects` بـ `script_json` من `template.config_json` ثم ينقل لـ `/editor/:id`.

### 2. Settings حقيقي (Profile + Password + Preferences)
- **حفظ الملف الشخصي**: تحديث `display_name` و `avatar_url` في `profiles` عبر `update().eq("user_id", user.id)`.
- **تغيير كلمة المرور**: `supabase.auth.updateUser({ password })` مع تأكيد.
- **التفضيلات**: إضافة عمود `preferences jsonb` في `profiles` (migration) لحفظ: الإشعارات، اللغة، تفضيلات التصدير الافتراضية.
- **رفع Avatar**: إنشاء storage bucket `avatars` (public) + سياسات + رفع الصورة وحفظ الرابط.

### 3. Exports تُحفظ فعلياً
- **Storage Bucket**: إنشاء bucket `exports` (private) مع RLS (المستخدم يقرأ ملفاته فقط، Admin يقرأ الكل).
- **`Editor.tsx` بعد التصدير**:
  1. رفع `Blob` الفيديو إلى `exports/{user_id}/{project_id}_{timestamp}.{ext}`.
  2. إنشاء صف في جدول `exports` بـ `video_url` و `resolution` و `status='completed'`.
  3. حالة الفشل: `status='failed'` + رسالة.
- **صفحة "تصديراتي"** جديدة `/exports`: تعرض السجل من قاعدة البيانات مع زر تنزيل/حذف.

### 4. Google Analytics 4 (مؤجَّل من قبل)
- إضافة GA4 script في `index.html` مع placeholder للـ Measurement ID.
- ملف `src/lib/analytics.ts` مع دوال: `trackEvent(name, params)`, `trackPageView(path)`.
- ربط الأحداث: `sign_up`, `login`, `project_create`, `template_use`, `export_start`, `export_complete`, `scene_add`.
- **مطلوب من المستخدم**: تزويدنا بـ Measurement ID الفعلي (G-XXXXXXXXXX).

### 5. تفعيل HIBP (حماية كلمات المرور المسرّبة)
- استدعاء `configure_auth` لتفعيل `password_hibp_enabled: true`.

## التغييرات التقنية باختصار

```text
Migrations:
  + INSERT 8 templates (seed)
  + ALTER profiles ADD preferences jsonb DEFAULT '{}'
  + CREATE BUCKET avatars (public) + policies
  + CREATE BUCKET exports (private) + policies (own + admin)

New files:
  + src/pages/Exports.tsx       (سجل التصديرات)
  + src/lib/analytics.ts        (GA4 helpers)
  + src/hooks/useProfile.ts     (قراءة/تحديث profiles)

Modified files:
  ~ src/pages/Templates.tsx     (Supabase بدل mock)
  ~ src/pages/Settings.tsx      (حفظ فعلي + رفع avatar + تغيير password)
  ~ src/pages/Editor.tsx        (رفع للـ Storage + insert في exports)
  ~ src/components/AppSidebar.tsx (رابط /exports)
  ~ src/App.tsx                 (route /exports)
  ~ index.html                  (GA4 snippet)

Auth config:
  ~ enable HIBP password protection
```

## ما هو خارج النطاق (للتوضيح)

- **Agents / Machines**: لا توجد في المشروع حالياً. إذا كنت تقصد ميزة جديدة، وضّحها في رسالة منفصلة.
- **المصادقة**: حقيقية بالفعل، لا تحتاج تغيير.

## مطلوب منك قبل التنفيذ

1. **GA4 Measurement ID الفعلي** (أو نضع placeholder ونتركك تستبدله).
2. تأكيد أن "Agents/Machines" غير مطلوبة الآن.

