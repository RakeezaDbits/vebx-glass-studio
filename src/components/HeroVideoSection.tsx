import { useRef, useEffect, useState } from "react";

/**
 * 4K HD balls/orbs themed video section – sits below the hero.
 * Add your own video file at public/videos/hero-orbs.mp4 or set videoSrc.
 */
const DEFAULT_VIDEO_SRC = "/videos/hero-orbs.mp4";

export default function HeroVideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onError = () => setVideoError(true);
    v.addEventListener("error", onError);
    return () => v.removeEventListener("error", onError);
  }, []);

  return (
    <section className="relative w-full min-h-[50vh] overflow-hidden border-y border-white/10">
      {/* Video or fallback: 4K-style animated orbs */}
      {!videoError ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-90"
          src={DEFAULT_VIDEO_SRC}
          poster=""
        />
      ) : null}

      {/* Fallback when no video / video fails: high-quality orbs animation */}
      <div
        className={`absolute inset-0 w-full h-full ${videoError ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        aria-hidden
      >
        <div className="absolute inset-0 bg-background/95" />
        {/* Multiple layers of orbs – 4K feel */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-primary/20 blur-[80px] animate-float will-change-transform"
            style={{
              width: `${120 + i * 40}px`,
              height: `${120 + i * 40}px`,
              left: `${(i * 7) % 100}%`,
              top: `${(i * 11) % 100}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: "8s",
            }}
          />
        ))}
      </div>

      {/* Gradient overlay for blend */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background/60 pointer-events-none" />
    </section>
  );
}
