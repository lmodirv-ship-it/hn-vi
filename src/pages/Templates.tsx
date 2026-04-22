import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { trackEvent, ANALYTICS_EVENTS } from "@/lib/analytics";
import tplMarketing from "@/assets/tpl-marketing.jpg";
import tplEducation from "@/assets/tpl-education.jpg";
import tplSocial from "@/assets/tpl-social.jpg";
import tplPresentation from "@/assets/tpl-presentation.jpg";

const categoryImages: Record<string, string> = {
  "تسويق": tplMarketing,
  "تعليم": tplEducation,
  "سوشيال ميديا": tplSocial,
  "عرض تقديمي": tplPresentation,
};

const categories = ["الكل", "تسويق", "تعليم", "سوشيال ميديا", "عرض تقديمي"];

interface Template {
  id: string;
  name: string;
  category: string;
  is_premium: boolean | null;
  config_json: any;
}

function fmtDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function Templates() {
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingId, setUsingId] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("templates")
        .select("*")
        .order("created_at", { ascending: true });
      if (!error && data) setTemplates(data as Template[]);
      setLoading(false);
    })();
  }, []);

  const filtered = activeCategory === "الكل" ? templates : templates.filter((t) => t.category === activeCategory);

  const handleUseTemplate = async (t: Template) => {
    if (!user) {
      navigate("/login");
      return;
    }
    setUsingId(t.id);
    try {
      const scenes = (t.config_json as any)?.scenes ?? [];
      const { data, error } = await supabase
        .from("projects")
        .insert({
          user_id: user.id,
          title: t.name,
          script_json: scenes,
          status: "draft",
        })
        .select()
        .single();
      if (error) throw error;
      trackEvent(ANALYTICS_EVENTS.TEMPLATE_USE, { template_id: t.id, template_name: t.name });
      trackEvent(ANALYTICS_EVENTS.PROJECT_CREATE, { from_template: true });
      toast({ title: "تم إنشاء المشروع!", description: `جاري فتح "${t.name}"...` });
      navigate(`/editor/${data.id}`);
    } catch (e: any) {
      toast({ title: "خطأ", description: e.message, variant: "destructive" });
    } finally {
      setUsingId(null);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen p-6 lg:p-10">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-4xl font-bold font-['Space_Grotesk']">
          مكتبة <span className="text-gradient">القوالب</span>
        </h1>
        <p className="text-muted-foreground mt-2">اختر قالبًا سينمائيًا وابدأ التعديل في ثوانٍ</p>
      </motion.div>

      {/* Category Filter */}
      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={activeCategory === cat ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(cat)}
            className={activeCategory === cat
              ? "gradient-primary border-0 text-primary-foreground shadow-lg shadow-primary/30"
              : "glass border-white/10 hover:bg-white/5"}
          >
            {cat}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((t, i) => {
          const scenes = (t.config_json as any)?.scenes ?? [];
          const totalDuration = scenes.reduce((acc: number, s: any) => acc + (s.duration || 0), 0);
          return (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.05, 0.3) }}
            className="group overflow-hidden rounded-2xl glass-card transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/15"
          >
            <div className="relative aspect-video">
              <img
                src={categoryImages[t.category] ?? tplMarketing}
                alt={t.name}
                width={896}
                height={512}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
              {t.is_premium && (
                <Badge className="absolute top-2 right-2 gradient-accent border-0 text-accent-foreground shadow-lg">
                  <Crown className="ml-1 h-3 w-3" />
                  مميز
                </Badge>
              )}
              <div className="absolute bottom-2 left-2 rounded-full glass px-2 py-0.5 text-xs text-foreground">
                {fmtDuration(totalDuration)}
              </div>
            </div>
            <div className="p-4">
              <h3 className="mb-1 font-semibold font-['Space_Grotesk']">{t.name}</h3>
              <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                <span>{scenes.length} مشاهد</span>
                <span>·</span>
                <span>{t.category}</span>
              </div>
              <Button
                size="sm"
                disabled={usingId === t.id}
                className="w-full gradient-primary border-0 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
                onClick={() => handleUseTemplate(t)}
              >
                {usingId === t.id ? <Loader2 className="ml-2 h-3.5 w-3.5 animate-spin" /> : <Sparkles className="ml-2 h-3.5 w-3.5" />}
                {usingId === t.id ? "جاري الإنشاء..." : "استخدم القالب"}
              </Button>
            </div>
          </motion.div>
          );
        })}
      </div>
      )}
    </div>
  );
}
