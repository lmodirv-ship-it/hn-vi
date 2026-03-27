import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Film, MoreVertical, Search, Clock, Trash2, Edit2 } from "lucide-react";
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

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold font-['Space_Grotesk']">مشاريعي</h1>
          <p className="text-muted-foreground">{projects.length} مشاريع</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary border-0 text-primary-foreground">
              <Plus className="mr-2 h-4 w-4" />
              مشروع جديد
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-['Space_Grotesk']">إنشاء مشروع جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <Input placeholder="اسم المشروع" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} onKeyDown={(e) => e.key === "Enter" && createProject()} />
              <Button onClick={createProject} className="w-full gradient-primary border-0 text-primary-foreground">إنشاء</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input placeholder="ابحث في مشاريعك..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20 text-center">
          <Film className="mb-4 h-12 w-12 text-muted-foreground/40" />
          <p className="text-lg font-medium text-muted-foreground">لا توجد مشاريع بعد</p>
          <p className="mb-4 text-sm text-muted-foreground/60">أنشئ مشروعك الأول وابدأ بصنع الأفلام</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => {
            const scenesCount = Array.isArray(project.script_json) ? project.script_json.length : 0;
            return (
              <Card key={project.id} className="group overflow-hidden border-border transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                <div className="relative aspect-video gradient-hero">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Film className="h-10 w-10 text-primary-foreground/20" />
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <Link to={`/editor/${project.id}`} className="flex-1">
                      <h3 className="font-semibold font-['Space_Grotesk'] hover:text-primary transition-colors">{project.title}</h3>
                      <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{formatDate(project.updated_at)}</span>
                        <span>{scenesCount} مشاهد</span>
                      </div>
                    </Link>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="text-destructive" onClick={() => deleteProject(project.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />حذف
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
