import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, Sparkles, Layers, Download, Zap, Film, Type, Music } from "lucide-react";

const features = [
  {
    icon: Type,
    title: "محرر نصوص ذكي",
    description: "اكتب السيناريو الخاص بك مع تنظيم المشاهد والتعليقات التوضيحية تلقائيًا",
  },
  {
    icon: Layers,
    title: "قوالب احترافية",
    description: "مكتبة قوالب جاهزة للتسويق والتعليم ووسائل التواصل الاجتماعي",
  },
  {
    icon: Film,
    title: "معاينة فورية",
    description: "شاهد الفيديو مباشرة أثناء التحرير مع تأثيرات وانتقالات متقدمة",
  },
  {
    icon: Music,
    title: "صوت بالذكاء الاصطناعي",
    description: "تحويل النص إلى كلام طبيعي بلغات متعددة مع موسيقى خلفية",
  },
  {
    icon: Sparkles,
    title: "تأثيرات متقدمة",
    description: "رسوم متحركة وانتقالات سينمائية تضفي طابعًا احترافيًا على أفلامك",
  },
  {
    icon: Download,
    title: "تصدير بجودة عالية",
    description: "صدّر الفيديو بجودة 720p أو 1080p جاهزًا للنشر على أي منصة",
  },
];

const steps = [
  { num: "01", title: "اكتب النص", desc: "أدخل السيناريو أو النص الذي تريد تحويله إلى فيديو" },
  { num: "02", title: "صمم المشاهد", desc: "اختر القوالب والألوان والخطوط والتأثيرات المناسبة" },
  { num: "03", title: "أضف الصوت", desc: "استخدم التعليق الصوتي بالذكاء الاصطناعي أو ارفع صوتك" },
  { num: "04", title: "صدّر وانشر", desc: "حمّل الفيديو بالجودة التي تريدها وشاركه مع العالم" },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
              <Play className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold font-['Space_Grotesk']">FilmForge</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">تسجيل الدخول</Button>
            </Link>
            <Link to="/login">
              <Button size="sm" className="gradient-primary border-0 text-primary-foreground">
                ابدأ مجانًا
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-16">
        <div className="gradient-hero absolute inset-0" />
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, hsl(239 84% 67% / 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsl(168 76% 42% / 0.2) 0%, transparent 40%)'
        }} />
        <div className="relative container mx-auto flex min-h-[90vh] flex-col items-center justify-center px-4 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary-foreground/80">
            <Zap className="h-3.5 w-3.5" />
            <span>مدعوم بالذكاء الاصطناعي</span>
          </div>
          <h1 className="mb-6 max-w-4xl text-5xl font-bold leading-tight tracking-tight text-primary-foreground md:text-7xl font-['Space_Grotesk']">
            حوّل أفكارك إلى{" "}
            <span className="text-gradient">أفلام احترافية</span>
          </h1>
          <p className="mb-10 max-w-2xl text-lg text-primary-foreground/60 md:text-xl">
            اكتب النص وشاهد كيف يتحول إلى فيديو سينمائي بتأثيرات متقدمة وصوت بالذكاء الاصطناعي — في دقائق وليس أيام
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link to="/login">
              <Button size="lg" className="gradient-primary border-0 text-primary-foreground px-8 text-base h-12">
                <Sparkles className="mr-2 h-5 w-5" />
                ابدأ الإنشاء مجانًا
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 h-12 px-8">
              <Play className="mr-2 h-5 w-5" />
              شاهد العرض التوضيحي
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl font-['Space_Grotesk']">كل ما تحتاجه لإنشاء أفلام مذهلة</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">أدوات احترافية مصممة لتحويل نصوصك إلى فيديوهات سينمائية بسهولة</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg gradient-primary">
                  <f.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="mb-2 text-lg font-semibold font-['Space_Grotesk']">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-border bg-muted/50 py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl font-['Space_Grotesk']">كيف يعمل؟</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">أربع خطوات بسيطة لتحويل نصك إلى فيلم احترافي</p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div key={s.num} className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary text-2xl font-bold text-primary-foreground font-['Space_Grotesk']">
                  {s.num}
                </div>
                <h3 className="mb-2 text-lg font-semibold font-['Space_Grotesk']">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl gradient-hero p-12 text-center md:p-20">
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: 'radial-gradient(circle at 30% 50%, hsl(250 84% 54% / 0.4) 0%, transparent 50%)'
            }} />
            <div className="relative">
              <h2 className="mb-4 text-3xl font-bold text-primary-foreground md:text-5xl font-['Space_Grotesk']">
                جاهز لإنشاء فيلمك الأول؟
              </h2>
              <p className="mx-auto mb-8 max-w-xl text-primary-foreground/60">
                انضم إلى آلاف المبدعين الذين يستخدمون FilmForge لتحويل أفكارهم إلى واقع
              </p>
              <Link to="/login">
                <Button size="lg" className="bg-primary-foreground text-foreground hover:bg-primary-foreground/90 h-12 px-8">
                  <Sparkles className="mr-2 h-5 w-5" />
                  ابدأ الآن مجانًا
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto flex items-center justify-between px-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md gradient-primary">
              <Play className="h-3 w-3 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground font-['Space_Grotesk']">FilmForge</span>
          </div>
          <span>© 2026 FilmForge. جميع الحقوق محفوظة.</span>
        </div>
      </footer>
    </div>
  );
}
