import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Film, MoreVertical, Search, Clock, Trash2, Settings, Sparkles, FolderOpen } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Project {
  id: string;
  title: string;
  updated_at: string;
  script_json: any;
  status: string | null;
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) fetchProjects();
  }, [user]);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("updated_at", { ascending: false });
    if (error) {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    } else {
      setProjects(data || []);
    }
    setLoading(false);
  };

  const createProject = async () => {
    if (!newTitle.trim() || !user) return;
    const { data, error } = await supabase
      .from("projects")
      .insert({ title: newTitle, user_id: user.id })
      .select()
      .single();
    if (error) {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    } else {
      setProjects([data, ...projects]);
      setNewTitle("");
      setDialogOpen(false);
      toast({ title: "تم إنشاء المشروع", description: newTitle });
    }
  };

  const deleteProject = async (id: string) => {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    } else {
      setProjects(projects.filter((p) => p.id !== id));
      toast({ title: "تم حذف المشروع" });
    }
  };

  const filtered = projects.filter((p) => p.title.includes(search));

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffH = Math.floor(diffMs / 3600000);
    if (diffH < 1) return "الآن";
    if (diffH < 24) return `منذ ${diffH} ساعة`;
    const diffD = Math.floor(diffH / 24);
    return `منذ ${diffD} يوم`;
  };

  const totalScenes = projects.reduce((sum, p) => {
    return sum + (Array.isArray(p.script_json) ? p.script_json.length : 0);
  }, 0);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen p-6 lg:p-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold font-['Space_Grotesk']">
            مرحبًا، <span className="text-gradient">صانع الأفلام</span>
          </h1>
          <p className="text-muted-foreground mt-2">لوحة تحكمك السينمائية — أنشئ، حرّر، وانشر بأناقة</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="gradient-primary border-0 text-primary-foreground shadow-xl shadow-primary/30 hover:shadow-primary/60 transition-all">
              <Plus className="ml-2 h-5 w-5" />
              مشروع جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-strong border-white/10">
            <DialogHeader>
              <DialogTitle className="font-['Space_Grotesk']">إنشاء مشروع جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <Input
                placeholder="اسم المشروع"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && createProject()}
                className="glass border-white/10"
              />
              <Button onClick={createProject} className="w-full gradient-primary border-0 text-primary-foreground">
                إنشاء
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { icon: FolderOpen, label: "مشاريع", value: projects.length, gradient: "gradient-primary" },
          { icon: Film, label: "مشاهد", value: totalScenes, gradient: "gradient-accent" },
          { icon: Sparkles, label: "القوالب", value: "تصفح", onClick: () => navigate("/templates"), gradient: "gradient-primary" },
          { icon: Settings, label: "الإعدادات", value: "إدارة", onClick: () => navigate("/settings"), gradient: "gradient-accent" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            onClick={s.onClick}
            className={`glass-card rounded-2xl p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 ${s.onClick ? "cursor-pointer" : ""}`}
          >
            <div className="flex items-center gap-3">
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${s.gradient} shadow-lg shadow-primary/20`}>
                <s.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-xl font-bold font-['Space_Grotesk']">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="ابحث في مشاريعك..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pr-10 glass border-white/10"
        />
      </div>

      {/* Projects Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl glass-card py-24 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary glow-primary">
            <Film className="h-7 w-7 text-primary-foreground" />
          </div>
          <p className="text-lg font-semibold font-['Space_Grotesk']">لا توجد مشاريع بعد</p>
          <p className="mb-6 text-sm text-muted-foreground">أنشئ مشروعك الأول وابدأ بصنع الأفلام</p>
          <Button onClick={() => setDialogOpen(true)} className="gradient-primary border-0 text-primary-foreground shadow-lg shadow-primary/30">
            <Plus className="ml-2 h-4 w-4" />
            إنشاء مشروع
          </Button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project, i) => {
            const scenesCount = Array.isArray(project.script_json) ? project.script_json.length : 0;
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.05, 0.4) }}
                className="group relative overflow-hidden rounded-2xl glass-card transition-all duration-300 hover:border-primary/50 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/20"
              >
                <Link to={`/editor/${project.id}`} className="block">
                  <div className="relative aspect-video overflow-hidden gradient-hero">
                    <div className="absolute inset-0 gradient-mesh opacity-50" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Film className="h-12 w-12 text-primary-foreground/15 group-hover:text-primary-foreground/30 group-hover:scale-110 transition-all" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center bg-primary/0 group-hover:bg-primary/10 transition-colors">
                      <span className="rounded-full glass-strong px-4 py-2 text-sm font-medium text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                        فتح المحرر
                      </span>
                    </div>
                  </div>
                </Link>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <Link to={`/editor/${project.id}`} className="flex-1 min-w-0">
                      <h3 className="truncate font-semibold font-['Space_Grotesk'] group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(project.updated_at)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Film className="h-3 w-3" />
                          {scenesCount} مشاهد
                        </span>
                      </div>
                    </Link>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="glass-strong border-white/10">
                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteProject(project.id)}>
                          <Trash2 className="ml-2 h-4 w-4" />
                          حذف
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
