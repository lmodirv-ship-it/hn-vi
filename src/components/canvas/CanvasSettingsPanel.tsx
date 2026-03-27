import { useCallback } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Bold, Italic, Underline } from 'lucide-react';
import {
  type CanvasConfig, type TextConfig, type AspectRatio, type Resolution, type BgType,
  type TextAnimation, type TextPosition, type TextAlign,
  ASPECT_RATIOS, FONT_LIST, ANIMATION_LIST, POSITION_LIST,
} from '@/types/canvas';
import { validateImageFile } from '@/utils/canvasValidation';
import { useToast } from '@/hooks/use-toast';

interface CanvasSettingsPanelProps {
  canvasConfig: CanvasConfig;
  textConfig: TextConfig;
  onCanvasChange: (config: Partial<CanvasConfig>) => void;
  onTextChange: (config: Partial<TextConfig>) => void;
  onBgImageUpload: (file: File) => void;
}

export default function CanvasSettingsPanel({
  canvasConfig,
  textConfig,
  onCanvasChange,
  onTextChange,
  onBgImageUpload,
}: CanvasSettingsPanelProps) {
  const { toast } = useToast();

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const result = validateImageFile(file);
    if (!result.valid) {
      toast({ title: 'خطأ', description: result.error, variant: 'destructive' });
      return;
    }
    onBgImageUpload(file);
    onCanvasChange({ bgType: 'image' });
  }, [onBgImageUpload, onCanvasChange, toast]);

  return (
    <div className="space-y-5 text-sm">
      {/* Aspect Ratio */}
      <div>
        <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">نسبة الأبعاد</Label>
        <Select value={canvasConfig.aspectRatio} onValueChange={(v) => onCanvasChange({ aspectRatio: v as AspectRatio })}>
          <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            {Object.entries(ASPECT_RATIOS).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Background Type */}
      <div>
        <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">نوع الخلفية</Label>
        <Select value={canvasConfig.bgType} onValueChange={(v) => onCanvasChange({ bgType: v as BgType })}>
          <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="solid">لون خالص</SelectItem>
            <SelectItem value="gradient">تدرج لوني</SelectItem>
            <SelectItem value="image">صورة</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {canvasConfig.bgType === 'gradient' && (
        <div className="flex gap-2">
          <div className="flex-1">
            <Label className="mb-1 block text-xs">اللون الأول</Label>
            <input type="color" value={canvasConfig.bgGradientStart}
              onChange={(e) => onCanvasChange({ bgGradientStart: e.target.value })}
              className="h-8 w-full cursor-pointer rounded border border-border" />
          </div>
          <div className="flex-1">
            <Label className="mb-1 block text-xs">اللون الثاني</Label>
            <input type="color" value={canvasConfig.bgGradientEnd}
              onChange={(e) => onCanvasChange({ bgGradientEnd: e.target.value })}
              className="h-8 w-full cursor-pointer rounded border border-border" />
          </div>
        </div>
      )}

      {canvasConfig.bgType === 'image' && (
        <div>
          <Input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageUpload} className="h-8 text-xs" />
        </div>
      )}

      <hr className="border-border" />

      {/* Text Animation */}
      <div>
        <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">تأثير النص</Label>
        <Select value={textConfig.animation} onValueChange={(v) => onTextChange({ animation: v as TextAnimation })}>
          <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            {ANIMATION_LIST.map(a => <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Font */}
      <div>
        <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">نوع الخط</Label>
        <Select value={textConfig.fontFamily} onValueChange={(v) => onTextChange({ fontFamily: v })}>
          <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            {FONT_LIST.map(f => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Font Size */}
      <div>
        <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">حجم الخط: {textConfig.fontSize}px</Label>
        <Slider value={[textConfig.fontSize]} min={12} max={120} step={1}
          onValueChange={([v]) => onTextChange({ fontSize: v })} />
      </div>

      {/* Colors */}
      <div className="flex gap-2">
        <div className="flex-1">
          <Label className="mb-1 block text-xs">لون النص</Label>
          <input type="color" value={textConfig.color}
            onChange={(e) => onTextChange({ color: e.target.value })}
            className="h-8 w-full cursor-pointer rounded border border-border" />
        </div>
        <div className="flex-1">
          <Label className="mb-1 block text-xs">لون الظل</Label>
          <input type="color" value={textConfig.shadowColor}
            onChange={(e) => onTextChange({ shadowColor: e.target.value })}
            className="h-8 w-full cursor-pointer rounded border border-border" />
        </div>
      </div>

      {/* Shadow Opacity */}
      <div>
        <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">شفافية الظل: {Math.round(textConfig.shadowOpacity * 100)}%</Label>
        <Slider value={[textConfig.shadowOpacity]} min={0} max={1} step={0.05}
          onValueChange={([v]) => onTextChange({ shadowOpacity: v })} />
      </div>

      {/* Position */}
      <div>
        <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">موضع النص</Label>
        <Select value={textConfig.position} onValueChange={(v) => onTextChange({ position: v as TextPosition })}>
          <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            {POSITION_LIST.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Align */}
      <div>
        <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">محاذاة النص</Label>
        <Select value={textConfig.align} onValueChange={(v) => onTextChange({ align: v as TextAlign })}>
          <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="right">يمين</SelectItem>
            <SelectItem value="center">وسط</SelectItem>
            <SelectItem value="left">يسار</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Line Spacing */}
      <div>
        <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">تباعد الأسطر: {textConfig.lineSpacing.toFixed(1)}</Label>
        <Slider value={[textConfig.lineSpacing]} min={1} max={3} step={0.1}
          onValueChange={([v]) => onTextChange({ lineSpacing: v })} />
      </div>

      {/* Text styles */}
      <div>
        <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">تنسيق النص</Label>
        <div className="flex gap-1">
          <Button variant={textConfig.bold ? 'default' : 'outline'} size="icon" className="h-8 w-8"
            onClick={() => onTextChange({ bold: !textConfig.bold })}>
            <Bold className="h-3.5 w-3.5" />
          </Button>
          <Button variant={textConfig.italic ? 'default' : 'outline'} size="icon" className="h-8 w-8"
            onClick={() => onTextChange({ italic: !textConfig.italic })}>
            <Italic className="h-3.5 w-3.5" />
          </Button>
          <Button variant={textConfig.underline ? 'default' : 'outline'} size="icon" className="h-8 w-8"
            onClick={() => onTextChange({ underline: !textConfig.underline })}>
            <Underline className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Text Background */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium text-muted-foreground">خلفية النص</Label>
          <Switch checked={textConfig.textBgEnabled} onCheckedChange={(v) => onTextChange({ textBgEnabled: v })} />
        </div>
        {textConfig.textBgEnabled && (
          <div className="space-y-2">
            <input type="color" value={textConfig.textBgColor}
              onChange={(e) => onTextChange({ textBgColor: e.target.value })}
              className="h-8 w-full cursor-pointer rounded border border-border" />
            <Slider value={[textConfig.textBgOpacity]} min={0} max={1} step={0.05}
              onValueChange={([v]) => onTextChange({ textBgOpacity: v })} />
          </div>
        )}
      </div>
    </div>
  );
}
