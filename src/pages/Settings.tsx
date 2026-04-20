import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Lock, Save, KeyRound, Bell, Palette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { toast } = useToast();

  return (
    <div dir="rtl" className="min-h-screen p-6 lg:p-10 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-4xl font-bold font-['Space_Grotesk']">
          <span className="text-gradient">الإعدادات</span>
        </h1>
        <p className="text-muted-foreground mt-2">خصّص تجربتك في FilmForge</p>
      </motion.div>

      <div className="space-y-5">
        {/* Profile */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6">
          <div className="mb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl gradient-primary shadow-lg shadow-primary/30">
                <User className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-semibold font-['Space_Grotesk']">الملف الشخصي</h2>
                <p className="text-xs text-muted-foreground">معلوماتك الأساسية</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>الاسم</Label>
              <div className="relative">
                <User className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="أحمد محمد" className="pr-10 glass border-white/10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>البريد الإلكتروني</Label>
              <div className="relative">
                <Mail className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input type="email" placeholder="you@example.com" className="pr-10 glass border-white/10" disabled />
              </div>
            </div>
            <Button
              className="gradient-primary border-0 text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-primary/60 transition-all"
              onClick={() => toast({ title: "قريبًا!" })}
            >
              <Save className="h-4 w-4 ml-2" />
              حفظ التغييرات
            </Button>
          </div>
        </motion.div>

        {/* Security */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="glass-card rounded-2xl p-6">
          <div className="mb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl gradient-accent shadow-lg shadow-accent/30">
                <KeyRound className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-semibold font-['Space_Grotesk']">الأمان</h2>
                <p className="text-xs text-muted-foreground">تغيير كلمة المرور</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>كلمة المرور الحالية</Label>
              <div className="relative">
                <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input type="password" className="pr-10 glass border-white/10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>كلمة المرور الجديدة</Label>
              <div className="relative">
                <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input type="password" className="pr-10 glass border-white/10" />
              </div>
            </div>
            <Button
              className="gradient-accent border-0 text-accent-foreground shadow-lg shadow-accent/30 hover:shadow-accent/60 transition-all"
              onClick={() => toast({ title: "قريبًا!" })}
            >
              <KeyRound className="h-4 w-4 ml-2" />
              تغيير كلمة المرور
            </Button>
          </div>
        </motion.div>

        {/* Preferences */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className="glass-card rounded-2xl p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl gradient-primary shadow-lg shadow-primary/30">
              <Palette className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-semibold font-['Space_Grotesk']">التفضيلات</h2>
              <p className="text-xs text-muted-foreground">المظهر، اللغة، والإشعارات</p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <button onClick={() => toast({ title: "قريبًا!" })} className="glass rounded-xl p-4 text-right transition-all hover:border-primary/40 hover:bg-white/5 border border-white/5">
              <div className="flex items-center gap-2 text-sm font-medium"><Bell className="h-4 w-4 text-accent" /> الإشعارات</div>
              <p className="mt-1 text-xs text-muted-foreground">تنبيهات المشاريع والإنجازات</p>
            </button>
            <button onClick={() => toast({ title: "قريبًا!" })} className="glass rounded-xl p-4 text-right transition-all hover:border-primary/40 hover:bg-white/5 border border-white/5">
              <div className="flex items-center gap-2 text-sm font-medium"><Palette className="h-4 w-4 text-primary" /> المظهر</div>
              <p className="mt-1 text-xs text-muted-foreground">داكن / فاتح / تلقائي</p>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
