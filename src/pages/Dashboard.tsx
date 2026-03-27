import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Film, MoreVertical, Search, Clock, Trash2, Settings, Sparkles, FolderOpen, TrendingUp } from "lucide-react";
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
      <div className="flex min-h-[50vh] items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 lg:p-8">
      {/* Stats Row */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl gradient-primary">
              <FolderOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{projects.length}</p>
              <p className="text-xs text-muted-foreground">مشاريع</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl gradient-accent">
              <Film className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalScenes}</p>
              <p className="text-xs text-muted-foreground">مشاهد</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm cursor-pointer hover:border-primary/40 transition-colors" onClick={() => navigate("/templates")}>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/20">
              <Sparkles className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">القوالب</p>
              <p className="text-xs text-muted-foreground">تصفح</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm cursor-pointer hover:border-primary/40 transition-colors" onClick={() => navigate("/settings")}>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted">
              <Settings className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">الإعدادات</p>
              <p className="text-xs text-muted-foreground">إدارة</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold font-['Space_Grotesk'] text-foreground">مشاريعي</h1>
          <p className="text-muted-foreground mt-1">{projects.length} مشاريع • {totalScenes} مشاهد</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="gradient-primary border-0 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow">
              <Plus className="mr-2 h-5 w-5" />
              مشروع جديد
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-['Space_Grotesk']">إنشاء مشروع جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <Input
                placeholder="اسم المشروع"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && createProject()}
              />
              <Button onClick={createProject} className="w-full gradient-primary border-0 text-primary-foreground">
                إنشاء
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="ابحث في مشاريعك..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-card/60 border-border/50 backdrop-blur-sm"
        />
      </div>

      {/* Projects Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/50 bg-card/30 py-20 text-center backdrop-blur-sm">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50">
            <Film className="h-8 w-8 text-muted-foreground/40" />
          </div>
          <p className="text-lg font-semibold text-foreground/70">لا توجد مشاريع بعد</p>
          <p className="mb-6 text-sm text-muted-foreground/60">أنشئ مشروعك الأول وابدأ بصنع الأفلام</p>
          <Button onClick={() => setDialogOpen(true)} className="gradient-primary border-0 text-primary-foreground">
            <Plus className="mr-2 h-4 w-4" />
            إنشاء مشروع
          </Button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => {
            const scenesCount = Array.isArray(project.script_json) ? project.script_json.length : 0;
            return (
              <Card
                key={project.id}
                className="group relative overflow-hidden border-border/40 bg-card/80 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1"
              >
                {/* Thumbnail area */}
                <Link to={`/editor/${project.id}`} className="block">
                  <div className="relative aspect-video overflow-hidden gradient-hero">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Film className="h-12 w-12 text-primary-foreground/10 group-hover:text-primary-foreground/20 transition-colors" />
                    </div>
                    {/* Hover overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-primary/0 group-hover:bg-primary/10 transition-colors">
                      <span className="rounded-full bg-primary/90 px-4 py-2 text-sm font-medium text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                        فتح المحرر
                      </span>
                    </div>
                  </div>
                </Link>

                {/* Info */}
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <Link to={`/editor/${project.id}`} className="flex-1 min-w-0">
                      <h3 className="truncate font-semibold font-['Space_Grotesk'] text-foreground group-hover:text-primary transition-colors">
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
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteProject(project.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          حذف
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
