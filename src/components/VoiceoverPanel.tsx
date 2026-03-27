import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Volume2, VolumeX, Play, Square } from "lucide-react";
import {
  type TTSConfig,
  DEFAULT_TTS_CONFIG,
  waitForVoices,
  previewTTS,
  stopTTS,
  isTTSSupported,
} from "@/lib/ttsService";

interface VoiceoverPanelProps {
  config: TTSConfig;
  onChange: (config: TTSConfig) => void;
  previewText?: string;
}

const LANGUAGES = [
  { value: "ar", label: "العربية" },
  { value: "en", label: "English" },
  { value: "fr", label: "Français" },
  { value: "es", label: "Español" },
  { value: "de", label: "Deutsch" },
  { value: "tr", label: "Türkçe" },
];

export default function VoiceoverPanel({ config, onChange, previewText }: VoiceoverPanelProps) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const supported = isTTSSupported();

  useEffect(() => {
    if (!supported) return;
    waitForVoices().then(setVoices);
  }, [supported]);

  const filteredVoices = voices.filter((v) => v.lang.startsWith(config.lang.split("-")[0]));

  const handlePreview = () => {
    if (isPreviewing) {
      stopTTS();
      setIsPreviewing(false);
    } else {
      const text = previewText || "مرحباً، هذا اختبار للتعليق الصوتي";
      previewTTS(text, config);
      setIsPreviewing(true);
      // Auto-reset after speech ends
      const u = new SpeechSynthesisUtterance(text);
      const words = text.split(" ").length;
      const estimatedMs = (words / (config.rate * 2.5)) * 1000 + 1000;
      setTimeout(() => setIsPreviewing(false), estimatedMs);
    }
  };

  if (!supported) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
        متصفحك لا يدعم ميزة التعليق الصوتي
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {config.enabled ? (
            <Volume2 className="h-4 w-4 text-primary" />
          ) : (
            <VolumeX className="h-4 w-4 text-muted-foreground" />
          )}
          <span className="text-sm font-medium">التعليق الصوتي</span>
        </div>
        <Switch
          checked={config.enabled}
          onCheckedChange={(enabled) => onChange({ ...config, enabled })}
        />
      </div>

      {config.enabled && (
        <>
          <div>
            <label className="mb-1.5 block text-sm font-medium">اللغة</label>
            <Select
              value={config.lang.split("-")[0]}
              onValueChange={(lang) => {
                onChange({ ...config, lang, voiceURI: undefined });
              }}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((l) => (
                  <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {filteredVoices.length > 0 && (
            <div>
              <label className="mb-1.5 block text-sm font-medium">الصوت</label>
              <Select
                value={config.voiceURI || "default"}
                onValueChange={(uri) =>
                  onChange({ ...config, voiceURI: uri === "default" ? undefined : uri })
                }
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">تلقائي</SelectItem>
                  {filteredVoices.map((v) => (
                    <SelectItem key={v.voiceURI} value={v.voiceURI}>
                      {v.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              السرعة: {config.rate.toFixed(1)}x
            </label>
            <Slider
              min={0.5}
              max={2}
              step={0.1}
              value={[config.rate]}
              onValueChange={([rate]) => onChange({ ...config, rate })}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              النبرة: {config.pitch.toFixed(1)}
            </label>
            <Slider
              min={0.5}
              max={2}
              step={0.1}
              value={[config.pitch]}
              onValueChange={([pitch]) => onChange({ ...config, pitch })}
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={handlePreview}
          >
            {isPreviewing ? (
              <><Square className="mr-2 h-3.5 w-3.5" />إيقاف المعاينة</>
            ) : (
              <><Play className="mr-2 h-3.5 w-3.5" />معاينة الصوت</>
            )}
          </Button>
        </>
      )}
    </div>
  );
}
