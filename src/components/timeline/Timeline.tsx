import { useState, useRef, useCallback, memo } from 'react';
import { DndContext, DragEndEvent, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { TimelineScene } from './TimelineScene';
import { Plus, Play, Pause, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import type { SceneData } from '@/lib/ffmpeg';

interface TimelineProps {
  scenes: SceneData[];
  currentTime: number;
  totalDuration: number;
  isPlaying: boolean;
  activeSceneId: string;
  onScenesChange: (scenes: SceneData[]) => void;
  onSceneSelect: (id: string) => void;
  onSeek: (time: number) => void;
  onPlay: () => void;
  onPause: () => void;
  onRestart: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export const Timeline = memo(function Timeline({
  scenes,
  currentTime,
  totalDuration,
  isPlaying,
  activeSceneId,
  onScenesChange,
  onSceneSelect,
  onSeek,
  onPlay,
  onPause,
  onRestart,
}: TimelineProps) {
  const [zoom, setZoom] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleAddScene = useCallback(() => {
    if (scenes.length >= 100) return;
    const newScene: SceneData = {
      id: Date.now().toString(),
      title: `مشهد ${scenes.length + 1}`,
      text: 'أدخل النص هنا...',
      duration: 5,
      bgColor: '#6C3AED',
      transition: 'fade',
    };
    onScenesChange([...scenes, newScene]);
    onSceneSelect(newScene.id);
  }, [scenes, onScenesChange, onSceneSelect]);

  const handleDeleteScene = useCallback((sceneId: string) => {
    if (scenes.length <= 1) return;
    const filtered = scenes.filter(s => s.id !== sceneId);
    onScenesChange(filtered);
    if (activeSceneId === sceneId) onSceneSelect(filtered[0].id);
  }, [scenes, activeSceneId, onScenesChange, onSceneSelect]);

  const handleDuplicateScene = useCallback((sceneId: string) => {
    if (scenes.length >= 100) return;
    const idx = scenes.findIndex(s => s.id === sceneId);
    if (idx === -1) return;
    const clone: SceneData = { ...scenes[idx], id: Date.now().toString() };
    const updated = [...scenes.slice(0, idx + 1), clone, ...scenes.slice(idx + 1)];
    onScenesChange(updated);
    onSceneSelect(clone.id);
  }, [scenes, onScenesChange, onSceneSelect]);

  const handleDurationChange = useCallback((sceneId: string, dur: number) => {
    const valid = Math.min(Math.max(dur, 1), 60);
    onScenesChange(scenes.map(s => s.id === sceneId ? { ...s, duration: valid } : s));
  }, [scenes, onScenesChange]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = scenes.findIndex(s => s.id === active.id);
    const newIdx = scenes.findIndex(s => s.id === over.id);
    onScenesChange(arrayMove(scenes, oldIdx, newIdx));
  }, [scenes, onScenesChange]);

  // Calculate scene start times
  const sceneStarts: number[] = [];
  let acc = 0;
  for (const s of scenes) {
    sceneStarts.push(acc);
    acc += s.duration;
  }

  return (
    <div className="border-t border-border bg-muted/50">
      {/* Controls bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={isPlaying ? onPause : onPlay}>
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onRestart}>
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
          <span className="text-xs font-mono text-muted-foreground min-w-[90px]">
            {formatTime(currentTime)} / {formatTime(totalDuration)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setZoom(z => Math.max(0.5, z - 0.25))}>
            <ZoomOut className="h-3.5 w-3.5" />
          </Button>
          <span className="text-xs text-muted-foreground w-10 text-center">{Math.round(zoom * 100)}%</span>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setZoom(z => Math.min(3, z + 0.25))}>
            <ZoomIn className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={handleAddScene} disabled={scenes.length >= 100}>
            <Plus className="h-3.5 w-3.5" />
            مشهد
          </Button>
        </div>
      </div>

      {/* Seek slider */}
      <div className="px-4 py-1">
        <Slider
          value={[currentTime]}
          min={0}
          max={totalDuration || 1}
          step={0.1}
          onValueChange={([v]) => onSeek(v)}
          className="h-2"
        />
      </div>

      {/* Scene blocks */}
      <div ref={scrollRef} className="overflow-x-auto px-4 py-2">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={scenes.map(s => s.id)} strategy={horizontalListSortingStrategy}>
            <div className="flex gap-1.5" style={{ minWidth: 'max-content' }}>
              {scenes.map((scene, i) => (
                <TimelineScene
                  key={scene.id}
                  scene={scene}
                  index={i}
                  isSelected={activeSceneId === scene.id}
                  isActive={currentTime >= sceneStarts[i] && currentTime < sceneStarts[i] + scene.duration}
                  zoom={zoom}
                  onSelect={() => onSceneSelect(scene.id)}
                  onDelete={() => handleDeleteScene(scene.id)}
                  onDuplicate={() => handleDuplicateScene(scene.id)}
                  onDurationChange={(d) => handleDurationChange(scene.id, d)}
                  canDelete={scenes.length > 1}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* Info bar */}
      <div className="flex items-center justify-between px-4 py-1 border-t border-border text-[11px] text-muted-foreground">
        <span>المشاهد: {scenes.length}/100</span>
        <span>المدة المتبقية: {formatTime(Math.max(0, 3600 - totalDuration))}</span>
      </div>
    </div>
  );
});
