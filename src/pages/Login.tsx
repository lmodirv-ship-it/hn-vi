import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Play, Mail, Lock, User, ArrowRight, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import AuroraBackground from "@/components/futuristic/AuroraBackground";

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [adminMode, setAdminMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (adminMode) {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: { emailRedirectTo: `${window.location.origin}/dashboard` },
        });
        if (error) throw error;
        toast({ title: "تم إرسال الرابط!", description: "تحقق من بريدك الإلكتروني للدخول كمدير" });
      } else if (isSignUp) {
        await signUp(email, password, name);
        toast({ title: "تم إنشاء الحساب!", description: "تحقق من بريدك الإلكتروني لتأكيد الحساب" });
      } else {
        await signIn(email, password);
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div dir="rtl" className="relative flex min-h-screen items-center justify-center p-4">
      <AuroraBackground />
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        <div className="absolute -inset-4 gradient-primary opacity-30 blur-3xl rounded-3xl" />
        <div className="relative glass-card rounded-3xl p-8">
          <div className="text-center">
            <Link to="/" className="mx-auto mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary glow-primary">
              <Play className="h-6 w-6 fill-primary-foreground text-primary-foreground" />
            </Link>
            <h1 className="text-2xl font-bold font-['Space_Grotesk']">
              {isSignUp ? "أهلًا بك في FilmForge" : "مرحبًا بعودتك"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {isSignUp ? "أنشئ حسابك وابدأ صناعة المستحيل" : "سجل دخولك للمتابعة"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="name">الاسم الكامل</Label>
                <div className="relative">
                  <User className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="name" placeholder="أحمد محمد" value={name} onChange={(e) => setName(e.target.value)} className="pr-10 glass border-white/10" />
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <div className="relative">
                <Mail className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pr-10 glass border-white/10" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <div className="relative">
                <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pr-10 glass border-white/10" required minLength={6} />
              </div>
            </div>
            <Button type="submit" size="lg" className="w-full gradient-primary border-0 text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-primary/60 transition-all" disabled={isLoading}>
              {isLoading ? "جاري التحميل..." : isSignUp ? "إنشاء الحساب" : "تسجيل الدخول"}
              {!isLoading && <ArrowRight className="mr-2 h-4 w-4 rtl:rotate-180" />}
            </Button>
          </form>

          <div className="mt-7 text-center text-sm text-muted-foreground">
            {isSignUp ? "لديك حساب بالفعل؟" : "ليس لديك حساب؟"}{" "}
            <button onClick={() => setIsSignUp(!isSignUp)} className="font-medium text-primary hover:underline">
              {isSignUp ? "سجل الدخول" : "أنشئ حساب"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
