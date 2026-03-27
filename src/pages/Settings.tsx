import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Lock, Save, KeyRound } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { toast } = useToast();

  return (
    <div dir="rtl" className="min-h-screen bg-background p-6 lg:p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-['Space_Grotesk'] text-foreground">الإعدادات</h1>
        <p className="text-muted-foreground mt-1">إدارة حسابك وتفضيلاتك</p>
      </div>

      <div className="space-y-6">
        {/* Profile Card */}
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl gradient-primary">
                <User className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="font-['Space_Grotesk'] text-foreground">الملف الشخصي</CardTitle>
                <CardDescription>معلوماتك الأساسية</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-foreground">الاسم</Label>
              <div className="relative">
                <User className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="أحمد محمد" className="pr-10 bg-muted/50 border-border/50 text-foreground placeholder:text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">البريد الإلكتروني</Label>
              <div className="relative">
                <Mail className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input type="email" placeholder="you@example.com" className="pr-10 bg-muted/50 border-border/50 text-foreground placeholder:text-muted-foreground" disabled />
              </div>
            </div>
            <Button
              className="gradient-primary border-0 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
              onClick={() => toast({ title: "قريبًا!" })}
            >
              <Save className="h-4 w-4 ml-2" />
              حفظ التغييرات
            </Button>
          </CardContent>
        </Card>

        {/* Security Card */}
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl gradient-accent">
                <KeyRound className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <CardTitle className="font-['Space_Grotesk'] text-foreground">الأمان</CardTitle>
                <CardDescription>تغيير كلمة المرور</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-foreground">كلمة المرور الحالية</Label>
              <div className="relative">
                <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input type="password" className="pr-10 bg-muted/50 border-border/50 text-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">كلمة المرور الجديدة</Label>
              <div className="relative">
                <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input type="password" className="pr-10 bg-muted/50 border-border/50 text-foreground" />
              </div>
            </div>
            <Button
              className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg transition-all"
              onClick={() => toast({ title: "قريبًا!" })}
            >
              <KeyRound className="h-4 w-4 ml-2" />
              تغيير كلمة المرور
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
