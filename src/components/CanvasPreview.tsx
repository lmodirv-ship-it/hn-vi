import { useRef, useEffect, useCallback } from "react";
import type { SceneData } from "@/lib/ffmpeg";

interface CanvasPreviewProps {
  scenes: SceneData[];
  activeSceneId: string;
  isPlaying: boolean;
  onSceneChange: (id: string) => void;
  onPlayingChange: (playing: boolean) => void;
  onTimeUpdate: (elapsed: number, total: number) => void;
}

export default function CanvasPreview({
  scenes,
  activeSceneId,
  isPlaying,
  onSceneChange,
  onPlayingChange,
  onTimeUpdate,
}: CanvasPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const pausedAtRef = useRef<number>(0);

  const totalDuration = scenes.reduce((a, s) => a + s.duration, 0);

  // Find which scene is active at a given elapsed time
  const getSceneAtTime = useCallback(
    (elapsed: number) => {
      let acc = 0;
      for (const scene of scenes) {
        if (elapsed < acc + scene.duration) {
          return { scene, localTime: elapsed - acc };
        }
        acc += scene.duration;
      }
      return { scene: scenes[scenes.length - 1], localTime: scenes[scenes.length - 1].duration };
    },
    [scenes]
  );

  // Ease function
  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
  const easeInCubic = (t: number) => t * t * t;

  // Draw a single frame
  const drawFrame = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number, elapsed: number) => {
      const { scene, localTime } = getSceneAtTime(Math.min(elapsed, totalDuration - 0.001));
      const progress = localTime / scene.duration; // 0..1

      // === Background ===
      ctx.fillStyle = scene.bgColor;
      ctx.fillRect(0, 0, w, h);

      // Subtle animated gradient
      const gradX = w * (0.3 + 0.1 * Math.sin(elapsed * 0.5));
      const gradY = h * (0.4 + 0.05 * Math.cos(elapsed * 0.3));
      const grad = ctx.createRadialGradient(gradX, gradY, 0, gradX, gradY, w * 0.7);
      grad.addColorStop(0, "rgba(255,255,255,0.1)");
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Floating particles
      for (let i = 0; i < 6; i++) {
        const px = (w * (0.15 + 0.7 * ((i * 0.17 + elapsed * 0.02 * (i + 1)) % 1)));
        const py = h * (0.2 + 0.6 * Math.sin(elapsed * 0.3 + i * 1.5) * 0.5 + 0.3);
        const size = 2 + Math.sin(elapsed + i) * 1.5;
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${0.08 + 0.04 * Math.sin(elapsed * 2 + i)})`;
        ctx.fill();
      }

      // === Transition effects ===
      let textOpacity = 1;
      let textOffsetX = 0;
      let textOffsetY = 0;
      let textScale = 1;

      const fadeInDur = 0.4; // seconds
      const fadeOutDur = 0.3;
      const fadeInProgress = Math.min(localTime / fadeInDur, 1);
      const fadeOutProgress = Math.max(0, (localTime - (scene.duration - fadeOutDur)) / fadeOutDur);

      switch (scene.transition) {
        case "fade":
          textOpacity = easeOutCubic(fadeInProgress) * (1 - easeInCubic(fadeOutProgress));
          break;
        case "slide":
          textOpacity = easeOutCubic(fadeInProgress) * (1 - easeInCubic(fadeOutProgress));
          textOffsetY = (1 - easeOutCubic(fadeInProgress)) * 60 + easeInCubic(fadeOutProgress) * -40;
          break;
        case "wipe":
          textOpacity = easeOutCubic(fadeInProgress) * (1 - easeInCubic(fadeOutProgress));
          textOffsetX = (1 - easeOutCubic(fadeInProgress)) * w * 0.15;
          break;
        case "zoom":
          textOpacity = easeOutCubic(fadeInProgress) * (1 - easeInCubic(fadeOutProgress));
          textScale = 0.7 + 0.3 * easeOutCubic(fadeInProgress);
          if (fadeOutProgress > 0) textScale = 1 + 0.3 * easeInCubic(fadeOutProgress);
          break;
      }

      // === Text rendering (typewriter effect) ===
      const text = scene.text;
      const typewriterDur = Math.min(scene.duration * 0.5, 2); // max 2s for typewriter
      const charsToShow = Math.min(
        text.length,
        Math.floor((localTime / typewriterDur) * text.length)
      );
      const displayText = localTime < typewriterDur ? text.slice(0, charsToShow) : text;

      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, textOpacity));
      ctx.translate(w / 2 + textOffsetX, h / 2 + textOffsetY);
      ctx.scale(textScale, textScale);

      // Text styling
      const fontSize = Math.round(w * 0.04);
      ctx.font = `bold ${fontSize}px 'Space Grotesk', sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#ffffff";

      // Shadow
      ctx.shadowColor = "rgba(0,0,0,0.4)";
      ctx.shadowBlur = 15;
      ctx.shadowOffsetY = 3;

      // Word wrap
      const maxWidth = w * 0.65;
      const words = displayText.split(" ");
      const lines: string[] = [];
      let currentLine = "";
      for (const word of words) {
        const test = currentLine ? `${currentLine} ${word}` : word;
        if (ctx.measureText(test).width > maxWidth && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = test;
        }
      }
      if (currentLine) lines.push(currentLine);

      const lineHeight = fontSize * 1.5;
      const startY = -((lines.length - 1) * lineHeight) / 2;

      lines.forEach((line, i) => {
        ctx.fillText(line, 0, startY + i * lineHeight);
      });

      // Typewriter cursor
      if (localTime < typewriterDur && charsToShow < text.length) {
        const lastLine = lines[lines.length - 1] || "";
        const cursorX = ctx.measureText(lastLine).width / 2 + 4;
        const cursorY = startY + (lines.length - 1) * lineHeight;
        const blink = Math.sin(elapsed * 6) > 0;
        if (blink) {
          ctx.fillStyle = "rgba(255,255,255,0.8)";
          ctx.fillRect(cursorX, cursorY - fontSize * 0.4, 3, fontSize * 0.8);
        }
      }

      ctx.restore();

      // === Scene title (subtle) ===
      ctx.save();
      ctx.globalAlpha = 0.3 * Math.max(0, textOpacity);
      ctx.font = `${Math.round(w * 0.015)}px 'Space Grotesk', sans-serif`;
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "left";
      ctx.fillText(scene.title, w * 0.04, h * 0.06);
      ctx.restore();

      // === Time indicator ===
      ctx.save();
      ctx.globalAlpha = 0.25;
      const barY = h - 4;
      ctx.fillStyle = "rgba(255,255,255,0.2)";
      ctx.fillRect(0, barY, w, 4);
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.fillRect(0, barY, w * (elapsed / totalDuration), 4);
      ctx.restore();
    },
    [getSceneAtTime, totalDuration, easeOutCubic, easeInCubic]
  );

  // Resize canvas
  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;
      const rect = container.getBoundingClientRect();
      // 16:9 aspect ratio
      let cw = rect.width;
      let ch = cw * (9 / 16);
      if (ch > rect.height) {
        ch = rect.height;
        cw = ch * (16 / 9);
      }
      canvas.width = cw * window.devicePixelRatio;
      canvas.height = ch * window.devicePixelRatio;
      canvas.style.width = `${cw}px`;
      canvas.style.height = `${ch}px`;
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    if (isPlaying) {
      startTimeRef.current = performance.now() - pausedAtRef.current * 1000;

      const loop = () => {
        const now = performance.now();
        const elapsed = (now - startTimeRef.current) / 1000;

        if (elapsed >= totalDuration) {
          // Loop back
          pausedAtRef.current = 0;
          startTimeRef.current = performance.now();
          onPlayingChange(false);
          onSceneChange(scenes[0].id);
          drawFrame(ctx, canvas.width, canvas.height, 0);
          onTimeUpdate(0, totalDuration);
          return;
        }

        drawFrame(ctx, canvas.width, canvas.height, elapsed);
        onTimeUpdate(elapsed, totalDuration);

        // Update active scene
        const { scene } = getSceneAtTime(elapsed);
        if (scene.id !== activeSceneId) {
          onSceneChange(scene.id);
        }

        animRef.current = requestAnimationFrame(loop);
      };
      animRef.current = requestAnimationFrame(loop);
    } else {
      // Draw static frame for current scene
      let elapsed = 0;
      let acc = 0;
      for (const s of scenes) {
        if (s.id === activeSceneId) {
          elapsed = acc + 0.5; // show mid-scene
          break;
        }
        acc += s.duration;
      }
      pausedAtRef.current = elapsed;
      drawFrame(ctx, canvas.width, canvas.height, elapsed);
      onTimeUpdate(elapsed, totalDuration);
    }

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, activeSceneId, scenes, drawFrame, totalDuration, getSceneAtTime, onSceneChange, onPlayingChange, onTimeUpdate]);

  return (
    <div ref={containerRef} className="flex flex-1 items-center justify-center">
      <canvas
        ref={canvasRef}
        className="rounded-xl shadow-2xl cursor-pointer"
        onClick={() => onPlayingChange(!isPlaying)}
      />
    </div>
  );
}
