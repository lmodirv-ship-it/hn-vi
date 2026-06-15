import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { User, Mail, Lock, Save, KeyRound, Bell, Palette, Loader2, Camera, Languages } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Settings() {
  const { toast } = useToast();
  const { user } = useAuth();
  const { profile, loading, updateProfile, uploadAvatar } = useProfile();
  const { t } = useTranslation();
  const fileRef = useRef<HTMLInputElement>(null);

  const [displayName, setDisplayName] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [changingPwd, setChangingPwd] = useState(false);

  const [notifications, setNotifications] = useState(true);
  const [savingPrefs, setSavingPrefs] = useState(false);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name ?? "");
      setNotifications(profile.preferences?.notifications ?? true);
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      await updateProfile({ display_name: displayName });
      toast({ title: "تم حفظ التغييرات" });
    } catch (e: any) {
      toast({ title: "خطأ", description: e.message, variant: "destructive" });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "حجم الصورة كبير", description: "الحد الأقصى 5MB", variant: "destructive" });
      return;
    }
    setUploadingAvatar(true);
    try {
      await uploadAvatar(file);
      toast({ title: "تم رفع الصورة" });
    } catch (err: any) {
      toast({ title: "خطأ", description: err.message, variant: "destructive" });
    } finally {
      setUploadingAvatar(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleChangePassword = async () => {
    if (!newPwd || newPwd.length < 6) {
      toast({ title: "كلمة مرور قصيرة", description: "6 أحرف على الأقل", variant: "destructive" });
      return;
    }
    if (!user?.email) return;
    setChangingPwd(true);
    try {
      // Verify current password by reauthenticating
      const { error: signErr } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPwd,
      });
      if (signErr) throw new Error("كلمة المرور الحالية غير صحيحة");
      const { error } = await supabase.auth.updateUser({ password: newPwd });
      if (error) throw error;
      setCurrentPwd("");
      setNewPwd("");
      toast({ title: "تم تغيير كلمة المرور" });
    } catch (e: any) {
      toast({ title: "خطأ", description: e.message, variant: "destructive" });
    } finally {
      setChangingPwd(false);
    }
  };

  const handleSavePrefs = async (next: boolean) => {
    setNotifications(next);
    setSavingPrefs(true);
    try {
      await updateProfile({ preferences: { ...(profile?.preferences ?? {}), notifications: next } });
    } catch (e: any) {
      toast({ title: "خطأ", description: e.message, variant: "destructive" });
    } finally {
      setSavingPrefs(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="h-16 w-16 rounded-full overflow-hidden border border-white/10 bg-muted flex items-center justify-center">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="avatar" className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-7 w-7 text-muted-foreground" />
                  )}
                </div>
              </div>
              <div>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatar} className="hidden" />
                <Button variant="outline" size="sm" disabled={uploadingAvatar} onClick={() => fileRef.current?.click()}>
                  {uploadingAvatar ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <Camera className="ml-2 h-4 w-4" />}
                  تغيير الصورة
                </Button>
                <p className="mt-1 text-xs text-muted-foreground">PNG/JPG حتى 5MB</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label>الاسم</Label>
              <div className="relative">
                <User className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="أحمد محمد" className="pr-10 glass border-white/10" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>البريد الإلكتروني</Label>
              <div className="relative">
                <Mail className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input type="email" value={user?.email ?? ""} className="pr-10 glass border-white/10" disabled />
              </div>
            </div>
            <Button
              disabled={savingProfile}
              className="gradient-primary border-0 text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-primary/60 transition-all"
              onClick={handleSaveProfile}
            >
              {savingProfile ? <Loader2 className="h-4 w-4 ml-2 animate-spin" /> : <Save className="h-4 w-4 ml-2" />}
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
                <Input type="password" className="pr-10 glass border-white/10" value={currentPwd} onChange={(e) => setCurrentPwd(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>كلمة المرور الجديدة</Label>
              <div className="relative">
                <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input type="password" className="pr-10 glass border-white/10" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} />
              </div>
            </div>
            <Button
              disabled={changingPwd || !currentPwd || !newPwd}
              className="gradient-accent border-0 text-accent-foreground shadow-lg shadow-accent/30 hover:shadow-accent/60 transition-all"
              onClick={handleChangePassword}
            >
              {changingPwd ? <Loader2 className="h-4 w-4 ml-2 animate-spin" /> : <KeyRound className="h-4 w-4 ml-2" />}
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
              <p className="text-xs text-muted-foreground">الإشعارات والتفضيلات</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="glass rounded-xl p-4 flex items-center justify-between border border-white/5">
              <div>
                <div className="flex items-center gap-2 text-sm font-medium"><Bell className="h-4 w-4 text-accent" /> الإشعارات</div>
                <p className="mt-1 text-xs text-muted-foreground">تنبيهات المشاريع والتصدير</p>
              </div>
              <Switch checked={notifications} disabled={savingPrefs} onCheckedChange={handleSavePrefs} />
            </div>
            <div className="glass rounded-xl p-4 border border-white/5 opacity-60">
              <div className="flex items-center gap-2 text-sm font-medium"><Palette className="h-4 w-4 text-primary" /> المظهر</div>
              <p className="mt-1 text-xs text-muted-foreground">داكن (حالياً الوحيد المدعوم)</p>
            </div>
          </div>
        </motion.div>

        {/* Language */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }} className="glass-card rounded-2xl p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl gradient-accent shadow-lg shadow-accent/30">
              <Languages className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-semibold font-['Space_Grotesk']">{t("settings.language_section")}</h2>
              <p className="text-xs text-muted-foreground">{t("settings.language_desc")}</p>
            </div>
          </div>
          <LanguageSwitcher />
        </motion.div>
      </div>
    </div>
  );
}
