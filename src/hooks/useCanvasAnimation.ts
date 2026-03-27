import { useRef, useEffect, useCallback, useState } from 'react';
import type { SceneData } from '@/lib/ffmpeg';
import type { CanvasConfig, TextConfig, TextPosition, ASPECT_RATIOS } from '@/types/canvas';
import { sanitizeText } from '@/utils/canvasValidation';

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeIn = (t: number) => t * t * t;

function getPositionXY(
  pos: TextPosition,
  w: number,
  h: number,
  align: 'left' | 'center' | 'right'
): { x: number; y: number; textAlign: CanvasTextAlign } {
  const pad = 0.08;
  const posMap: Record<TextPosition, { x: number; y: number; textAlign: CanvasTextAlign }> = {
    'top-left': { x: w * pad, y: h * 0.12, textAlign: 'left' },
    'top-center': { x: w / 2, y: h * 0.12, textAlign: 'center' },
    'top-right': { x: w * (1 - pad), y: h * 0.12, textAlign: 'right' },
    'center-left': { x: w * pad, y: h / 2, textAlign: 'left' },
    'center': { x: w / 2, y: h / 2, textAlign: 'center' },
    'center-right': { x: w * (1 - pad), y: h / 2, textAlign: 'right' },
    'bottom-left': { x: w * pad, y: h * 0.88, textAlign: 'left' },
    'bottom-center': { x: w / 2, y: h * 0.88, textAlign: 'center' },
    'bottom-right': { x: w * (1 - pad), y: h * 0.88, textAlign: 'right' },
  };
  const p = posMap[pos];
  // Override textAlign if user explicitly sets it
  const finalAlign: CanvasTextAlign = align === 'left' ? 'left' : align === 'right' ? 'right' : p.textAlign;
  return { ...p, textAlign: finalAlign };
}

interface UseCanvasAnimationProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  containerRef: React.RefObject<HTMLDivElement>;
  scenes: SceneData[];
  activeSceneId: string;
  canvasConfig: CanvasConfig;
  textConfig: TextConfig;
  bgImage: HTMLImageElement | null;
  aspectRatioValue: number;
}

interface UseCanvasAnimationReturn {
  isPlaying: boolean;
  currentTime: number;
  totalDuration: number;
  play: () => void;
  pause: () => void;
  restart: () => void;
  seek: (time: number) => void;
  togglePlay: () => void;
  currentSceneId: string;
}

export function useCanvasAnimation({
  canvasRef,
  containerRef,
  scenes,
  activeSceneId,
  canvasConfig,
  textConfig,
  bgImage,
  aspectRatioValue,
}: UseCanvasAnimationProps): UseCanvasAnimationReturn {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentSceneId, setCurrentSceneId] = useState(activeSceneId);

  const animRef = useRef<number>(0);
  const startTimeRef = useRef(0);
  const pausedAtRef = useRef(0);
  const lastDrawRef = useRef(0);

  const totalDuration = scenes.reduce((a, s) => a + s.duration, 0);

  const getSceneAtTime = useCallback((elapsed: number) => {
    let acc = 0;
    for (const scene of scenes) {
      if (elapsed < acc + scene.duration) {
        return { scene, localTime: elapsed - acc };
      }
      acc += scene.duration;
    }
    return { scene: scenes[scenes.length - 1], localTime: scenes[scenes.length - 1].duration };
  }, [scenes]);

  const drawFrame = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number, elapsed: number) => {
      const { scene, localTime } = getSceneAtTime(Math.min(elapsed, totalDuration - 0.001));
      const progress = localTime / scene.duration;

      // === Background ===
      if (canvasConfig.bgType === 'gradient') {
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, canvasConfig.bgGradientStart);
        grad.addColorStop(1, canvasConfig.bgGradientEnd);
        ctx.fillStyle = grad;
      } else if (canvasConfig.bgType === 'image' && bgImage) {
        ctx.drawImage(bgImage, 0, 0, w, h);
        ctx.fillStyle = 'transparent';
      } else {
        ctx.fillStyle = scene.bgColor;
      }
      ctx.fillRect(0, 0, w, h);

      // Subtle animated gradient overlay
      const gradX = w * (0.3 + 0.1 * Math.sin(elapsed * 0.5));
      const gradY = h * (0.4 + 0.05 * Math.cos(elapsed * 0.3));
      const radGrad = ctx.createRadialGradient(gradX, gradY, 0, gradX, gradY, w * 0.7);
      radGrad.addColorStop(0, 'rgba(255,255,255,0.08)');
      radGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = radGrad;
      ctx.fillRect(0, 0, w, h);

      // Floating particles
      for (let i = 0; i < 6; i++) {
        const px = w * (0.15 + 0.7 * ((i * 0.17 + elapsed * 0.02 * (i + 1)) % 1));
        const py = h * (0.2 + 0.6 * Math.sin(elapsed * 0.3 + i * 1.5) * 0.5 + 0.3);
        const size = 2 + Math.sin(elapsed + i) * 1.5;
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${0.06 + 0.03 * Math.sin(elapsed * 2 + i)})`;
        ctx.fill();
      }

      // === Animation effects ===
      let textOpacity = 1;
      let textOffsetX = 0;
      let textOffsetY = 0;
      let textScale = 1;

      const fadeInDur = 0.5;
      const fadeOutDur = 0.3;
      const fadeInP = Math.min(localTime / fadeInDur, 1);
      const fadeOutP = Math.max(0, (localTime - (scene.duration - fadeOutDur)) / fadeOutDur);

      const anim = textConfig.animation;
      textOpacity = easeOut(fadeInP) * (1 - easeIn(fadeOutP));

      if (anim === 'slide-left') textOffsetX = (1 - easeOut(fadeInP)) * -w * 0.15;
      else if (anim === 'slide-right') textOffsetX = (1 - easeOut(fadeInP)) * w * 0.15;
      else if (anim === 'slide-up') textOffsetY = (1 - easeOut(fadeInP)) * -h * 0.1;
      else if (anim === 'slide-down') textOffsetY = (1 - easeOut(fadeInP)) * h * 0.1;
      else if (anim === 'zoom-in') textScale = 0.5 + 0.5 * easeOut(fadeInP);
      else if (anim === 'zoom-out') textScale = 1.5 - 0.5 * easeOut(fadeInP);
      else if (anim === 'fade') { /* opacity only */ }

      // === Text rendering ===
      const cleanText = sanitizeText(scene.text);
      const isTypewriter = anim === 'typewriter';
      const typewriterDur = Math.min(scene.duration * 0.5, 2);
      const charsToShow = isTypewriter
        ? Math.min(cleanText.length, Math.floor((localTime / typewriterDur) * cleanText.length))
        : cleanText.length;
      const displayText = isTypewriter && localTime < typewriterDur
        ? cleanText.slice(0, charsToShow)
        : cleanText;

      const { x: posX, y: posY, textAlign } = getPositionXY(textConfig.position, w, h, textConfig.align);

      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, textOpacity));
      ctx.translate(posX + textOffsetX, posY + textOffsetY);
      ctx.scale(textScale, textScale);

      // Font
      const scaleFactor = w / 1920; // normalize to 1080p
      const fontSize = Math.round(textConfig.fontSize * scaleFactor);
      const weight = textConfig.bold ? 'bold' : 'normal';
      const style = textConfig.italic ? 'italic' : 'normal';
      ctx.font = `${style} ${weight} ${fontSize}px ${textConfig.fontFamily}`;
      ctx.textAlign = textAlign;
      ctx.textBaseline = 'middle';
      ctx.fillStyle = textConfig.color;

      // Shadow
      ctx.shadowColor = `${textConfig.shadowColor}${Math.round(textConfig.shadowOpacity * 255).toString(16).padStart(2, '0')}`;
      ctx.shadowBlur = 15;
      ctx.shadowOffsetY = 3;

      // Word wrap
      const maxWidth = w * 0.7;
      const words = displayText.split(' ');
      const lines: string[] = [];
      let currentLine = '';
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

      const lineHeight = fontSize * textConfig.lineSpacing;
      const startY = -((lines.length - 1) * lineHeight) / 2;

      // Text background
      if (textConfig.textBgEnabled) {
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;
        const bgPad = fontSize * 0.3;
        lines.forEach((line, i) => {
          const lw = ctx.measureText(line).width;
          const lx = textAlign === 'center' ? -lw / 2 : textAlign === 'right' ? -lw : 0;
          ctx.fillStyle = `${textConfig.textBgColor}${Math.round(textConfig.textBgOpacity * 255).toString(16).padStart(2, '0')}`;
          ctx.fillRect(lx - bgPad, startY + i * lineHeight - fontSize * 0.5 - bgPad / 2, lw + bgPad * 2, fontSize + bgPad);
        });
        ctx.fillStyle = textConfig.color;
        ctx.shadowColor = `${textConfig.shadowColor}${Math.round(textConfig.shadowOpacity * 255).toString(16).padStart(2, '0')}`;
        ctx.shadowBlur = 15;
        ctx.shadowOffsetY = 3;
      }

      lines.forEach((line, i) => {
        ctx.fillText(line, 0, startY + i * lineHeight);
        // Underline
        if (textConfig.underline) {
          const lw = ctx.measureText(line).width;
          const lx = textAlign === 'center' ? -lw / 2 : textAlign === 'right' ? -lw : 0;
          ctx.fillRect(lx, startY + i * lineHeight + fontSize * 0.45, lw, 2);
        }
      });

      // Typewriter cursor
      if (isTypewriter && localTime < typewriterDur && charsToShow < cleanText.length) {
        const lastLine = lines[lines.length - 1] || '';
        const cursorX = textAlign === 'center' ? ctx.measureText(lastLine).width / 2 + 4 : ctx.measureText(lastLine).width + 4;
        const cursorY = startY + (lines.length - 1) * lineHeight;
        if (Math.sin(elapsed * 6) > 0) {
          ctx.fillStyle = 'rgba(255,255,255,0.8)';
          ctx.fillRect(cursorX, cursorY - fontSize * 0.4, 3, fontSize * 0.8);
        }
      }

      ctx.restore();

      // Scene title
      ctx.save();
      ctx.globalAlpha = 0.3 * Math.max(0, textOpacity);
      ctx.font = `${Math.round(w * 0.015)}px 'Space Grotesk', sans-serif`;
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.fillText(sanitizeText(scene.title), w * 0.04, h * 0.06);
      ctx.restore();

      // Progress bar
      ctx.save();
      ctx.globalAlpha = 0.25;
      const barY = h - 4;
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.fillRect(0, barY, w, 4);
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.fillRect(0, barY, w * (elapsed / totalDuration), 4);
      ctx.restore();
    },
    [getSceneAtTime, totalDuration, canvasConfig, textConfig, bgImage]
  );

  // Resize
  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;
      const rect = container.getBoundingClientRect();
      let cw = rect.width;
      let ch = cw / aspectRatioValue;
      if (ch > rect.height) {
        ch = rect.height;
        cw = ch * aspectRatioValue;
      }
      canvas.width = cw * window.devicePixelRatio;
      canvas.height = ch * window.devicePixelRatio;
      canvas.style.width = `${cw}px`;
      canvas.style.height = `${ch}px`;
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [canvasRef, containerRef, aspectRatioValue]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (isPlaying) {
      startTimeRef.current = performance.now() - pausedAtRef.current * 1000;

      const loop = () => {
        const now = performance.now();
        // Throttle to ~60fps
        if (now - lastDrawRef.current < 16) {
          animRef.current = requestAnimationFrame(loop);
          return;
        }
        lastDrawRef.current = now;

        const elapsed = (now - startTimeRef.current) / 1000;

        if (elapsed >= totalDuration) {
          pausedAtRef.current = 0;
          setIsPlaying(false);
          setCurrentTime(0);
          setCurrentSceneId(scenes[0].id);
          drawFrame(ctx, canvas.width, canvas.height, 0);
          return;
        }

        drawFrame(ctx, canvas.width, canvas.height, elapsed);
        setCurrentTime(elapsed);

        const { scene } = getSceneAtTime(elapsed);
        if (scene.id !== currentSceneId) {
          setCurrentSceneId(scene.id);
        }

        animRef.current = requestAnimationFrame(loop);
      };
      animRef.current = requestAnimationFrame(loop);
    } else {
      // Draw static frame
      let elapsed = 0;
      let acc = 0;
      for (const s of scenes) {
        if (s.id === activeSceneId) {
          elapsed = acc + 0.5;
          break;
        }
        acc += s.duration;
      }
      pausedAtRef.current = elapsed;
      drawFrame(ctx, canvas.width, canvas.height, elapsed);
      setCurrentTime(elapsed);
    }

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, activeSceneId, scenes, drawFrame, totalDuration, getSceneAtTime, canvasRef, currentSceneId]);

  const play = useCallback(() => setIsPlaying(true), []);
  const pause = useCallback(() => setIsPlaying(false), []);
  const togglePlay = useCallback(() => setIsPlaying(p => !p), []);
  const restart = useCallback(() => {
    pausedAtRef.current = 0;
    setCurrentTime(0);
    setCurrentSceneId(scenes[0].id);
    setIsPlaying(true);
  }, [scenes]);
  const seek = useCallback((time: number) => {
    pausedAtRef.current = time;
    setCurrentTime(time);
    const { scene } = getSceneAtTime(time);
    setCurrentSceneId(scene.id);
    // Redraw immediately
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) drawFrame(ctx, canvas.width, canvas.height, time);
    }
  }, [getSceneAtTime, drawFrame, canvasRef]);

  return {
    isPlaying,
    currentTime,
    totalDuration,
    play,
    pause,
    restart,
    seek,
    togglePlay,
    currentSceneId,
  };
}
