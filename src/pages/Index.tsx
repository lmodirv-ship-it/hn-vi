import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Play, Sparkles, Zap, Film, Cpu, ArrowLeft, Star, PenLine, Wand2, Rocket, Users, Globe2, Heart,
} from "lucide-react";
import AuroraBackground from "@/components/futuristic/AuroraBackground";
import ctaRocket from "@/assets/cta-rocket.jpg";
import heroCinematic from "@/assets/hero-cinematic.jpg";
import stepWrite from "@/assets/step-write.jpg";
import stepGenerate from "@/assets/step-generate.jpg";
import stepExport from "@/assets/step-export.jpg";
import avatar1 from "@/assets/avatar-1.jpg";
import avatar2 from "@/assets/avatar-2.jpg";
import avatar3 from "@/assets/avatar-3.jpg";
import featAi from "@/assets/feat-ai.jpg";
import featTemplates from "@/assets/feat-templates.jpg";
import featPreview from "@/assets/feat-preview.jpg";
import featVoice from "@/assets/feat-voice.jpg";
import featEffects from "@/assets/feat-effects.jpg";
import featGpu from "@/assets/feat-gpu.jpg";
import featPublish from "@/assets/feat-publish.jpg";
import featSecurity from "@/assets/feat-security.jpg";
import featCollab from "@/assets/feat-collab.jpg";

const features = [
  { image: featAi, title: "محرر ذكي بالـ AI", description: "ذكاء اصطناعي يقترح المشاهد والانتقالات والأصوات تلقائيًا حسب نصك" },
  { image: featTemplates, title: "+200 قالب احترافي", description: "مكتبة ضخمة من القوالب السينمائية لجميع المنصات والصناعات" },
  { image: featPreview, title: "معاينة فورية 4K", description: "شاهد فيلمك مباشرة بدقة عالية مع تأثيرات وتحولات سينمائية متقدمة" },
  { image: featVoice, title: "أصوات بـ 50 لغة", description: "تحويل النص لكلام طبيعي بأصوات بشرية واقعية ومكتبة موسيقى ضخمة" },
  { image: featEffects, title: "تأثيرات هوليوود", description: "particles، glow، 3D camera، motion blur، LUTs سينمائية احترافية" },
  { image: featGpu, title: "تصدير GPU سريع", description: "تصدير 1080p/4K بضغط ذكي وجودة لا تضاهى في ثوانٍ معدودة" },
  { image: featPublish, title: "نشر مباشر للمنصات", description: "انشر مباشرة على YouTube، TikTok، Instagram، X من داخل المحرر" },
  { image: featSecurity, title: "خصوصية تامة", description: "تشفير كامل، RLS، نسخ احتياطية تلقائية على السحابة الآمنة" },
  { image: featCollab, title: "تعاون لحظي", description: "اعمل مع فريقك بنفس الوقت — تعليقات، نسخ، صلاحيات متقدمة" },
];

const steps = [
  {
    num: "01",
    title: "اكتب فكرتك",
    desc: "أدخل نصاً بسيطاً أو اطلب من الذكاء الاصطناعي توليد سيناريو سينمائي كامل لك في ثوانٍ.",
    image: stepWrite,
    icon: PenLine,
  },
  {
    num: "02",
    title: "ولّد المشاهد",
    desc: "AI يقترح القوالب، التأثيرات، الموسيقى، والتعليق الصوتي تلقائياً — أو خصّص كل تفصيلة بنفسك.",
    image: stepGenerate,
    icon: Wand2,
  },
  {
    num: "03",
    title: "صدّر وانشر",
    desc: "صدّر بدقة 4K بثوانٍ معدودة وانشر مباشرة على YouTube و TikTok و Instagram من نقرة واحدة.",
    image: stepExport,
    icon: Rocket,
  },
];

const stats = [
  { value: "+250K", label: "مبدع نشط حول العالم", icon: Users },
  { value: "+5M", label: "فيديو سينمائي منتج", icon: Film },
  { value: "98%", label: "رضا المستخدمين", icon: Heart },
  { value: "50+", label: "لغة مدعومة بالـ AI", icon: Globe2 },
];

const testimonials = [
  {
    name: "كريم سعيد",
    role: "مدير تسويق — دبي",
    quote: "أنتج حملة إعلانية كاملة بـ 12 فيديو في أقل من ساعة. كانت تأخذني أسبوعاً قبل FilmForge.",
    image: avatar1,
  },
  {
    name: "ليلى أحمد",
    role: "صانعة محتوى — الرياض",
    quote: "الجودة سينمائية فعلاً. متابعيني زادوا 3 أضعاف منذ بدأت أستعمل المنصة. لا غنى عنها.",
    image: avatar2,
  },
  {
    name: "يوسف العمري",
    role: "مخرج مستقل — الدار البيضاء",
    quote: "أفضل ما جرّبته في حياتي. الـ AI يفهم النص العربي تماماً ويولّد مشاهد بمستوى هوليوود.",
    image: avatar3,
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
};

export default function Index() {
  return (
    <div dir="rtl" className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <AuroraBackground />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4 pt-4">
          <div className="glass-card mx-auto flex h-16 items-center justify-between rounded-2xl px-5">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl gradient-primary glow-primary">
                <Play className="h-4 w-4 fill-primary-foreground text-primary-foreground" />
              </div>
              <span className="text-lg font-bold tracking-tight font-['Space_Grotesk']">FilmForge</span>
              <span className="hidden sm:inline-block rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary-foreground/80">AI</span>
            </Link>
            <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#features" className="hover:text-foreground transition-colors">المميزات</a>
              <a href="#how" className="hover:text-foreground transition-colors">كيف يعمل</a>
              <a href="#pricing" className="hover:text-foreground transition-colors">الأسعار</a>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/login"><Button variant="ghost" size="sm">دخول</Button></Link>
              <Link to="/login">
                <Button size="sm" className="gradient-primary border-0 text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all">
                  ابدأ مجانًا
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-7 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs"
            >
              <Zap className="h-3.5 w-3.5 text-accent" />
              <span className="text-foreground/90">منصة الجيل القادم لصناعة الأفلام بالذكاء الاصطناعي</span>
              <span className="rounded-full gradient-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">جديد</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mb-6 text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl lg:text-[88px] font-['Space_Grotesk']"
            >
              حوّل أفكارك إلى
              <br />
              <span className="text-gradient inline-block">أفلام من المستقبل</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl leading-relaxed"
            >
              منصة سينمائية متكاملة تجمع أقوى مميزات أفضل أدوات العالم —
              ذكاء اصطناعي، تعاون لحظي، تأثيرات هوليوود، ونشر بنقرة واحدة.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <Link to="/login">
                <Button size="lg" className="gradient-primary border-0 text-primary-foreground h-13 px-8 text-base shadow-xl shadow-primary/40 hover:shadow-primary/60 transition-all">
                  <Sparkles className="ml-2 h-5 w-5" />
                  ابدأ الإنشاء مجانًا
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-13 px-8 glass border-white/10 hover:bg-white/5">
                <Play className="ml-2 h-5 w-5" />
                شاهد العرض (1:30)
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-accent text-accent" />)}</div>
                <span>4.9/5 — أكثر من 12 ألف تقييم</span>
              </div>
              <span className="hidden sm:block">•</span>
              <span>بدون بطاقة ائتمان</span>
              <span className="hidden sm:block">•</span>
              <span>إلغاء في أي وقت</span>
            </motion.div>
          </div>

          {/* Hero preview frame */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.5 }}
            className="relative mx-auto mt-20 max-w-6xl"
          >
            <div className="absolute -inset-4 gradient-primary opacity-30 blur-3xl rounded-3xl" />
            <div className="relative glass-card overflow-hidden rounded-2xl">
              <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-destructive/70" />
                  <span className="h-3 w-3 rounded-full bg-accent/70" />
                  <span className="h-3 w-3 rounded-full bg-primary/70" />
                </div>
                <div className="ms-3 flex-1 text-center text-xs text-muted-foreground">FilmForge Studio — مشروع جديد</div>
              </div>
              <div className="aspect-video relative gradient-hero flex items-center justify-center">
                <div className="absolute inset-0 gradient-mesh opacity-60" />
                <div className="relative flex flex-col items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full glass glow-primary">
                    <Play className="h-8 w-8 fill-primary-foreground text-primary-foreground" />
                  </div>
                  <p className="text-sm text-foreground/70 font-['Space_Grotesk']">معاينة Studio Editor</p>
                </div>
                {/* floating UI chips */}
                <div className="absolute top-6 right-6 glass rounded-xl px-3 py-2 text-xs">
                  <Cpu className="inline h-3 w-3 ml-1 text-accent" /> AI يفكر...
                </div>
                <div className="absolute bottom-6 left-6 glass rounded-xl px-3 py-2 text-xs">
                  <Film className="inline h-3 w-3 ml-1 text-primary" /> 12 مشهد • 4K
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative py-16">
        <div className="container mx-auto px-4">
          <div className="glass-card rounded-3xl p-8 md:p-10">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {stats.map((s, i) => (
                <motion.div key={s.label} {...fadeUp} transition={{ delay: i * 0.1 }} className="text-center">
                  <div className="text-4xl font-bold text-gradient md:text-5xl font-['Space_Grotesk']">{s.value}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative py-24">
        <div className="container mx-auto px-4">
          <motion.div {...fadeUp} className="mb-16 text-center">
            <span className="rounded-full glass px-3 py-1 text-xs text-foreground/70">المميزات</span>
            <h2 className="mt-4 text-4xl font-bold md:text-5xl font-['Space_Grotesk']">
              كل ما تحتاجه — <span className="text-gradient">وأكثر</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              جمعنا أقوى مميزات المنصات العالمية في مكان واحد، وأضفنا لمساتنا السحرية
            </p>
          </motion.div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                {...fadeUp}
                transition={{ delay: (i % 3) * 0.1 }}
                className="group glass-card relative overflow-hidden rounded-2xl p-6 transition-all hover:-translate-y-1 hover:border-primary/40"
              >
                <div className="mb-5 h-16 w-16 overflow-hidden rounded-xl ring-1 ring-white/10 shadow-lg shadow-primary/20 group-hover:shadow-primary/50 transition-all">
                  <img
                    src={f.image}
                    alt={f.title}
                    width={512}
                    height={512}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <h3 className="mb-2 text-lg font-semibold font-['Space_Grotesk']">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="relative py-24">
        <div className="container mx-auto px-4">
          <motion.div {...fadeUp} className="mb-16 text-center">
            <span className="rounded-full glass px-3 py-1 text-xs text-foreground/70">كيف يعمل</span>
            <h2 className="mt-4 text-4xl font-bold md:text-5xl font-['Space_Grotesk']">
              من فكرة إلى فيلم في <span className="text-gradient">4 خطوات</span>
            </h2>
          </motion.div>
          <div className="relative grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="absolute top-10 left-0 right-0 hidden h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent lg:block" />
            {steps.map((s, i) => (
              <motion.div key={s.num} {...fadeUp} transition={{ delay: i * 0.12 }} className="relative">
                <div className="glass-card relative rounded-2xl p-6 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary text-xl font-bold text-primary-foreground shadow-lg shadow-primary/40 font-['Space_Grotesk']">
                    {s.num}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold font-['Space_Grotesk']">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative py-24">
        <div className="container mx-auto px-4">
          <motion.div {...fadeUp} className="mb-16 text-center">
            <span className="rounded-full glass px-3 py-1 text-xs text-foreground/70">آراء المبدعين</span>
            <h2 className="mt-4 text-4xl font-bold md:text-5xl font-['Space_Grotesk']">
              يحبه أكثر من <span className="text-gradient">250 ألف</span> صانع محتوى
            </h2>
          </motion.div>
          <div className="grid gap-5 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} {...fadeUp} transition={{ delay: i * 0.1 }} className="glass-card rounded-2xl p-6">
                <div className="mb-4 flex">{[...Array(5)].map((_, k) => <Star key={k} className="h-4 w-4 fill-accent text-accent" />)}</div>
                <p className="mb-5 text-sm leading-relaxed text-foreground/85">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-primary text-sm font-bold text-primary-foreground">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold font-['Space_Grotesk']">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24">
        <div className="container mx-auto px-4">
          <motion.div {...fadeUp} className="relative overflow-hidden rounded-3xl glass-strong p-12 text-center md:p-20">
            <div className="absolute inset-0 gradient-mesh opacity-60" />
            <div className="relative">
              <div className="mx-auto mb-6 h-20 w-20 overflow-hidden rounded-2xl ring-1 ring-white/15 glow-primary">
                <img
                  src={ctaRocket}
                  alt="صاروخ ينطلق"
                  width={512}
                  height={512}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <h2 className="mb-4 text-4xl font-bold md:text-6xl font-['Space_Grotesk']">
                جاهز لصنع <span className="text-gradient">المستحيل</span>؟
              </h2>
              <p className="mx-auto mb-8 max-w-xl text-muted-foreground md:text-lg">
                انضم لآلاف المبدعين وابدأ رحلتك مع منصة الجيل القادم — مجانًا
              </p>
              <Link to="/login">
                <Button size="lg" className="gradient-primary border-0 text-primary-foreground h-13 px-10 text-base shadow-xl shadow-primary/40 hover:shadow-primary/70 transition-all">
                  ابدأ الآن
                  <ArrowLeft className="mr-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/5 py-10">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md gradient-primary">
              <Play className="h-3 w-3 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground font-['Space_Grotesk']">FilmForge</span>
          </div>
          <span>© 2026 FilmForge — صُنع بشغف للمبدعين</span>
        </div>
      </footer>
    </div>
  );
}