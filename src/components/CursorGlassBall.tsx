import { useState, useEffect, useRef } from "react";

const SIZE = 56;
const SMOOTH = 0.24;
const MAGNIFY = 2;
const COPY_THROTTLE_MS = 80;

export default function CursorGlassBall({ contentRef }: { contentRef?: React.RefObject<HTMLDivElement | null> }) {
  const [pos, setPos] = useState({ x: -SIZE, y: -SIZE });
  const [scroll, setScroll] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const raf = useRef<number>(0);
  const target = useRef({ x: -SIZE, y: -SIZE });
  const current = useRef({ x: -SIZE, y: -SIZE });
  const lensRef = useRef<HTMLDivElement>(null);
  const lastCopy = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;
    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX - SIZE / 2, y: e.clientY - SIZE / 2 };
      setVisible(true);
    };
    const onLeave = () => setVisible(false);
    const onScroll = () => setScroll({ x: window.scrollX, y: window.scrollY });
    const animate = () => {
      current.current.x += (target.current.x - current.current.x) * SMOOTH;
      current.current.y += (target.current.y - current.current.y) * SMOOTH;
      setPos({ x: current.current.x, y: current.current.y });
      raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  useEffect(() => {
    if (!visible || !contentRef?.current || !lensRef.current) return;
    const now = Date.now();
    if (now - lastCopy.current < COPY_THROTTLE_MS) return;
    lastCopy.current = now;
    try {
      lensRef.current.innerHTML = contentRef.current.innerHTML;
    } catch {
      // ignore
    }
  }, [visible, pos, scroll, contentRef]);

  if (!visible) return null;

  const centerX = pos.x + SIZE / 2;
  const centerY = pos.y + SIZE / 2;
  const copyLeft = -(centerX + scroll.x);
  const copyTop = -(centerY + scroll.y);

  return (
    <div
      className={`cursor-glass-ball ${contentRef ? "cursor-glass-ball-magnifier" : ""} pointer-events-none fixed z-[9999] rounded-full overflow-hidden`}
      style={{
        width: SIZE,
        height: SIZE,
        left: 0,
        top: 0,
        transform: `translate(${pos.x}px, ${pos.y}px)`,
      }}
      aria-hidden
    >
      {contentRef && (
        <div
          className="cursor-glass-ball-lens"
          style={{
            position: "absolute",
            left: SIZE / 2,
            top: SIZE / 2,
            width: "100vw",
            height: "100vh",
            transform: `scale(${MAGNIFY})`,
            transformOrigin: "0 0",
            zIndex: -2,
          }}
        >
          <div
            ref={lensRef}
            className="cursor-glass-ball-copy"
            style={{
              position: "absolute",
              left: copyLeft,
              top: copyTop,
              width: "100vw",
              minHeight: "100vh",
              pointerEvents: "none",
            }}
          />
        </div>
      )}
    </div>
  );
}
