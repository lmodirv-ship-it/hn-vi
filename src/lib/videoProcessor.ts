import { Muxer, ArrayBufferTarget } from "mp4-muxer";
import type { SceneData } from "./ffmpeg";

/**
 * WebCodecs-based video processor — lighter & faster than FFmpeg.wasm.
 * Falls back to CanvasRecorder when WebCodecs is unavailable.
 */

export function supportsWebCodecs(): boolean {
  return typeof VideoEncoder !== "undefined" && typeof VideoFrame !== "undefined";
}

export interface VideoProcessorOptions {
  width: number;
  height: number;
  fps: number;
  bitrate: number;
}

export async function exportWithWebCodecs(
  scenes: SceneData[],
  options: VideoProcessorOptions,
  onProgress: (progress: number, status: string) => void
): Promise<string> {
  const { width, height, fps, bitrate } = options;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  onProgress(2, "جاري تهيئة المعالج...");

  const target = new ArrayBufferTarget();
  const muxer = new Muxer({
    target,
    video: { codec: "avc", width, height },
    fastStart: "in-memory",
  });

  const encoder = new VideoEncoder({
    output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
    error: (e) => { throw e; },
  });

  encoder.configure({
    codec: "avc1.42E01E",
    width,
    height,
    bitrate,
    framerate: fps,
  });

  const totalDuration = scenes.reduce((a, s) => a + s.duration, 0);
  const totalFrames = Math.ceil(totalDuration * fps);
  const frameDuration = 1_000_000 / fps; // microseconds

  let globalFrame = 0;

  for (const scene of scenes) {
    const sceneFrames = Math.ceil(scene.duration * fps);

    for (let f = 0; f < sceneFrames; f++) {
      drawSceneFrame(ctx, scene, f, sceneFrames, width, height, fps);

      const frame = new VideoFrame(canvas, { timestamp: globalFrame * frameDuration });
      encoder.encode(frame, { keyFrame: globalFrame % (fps * 2) === 0 });
      frame.close();

      globalFrame++;

      if (globalFrame % 10 === 0) {
        const pct = Math.round((globalFrame / totalFrames) * 100);
        onProgress(5 + pct * 0.85, `جاري إنشاء الإطارات... ${pct}%`);
        // yield to keep UI responsive
        await new Promise((r) => setTimeout(r, 0));
      }
    }
  }

  onProgress(92, "جاري إنهاء الترميز...");
  await encoder.flush();
  encoder.close();
  muxer.finalize();

  const buf = target.buffer;
  const blob = new Blob([buf], { type: "video/mp4" });
  const url = URL.createObjectURL(blob);

  onProgress(100, "تم!");
  return url;
}

/* ── frame drawing (shared logic) ── */

function drawSceneFrame(
  ctx: CanvasRenderingContext2D,
  scene: SceneData,
  f: number,
  sceneFrames: number,
  width: number,
  height: number,
  fps: number
) {
  // Background
  ctx.fillStyle = scene.bgColor;
  ctx.fillRect(0, 0, width, height);

  // Radial gradient overlay
  const g = ctx.createRadialGradient(width * 0.3, height * 0.4, 0, width * 0.3, height * 0.4, width * 0.7);
  g.addColorStop(0, "rgba(255,255,255,0.08)");
  g.addColorStop(1, "transparent");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, width, height);

  // Text animation
  let textOpacity = 1;
  let textY = height / 2;
  const fadeFrames = Math.min(fps * 0.5, sceneFrames * 0.2);

  if (f < fadeFrames) {
    textOpacity = f / fadeFrames;
    if (scene.transition === "slide") textY = height / 2 + 40 * (1 - f / fadeFrames);
  }
  if (f > sceneFrames - fadeFrames) {
    textOpacity = (sceneFrames - f) / fadeFrames;
  }

  ctx.save();
  ctx.globalAlpha = textOpacity;
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const fontSize = Math.round(width * 0.04);
  ctx.font = `bold ${fontSize}px 'Space Grotesk', sans-serif`;
  ctx.shadowColor = "rgba(0,0,0,0.4)";
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 3;

  // Word-wrap
  const maxW = width * 0.7;
  const words = scene.text.split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const test = cur ? `${cur} ${w}` : w;
    if (ctx.measureText(test).width > maxW && cur) { lines.push(cur); cur = w; }
    else cur = test;
  }
  if (cur) lines.push(cur);

  const lh = fontSize * 1.4;
  const startY = textY - ((lines.length - 1) * lh) / 2;
  lines.forEach((line, i) => ctx.fillText(line, width / 2, startY + i * lh));

  ctx.restore();
}
