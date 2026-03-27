import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";

let ffmpegInstance: FFmpeg | null = null;

export async function getFFmpeg(): Promise<FFmpeg> {
  if (ffmpegInstance) return ffmpegInstance;

  const ffmpeg = new FFmpeg();

  const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";

  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
  });

  ffmpegInstance = ffmpeg;
  return ffmpeg;
}

export type VideoQuality = "low" | "medium" | "high" | "ultra";
export type VideoFormat = "mp4" | "webm";

export interface ExportOptions {
  width: number;
  height: number;
  fps: number;
  label: string;
}

export interface AdvancedExportOptions extends ExportOptions {
  quality: VideoQuality;
  format: VideoFormat;
}

/** Quality-dependent FFmpeg encoding parameters */
const QUALITY_SETTINGS: Record<VideoQuality, { crf: number; preset: string; bitrate: string }> = {
  low:    { crf: 28, preset: "ultrafast", bitrate: "1M" },
  medium: { crf: 23, preset: "fast",      bitrate: "2.5M" },
  high:   { crf: 18, preset: "medium",    bitrate: "5M" },
  ultra:  { crf: 15, preset: "slow",      bitrate: "10M" },
};

export const EXPORT_PRESETS: Record<string, ExportOptions> = {
  "720p":  { width: 1280, height: 720,  fps: 30, label: "HD 720p" },
  "1080p": { width: 1920, height: 1080, fps: 30, label: "Full HD 1080p" },
  "1080p60": { width: 1920, height: 1080, fps: 60, label: "Full HD 1080p 60fps" },
  "4k":    { width: 3840, height: 2160, fps: 30, label: "4K Ultra HD" },
};

export interface SceneData {
  id: string;
  title: string;
  text: string;
  duration: number;
  bgColor: string;
  transition: string;
}

/**
 * Renders scenes to individual frame images on a canvas,
 * then encodes them into a video using FFmpeg.wasm.
 * Supports quality tiers, 60fps, 4K, and mp4/webm output.
 */
export async function exportVideo(
  scenes: SceneData[],
  preset: ExportOptions,
  onProgress: (progress: number, status: string) => void,
  quality: VideoQuality = "high",
  format: VideoFormat = "mp4"
): Promise<string> {
  onProgress(0, "جاري تحميل محرك الفيديو...");
  const ffmpeg = await getFFmpeg();

  const { width, height, fps } = preset;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;

  // Enable high-quality rendering
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  const totalDuration = scenes.reduce((acc, s) => acc + s.duration, 0);
  const totalFrames = Math.ceil(totalDuration * fps);

  onProgress(5, "جاري إنشاء الإطارات...");

  let frameIndex = 0;
  for (const scene of scenes) {
    const sceneFrames = Math.ceil(scene.duration * fps);

    for (let f = 0; f < sceneFrames; f++) {
      const progress = frameIndex / totalFrames;

      // Draw background
      ctx.fillStyle = scene.bgColor;
      ctx.fillRect(0, 0, width, height);

      // Radial gradient overlay
      const gradient = ctx.createRadialGradient(
        width * 0.3, height * 0.4, 0,
        width * 0.3, height * 0.4, width * 0.7
      );
      gradient.addColorStop(0, "rgba(255,255,255,0.08)");
      gradient.addColorStop(1, "transparent");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Text animation
      let textOpacity = 1;
      let textY = height / 2;
      const fadeFrames = Math.min(fps * 0.5, sceneFrames * 0.2);

      if (f < fadeFrames) {
        textOpacity = f / fadeFrames;
        if (scene.transition === "slide") {
          textY = height / 2 + 40 * (1 - f / fadeFrames);
        }
      }
      if (f > sceneFrames - fadeFrames) {
        textOpacity = (sceneFrames - f) / fadeFrames;
      }

      // Draw text
      ctx.save();
      ctx.globalAlpha = textOpacity;
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const fontSize = Math.round(width * 0.04);
      ctx.font = `bold ${fontSize}px 'Space Grotesk', sans-serif`;

      // Text shadow for depth
      ctx.shadowColor = "rgba(0,0,0,0.4)";
      ctx.shadowBlur = 12;
      ctx.shadowOffsetY = 3;

      // Word wrap
      const maxWidth = width * 0.7;
      const words = scene.text.split(" ");
      const lines: string[] = [];
      let currentLine = "";

      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        if (ctx.measureText(testLine).width > maxWidth && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) lines.push(currentLine);

      const lineHeight = fontSize * 1.4;
      const startY = textY - ((lines.length - 1) * lineHeight) / 2;

      lines.forEach((line, i) => {
        ctx.fillText(line, width / 2, startY + i * lineHeight);
      });

      ctx.restore();

      // Write frame to FFmpeg FS
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b!), "image/png");
      });
      const arrayBuffer = await blob.arrayBuffer();
      const frameNum = String(frameIndex).padStart(6, "0");
      await ffmpeg.writeFile(`frame_${frameNum}.png`, new Uint8Array(arrayBuffer));

      frameIndex++;

      if (frameIndex % 10 === 0) {
        onProgress(5 + progress * 70, `جاري إنشاء الإطارات... ${Math.round(progress * 100)}%`);
      }
    }
  }

  onProgress(75, "جاري تجميع الفيديو...");

  const qs = QUALITY_SETTINGS[quality];
  const outputFile = `output.${format}`;

  if (format === "webm") {
    await ffmpeg.exec([
      "-framerate", String(fps),
      "-i", "frame_%06d.png",
      "-c:v", "libvpx-vp9",
      "-b:v", qs.bitrate,
      "-crf", String(qs.crf),
      "-pix_fmt", "yuv420p",
      "-r", String(fps),
      outputFile,
    ]);
  } else {
    await ffmpeg.exec([
      "-framerate", String(fps),
      "-i", "frame_%06d.png",
      "-c:v", "libx264",
      "-preset", qs.preset,
      "-crf", String(qs.crf),
      "-b:v", qs.bitrate,
      "-pix_fmt", "yuv420p",
      "-movflags", "+faststart",
      "-tune", "film",
      "-profile:v", "high",
      "-level", "4.2",
      "-r", String(fps),
      outputFile,
    ]);
  }

  onProgress(95, "جاري التحضير للتنزيل...");

  const data = await ffmpeg.readFile(outputFile);
  const uint8 = data instanceof Uint8Array ? data : new TextEncoder().encode(data as string);
  const mimeType = format === "webm" ? "video/webm" : "video/mp4";
  const videoBlob = new Blob([new Uint8Array(uint8)], { type: mimeType });
  const url = URL.createObjectURL(videoBlob);

  // Cleanup
  for (let i = 0; i < frameIndex; i++) {
    const frameNum = String(i).padStart(6, "0");
    try { await ffmpeg.deleteFile(`frame_${frameNum}.png`); } catch {}
  }
  try { await ffmpeg.deleteFile(outputFile); } catch {}

  onProgress(100, "تم!");
  return url;
}
