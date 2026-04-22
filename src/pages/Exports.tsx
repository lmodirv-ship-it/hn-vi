import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Trash2, Film, Loader2, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface ExportRow {
  id: string;
  project_id: string;
  status: string | null;
  resolution: string | null;
  video_url: string | null;
  created_at: string;
}

export default function Exports() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<ExportRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("exports")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (!error && data) setItems(data as ExportRow[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, [user]);

  const handleDownload = async (row: ExportRow) => {
    if (!row.video_url) return;
    try {
      // video_url stores the storage path, e.g. {user_id}/{project}_{ts}.mp4
      const { data, error } = await supabase.storage.from("exports").createSignedUrl(row.video_url, 3600);
      if (error || !data?.signedUrl) throw error || new Error("Failed");
      const a = document.createElement("a");
      a.href = data.signedUrl;
      a.download = row.video_url.split("/").pop() || "video.mp4";
      a.target = "_blank";
      a.click();
    } catch (e: any) {
      toast({ title: "خطأ في التنزيل", description: e.message, variant: "destructive" });
    }
  };

  const handleDelete = async (row: ExportRow) => {
    if (!confirm("حذف هذا التصدير نهائياً؟")) return;
    try {
      if (row.video_url) {
        await supabase.storage.from("exports").remove([row.video_url]);
      }
      const { error } = await supabase.from("exports").delete().eq("id", row.id);
      if (error) throw error;
      setItems((prev) => prev.filter((x) => x.id !== row.id));
      toast({ title: "تم الحذف" });
    } catch (e: any) {
      toast({ title: "خطأ", description: e.message, variant: "destructive" });
    }
  };

  const fmt = (d: string) => new Date(d).toLocaleString("ar-EG");

  return (
    <div dir="rtl" className="min-h-screen p-6 lg:p-10">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-4xl font-bold font-['Space_Grotesk']">
          <span className="text-gradient">تصديراتي</span>
        </h1>
        <p className="text-muted-foreground mt-2">سجل كامل للفيديوهات التي صدّرتها</p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : items.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <Film className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
          <p className="text-muted-foreground">لم تصدّر أي فيديو بعد</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map((row, i) => (
            <motion.div
              key={row.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.04, 0.3) }}
              className="glass-card rounded-2xl p-5 flex items-center gap-4"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl gradient-primary shadow-lg shadow-primary/30">
                <Film className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold font-['Space_Grotesk']">تصدير #{row.id.slice(0, 8)}</span>
                  <Badge variant={row.status === "completed" ? "default" : row.status === "failed" ? "destructive" : "secondary"}>
                    {row.status === "completed" ? "مكتمل" : row.status === "failed" ? "فشل" : row.status === "pending" ? "قيد المعالجة" : row.status}
                  </Badge>
                  {row.resolution && <Badge variant="outline">{row.resolution}</Badge>}
                </div>
                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {fmt(row.created_at)}
                </div>
              </div>
              {row.status === "completed" && row.video_url && (
                <Button size="sm" variant="outline" onClick={() => handleDownload(row)}>
                  <Download className="ml-2 h-4 w-4" />تنزيل
                </Button>
              )}
              <Button size="sm" variant="ghost" onClick={() => handleDelete(row)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}