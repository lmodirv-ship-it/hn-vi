import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Film, Crown, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const categories = ["الكل", "تسويق", "تعليم", "سوشيال ميديا", "عرض تقديمي"];

const templates = [
  { id: "1", name: "ريلز تسويقي", category: "تسويق", scenes: 5, duration: "0:30", premium: false },
  { id: "2", name: "شرح منتج", category: "تسويق", scenes: 8, duration: "1:00", premium: false },
  { id: "3", name: "درس تعليمي", category: "تعليم", scenes: 12, duration: "2:00", premium: true },
  { id: "4", name: "تيك توك — نصائح", category: "سوشيال ميديا", scenes: 4, duration: "0:15", premium: false },
  { id: "5", name: "عرض شركة", category: "عرض تقديمي", scenes: 10, duration: "3:00", premium: true },
  { id: "6", name: "إعلان قصير", category: "تسويق", scenes: 3, duration: "0:15", premium: false },
  { id: "7", name: "ستوري انستغرام", category: "سوشيال ميديا", scenes: 6, duration: "0:15", premium: false },
  { id: "8", name: "مقدمة يوتيوب", category: "سوشيال ميديا", scenes: 3, duration: "0:10", premium: true },
];

export default function Templates() {
  const [activeCategory, setActiveCategory] = useState("الكل");
  const { toast } = useToast();

  const filtered = activeCategory === "الكل" ? templates : templates.filter((t) => t.category === activeCategory);

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

      {/* Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.05, 0.3) }}
            className="group overflow-hidden rounded-2xl glass-card transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/15"
          >
            <div className="relative aspect-video">
              <div className="absolute inset-0 gradient-hero" />
              <div className="absolute inset-0 gradient-mesh opacity-50" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Film className="h-9 w-9 text-primary-foreground/20 group-hover:scale-110 transition-transform" />
              </div>
              {t.premium && (
                <Badge className="absolute top-2 right-2 gradient-accent border-0 text-accent-foreground shadow-lg">
                  <Crown className="ml-1 h-3 w-3" />
                  مميز
                </Badge>
              )}
              <div className="absolute bottom-2 left-2 rounded-full glass px-2 py-0.5 text-xs text-foreground">
                {t.duration}
              </div>
            </div>
            <div className="p-4">
              <h3 className="mb-1 font-semibold font-['Space_Grotesk']">{t.name}</h3>
              <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                <span>{t.scenes} مشاهد</span>
                <span>·</span>
                <span>{t.category}</span>
              </div>
              <Button
                size="sm"
                className="w-full gradient-primary border-0 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
                onClick={() => toast({ title: "قريبًا!", description: "سيتم ربط القوالب بالمحرر" })}
              >
                <Sparkles className="ml-2 h-3.5 w-3.5" />
                استخدم القالب
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
