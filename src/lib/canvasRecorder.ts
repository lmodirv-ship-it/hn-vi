import type { SceneData } from "./ffmpeg";

/**
 * Fallback video export using MediaRecorder + canvas.captureStream().
 * Works in all modern browsers (outputs WebM).
 */

export async function exportWithCanvasRecorder(
  scenes: SceneData[],
  options: { width: number; height: number; fps: number; bitrate: number },
  onProgress: (progress: number, status: string) => void
): Promise<string> {
  const { width, height, fps, bitrate } = options;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;

  onProgress(2, "جاري تهيئة المسجل...");

  const stream = canvas.captureStream(fps);
  const recorder = new MediaRecorder(stream, {
    mimeType: "video/webm;codecs=vp8",
    videoBitsPerSecond: bitrate,
  });

  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };

  recorder.start();

  const totalDuration = scenes.reduce((a, s) => a + s.duration, 0);
  const totalFrames = Math.ceil(totalDuration * fps);
  const frameDelay = 1000 / fps;
  let globalFrame = 0;

  for (const scene of scenes) {
    const sceneFrames = Math.ceil(scene.duration * fps);

    for (let f = 0; f < sceneFrames; f++) {
      drawFrame(ctx, scene, f, sceneFrames, width, height, fps);
      globalFrame++;

      if (globalFrame % 10 === 0) {
        const pct = Math.round((globalFrame / totalFrames) * 100);
        onProgress(5 + pct * 0.85, `جاري التسجيل... ${pct}%`);
      }

      await new Promise((r) => setTimeout(r, frameDelay));
    }
  }

  onProgress(92, "جاري إنهاء التسجيل...");

  return new Promise<string>((resolve) => {
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      resolve(URL.createObjectURL(blob));
      onProgress(100, "تم!");
    };
    recorder.stop();
  });
}

function drawFrame(
  ctx: CanvasRenderingContext2D,
  scene: SceneData,
  f: number,
  sceneFrames: number,
  w: number,
  h: number,
  fps: number
) {
  ctx.fillStyle = scene.bgColor;
  ctx.fillRect(0, 0, w, h);

  let opacity = 1;
  let y = h / 2;
  const fade = Math.min(fps * 0.5, sceneFrames * 0.2);
  if (f < fade) { opacity = f / fade; if (scene.transition === "slide") y += 40 * (1 - f / fade); }
  if (f > sceneFrames - fade) opacity = (sceneFrames - f) / fade;

  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const fs = Math.round(w * 0.04);
  ctx.font = `bold ${fs}px 'Space Grotesk', sans-serif`;
  ctx.fillText(scene.text, w / 2, y);
  ctx.restore();
}
