import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Download, Smartphone, Monitor, ChevronLeft, Check } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function Install() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches;

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);

    window.addEventListener("appinstalled", () => setIsInstalled(true));

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setIsInstalled(true);
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4" dir="rtl">
      <div className="max-w-lg w-full space-y-8 text-center">
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-4">
            <ChevronLeft className="ml-2 h-4 w-4" />
            الرجوع
          </Button>
        </Link>

        <div className="space-y-3">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary">
            <Download className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold font-['Space_Grotesk']">تثبيت التطبيق</h1>
          <p className="text-muted-foreground">
            ثبّت HN Video AI على جهازك للوصول السريع والعمل بدون إنترنت
          </p>
        </div>

        {isInstalled || isStandalone ? (
          <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-6">
            <Check className="mx-auto h-10 w-10 text-green-500 mb-3" />
            <p className="text-lg font-semibold text-green-400">التطبيق مثبّت بالفعل!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {deferredPrompt ? (
              <Button onClick={handleInstall} size="lg" className="w-full gradient-primary border-0 text-primary-foreground">
                <Download className="ml-2 h-5 w-5" />
                تثبيت الآن
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="rounded-xl border border-border bg-muted/30 p-5 text-right space-y-3">
                  <div className="flex items-start gap-3">
                    <Smartphone className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium">على الهاتف (iPhone / Android)</p>
                      <p className="text-sm text-muted-foreground">
                        افتح القائمة ← "إضافة إلى الشاشة الرئيسية"
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Monitor className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium">على الكمبيوتر (Chrome / Edge)</p>
                      <p className="text-sm text-muted-foreground">
                        اضغط على أيقونة التثبيت في شريط العنوان
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
