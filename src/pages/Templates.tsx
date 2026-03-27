import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-['Space_Grotesk']">القوالب</h1>
        <p className="text-muted-foreground">اختر قالبًا جاهزًا وابدأ بتعديله حسب رغبتك</p>
      </div>

      {/* Category Filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={activeCategory === cat ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(cat)}
            className={activeCategory === cat ? "gradient-primary border-0 text-primary-foreground" : ""}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Template Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((t) => (
          <Card key={t.id} className="group overflow-hidden border-border transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
            <div className="relative aspect-video bg-muted">
              <div className="absolute inset-0 flex items-center justify-center gradient-hero">
                <Film className="h-8 w-8 text-primary-foreground/20" />
              </div>
              {t.premium && (
                <Badge className="absolute top-2 left-2 gradient-accent border-0 text-accent-foreground">
                  <Crown className="mr-1 h-3 w-3" />
                  مميز
                </Badge>
              )}
              <div className="absolute bottom-2 right-2 rounded bg-foreground/80 px-2 py-0.5 text-xs text-background">
                {t.duration}
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="mb-1 font-semibold font-['Space_Grotesk']">{t.name}</h3>
              <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                <span>{t.scenes} مشاهد</span>
                <span>·</span>
                <span>{t.category}</span>
              </div>
              <Button
                size="sm"
                className="w-full gradient-primary border-0 text-primary-foreground"
                onClick={() => toast({ title: "قريبًا!", description: "سيتم ربط القوالب بالمحرر" })}
              >
                <Sparkles className="mr-2 h-3.5 w-3.5" />
                استخدم القالب
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
