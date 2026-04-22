import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Users, FolderOpen, Film, Activity, Shield, Ban, CheckCircle2, Trash2, Search, Sparkles, Crown,
} from "lucide-react";

interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  banned: boolean;
  created_at: string;
}
interface ProjectRow {
  id: string;
  title: string;
  user_id: string;
  status: string | null;
  created_at: string;
  updated_at: string;
  script_json: any;
}
interface ExportRow {
  id: string;
  user_id: string;
  project_id: string;
  status: string | null;
  resolution: string | null;
  created_at: string;
}

export default function Admin() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [exports, setExports] = useState<ExportRow[]>([]);
  const [adminIds, setAdminIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");

  const fetchAll = async () => {
    setLoading(true);
    const [p, pr, ex, ro] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("projects").select("*").order("created_at", { ascending: false }),
      supabase.from("exports").select("*").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id, role").eq("role", "admin"),
    ]);
    if (p.error || pr.error || ex.error || ro.error) {
      toast({
        title: "خطأ في تحميل البيانات",
        description: p.error?.message || pr.error?.message || ex.error?.message || ro.error?.message,
        variant: "destructive",
      });
    }
    setProfiles(p.data || []);
    setProjects(pr.data || []);
    setExports(ex.data || []);
    setAdminIds(new Set((ro.data || []).map((r: any) => r.user_id)));
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const toggleBan = async (userId: string, banned: boolean) => {
    const { error } = await supabase.from("profiles").update({ banned: !banned }).eq("user_id", userId);
    if (error) return toast({ title: "خطأ", description: error.message, variant: "destructive" });
    setProfiles(profiles.map((p) => (p.user_id === userId ? { ...p, banned: !banned } : p)));
    toast({ title: !banned ? "تم حظر المستخدم" : "تم رفع الحظر" });
  };

  const promoteAdmin = async (userId: string, isAdmin: boolean) => {
    if (isAdmin) {
      const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", "admin");
      if (error) return toast({ title: "خطأ", description: error.message, variant: "destructive" });
      const next = new Set(adminIds);
      next.delete(userId);
      setAdminIds(next);
      toast({ title: "تم سحب صلاحية المدير" });
    } else {
      const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: "admin" });
      if (error) return toast({ title: "خطأ", description: error.message, variant: "destructive" });
      setAdminIds(new Set([...adminIds, userId]));
      toast({ title: "تمت ترقيته إلى مدير" });
    }
  };

  const deleteProject = async (id: string) => {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) return toast({ title: "خطأ", description: error.message, variant: "destructive" });
    setProjects(projects.filter((p) => p.id !== id));
    toast({ title: "تم حذف المشروع" });
  };

  const deleteExport = async (id: string) => {
    const { error } = await supabase.from("exports").delete().eq("id", id);
    if (error) return toast({ title: "خطأ", description: error.message, variant: "destructive" });
    setExports(exports.filter((e) => e.id !== id));
    toast({ title: "تم حذف التصدير" });
  };

  const filteredProfiles = profiles.filter(
    (p) => !search || (p.display_name || "").toLowerCase().includes(search.toLowerCase()),
  );
  const profileMap = new Map(profiles.map((p) => [p.user_id, p]));

  // Stats
  const stats = [
    { label: "المستخدمون", value: profiles.length, icon: Users, gradient: "gradient-primary" },
    { label: "المشاريع", value: projects.length, icon: FolderOpen, gradient: "gradient-accent" },
    { label: "التصديرات", value: exports.length, icon: Film, gradient: "gradient-primary" },
    { label: "محظورون", value: profiles.filter((p) => p.banned).length, icon: Ban, gradient: "gradient-accent" },
  ];

  const fmt = (d: string) => new Date(d).toLocaleDateString("ar-EG", { year: "numeric", month: "short", day: "numeric" });

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen p-6 lg:p-10">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl gradient-primary glow-primary">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-4xl font-bold font-['Space_Grotesk']">
              لوحة <span className="text-gradient">المدير</span>
            </h1>
            <p className="text-muted-foreground mt-1">تحكم كامل بالمستخدمين والمحتوى والإحصائيات</p>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="glass-card rounded-2xl p-5"
          >
            <div className="flex items-center gap-3">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${s.gradient} shadow-lg shadow-primary/20`}>
                <s.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold font-['Space_Grotesk']">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="glass border-white/10 mb-6">
          <TabsTrigger value="users"><Users className="ml-2 h-4 w-4" />المستخدمون</TabsTrigger>
          <TabsTrigger value="projects"><FolderOpen className="ml-2 h-4 w-4" />المشاريع</TabsTrigger>
          <TabsTrigger value="exports"><Film className="ml-2 h-4 w-4" />التصديرات</TabsTrigger>
          <TabsTrigger value="overview"><Activity className="ml-2 h-4 w-4" />نظرة عامة</TabsTrigger>
        </TabsList>

        {/* USERS */}
        <TabsContent value="users">
          <Card className="glass-card border-white/10 p-4">
            <div className="relative mb-4 max-w-md">
              <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ابحث بالاسم..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pr-10 glass border-white/10"
              />
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">الاسم</TableHead>
                  <TableHead className="text-right">انضم</TableHead>
                  <TableHead className="text-right">الدور</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProfiles.map((p) => {
                  const isAdmin = adminIds.has(p.user_id);
                  return (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.display_name || "—"}</TableCell>
                      <TableCell className="text-muted-foreground">{fmt(p.created_at)}</TableCell>
                      <TableCell>
                        {isAdmin ? (
                          <Badge className="gradient-primary border-0 text-primary-foreground"><Crown className="ml-1 h-3 w-3" />مدير</Badge>
                        ) : (
                          <Badge variant="outline" className="border-white/10">مستخدم</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {p.banned ? (
                          <Badge variant="destructive"><Ban className="ml-1 h-3 w-3" />محظور</Badge>
                        ) : (
                          <Badge variant="outline" className="border-emerald-500/30 text-emerald-400"><CheckCircle2 className="ml-1 h-3 w-3" />نشط</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="border-white/10" onClick={() => promoteAdmin(p.user_id, isAdmin)}>
                            {isAdmin ? "سحب الإدارة" : "ترقية لمدير"}
                          </Button>
                          <Button
                            size="sm"
                            variant={p.banned ? "outline" : "destructive"}
                            className={p.banned ? "border-white/10" : ""}
                            onClick={() => toggleBan(p.user_id, p.banned)}
                          >
                            {p.banned ? "رفع الحظر" : "حظر"}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filteredProfiles.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">لا يوجد مستخدمون</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* PROJECTS */}
        <TabsContent value="projects">
          <Card className="glass-card border-white/10 p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">العنوان</TableHead>
                  <TableHead className="text-right">المالك</TableHead>
                  <TableHead className="text-right">المشاهد</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">آخر تحديث</TableHead>
                  <TableHead className="text-right">إجراء</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((p) => {
                  const owner = profileMap.get(p.user_id);
                  const scenes = Array.isArray(p.script_json) ? p.script_json.length : 0;
                  return (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.title}</TableCell>
                      <TableCell className="text-muted-foreground">{owner?.display_name || p.user_id.slice(0, 8)}</TableCell>
                      <TableCell>{scenes}</TableCell>
                      <TableCell><Badge variant="outline" className="border-white/10">{p.status || "draft"}</Badge></TableCell>
                      <TableCell className="text-muted-foreground">{fmt(p.updated_at)}</TableCell>
                      <TableCell>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive"><Trash2 className="h-4 w-4" /></Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="glass-strong border-white/10">
                            <AlertDialogHeader>
                              <AlertDialogTitle>حذف المشروع نهائياً؟</AlertDialogTitle>
                              <AlertDialogDescription>سيتم حذف "{p.title}" ولا يمكن التراجع.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>إلغاء</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteProject(p.id)}>حذف</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {projects.length === 0 && (
                  <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">لا توجد مشاريع</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* EXPORTS */}
        <TabsContent value="exports">
          <Card className="glass-card border-white/10 p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">المالك</TableHead>
                  <TableHead className="text-right">الدقة</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">التاريخ</TableHead>
                  <TableHead className="text-right">إجراء</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exports.map((e) => {
                  const owner = profileMap.get(e.user_id);
                  return (
                    <TableRow key={e.id}>
                      <TableCell>{owner?.display_name || e.user_id.slice(0, 8)}</TableCell>
                      <TableCell><Badge variant="outline" className="border-white/10">{e.resolution || "—"}</Badge></TableCell>
                      <TableCell><Badge variant="outline" className="border-white/10">{e.status || "pending"}</Badge></TableCell>
                      <TableCell className="text-muted-foreground">{fmt(e.created_at)}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="destructive" onClick={() => deleteExport(e.id)}><Trash2 className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {exports.length === 0 && (
                  <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">لا توجد تصديرات</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* OVERVIEW */}
        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="glass-card border-white/10 p-6">
              <div className="mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h3 className="font-semibold font-['Space_Grotesk']">أحدث المشاريع</h3>
              </div>
              <div className="space-y-2">
                {projects.slice(0, 5).map((p) => (
                  <div key={p.id} className="flex items-center justify-between rounded-lg glass p-3">
                    <span className="truncate">{p.title}</span>
                    <span className="text-xs text-muted-foreground">{fmt(p.updated_at)}</span>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="glass-card border-white/10 p-6">
              <div className="mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <h3 className="font-semibold font-['Space_Grotesk']">أحدث المستخدمين</h3>
              </div>
              <div className="space-y-2">
                {profiles.slice(0, 5).map((p) => (
                  <div key={p.id} className="flex items-center justify-between rounded-lg glass p-3">
                    <span className="truncate">{p.display_name || "—"}</span>
                    <span className="text-xs text-muted-foreground">{fmt(p.created_at)}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}