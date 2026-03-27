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

export interface ExportOptions {
  width: number;
  height: number;
  fps: number;
  label: string;
}

export const EXPORT_PRESETS: Record<string, ExportOptions> = {
  "720p": { width: 1280, height: 720, fps: 30, label: "HD 720p" },
  "1080p": { width: 1920, height: 1080, fps: 30, label: "Full HD 1080p" },
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
 * then encodes them into an MP4 using FFmpeg.wasm
 */
export async function exportVideo(
  scenes: SceneData[],
  preset: ExportOptions,
  onProgress: (progress: number, status: string) => void
): Promise<string> {
  onProgress(0, "جاري تحميل محرك الفيديو...");
  const ffmpeg = await getFFmpeg();

  const { width, height, fps } = preset;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;

  // Calculate total frames
  const totalDuration = scenes.reduce((acc, s) => acc + s.duration, 0);
  const totalFrames = totalDuration * fps;

  onProgress(5, "جاري إنشاء الإطارات...");

  // Render each frame
  let frameIndex = 0;
  for (const scene of scenes) {
    const sceneFrames = scene.duration * fps;

    for (let f = 0; f < sceneFrames; f++) {
      const progress = frameIndex / totalFrames;

      // Draw background
      ctx.fillStyle = scene.bgColor;
      ctx.fillRect(0, 0, width, height);

      // Draw subtle radial gradient overlay
      const gradient = ctx.createRadialGradient(
        width * 0.3, height * 0.4, 0,
        width * 0.3, height * 0.4, width * 0.7
      );
      gradient.addColorStop(0, "rgba(255,255,255,0.08)");
      gradient.addColorStop(1, "transparent");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Calculate text animation
      let textOpacity = 1;
      let textY = height / 2;
      const fadeFrames = Math.min(fps * 0.5, sceneFrames * 0.2);

      // Fade in
      if (f < fadeFrames) {
        textOpacity = f / fadeFrames;
        if (scene.transition === "slide") {
          textY = height / 2 + 40 * (1 - f / fadeFrames);
        }
      }
      // Fade out
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

      // Text shadow
      ctx.shadowColor = "rgba(0,0,0,0.3)";
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 2;

      lines.forEach((line, i) => {
        ctx.fillText(line, width / 2, startY + i * lineHeight);
      });

      ctx.restore();

      // Convert canvas to PNG and write to FFmpeg FS
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b!), "image/png");
      });
      const arrayBuffer = await blob.arrayBuffer();
      const frameNum = String(frameIndex).padStart(6, "0");
      await ffmpeg.writeFile(`frame_${frameNum}.png`, new Uint8Array(arrayBuffer));

      frameIndex++;

      // Update progress every 10 frames
      if (frameIndex % 10 === 0) {
        onProgress(5 + progress * 70, `جاري إنشاء الإطارات... ${Math.round(progress * 100)}%`);
      }
    }
  }

  onProgress(75, "جاري تجميع الفيديو...");

  // Encode frames to MP4
  await ffmpeg.exec([
    "-framerate", String(fps),
    "-i", "frame_%06d.png",
    "-c:v", "libx264",
    "-pix_fmt", "yuv420p",
    "-preset", "fast",
    "-crf", "23",
    "output.mp4",
  ]);

  onProgress(95, "جاري التحضير للتنزيل...");

  // Read output
  const data = await ffmpeg.readFile("output.mp4");
  const uint8 = data instanceof Uint8Array ? data : new TextEncoder().encode(data as string);
  const videoBlob = new Blob([new Uint8Array(uint8)], { type: "video/mp4" });
  const url = URL.createObjectURL(videoBlob);

  // Cleanup frames
  for (let i = 0; i < frameIndex; i++) {
    const frameNum = String(i).padStart(6, "0");
    try {
      await ffmpeg.deleteFile(`frame_${frameNum}.png`);
    } catch {}
  }
  try {
    await ffmpeg.deleteFile("output.mp4");
  } catch {}

  onProgress(100, "تم!");
  return url;
}
