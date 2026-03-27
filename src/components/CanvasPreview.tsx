import { useRef, useState, useCallback, useMemo } from 'react';
import type { SceneData } from '@/lib/ffmpeg';
import { useCanvasAnimation } from '@/hooks/useCanvasAnimation';
import CanvasControls from '@/components/canvas/CanvasControls';
import CanvasSettingsPanel from '@/components/canvas/CanvasSettingsPanel';
import { type CanvasConfig, type TextConfig, ASPECT_RATIOS, DEFAULT_CANVAS_CONFIG, DEFAULT_TEXT_CONFIG } from '@/types/canvas';
import { Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';

export interface CanvasAnimationControls {
  isPlaying: boolean;
  currentTime: number;
  totalDuration: number;
  play: () => void;
  pause: () => void;
  restart: () => void;
  seek: (time: number) => void;
}

interface CanvasPreviewProps {
  scenes: SceneData[];
  activeSceneId: string;
  onSceneChange: (id: string) => void;
  onControlsReady?: (controls: CanvasAnimationControls) => void;
}

export default function CanvasPreview({ scenes, activeSceneId, onSceneChange }: CanvasPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const [canvasConfig, setCanvasConfig] = useState<CanvasConfig>(DEFAULT_CANVAS_CONFIG);
  const [textConfig, setTextConfig] = useState<TextConfig>(DEFAULT_TEXT_CONFIG);
  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const aspectRatioValue = useMemo(() => ASPECT_RATIOS[canvasConfig.aspectRatio].ratio, [canvasConfig.aspectRatio]);

  const { isPlaying, currentTime, totalDuration, play, pause, restart, seek, togglePlay, currentSceneId } = useCanvasAnimation({
    canvasRef: canvasRef as React.RefObject<HTMLCanvasElement>,
    containerRef: containerRef as React.RefObject<HTMLDivElement>,
    scenes,
    activeSceneId,
    canvasConfig,
    textConfig,
    bgImage,
    aspectRatioValue,
  });

  // Sync scene changes back to parent
  if (currentSceneId !== activeSceneId && isPlaying) {
    onSceneChange(currentSceneId);
  }

  const handleCanvasChange = useCallback((partial: Partial<CanvasConfig>) => {
    setCanvasConfig(prev => ({ ...prev, ...partial }));
  }, []);

  const handleTextChange = useCallback((partial: Partial<TextConfig>) => {
    setTextConfig(prev => ({ ...prev, ...partial }));
  }, []);

  const handleBgImageUpload = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => setBgImage(img);
    img.onerror = () => setBgImage(null);
    img.src = url;
  }, []);

  const settingsContent = (
    <CanvasSettingsPanel
      canvasConfig={canvasConfig}
      textConfig={textConfig}
      onCanvasChange={handleCanvasChange}
      onTextChange={handleTextChange}
      onBgImageUpload={handleBgImageUpload}
    />
  );

  return (
    <div className="flex flex-1 flex-col h-full">
      {/* Canvas */}
      <div ref={containerRef} className="flex flex-1 items-center justify-center bg-muted/20 p-4 relative">
        <canvas
          ref={canvasRef}
          className="rounded-xl shadow-2xl cursor-pointer"
          onClick={togglePlay}
        />
        {/* Settings toggle */}
        {isMobile ? (
          <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="absolute top-6 right-6 h-8 w-8 bg-background/80 backdrop-blur-sm">
                <Settings2 className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[70vh]">
              <SheetHeader><SheetTitle>إعدادات Canvas</SheetTitle></SheetHeader>
              <ScrollArea className="h-full pr-4 mt-4">
                {settingsContent}
              </ScrollArea>
            </SheetContent>
          </Sheet>
        ) : (
          <Button variant="outline" size="icon" className="absolute top-6 right-6 h-8 w-8 bg-background/80 backdrop-blur-sm"
            onClick={() => setSettingsOpen(o => !o)}>
            <Settings2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Controls */}
      <div className="border-t border-border bg-muted/30 px-2 py-2">
        <CanvasControls
          isPlaying={isPlaying}
          currentTime={currentTime}
          totalDuration={totalDuration}
          onPlay={play}
          onPause={pause}
          onRestart={restart}
          onSeek={seek}
        />
      </div>

      {/* Desktop settings panel overlay */}
      {!isMobile && settingsOpen && (
        <div className="absolute top-14 right-0 w-[320px] h-[calc(100%-3.5rem)] border-l border-border bg-background z-20 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="text-sm font-medium">إعدادات Canvas</span>
            <Button variant="ghost" size="sm" onClick={() => setSettingsOpen(false)}>✕</Button>
          </div>
          <ScrollArea className="h-[calc(100%-3rem)] px-4 py-3">
            {settingsContent}
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
