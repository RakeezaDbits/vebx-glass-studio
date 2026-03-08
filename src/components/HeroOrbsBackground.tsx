import { useEffect, useRef } from "react";

/**
 * 4K-style animated orbs background – generated in code (no video file).
 * Theme: dark + primary red glow, smooth motion.
 */
const ORB_COUNT = 14;
const PRIMARY_RGB = { r: 139, g: 28, b: 32 }; // hsl(357 90% 26%) approx

export default function HeroOrbsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    type Orb = {
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      phase: number;
      opacity: number;
    };

    const orbs: Orb[] = [];
    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    for (let i = 0; i < ORB_COUNT; i++) {
      orbs.push({
        x: rand(0, window.innerWidth),
        y: rand(0, window.innerHeight),
        radius: rand(80, 220),
        vx: rand(-0.15, 0.15),
        vy: rand(-0.12, 0.12),
        phase: rand(0, Math.PI * 2),
        opacity: rand(0.04, 0.14),
      });
    }

    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      time += 0.008;

      orbs.forEach((orb) => {
        orb.x += orb.vx;
        orb.y += orb.vy;
        if (orb.x < -orb.radius) orb.x = w + orb.radius;
        if (orb.x > w + orb.radius) orb.x = -orb.radius;
        if (orb.y < -orb.radius) orb.y = h + orb.radius;
        if (orb.y > h + orb.radius) orb.y = -orb.radius;

        const pulse = 0.92 + 0.08 * Math.sin(time + orb.phase);
        const r = orb.radius * pulse;
        const opacity = orb.opacity * (0.85 + 0.15 * Math.sin(time * 0.7 + orb.phase));

        const gradient = ctx.createRadialGradient(
          orb.x, orb.y, 0,
          orb.x, orb.y, r
        );
        gradient.addColorStop(0, `rgba(${PRIMARY_RGB.r}, ${PRIMARY_RGB.g}, ${PRIMARY_RGB.b}, ${opacity * 0.9})`);
        gradient.addColorStop(0.4, `rgba(${PRIMARY_RGB.r}, ${PRIMARY_RGB.g}, ${PRIMARY_RGB.b}, ${opacity * 0.4})`);
        gradient.addColorStop(0.7, `rgba(${PRIMARY_RGB.r}, ${PRIMARY_RGB.g}, ${PRIMARY_RGB.b}, ${opacity * 0.1})`);
        gradient.addColorStop(1, "rgba(0,0,0,0)");

        ctx.beginPath();
        ctx.arc(orb.x, orb.y, r, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      animationId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    draw();
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full object-cover"
      style={{ background: "transparent" }}
      aria-hidden
    />
  );
}
