export type AspectRatio = '16:9' | '9:16' | '1:1' | '4:5';
export type Resolution = '720p' | '1080p' | '4k';
export type TextAnimation = 'typewriter' | 'fade' | 'slide-left' | 'slide-right' | 'slide-up' | 'slide-down' | 'zoom-in' | 'zoom-out';
export type TextPosition = 'top-left' | 'top-center' | 'top-right' | 'center-left' | 'center' | 'center-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
export type TextAlign = 'left' | 'center' | 'right';
export type BgType = 'solid' | 'gradient' | 'image';

export interface CanvasConfig {
  aspectRatio: AspectRatio;
  resolution: Resolution;
  bgType: BgType;
  bgColor: string;
  bgGradientStart: string;
  bgGradientEnd: string;
  bgImageUrl: string | null;
}

export interface TextConfig {
  fontSize: number;
  fontFamily: string;
  color: string;
  shadowColor: string;
  shadowOpacity: number;
  position: TextPosition;
  align: TextAlign;
  lineSpacing: number;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  textBgEnabled: boolean;
  textBgColor: string;
  textBgOpacity: number;
  animation: TextAnimation;
}

export const ASPECT_RATIOS: Record<AspectRatio, { label: string; ratio: number }> = {
  '16:9': { label: '16:9 (YouTube)', ratio: 16 / 9 },
  '9:16': { label: '9:16 (TikTok)', ratio: 9 / 16 },
  '1:1': { label: '1:1 (Instagram)', ratio: 1 },
  '4:5': { label: '4:5 (Portrait)', ratio: 4 / 5 },
};

export const RESOLUTIONS: Record<Resolution, { w: number; h: number; label: string }> = {
  '720p': { w: 1280, h: 720, label: '720p' },
  '1080p': { w: 1920, h: 1080, label: '1080p' },
  '4k': { w: 3840, h: 2160, label: '4K' },
};

export const FONT_LIST = [
  { value: "'Space Grotesk', sans-serif", label: 'Space Grotesk' },
  { value: "'Inter', sans-serif", label: 'Inter' },
  { value: "'Arial', sans-serif", label: 'Arial' },
  { value: "'Georgia', serif", label: 'Georgia' },
  { value: "'Courier New', monospace", label: 'Courier New' },
  { value: "'Tahoma', sans-serif", label: 'Tahoma' },
  { value: "'Verdana', sans-serif", label: 'Verdana' },
  { value: "'Times New Roman', serif", label: 'Times New Roman' },
  { value: "'Trebuchet MS', sans-serif", label: 'Trebuchet MS' },
  { value: "'Lucida Console', monospace", label: 'Lucida Console' },
];

export const ANIMATION_LIST: { value: TextAnimation; label: string }[] = [
  { value: 'typewriter', label: 'كتابة تلقائية' },
  { value: 'fade', label: 'تلاشي' },
  { value: 'slide-left', label: 'انزلاق من اليسار' },
  { value: 'slide-right', label: 'انزلاق من اليمين' },
  { value: 'slide-up', label: 'انزلاق من الأعلى' },
  { value: 'slide-down', label: 'انزلاق من الأسفل' },
  { value: 'zoom-in', label: 'تكبير' },
  { value: 'zoom-out', label: 'تصغير' },
];

export const POSITION_LIST: { value: TextPosition; label: string }[] = [
  { value: 'top-left', label: 'أعلى يسار' },
  { value: 'top-center', label: 'أعلى وسط' },
  { value: 'top-right', label: 'أعلى يمين' },
  { value: 'center-left', label: 'وسط يسار' },
  { value: 'center', label: 'وسط' },
  { value: 'center-right', label: 'وسط يمين' },
  { value: 'bottom-left', label: 'أسفل يسار' },
  { value: 'bottom-center', label: 'أسفل وسط' },
  { value: 'bottom-right', label: 'أسفل يمين' },
];

export const DEFAULT_CANVAS_CONFIG: CanvasConfig = {
  aspectRatio: '16:9',
  resolution: '1080p',
  bgType: 'solid',
  bgColor: '#6C3AED',
  bgGradientStart: '#6C3AED',
  bgGradientEnd: '#2DD4A8',
  bgImageUrl: null,
};

export const DEFAULT_TEXT_CONFIG: TextConfig = {
  fontSize: 48,
  fontFamily: "'Space Grotesk', sans-serif",
  color: '#ffffff',
  shadowColor: '#000000',
  shadowOpacity: 0.4,
  position: 'center',
  align: 'center',
  lineSpacing: 1.5,
  bold: true,
  italic: false,
  underline: false,
  textBgEnabled: false,
  textBgColor: '#000000',
  textBgOpacity: 0.5,
  animation: 'typewriter',
};
