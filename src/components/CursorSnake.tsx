import { useEffect, useRef } from "react";

/** Har link ki max lambai (px) — tez drag pe bhi poora trail chota hi rahe */
const LINK = 8;
/** Points count — total max ~ (N-1) * LINK */
const N = 8;
const HEAD_LERP = 0.55;

const W_HEAD = 12;
const W_TAIL = 0.8;

/**
 * Transparent red tapered swoosh — koi alag dot nahi; size hamesha chhota (fixed-length chain).
 */
export default function CursorSnake() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ptsRef = useRef<{ x: number; y: number }[] | null>(null);
  const targetRef = useRef({ x: -100, y: -100 });
  const visibleRef = useRef(false);
  const rafRef = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;

    ptsRef.current = Array.from({ length: N }, () => ({ x: -100, y: -100 }));

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    const onMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
      visibleRef.current = true;
    };
    const onLeave = () => {
      visibleRef.current = false;
    };

    const tick = () => {
      const p = ptsRef.current;
      if (!p) return;
      const t = targetRef.current;

      p[0].x += (t.x - p[0].x) * HEAD_LERP;
      p[0].y += (t.y - p[0].y) * HEAD_LERP;

      for (let i = 1; i < N; i++) {
        const dx = p[i].x - p[i - 1].x;
        const dy = p[i].y - p[i - 1].y;
        const dist = Math.hypot(dx, dy);
        if (dist < 1e-6) {
          p[i].x = p[i - 1].x - LINK;
          p[i].y = p[i - 1].y;
        } else {
          const s = LINK / dist;
          p[i].x = p[i - 1].x + dx * s;
          p[i].y = p[i - 1].y + dy * s;
        }
      }

      const cw = window.innerWidth;
      const ch = window.innerHeight;
      ctx.clearRect(0, 0, cw, ch);

      if (!visibleRef.current) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      const ex: { x: number; y: number }[] = [];
      for (let i = 0; i < N - 1; i++) {
        ex.push(p[i]);
        ex.push({
          x: (p[i].x + p[i + 1].x) * 0.5,
          y: (p[i].y + p[i + 1].y) * 0.5,
        });
      }
      ex.push(p[N - 1]);
      const M = ex.length;
      const wAt = (i: number) => {
        const t = i / (M - 1);
        return W_TAIL + (W_HEAD - W_TAIL) * (1 - t);
      };

      const strokeSeg = (mul: number, alpha: number, blur: number, glowA: number) => {
        for (let i = 0; i < M - 1; i++) {
          const mid = (wAt(i) + wAt(i + 1)) / 2;
          ctx.lineWidth = mid * mul;
          ctx.strokeStyle = `hsla(357, 88%, 58%, ${alpha})`;
          ctx.shadowBlur = blur;
          ctx.shadowColor = `hsla(357, 90%, 55%, ${glowA})`;
          ctx.beginPath();
          ctx.moveTo(ex[i].x, ex[i].y);
          ctx.lineTo(ex[i + 1].x, ex[i + 1].y);
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
      };

      strokeSeg(2.3, 0.07, 26, 0.55);
      strokeSeg(1.6, 0.12, 16, 0.45);

      for (let i = 0; i < M - 1; i++) {
        const mid = (wAt(i) + wAt(i + 1)) / 2;
        ctx.lineWidth = mid * 1.05;
        ctx.strokeStyle = "hsla(357, 85%, 62%, 0.42)";
        ctx.shadowBlur = 10;
        ctx.shadowColor = "hsla(357, 90%, 52%, 0.4)";
        ctx.beginPath();
        ctx.moveTo(ex[i].x, ex[i].y);
        ctx.lineTo(ex[i + 1].x, ex[i + 1].y);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[150]"
      aria-hidden
    />
  );
}
