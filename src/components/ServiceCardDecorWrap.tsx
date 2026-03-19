import type { ReactNode } from "react";

/**
 * Sits behind each service card so the liquid-glass layer reads as a floating panel
 * over rings, blurs, and accent circles (pointer-events-none).
 */
export default function ServiceCardDecorWrap({ children, index = 0 }: { children: ReactNode; index?: number }) {
  const phase = index % 3;

  return (
    <div className="relative h-full min-h-[120px]">
      <div
        className="pointer-events-none absolute -inset-[3px] z-0 overflow-visible select-none"
        aria-hidden
      >
        {/* Soft pool of light under the card */}
        <div className="absolute left-1/2 bottom-2 w-[90%] max-w-[300px] h-28 -translate-x-1/2 rounded-full bg-primary/[0.09] blur-2xl" />
        <div className="absolute left-1/2 bottom-0 w-[75%] max-w-[240px] h-20 -translate-x-1/2 translate-y-[35%] rounded-full bg-primary/[0.06] blur-xl" />

        {/* Hollow rings — “saucer” under glass */}
        <div className="absolute left-1/2 bottom-0 w-[72%] max-w-[260px] aspect-[2.2/1] -translate-x-1/2 translate-y-[20%] rounded-[100%] border border-primary/20 opacity-90" />
        <div className="absolute left-1/2 bottom-1 w-[58%] max-w-[200px] h-[46%] -translate-x-1/2 rounded-[100%] border border-white/[0.07]" />

        {/* Scattered accent circles (position shifts slightly per card) */}
        <div
          className={`absolute w-10 h-10 rounded-full border border-primary/30 opacity-70 ${
            phase === 0 ? "bottom-8 left-[8%]" : phase === 1 ? "bottom-10 right-[10%]" : "bottom-6 left-[20%]"
          }`}
        />
        <div
          className={`absolute w-6 h-6 rounded-full bg-primary/20 blur-md ${
            phase === 0 ? "bottom-12 right-[14%]" : phase === 1 ? "bottom-8 left-[18%]" : "bottom-14 right-[22%]"
          }`}
        />
        <div
          className={`absolute w-14 h-14 rounded-full border border-primary/15 ${
            phase === 0 ? "-top-1 right-3" : phase === 1 ? "-top-1 left-4" : "top-0 right-1/4"
          }`}
        />
        <div
          className={`absolute w-3 h-3 rounded-full bg-white/10 ${
            phase === 0 ? "bottom-16 left-1/4" : phase === 1 ? "bottom-20 right-1/3" : "bottom-14 left-[35%]"
          }`}
        />

        {/* Thin arc — suggests a lens / glass base */}
        <div
          className="absolute left-1/2 bottom-3 h-px w-[55%] max-w-[180px] -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/35 to-transparent"
          style={{ opacity: 0.85 }}
        />
      </div>

      <div className="relative z-[1] h-full">{children}</div>
    </div>
  );
}
