-- 1. Add preferences column to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS preferences jsonb NOT NULL DEFAULT '{}'::jsonb;

-- 2. Create avatars bucket (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Avatars policies
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 3. Create exports bucket (private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('exports', 'exports', false)
ON CONFLICT (id) DO NOTHING;

-- Exports policies
CREATE POLICY "Users can view their own exported videos"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'exports'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Admins can view all exported videos"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'exports'
  AND public.has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Users can upload their own exported videos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'exports'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own exported videos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'exports'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Admins can delete any exported video"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'exports'
  AND public.has_role(auth.uid(), 'admin'::app_role)
);

-- 4. Allow users to update their own exports (for status changes)
CREATE POLICY "Users can update their own exports"
ON public.exports FOR UPDATE
USING (auth.uid() = user_id);

-- 5. Seed 8 templates
INSERT INTO public.templates (name, category, is_premium, config_json) VALUES
('ريلز تسويقي', 'تسويق', false, '{"scenes":[{"id":"s1","title":"المقدمة","text":"اكتشف منتجنا الجديد","duration":3,"bgColor":"#6C3AED","transition":"fade"},{"id":"s2","title":"الميزة 1","text":"جودة لا مثيل لها","duration":3,"bgColor":"#1E1B4B","transition":"slide"},{"id":"s3","title":"الميزة 2","text":"سعر تنافسي","duration":3,"bgColor":"#0F172A","transition":"zoom"},{"id":"s4","title":"الميزة 3","text":"شحن سريع","duration":3,"bgColor":"#1E1B4B","transition":"fade"},{"id":"s5","title":"الدعوة للعمل","text":"اطلب الآن!","duration":4,"bgColor":"#6C3AED","transition":"zoom"}]}'::jsonb),
('شرح منتج', 'تسويق', false, '{"scenes":[{"id":"s1","title":"العنوان","text":"تعرّف على منتجنا","duration":4,"bgColor":"#6C3AED","transition":"fade"},{"id":"s2","title":"المشكلة","text":"هل تواجه هذه المشكلة؟","duration":5,"bgColor":"#7C2D12","transition":"slide"},{"id":"s3","title":"الحل","text":"إليك الحل المثالي","duration":5,"bgColor":"#0F172A","transition":"zoom"},{"id":"s4","title":"كيف يعمل","text":"خطوات بسيطة","duration":6,"bgColor":"#1E1B4B","transition":"fade"},{"id":"s5","title":"الفوائد","text":"وفّر وقتك","duration":5,"bgColor":"#6C3AED","transition":"slide"},{"id":"s6","title":"شهادة","text":"عملاؤنا سعداء","duration":5,"bgColor":"#0F172A","transition":"fade"},{"id":"s7","title":"العرض","text":"خصم 30% اليوم","duration":4,"bgColor":"#DC2626","transition":"zoom"},{"id":"s8","title":"اشتر الآن","text":"لا تفوّت الفرصة","duration":6,"bgColor":"#6C3AED","transition":"zoom"}]}'::jsonb),
('درس تعليمي', 'تعليم', true, '{"scenes":[{"id":"s1","title":"مرحباً","text":"درس اليوم","duration":5,"bgColor":"#1E40AF","transition":"fade"},{"id":"s2","title":"الأهداف","text":"ما ستتعلمه","duration":8,"bgColor":"#0F172A","transition":"slide"},{"id":"s3","title":"المفهوم","text":"شرح المفهوم","duration":12,"bgColor":"#1E40AF","transition":"fade"},{"id":"s4","title":"مثال 1","text":"مثال تطبيقي","duration":12,"bgColor":"#0F172A","transition":"zoom"},{"id":"s5","title":"مثال 2","text":"مثال آخر","duration":12,"bgColor":"#1E40AF","transition":"slide"},{"id":"s6","title":"تمرين","text":"جرّب بنفسك","duration":15,"bgColor":"#7C2D12","transition":"fade"},{"id":"s7","title":"الحل","text":"الإجابة","duration":12,"bgColor":"#0F172A","transition":"slide"},{"id":"s8","title":"النصائح","text":"نصائح مهمة","duration":10,"bgColor":"#1E40AF","transition":"fade"},{"id":"s9","title":"الأخطاء","text":"تجنّب هذه","duration":10,"bgColor":"#DC2626","transition":"zoom"},{"id":"s10","title":"الملخص","text":"ما تعلّمناه","duration":10,"bgColor":"#1E40AF","transition":"fade"},{"id":"s11","title":"المراجع","text":"للمزيد","duration":7,"bgColor":"#0F172A","transition":"slide"},{"id":"s12","title":"الخاتمة","text":"شكراً للمشاهدة","duration":7,"bgColor":"#6C3AED","transition":"fade"}]}'::jsonb),
('تيك توك — نصائح', 'سوشيال ميديا', false, '{"scenes":[{"id":"s1","title":"السؤال","text":"هل تعلم؟","duration":3,"bgColor":"#000000","transition":"fade"},{"id":"s2","title":"النصيحة","text":"نصيحة ذهبية","duration":4,"bgColor":"#6C3AED","transition":"zoom"},{"id":"s3","title":"التطبيق","text":"كيف تطبّقها","duration":4,"bgColor":"#0F172A","transition":"slide"},{"id":"s4","title":"المتابعة","text":"تابعنا للمزيد","duration":4,"bgColor":"#DC2626","transition":"zoom"}]}'::jsonb),
('عرض شركة', 'عرض تقديمي', true, '{"scenes":[{"id":"s1","title":"الشعار","text":"شركتنا","duration":5,"bgColor":"#0F172A","transition":"fade"},{"id":"s2","title":"من نحن","text":"تعرّف علينا","duration":12,"bgColor":"#1E1B4B","transition":"slide"},{"id":"s3","title":"الرؤية","text":"رؤيتنا","duration":12,"bgColor":"#6C3AED","transition":"fade"},{"id":"s4","title":"الرسالة","text":"رسالتنا","duration":12,"bgColor":"#0F172A","transition":"slide"},{"id":"s5","title":"الخدمات","text":"ما نقدّمه","duration":15,"bgColor":"#1E1B4B","transition":"zoom"},{"id":"s6","title":"الفريق","text":"فريقنا","duration":15,"bgColor":"#0F172A","transition":"fade"},{"id":"s7","title":"إنجازاتنا","text":"أرقام تتحدّث","duration":15,"bgColor":"#6C3AED","transition":"slide"},{"id":"s8","title":"العملاء","text":"عملاؤنا","duration":15,"bgColor":"#1E1B4B","transition":"fade"},{"id":"s9","title":"اتصل بنا","text":"للتواصل","duration":12,"bgColor":"#0F172A","transition":"zoom"},{"id":"s10","title":"شكراً","text":"شكراً لكم","duration":7,"bgColor":"#6C3AED","transition":"fade"}]}'::jsonb),
('إعلان قصير', 'تسويق', false, '{"scenes":[{"id":"s1","title":"الجذب","text":"عرض حصري!","duration":4,"bgColor":"#DC2626","transition":"zoom"},{"id":"s2","title":"التفاصيل","text":"خصم 50%","duration":6,"bgColor":"#6C3AED","transition":"slide"},{"id":"s3","title":"العمل","text":"اطلب الآن","duration":5,"bgColor":"#0F172A","transition":"zoom"}]}'::jsonb),
('ستوري انستغرام', 'سوشيال ميديا', false, '{"scenes":[{"id":"s1","title":"المقدمة","text":"اليوم...","duration":2,"bgColor":"#6C3AED","transition":"fade"},{"id":"s2","title":"اللحظة","text":"شيء مميز","duration":3,"bgColor":"#1E1B4B","transition":"slide"},{"id":"s3","title":"التفصيل","text":"المزيد","duration":3,"bgColor":"#0F172A","transition":"zoom"},{"id":"s4","title":"الرأي","text":"رأيك يهمني","duration":3,"bgColor":"#1E1B4B","transition":"fade"},{"id":"s5","title":"السؤال","text":"شاركني","duration":2,"bgColor":"#6C3AED","transition":"slide"},{"id":"s6","title":"الختام","text":"تابع","duration":2,"bgColor":"#0F172A","transition":"fade"}]}'::jsonb),
('مقدمة يوتيوب', 'سوشيال ميديا', true, '{"scenes":[{"id":"s1","title":"الترحيب","text":"مرحباً بكم","duration":3,"bgColor":"#DC2626","transition":"zoom"},{"id":"s2","title":"اسم القناة","text":"قناتنا","duration":4,"bgColor":"#0F172A","transition":"fade"},{"id":"s3","title":"الاشتراك","text":"اشترك الآن","duration":3,"bgColor":"#6C3AED","transition":"zoom"}]}'::jsonb);