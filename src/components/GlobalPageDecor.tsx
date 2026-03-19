/**
 * Site-wide background decoration — fixed behind all pages (public + admin).
 * pointer-events-none; does not block interaction.
 */
import type { CSSProperties } from "react";

const ORBS: { style: CSSProperties; className: string; delay: string; duration: string }[] = [
  { style: { top: "8%", left: "3%", width: "min(28rem, 45vw)", height: "min(28rem, 45vw)" }, className: "bg-primary/10 blur-[100px]", delay: "0s", duration: "7s" },
  { style: { top: "42%", left: "-8%", width: "min(22rem, 38vw)", height: "min(22rem, 38vw)" }, className: "bg-primary/8 blur-[90px]", delay: "1.2s", duration: "8s" },
  { style: { top: "65%", right: "-5%", width: "min(32rem, 48vw)", height: "min(32rem, 48vw)" }, className: "bg-primary/9 blur-[110px]", delay: "0.6s", duration: "9s" },
  { style: { top: "18%", right: "8%", width: "min(20rem, 32vw)", height: "min(20rem, 32vw)" }, className: "bg-primary/7 blur-[80px]", delay: "2s", duration: "7s" },
  { style: { bottom: "12%", left: "18%", width: "min(24rem, 40vw)", height: "min(24rem, 40vw)" }, className: "bg-primary/8 blur-[95px]", delay: "1.5s", duration: "8s" },
  { style: { bottom: "28%", right: "22%", width: "min(16rem, 28vw)", height: "min(16rem, 28vw)" }, className: "bg-primary/6 blur-[70px]", delay: "2.8s", duration: "10s" },
  { style: { top: "52%", left: "42%", width: "min(14rem, 22vw)", height: "min(14rem, 22vw)" }, className: "bg-white/[0.04] blur-[60px]", delay: "3.5s", duration: "9s" },
];

const RINGS = [
  "top-[12%] right-[18%] w-40 h-40 border border-primary/10 rounded-full",
  "bottom-[20%] left-[10%] w-56 h-56 border border-white/[0.06] rounded-full",
  "top-[38%] left-[28%] w-24 h-24 border border-primary/15 rounded-full",
  "bottom-[35%] right-[12%] w-32 h-32 border border-white/[0.05] rounded-full",
];

export default function GlobalPageDecor() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      {/* Soft vignette + top glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_-15%,hsl(357_90%_26%_/_0.14),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_100%_80%,hsl(357_90%_26%_/_0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_0%_60%,hsl(0_0%_8%_/_0.9),transparent_55%)]" />

      {/* Fine grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(0 0% 100% / 0.12) 1px, transparent 1px),
            linear-gradient(90deg, hsl(0 0% 100% / 0.12) 1px, transparent 1px)
          `,
          backgroundSize: "56px 56px",
        }}
      />

      {/* Diagonal micro-texture */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: "repeating-linear-gradient(-35deg, transparent, transparent 2px, hsl(357 90% 46% / 0.15) 2px, hsl(357 90% 46% / 0.15) 3px)",
          backgroundSize: "8px 8px",
        }}
      />

      {/* Accent line streaks */}
      <div className="absolute top-0 left-[20%] h-[40vh] w-px bg-gradient-to-b from-primary/20 via-primary/5 to-transparent opacity-40" />
      <div className="absolute top-[30%] right-[25%] h-[50vh] w-px bg-gradient-to-b from-transparent via-primary/10 to-transparent opacity-30" />

      {RINGS.map((cls, i) => (
        <div key={i} className={`absolute ${cls}`} />
      ))}

      {ORBS.map((o, i) => (
        <div
          key={i}
          className={`absolute rounded-full ${o.className} animate-float will-change-transform`}
          style={{
            ...o.style,
            animationDelay: o.delay,
            animationDuration: o.duration,
          }}
        />
      ))}
    </div>
  );
}
