import { useEffect, useRef } from "react";

function parseHslTriplet(raw: string): { h: number; s: number; l: number } | null {
  const t = raw.trim();
  const m = t.match(/^([\d.]+)\s+([\d.]+)%\s+([\d.]+)%$/);
  if (!m) return null;
  return { h: Number(m[1]), s: Number(m[2]), l: Number(m[3]) };
}

function hslCss(t: { h: number; s: number; l: number }): string {
  return `hsl(${t.h} ${t.s}% ${t.l}%)`;
}

function adjustL(t: { h: number; s: number; l: number }, d: number): string {
  const l = Math.max(3, Math.min(94, t.l + d));
  return hslCss({ ...t, l });
}

function drawIsoCube(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  depth: number,
  cTop: string,
  cLeft: string,
  cRight: string
) {
  const w2 = w / 2;
  const h2 = h / 2;

  ctx.fillStyle = cRight;
  ctx.beginPath();
  ctx.moveTo(x + w2, y + h2);
  ctx.lineTo(x + w2, y + h2 + depth);
  ctx.lineTo(x, y + 2 * h2 + depth);
  ctx.lineTo(x, y + 2 * h2);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = cLeft;
  ctx.beginPath();
  ctx.moveTo(x - w2, y + h2);
  ctx.lineTo(x, y + 2 * h2);
  ctx.lineTo(x, y + 2 * h2 + depth);
  ctx.lineTo(x - w2, y + h2 + depth);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = cTop;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w2, y + h2);
  ctx.lineTo(x, y + 2 * h2);
  ctx.lineTo(x - w2, y + h2);
  ctx.closePath();
  ctx.fill();
}

/**
 * Isometric block field (Pave “borsch”-style): vertical wave only, no pointer interaction.
 * Colors from --primary / --background.
 */
export default function AboutHeroIsometricBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const ro = new ResizeObserver(() => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = container.clientWidth;
      const h = container.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    });
    ro.observe(container);

    const tick = (t: number) => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w < 2 || h < 2) {
        raf = requestAnimationFrame(tick);
        return;
      }

      const rootStyle = getComputedStyle(document.documentElement);
      const bgRaw = parseHslTriplet(rootStyle.getPropertyValue("--background"));
      const prRaw = parseHslTriplet(rootStyle.getPropertyValue("--primary"));
      const bg = bgRaw ? hslCss(bgRaw) : "hsl(0 0% 2%)";
      const pr = prRaw ?? { h: 357, s: 90, l: 26 };

      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      const tileW = w < 640 ? 46 : 58;
      const tileH = tileW / 2;
      const time = t * 0.001;
      const originX = w * 0.5;
      const originY = h * 0.3;
      const range = Math.min(48, Math.ceil(Math.max(w, h) / (tileW * 0.42)) + 12);

      const topC = adjustL(pr, 10);
      const rightC = adjustL(pr, -4);
      const leftC = adjustL(pr, -22);

      type Cell = { i: number; j: number; sx: number; sy: number; depth: number };
      const cells: Cell[] = [];

      for (let i = -range; i <= range; i++) {
        for (let j = -range; j <= range; j++) {
          const sx = originX + (i - j) * (tileW / 2);
          const sy = originY + (i + j) * (tileH / 2);
          if (sx < -tileW * 4 || sx > w + tileW * 4 || sy < -tileW * 3 || sy > h + tileW * 3) continue;

          const phase = i * 0.52 + j * 0.44;
          const slow = Math.sin(time * 1.15 + phase);
          const med = Math.sin(time * 1.9 + phase * 1.3) * 0.55;
          const ripple = Math.sin(time * 0.85 + (i + j) * 0.38) * 0.45;
          let hNorm = slow * 0.5 + med * 0.35 + ripple * 0.35;
          hNorm = Math.max(-1, Math.min(1, hNorm));

          const depthBase = 6;
          const depthAmp = 30;
          const depth = Math.max(4, Math.min(78, depthBase + depthAmp * ((hNorm + 1) / 2)));

          cells.push({ i, j, sx, sy, depth });
        }
      }

      cells.sort((a, b) => a.i + a.j - (b.i + b.j) || a.i - b.i);

      for (const c of cells) {
        const lift = c.depth * 0.52;
        drawIsoCube(ctx, c.sx, c.sy - lift, tileW, tileH, c.depth, topC, leftC, rightC);
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none" aria-hidden>
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
