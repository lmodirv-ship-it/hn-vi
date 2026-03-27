/**
 * Web Worker for rendering video frames off the main thread.
 * Uses OffscreenCanvas for GPU-accelerated drawing.
 */

interface SceneData {
  id: string;
  title: string;
  text: string;
  duration: number;
  bgColor: string;
  transition: string;
}

interface RenderRequest {
  type: "RENDER_FRAMES";
  scenes: SceneData[];
  width: number;
  height: number;
  fps: number;
}

interface FrameResult {
  type: "FRAME";
  index: number;
  bitmap: ImageBitmap;
}

interface ProgressMsg {
  type: "PROGRESS";
  percent: number;
  status: string;
}

interface DoneMsg {
  type: "DONE";
  totalFrames: number;
}

interface ErrorMsg {
  type: "ERROR";
  message: string;
}

type WorkerOutMessage = FrameResult | ProgressMsg | DoneMsg | ErrorMsg;

function drawSceneFrame(
  ctx: OffscreenCanvasRenderingContext2D,
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
  const g = ctx.createRadialGradient(
    width * 0.3, height * 0.4, 0,
    width * 0.3, height * 0.4, width * 0.7
  );
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
  (ctx as any).textBaseline = "middle";

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
    if (ctx.measureText(test).width > maxW && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = test;
    }
  }
  if (cur) lines.push(cur);

  const lh = fontSize * 1.4;
  const startY = textY - ((lines.length - 1) * lh) / 2;
  lines.forEach((line, i) => ctx.fillText(line, width / 2, startY + i * lh));

  ctx.restore();
}

self.addEventListener("message", async (e: MessageEvent<RenderRequest>) => {
  const { scenes, width, height, fps } = e.data;

  if (e.data.type !== "RENDER_FRAMES") return;

  try {
    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const totalFrames = scenes.reduce((a, s) => a + Math.ceil(s.duration * fps), 0);
    let globalFrame = 0;

    for (const scene of scenes) {
      const sceneFrames = Math.ceil(scene.duration * fps);

      for (let f = 0; f < sceneFrames; f++) {
        drawSceneFrame(ctx, scene, f, sceneFrames, width, height, fps);

        const bitmap = canvas.transferToImageBitmap();

        (self as unknown as Worker).postMessage(
          { type: "FRAME", index: globalFrame, bitmap } as FrameResult,
          [bitmap] as any
        );

        globalFrame++;

        if (globalFrame % 15 === 0) {
          const pct = Math.round((globalFrame / totalFrames) * 100);
          (self as unknown as Worker).postMessage({
            type: "PROGRESS",
            percent: pct,
            status: `جاري إنشاء الإطارات... ${pct}%`,
          } as ProgressMsg);
        }
      }
    }

    (self as unknown as Worker).postMessage({
      type: "DONE",
      totalFrames: globalFrame,
    } as DoneMsg);
  } catch (err: any) {
    (self as unknown as Worker).postMessage({
      type: "ERROR",
      message: err?.message || "خطأ في معالجة الإطارات",
    } as ErrorMsg);
  }
});
