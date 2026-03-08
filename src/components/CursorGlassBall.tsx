import { useState, useEffect, useRef } from "react";

const SIZE = 60;
const SMOOTH = 0.12;

export default function CursorGlassBall() {
  const [pos, setPos] = useState({ x: -SIZE, y: -SIZE });
  const [visible, setVisible] = useState(false);
  const raf = useRef<number>(0);
  const target = useRef({ x: -SIZE, y: -SIZE });
  const current = useRef({ x: -SIZE, y: -SIZE });

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;
    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX - SIZE / 2, y: e.clientY - SIZE / 2 };
      setVisible(true);
    };
    const onLeave = () => setVisible(false);
    const animate = () => {
      current.current.x += (target.current.x - current.current.x) * SMOOTH;
      current.current.y += (target.current.y - current.current.y) * SMOOTH;
      setPos({ x: current.current.x, y: current.current.y });
      raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);
    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  if (!visible) return null;
  return (
    <div
      className="cursor-glass-ball pointer-events-none fixed z-[9999] rounded-full"
      style={{ width: SIZE, height: SIZE, left: 0, top: 0, transform: `translate(${pos.x}px, ${pos.y}px)` }}
      aria-hidden
    />
  );
}
