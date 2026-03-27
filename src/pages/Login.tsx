import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Mail, Lock, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "قريبًا!",
      description: "سيتم تفعيل نظام المصادقة بعد ربط Lovable Cloud",
    });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4">
      <div className="gradient-hero absolute inset-0" />
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: 'radial-gradient(circle at 50% 30%, hsl(250 84% 54% / 0.3) 0%, transparent 50%)'
      }} />

      <Card className="relative w-full max-w-md border-border/50 bg-card/95 backdrop-blur-xl">
        <CardHeader className="text-center">
          <Link to="/" className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl gradient-primary">
            <Play className="h-5 w-5 text-primary-foreground" />
          </Link>
          <CardTitle className="text-2xl font-['Space_Grotesk']">
            {isSignUp ? "إنشاء حساب جديد" : "تسجيل الدخول"}
          </CardTitle>
          <CardDescription>
            {isSignUp ? "أنشئ حسابك وابدأ بإنشاء أفلامك" : "مرحبًا بعودتك! سجل الدخول للمتابعة"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="name">الاسم الكامل</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="name" placeholder="أحمد محمد" value={name} onChange={(e) => setName(e.target.value)} className="pl-10" />
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10" />
              </div>
            </div>
            <Button type="submit" className="w-full gradient-primary border-0 text-primary-foreground">
              {isSignUp ? "إنشاء الحساب" : "تسجيل الدخول"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {isSignUp ? "لديك حساب بالفعل؟" : "ليس لديك حساب؟"}{" "}
            <button onClick={() => setIsSignUp(!isSignUp)} className="font-medium text-primary hover:underline">
              {isSignUp ? "سجل الدخول" : "أنشئ حساب"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
