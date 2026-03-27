import { useState, useCallback, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  Plus, Trash2, ChevronLeft, Download, GripVertical,
  Type, Eye, Film, Loader2, Settings2, Save, Cloud, CloudOff
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EXPORT_PRESETS, type SceneData, type VideoQuality, type VideoFormat, exportVideo } from "@/lib/ffmpeg";
import { supportsWebCodecs, exportWithWebCodecs } from "@/lib/videoProcessor";
import { exportWithCanvasRecorder } from "@/lib/canvasRecorder";
import CanvasPreview from "@/components/CanvasPreview";
import { Timeline } from "@/components/timeline/Timeline";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const defaultScenes: SceneData[] = [
  { id: "1", title: "المقدمة", text: "مرحبًا بكم في عرضنا", duration: 5, bgColor: "#6C3AED", transition: "fade" },
  { id: "2", title: "المحتوى الرئيسي", text: "هنا يمكنك كتابة المحتوى الأساسي للفيديو", duration: 8, bgColor: "#2DD4A8", transition: "slide" },
  { id: "3", title: "الخاتمة", text: "شكرًا لمشاهدتكم!", duration: 4, bgColor: "#6C3AED", transition: "fade" },
];

export default function Editor() {
  const { id } = useParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const [scenes, setScenes] = useState<SceneData[]>(defaultScenes);
  const [activeScene, setActiveScene] = useState<string>("1");
  const [projectTitle, setProjectTitle] = useState("مشروع بدون عنوان");
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");
  const [loadingProject, setLoadingProject] = useState(true);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Export state
  const [showExport, setShowExport] = useState(false);
  const [exportPreset, setExportPreset] = useState<string>("1080p");
  const [exportQuality, setExportQuality] = useState<VideoQuality>("high");
  const [exportFormat, setExportFormat] = useState<VideoFormat>("mp4");
  const [exportMethod, setExportMethod] = useState<"auto" | "webcodecs" | "ffmpeg" | "canvas">("auto");
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatus, setExportStatus] = useState("");
  // Canvas animation controls
  const [canvasControls, setCanvasControls] = useState<{
    isPlaying: boolean; currentTime: number; totalDuration: number;
    play: () => void; pause: () => void; restart: () => void; seek: (t: number) => void;
  } | null>(null);

  const handleControlsReady = useCallback((controls: any) => {
    setCanvasControls(controls);
  }, []);

  // Load project from database
  useEffect(() => {
    if (!id || !user) {
      setLoadingProject(false);
      return;
    }
    const loadProject = async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();
      if (data) {
        setProjectTitle(data.title);
        if (Array.isArray(data.script_json) && data.script_json.length > 0) {
          setScenes(data.script_json as unknown as SceneData[]);
          setActiveScene((data.script_json as any[])[0]?.id || "1");
        }
      } else if (error) {
        console.error("Error loading project:", error.message);
      }
      setLoadingProject(false);
    };
    loadProject();
  }, [id, user]);

  // Auto-save with debounce
  const saveProject = useCallback(async (scenesToSave: SceneData[], title: string) => {
    if (!id || !user) return;
    setSaveStatus("saving");
    const { error } = await supabase
      .from("projects")
      .update({
        script_json: scenesToSave as unknown as any,
        title: title,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", user.id);
    if (error) {
      setSaveStatus("unsaved");
    } else {
      setSaveStatus("saved");
    }
  }, [id, user]);

  useEffect(() => {
    if (loadingProject) return;
    setSaveStatus("unsaved");
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      saveProject(scenes, projectTitle);
    }, 1500);
    return () => { if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current); };
  }, [scenes, projectTitle, saveProject, loadingProject]);

  const currentScene = scenes.find((s) => s.id === activeScene) || scenes[0];

  const updateScene = (field: keyof SceneData, value: string | number) => {
    setScenes(scenes.map((s) => (s.id === activeScene ? { ...s, [field]: value } : s)));
  };

  const addScene = () => {
    const newScene: SceneData = {
      id: Date.now().toString(),
      title: `مشهد ${scenes.length + 1}`,
      text: "أدخل النص هنا...",
      duration: 5,
      bgColor: "#6C3AED",
      transition: "fade",
    };
    setScenes([...scenes, newScene]);
    setActiveScene(newScene.id);
  };

  const deleteScene = (sceneId: string) => {
    if (scenes.length <= 1) return;
    const newScenes = scenes.filter((s) => s.id !== sceneId);
    setScenes(newScenes);
    if (activeScene === sceneId) setActiveScene(newScenes[0].id);
  };

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);
    setExportStatus("جاري البدء...");

    try {
      const preset = EXPORT_PRESETS[exportPreset];
      const progressCb = (progress: number, status: string) => {
        setExportProgress(progress);
        setExportStatus(status);
      };

      const bitrateMap: Record<VideoQuality, number> = {
        low: 1_000_000, medium: 2_500_000, high: 5_000_000, ultra: 10_000_000,
      };

      // Determine method
      let method = exportMethod;
      if (method === "auto") {
        method = supportsWebCodecs() ? "webcodecs" : "canvas";
      }

      let url: string;
      let fileExt = exportFormat;

      if (method === "webcodecs") {
        url = await exportWithWebCodecs(scenes, {
          width: preset.width, height: preset.height, fps: preset.fps,
          bitrate: bitrateMap[exportQuality],
        }, progressCb);
        fileExt = "mp4";
      } else if (method === "canvas") {
        url = await exportWithCanvasRecorder(scenes, {
          width: preset.width, height: preset.height, fps: preset.fps,
          bitrate: bitrateMap[exportQuality],
        }, progressCb);
        fileExt = "webm";
      } else {
        url = await exportVideo(scenes, preset, progressCb, exportQuality, exportFormat);
        fileExt = exportFormat;
      }

      const a = document.createElement("a");
      a.href = url;
      a.download = `filmforge-video-${exportPreset}.${fileExt}`;
      a.click();

      toast({ title: "تم التصدير بنجاح!", description: `تم تصدير الفيديو بجودة ${preset.label}` });
      setShowExport(false);
    } catch (error: any) {
      toast({ title: "خطأ في التصدير", description: error.message, variant: "destructive" });
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const totalDuration = scenes.reduce((acc, s) => acc + s.duration, 0);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  if (loadingProject) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Top Bar */}
      <div className="flex h-14 items-center justify-between border-b border-border px-4">
        <div className="flex items-center gap-3">
          <Link to="/dashboard">
            <Button variant="ghost" size="icon"><ChevronLeft className="h-4 w-4" /></Button>
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md gradient-primary">
              <Film className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <Input
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="h-8 w-40 border-none bg-transparent px-1 text-sm font-semibold font-['Space_Grotesk'] focus-visible:ring-1"
            />
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            {saveStatus === "saving" && <><Loader2 className="h-3 w-3 animate-spin" /> جاري الحفظ...</>}
            {saveStatus === "saved" && <><Cloud className="h-3 w-3 text-green-500" /> تم الحفظ</>}
            {saveStatus === "unsaved" && <><CloudOff className="h-3 w-3 text-yellow-500" /> غير محفوظ</>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">المدة: {totalDuration}ث</span>
          <Button variant="outline" size="sm" onClick={() => setShowExport(true)}>
            <Download className="mr-2 h-4 w-4" />
            تصدير
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Scene List Sidebar */}
        <div className="w-56 shrink-0 overflow-y-auto border-r border-border bg-muted/30 p-3">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium">المشاهد</span>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={addScene}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-1.5">
            {scenes.map((scene, i) => (
              <button
                key={scene.id}
                onClick={() => setActiveScene(scene.id)}
                className={`group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  activeScene === scene.id
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "hover:bg-muted border border-transparent"
                }`}
              >
                <GripVertical className="h-3.5 w-3.5 shrink-0 text-muted-foreground/40" />
                <div className="flex-1 truncate">
                  <span className="text-xs text-muted-foreground">#{i + 1}</span>
                  <p className="truncate font-medium">{scene.title}</p>
                </div>
                {scenes.length > 1 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteScene(scene.id); }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </button>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Main Area */}
        <div className="flex flex-1 flex-col overflow-hidden relative">
          <CanvasPreview
            scenes={scenes}
            activeSceneId={activeScene}
            onSceneChange={setActiveScene}
            onControlsReady={handleControlsReady}
          />
        </div>

        {/* Properties Panel */}
        <div className="w-72 shrink-0 overflow-y-auto border-l border-border p-4">
          <Tabs defaultValue="text">
            <TabsList className="w-full">
              <TabsTrigger value="text" className="flex-1"><Type className="mr-1 h-3.5 w-3.5" />النص</TabsTrigger>
              <TabsTrigger value="style" className="flex-1"><Eye className="mr-1 h-3.5 w-3.5" />التصميم</TabsTrigger>
              <TabsTrigger value="settings" className="flex-1"><Settings2 className="mr-1 h-3.5 w-3.5" />إعدادات</TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="mt-4 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">عنوان المشهد</label>
                <Input value={currentScene.title} onChange={(e) => updateScene("title", e.target.value)} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">النص</label>
                <Textarea rows={6} value={currentScene.text} onChange={(e) => updateScene("text", e.target.value)} />
              </div>
            </TabsContent>

            <TabsContent value="style" className="mt-4 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">لون الخلفية</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={currentScene.bgColor}
                    onChange={(e) => updateScene("bgColor", e.target.value)}
                    className="h-10 w-10 cursor-pointer rounded border border-border"
                  />
                  <Input value={currentScene.bgColor} onChange={(e) => updateScene("bgColor", e.target.value)} className="flex-1" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">الانتقال</label>
                <Select value={currentScene.transition} onValueChange={(v) => updateScene("transition", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fade">تلاشي</SelectItem>
                    <SelectItem value="slide">انزلاق</SelectItem>
                    <SelectItem value="wipe">مسح</SelectItem>
                    <SelectItem value="zoom">تكبير</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="mt-4 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">المدة (ثواني)</label>
                <Input type="number" min={1} max={60} value={currentScene.duration} onChange={(e) => updateScene("duration", parseInt(e.target.value) || 1)} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Timeline */}
      <Timeline
        scenes={scenes}
        currentTime={canvasControls?.currentTime ?? 0}
        totalDuration={canvasControls?.totalDuration ?? totalDuration}
        isPlaying={canvasControls?.isPlaying ?? false}
        activeSceneId={activeScene}
        onScenesChange={setScenes}
        onSceneSelect={setActiveScene}
        onSeek={(t) => canvasControls?.seek(t)}
        onPlay={() => canvasControls?.play()}
        onPause={() => canvasControls?.pause()}
        onRestart={() => canvasControls?.restart()}
      />

      {/* Export Dialog */}
      <Dialog open={showExport} onOpenChange={setShowExport}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-['Space_Grotesk']">تصدير الفيديو</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 pt-2">
            {!isExporting ? (
              <>
                <div>
                  <label className="mb-2 block text-sm font-medium">جودة الفيديو</label>
                  <Select value={exportPreset} onValueChange={setExportPreset}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(EXPORT_PRESETS).map(([key, preset]) => (
                        <SelectItem key={key} value={key}>
                          {preset.label} ({preset.width}×{preset.height})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">مستوى الجودة</label>
                  <Select value={exportQuality} onValueChange={(v) => setExportQuality(v as VideoQuality)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">منخفضة (سريع)</SelectItem>
                      <SelectItem value="medium">متوسطة</SelectItem>
                      <SelectItem value="high">عالية (موصى به)</SelectItem>
                      <SelectItem value="ultra">فائقة (بطيء)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">صيغة الملف</label>
                  <Select value={exportFormat} onValueChange={(v) => setExportFormat(v as VideoFormat)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mp4">MP4 (موصى به)</SelectItem>
                      <SelectItem value="webm">WebM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">طريقة المعالجة</label>
                  <Select value={exportMethod} onValueChange={(v) => setExportMethod(v as any)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">تلقائي (موصى به)</SelectItem>
                      <SelectItem value="webcodecs">WebCodecs (أسرع)</SelectItem>
                      <SelectItem value="ffmpeg">FFmpeg (كلاسيكي)</SelectItem>
                      <SelectItem value="canvas">Canvas Recorder (متوافق)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {supportsWebCodecs() ? "✅ متصفحك يدعم WebCodecs" : "⚠️ متصفحك لا يدعم WebCodecs، سيتم استخدام البديل"}
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-muted/50 p-4 text-sm">
                  <div className="flex justify-between mb-1">
                    <span className="text-muted-foreground">عدد المشاهد</span>
                    <span className="font-medium">{scenes.length}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-muted-foreground">المدة الإجمالية</span>
                    <span className="font-medium">{totalDuration} ثانية</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">عدد الإطارات</span>
                    <span className="font-medium">{totalDuration * EXPORT_PRESETS[exportPreset].fps}</span>
                  </div>
                </div>
                <Button onClick={handleExport} className="w-full gradient-primary border-0 text-primary-foreground">
                  <Download className="mr-2 h-4 w-4" />
                  بدء التصدير
                </Button>
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
                <Progress value={exportProgress} className="h-2" />
                <p className="text-center text-sm text-muted-foreground">{exportStatus}</p>
                <p className="text-center text-xs text-muted-foreground/60">
                  {Math.round(exportProgress)}%
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
