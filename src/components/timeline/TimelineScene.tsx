import { memo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2, Copy, GripVertical } from 'lucide-react';
import type { SceneData } from '@/lib/ffmpeg';

interface TimelineSceneProps {
  scene: SceneData;
  index: number;
  isSelected: boolean;
  isActive: boolean;
  zoom: number;
  canDelete: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onDurationChange: (duration: number) => void;
}

export const TimelineScene = memo(function TimelineScene({
  scene,
  index,
  isSelected,
  isActive,
  zoom,
  canDelete,
  onSelect,
  onDelete,
  onDuplicate,
}: TimelineSceneProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: scene.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    width: `${Math.max(80, scene.duration * 20 * zoom)}px`,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={`relative flex flex-col rounded-lg border cursor-pointer select-none transition-colors ${
        isSelected
          ? 'border-primary bg-primary/10'
          : isActive
          ? 'border-primary/40 bg-primary/5'
          : 'border-border bg-card hover:border-muted-foreground/30'
      }`}
    >
      {/* Color strip */}
      <div className="h-1.5 rounded-t-lg" style={{ backgroundColor: scene.bgColor }} />

      <div className="flex items-center gap-1 px-2 py-1.5">
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
          <GripVertical className="h-3.5 w-3.5 text-muted-foreground/50" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] text-muted-foreground">#{index + 1}</p>
          <p className="text-xs font-medium truncate">{scene.title}</p>
        </div>
      </div>

      <div className="px-2 pb-1.5 text-[10px] text-muted-foreground truncate">
        {scene.text.substring(0, 30)}
      </div>

      <div className="flex items-center justify-between px-2 pb-1.5">
        <span className="text-[10px] font-mono text-muted-foreground">{scene.duration}ث</span>
        <div className="flex gap-0.5">
          <button
            onClick={(e) => { e.stopPropagation(); onDuplicate(); }}
            className="p-0.5 rounded hover:bg-muted transition-colors"
            title="تكرار"
          >
            <Copy className="h-3 w-3 text-muted-foreground" />
          </button>
          {canDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="p-0.5 rounded hover:bg-destructive/10 transition-colors"
              title="حذف"
            >
              <Trash2 className="h-3 w-3 text-destructive" />
            </button>
          )}
        </div>
      </div>

      {/* Transition badge */}
      {scene.transition !== 'none' && (
        <div className="absolute -right-2 top-1/2 -translate-y-1/2 bg-muted text-[9px] text-muted-foreground px-1 py-0.5 rounded border border-border z-10">
          {scene.transition}
        </div>
      )}
    </div>
  );
});
