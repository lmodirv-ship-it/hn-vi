import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Play, Sparkles, Zap, Film, Cpu, ArrowLeft, Star, PenLine, Wand2, Rocket, Users, Globe2, Heart,
} from "lucide-react";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { Check, Crown, Gem } from "lucide-react";
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

const pricingPlans = [
  {
    name: "مجاني",
    price: "0",
    period: "للأبد",
    description: "مثالي للتجربة وصناعة الفيديوهات الأولى",
    icon: Sparkles,
    features: [
      "5 فيديوهات شهرياً",
      "دقة 720p",
      "20 قالب أساسي",
      "علامة مائية صغيرة",
      "تصدير في دقيقتين",
    ],
    cta: "ابدأ مجاناً",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "19",
    period: "/شهر",
    description: "للمبدعين وصناع المحتوى المحترفين",
    icon: Gem,
    features: [
      "فيديوهات غير محدودة",
      "دقة 4K سينمائية",
      "+200 قالب احترافي",
      "بدون علامة مائية",
      "أصوات AI بـ 50 لغة",
      "تصدير سريع بـ GPU",
      "نشر مباشر للمنصات",
    ],
    cta: "ابدأ تجربة 7 أيام",
    highlighted: true,
  },
  {
    name: "Studio",
    price: "49",
    period: "/شهر",
    description: "للفرق والوكالات والاستوديوهات",
    icon: Crown,
    features: [
      "كل مميزات Pro",
      "تعاون لحظي للفريق",
      "دقة 8K + HDR",
      "تأثيرات هوليوود كاملة",
      "API للمطورين",
      "تخزين سحابي 1TB",
      "دعم فني VIP 24/7",
    ],
    cta: "تواصل مع المبيعات",
    highlighted: false,
  },
];

const faqs = [
  {
    q: "هل أحتاج خبرة في التصميم أو المونتاج؟",
    a: "أبداً. FilmForge مصمم ليكون بسيطاً جداً — اكتب فكرتك بالعربية والذكاء الاصطناعي يتولى الباقي. لا حاجة لخبرة تقنية أو إبداعية مسبقة.",
  },
  {
    q: "ما هي جودة الفيديوهات الناتجة؟",
    a: "نوفر جودة سينمائية تصل إلى 4K (و 8K في خطة Studio) بمعدل 60 إطار/ثانية، مع تأثيرات بصرية بمستوى استوديوهات هوليوود وألوان LUTs احترافية.",
  },
  {
    q: "ما هي اللغات المدعومة؟",
    a: "ندعم أكثر من 50 لغة بشكل كامل، مع تركيز خاص على اللغة العربية بجميع لهجاتها (الفصحى، الخليجية، المصرية، المغربية...) وأصوات بشرية واقعية.",
  },
  {
    q: "هل بياناتي ومشاريعي آمنة؟",
    a: "نعم 100%. نستخدم تشفيراً كاملاً، Row Level Security على قاعدة البيانات، نسخ احتياطية تلقائية، ولا نشارك أي بيانات مع أطراف ثالثة. مشاريعك ملكك وحدك.",
  },
  {
    q: "هل يمكنني الإلغاء في أي وقت؟",
    a: "بالطبع. لا توجد عقود أو التزامات. يمكنك الإلغاء بنقرة واحدة من إعدادات حسابك، وتحتفظ بجميع فيديوهاتك بعد الإلغاء.",
  },
  {
    q: "هل أملك حقوق الفيديوهات التي أنشئها؟",
    a: "نعم. جميع الفيديوهات التي تنشئها ملكك بالكامل بحقوق تجارية كاملة — يمكنك استخدامها في الإعلانات والحملات والبيع دون أي قيود.",
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
            {/* Diamond glow halo */}
            <div className="absolute -inset-6 gradient-primary opacity-40 blur-[100px] rounded-[3rem]" />
            <div className="absolute -inset-2 bg-gradient-to-tr from-primary/30 via-accent/20 to-primary/30 blur-2xl rounded-3xl" />

            {/* Cinematic frame with diamond clip */}
            <div className="relative glass-strong overflow-hidden rounded-3xl ring-1 ring-white/10">
              <div className="flex items-center gap-2 border-b border-white/5 px-5 py-3">
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-destructive/70" />
                  <span className="h-3 w-3 rounded-full bg-accent/70" />
                  <span className="h-3 w-3 rounded-full bg-primary/70" />
                </div>
                <div className="ms-3 flex-1 text-center text-xs text-muted-foreground font-['Space_Grotesk']">
                  FilmForge Studio — مشروع سينمائي جديد
                </div>
              </div>
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={heroCinematic}
                  alt="واجهة محرر FilmForge السينمائي مع مؤثرات ألماسية مستقبلية"
                  width={1920}
                  height={1080}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                {/* Floating play */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.9 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <button className="group/play relative flex h-24 w-24 items-center justify-center rounded-full glass-strong glow-primary ring-2 ring-white/20 transition-transform hover:scale-110">
                    <span className="absolute inset-0 rounded-full gradient-primary opacity-40 blur-xl group-hover/play:opacity-70 transition-opacity" />
                    <Play className="relative h-9 w-9 fill-primary-foreground text-primary-foreground" />
                  </button>
                </motion.div>
                {/* Floating UI chips */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1 }}
                  className="absolute top-6 right-6 glass-strong rounded-xl px-3 py-2 text-xs ring-1 ring-white/10"
                >
                  <Cpu className="inline h-3 w-3 ml-1 text-accent" /> AI يولّد المشاهد...
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 }}
                  className="absolute bottom-6 left-6 glass-strong rounded-xl px-3 py-2 text-xs ring-1 ring-white/10"
                >
                  <Film className="inline h-3 w-3 ml-1 text-primary" /> 12 مشهد • 4K • 60fps
                </motion.div>
              </div>
            </div>

            {/* Floating diamond accents */}
            <div className="pointer-events-none absolute -top-8 -right-8 hidden md:block">
              <div className="h-16 w-16 rotate-45 gradient-primary opacity-60 blur-md rounded-lg" />
            </div>
            <div className="pointer-events-none absolute -bottom-8 -left-8 hidden md:block">
              <div className="h-20 w-20 rotate-45 bg-accent/40 blur-md rounded-lg" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative py-16">
        <div className="container mx-auto px-4">
          <div className="relative">
            <div className="absolute inset-0 gradient-primary opacity-20 blur-3xl" />
            <div className="relative glass-strong rounded-3xl p-8 md:p-12 ring-1 ring-white/10">
              <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                {stats.map((s, i) => (
                  <motion.div
                    key={s.label}
                    {...fadeUp}
                    transition={{ delay: i * 0.1 }}
                    className="group relative text-center"
                  >
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl glass ring-1 ring-white/10 group-hover:ring-primary/50 transition-all">
                      <s.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-4xl font-bold text-gradient md:text-5xl font-['Space_Grotesk'] tracking-tight">
                      {s.value}
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">{s.label}</div>
                  </motion.div>
                ))}
              </div>
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
              من فكرة إلى فيلم في <span className="text-gradient">3 خطوات</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              عملية بسيطة، نتائج سينمائية. لا حاجة لخبرة تقنية — فقط أفكارك.
            </p>
          </motion.div>
          <div className="relative grid gap-8 md:grid-cols-3">
            {/* Connecting line */}
            <div className="absolute top-1/3 left-[10%] right-[10%] hidden h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent md:block" />
            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                {...fadeUp}
                transition={{ delay: i * 0.15 }}
                className="group relative"
              >
                <div className="glass-card relative overflow-hidden rounded-3xl ring-1 ring-white/10 transition-all duration-500 hover:-translate-y-2 hover:ring-primary/40 hover:shadow-2xl hover:shadow-primary/30">
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={s.image}
                      alt={s.title}
                      width={1024}
                      height={768}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                    {/* Number badge */}
                    <div className="absolute top-4 right-4 flex h-12 w-12 items-center justify-center rotate-45 rounded-lg gradient-primary shadow-lg shadow-primary/50">
                      <span className="-rotate-45 text-base font-bold text-primary-foreground font-['Space_Grotesk']">
                        {s.num}
                      </span>
                    </div>
                    {/* Icon chip */}
                    <div className="absolute bottom-4 left-4 flex h-10 w-10 items-center justify-center rounded-xl glass-strong ring-1 ring-white/15">
                      <s.icon className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                  {/* Content */}
                  <div className="p-6">
                    <h3 className="mb-3 text-xl font-bold font-['Space_Grotesk']">{s.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                  </div>
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
              <motion.div
                key={t.name}
                {...fadeUp}
                transition={{ delay: i * 0.12 }}
                className="group glass-card relative overflow-hidden rounded-3xl p-7 ring-1 ring-white/10 transition-all hover:-translate-y-1 hover:ring-primary/40 hover:shadow-2xl hover:shadow-primary/20"
              >
                {/* Decorative gradient */}
                <div className="absolute -top-12 -right-12 h-32 w-32 rotate-45 gradient-primary opacity-10 blur-2xl group-hover:opacity-30 transition-opacity" />
                <div className="relative">
                  <div className="mb-4 flex">
                    {[...Array(5)].map((_, k) => (
                      <Star key={k} className="h-4 w-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="mb-6 text-base leading-relaxed text-foreground/90 font-['Space_Grotesk']">
                    "{t.quote}"
                  </p>
                  <div className="flex items-center gap-3 border-t border-white/5 pt-4">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2 ring-primary/30">
                      <img
                        src={t.image}
                        alt={t.name}
                        width={512}
                        height={512}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-bold font-['Space_Grotesk']">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative py-24">
        <div className="container mx-auto px-4">
          <motion.div {...fadeUp} className="mb-16 text-center">
            <span className="rounded-full glass px-3 py-1 text-xs text-foreground/70">الأسعار</span>
            <h2 className="mt-4 text-4xl font-bold md:text-5xl font-['Space_Grotesk']">
              خطط <span className="text-gradient">تناسب الجميع</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              ابدأ مجاناً وارتقِ متى احتجت — بدون عقود، بدون مفاجآت
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={plan.name}
                {...fadeUp}
                transition={{ delay: i * 0.1 }}
                className={`group relative ${plan.highlighted ? "md:-translate-y-4" : ""}`}
              >
                {plan.highlighted && (
                  <>
                    <div className="absolute -inset-1 gradient-primary opacity-50 blur-2xl rounded-3xl" />
                    <div className="absolute -top-4 left-1/2 z-10 -translate-x-1/2">
                      <div className="rotate-0 rounded-full gradient-primary px-4 py-1 text-[11px] font-bold text-primary-foreground shadow-lg shadow-primary/50 font-['Space_Grotesk'] tracking-wide">
                        ⭐ الأكثر شعبية
                      </div>
                    </div>
                  </>
                )}
                <div
                  className={`relative h-full overflow-hidden rounded-3xl p-8 ring-1 transition-all hover:-translate-y-1 ${
                    plan.highlighted
                      ? "glass-strong ring-primary/40 shadow-2xl shadow-primary/30"
                      : "glass-card ring-white/10 hover:ring-primary/30"
                  }`}
                >
                  {/* Diamond corner accent */}
                  <div
                    className={`pointer-events-none absolute -top-10 -right-10 h-24 w-24 rotate-45 blur-2xl ${
                      plan.highlighted ? "gradient-primary opacity-40" : "bg-primary/20 opacity-50"
                    }`}
                  />

                  {/* Icon */}
                  <div
                    className={`mb-5 flex h-14 w-14 rotate-45 items-center justify-center rounded-xl ring-1 ${
                      plan.highlighted
                        ? "gradient-primary shadow-lg shadow-primary/50 ring-white/20"
                        : "glass ring-white/10"
                    }`}
                  >
                    <plan.icon
                      className={`h-6 w-6 -rotate-45 ${
                        plan.highlighted ? "text-primary-foreground" : "text-primary"
                      }`}
                    />
                  </div>

                  {/* Name */}
                  <h3 className="mb-2 text-2xl font-bold font-['Space_Grotesk']">{plan.name}</h3>
                  <p className="mb-6 text-sm text-muted-foreground">{plan.description}</p>

                  {/* Price */}
                  <div className="mb-6 flex items-end gap-2">
                    <span className="text-5xl font-bold font-['Space_Grotesk'] tracking-tight">
                      ${plan.price}
                    </span>
                    <span className="mb-2 text-sm text-muted-foreground">{plan.period}</span>
                  </div>

                  {/* CTA */}
                  <Link to="/login" className="block">
                    <Button
                      size="lg"
                      className={`mb-7 w-full ${
                        plan.highlighted
                          ? "gradient-primary border-0 text-primary-foreground shadow-lg shadow-primary/40 hover:shadow-primary/60"
                          : "glass border border-white/10 bg-transparent text-foreground hover:bg-white/5"
                      }`}
                    >
                      {plan.cta}
                    </Button>
                  </Link>

                  {/* Features */}
                  <ul className="space-y-3">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-3 text-sm">
                        <span
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md ${
                            plan.highlighted
                              ? "gradient-primary"
                              : "bg-primary/15 ring-1 ring-primary/30"
                          }`}
                        >
                          <Check
                            className={`h-3 w-3 ${
                              plan.highlighted ? "text-primary-foreground" : "text-primary"
                            }`}
                          />
                        </span>
                        <span className="text-foreground/85 leading-relaxed">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.p
            {...fadeUp}
            className="mt-10 text-center text-sm text-muted-foreground"
          >
            جميع الخطط تشمل: تشفير كامل • نسخ احتياطية تلقائية • دعم باللغة العربية
          </motion.p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="relative py-24">
        <div className="container mx-auto px-4">
          <motion.div {...fadeUp} className="mb-16 text-center">
            <span className="rounded-full glass px-3 py-1 text-xs text-foreground/70">الأسئلة الشائعة</span>
            <h2 className="mt-4 text-4xl font-bold md:text-5xl font-['Space_Grotesk']">
              أسئلة <span className="text-gradient">يطرحها الجميع</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              كل ما تحتاج معرفته قبل أن تبدأ رحلتك مع FilmForge
            </p>
          </motion.div>

          <motion.div {...fadeUp} className="relative mx-auto max-w-3xl">
            {/* Diamond background accents */}
            <div className="pointer-events-none absolute -top-10 -right-10 h-24 w-24 rotate-45 gradient-primary opacity-15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-10 -left-10 h-28 w-28 rotate-45 bg-accent/30 blur-3xl" />

            <Accordion
              type="single"
              collapsible
              className="relative glass-card rounded-3xl ring-1 ring-white/10 p-2 md:p-4"
            >
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`item-${i}`}
                  className="border-b border-white/5 last:border-0 px-4 md:px-6"
                >
                  <AccordionTrigger className="text-right text-base font-semibold font-['Space_Grotesk'] hover:text-primary hover:no-underline py-5">
                    <span className="flex items-center gap-3 flex-1">
                      <span className="flex h-7 w-7 shrink-0 rotate-45 items-center justify-center rounded-md gradient-primary text-[11px] font-bold text-primary-foreground shadow-md shadow-primary/40">
                        <span className="-rotate-45">{i + 1}</span>
                      </span>
                      {faq.q}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5 pr-10">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24">
        <div className="container mx-auto px-4">
          <motion.div {...fadeUp} className="relative">
            {/* Diamond glow halo */}
            <div className="absolute -inset-8 gradient-primary opacity-30 blur-[120px] rounded-[3rem]" />

            <div className="relative overflow-hidden rounded-[2.5rem] glass-strong ring-1 ring-white/10 p-10 text-center md:p-20">
              {/* Background image */}
              <div className="absolute inset-0">
                <img
                  src={ctaRocket}
                  alt=""
                  aria-hidden="true"
                  className="h-full w-full object-cover opacity-20"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background/90" />
                <div className="absolute inset-0 gradient-mesh opacity-50" />
              </div>

              {/* Floating diamonds */}
              <div className="pointer-events-none absolute top-10 right-10 h-20 w-20 rotate-45 gradient-primary opacity-20 blur-xl" />
              <div className="pointer-events-none absolute bottom-10 left-10 h-24 w-24 rotate-45 bg-accent/30 blur-xl" />
              <div className="pointer-events-none absolute top-1/2 left-1/4 h-12 w-12 -translate-y-1/2 rotate-45 bg-primary/40 blur-lg" />

              <div className="relative mx-auto max-w-3xl">
                {/* Diamond logo */}
                <motion.div
                  initial={{ scale: 0, rotate: 0 }}
                  whileInView={{ scale: 1, rotate: 360 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="mx-auto mb-8 flex h-24 w-24 rotate-45 items-center justify-center rounded-2xl gradient-primary shadow-2xl shadow-primary/60"
                >
                  <Sparkles className="h-10 w-10 -rotate-45 text-primary-foreground" />
                </motion.div>

                <h2 className="mb-5 text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl font-['Space_Grotesk']">
                  ابدأ صناعة
                  <br />
                  <span className="text-gradient">المستقبل اليوم</span>
                </h2>
                <p className="mx-auto mb-10 max-w-xl text-base text-muted-foreground md:text-lg leading-relaxed">
                  انضم لـ <span className="font-bold text-foreground">+250,000</span> مبدع يصنعون أفلاماً سينمائية بذكاء اصطناعي.
                  لا حاجة لبطاقة ائتمان — فقط أفكارك.
                </p>

                <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Link to="/login">
                    <Button
                      size="lg"
                      className="group gradient-primary border-0 text-primary-foreground h-14 px-10 text-base shadow-2xl shadow-primary/50 hover:shadow-primary/80 transition-all hover:-translate-y-0.5"
                    >
                      <Sparkles className="ml-2 h-5 w-5 transition-transform group-hover:rotate-12" />
                      ابدأ مجاناً الآن
                      <ArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
                    </Button>
                  </Link>
                  <a href="#how">
                    <Button size="lg" variant="outline" className="h-14 px-8 glass border-white/10 hover:bg-white/5">
                      <Play className="ml-2 h-5 w-5" />
                      شاهد كيف يعمل
                    </Button>
                  </a>
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                    بدون بطاقة ائتمان
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                    إعداد في 30 ثانية
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                    إلغاء في أي وقت
                  </span>
                </div>
              </div>
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