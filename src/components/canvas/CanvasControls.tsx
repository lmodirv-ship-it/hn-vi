import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { formatTime } from '@/utils/canvasValidation';

interface CanvasControlsProps {
  isPlaying: boolean;
  currentTime: number;
  totalDuration: number;
  onPlay: () => void;
  onPause: () => void;
  onRestart: () => void;
  onSeek: (time: number) => void;
}

export default function CanvasControls({
  isPlaying,
  currentTime,
  totalDuration,
  onPlay,
  onPause,
  onRestart,
  onSeek,
}: CanvasControlsProps) {
  return (
    <div className="flex items-center gap-3 w-full px-2">
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onRestart}>
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={isPlaying ? onPause : onPlay}>
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
      </div>
      <span className="text-xs text-muted-foreground font-mono w-12 shrink-0">
        {formatTime(currentTime)}
      </span>
      <Slider
        value={[currentTime]}
        min={0}
        max={totalDuration}
        step={0.1}
        onValueChange={([v]) => onSeek(v)}
        className="flex-1"
      />
      <span className="text-xs text-muted-foreground font-mono w-12 text-right shrink-0">
        {formatTime(totalDuration)}
      </span>
    </div>
  );
}
