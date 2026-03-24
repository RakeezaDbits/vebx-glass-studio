import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import heroVideoAsset from "@/videos/hero-bg.mp4.asset.json";

type HeroVideoAsset = {
  url: string;
  lovable_cdn_url?: string;
};

const asset = heroVideoAsset as HeroVideoAsset;

function resolveHeroVideoSrc(): string {
  const fromEnv = import.meta.env.VITE_HERO_VIDEO_URL?.trim();
  if (fromEnv) return fromEnv;

  if (typeof window !== "undefined" && asset.lovable_cdn_url) {
    const host = window.location.hostname;
    if (/lovableproject|lovable\.app/i.test(host)) {
      return asset.lovable_cdn_url;
    }
  }

  return asset.url?.trim() || "/videos/hero-bg.mp4";
}

const VIDEO_SRC = resolveHeroVideoSrc();
const VIDEO_PLAYBACK_RATE = 0.42;
const LOOP_CROSSFADE_SECONDS = 0.85;
const LOOP_CROSSFADE_MS = 700;

export default function HeroSection() {
  const { t } = useTranslation();
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const transitionTimeoutRef = useRef<number | null>(null);
  const isTransitioningRef = useRef(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isLoopCrossfading, setIsLoopCrossfading] = useState(false);

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        window.clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const currentVideo = videoRefs.current[activeVideoIndex];

    if (!currentVideo || videoFailed) {
      return;
    }

    const handleTimeUpdate = () => {
      if (isTransitioningRef.current) {
        return;
      }

      if (!Number.isFinite(currentVideo.duration) || currentVideo.duration <= 0) {
        return;
      }

      if (currentVideo.duration - currentVideo.currentTime > LOOP_CROSSFADE_SECONDS) {
        return;
      }

      const nextVideoIndex = activeVideoIndex === 0 ? 1 : 0;
      const nextVideo = videoRefs.current[nextVideoIndex];

      if (!nextVideo) {
        return;
      }

      isTransitioningRef.current = true;
      setIsLoopCrossfading(true);
      nextVideo.currentTime = 0;
      nextVideo.playbackRate = VIDEO_PLAYBACK_RATE;

      const playPromise = nextVideo.play();
      playPromise?.catch(() => {
        isTransitioningRef.current = false;
        setIsLoopCrossfading(false);
      });

      if (transitionTimeoutRef.current) {
        window.clearTimeout(transitionTimeoutRef.current);
      }

      transitionTimeoutRef.current = window.setTimeout(() => {
        currentVideo.pause();
        currentVideo.currentTime = 0;
        setActiveVideoIndex(nextVideoIndex);
        setIsLoopCrossfading(false);
        isTransitioningRef.current = false;
      }, LOOP_CROSSFADE_MS);
    };

    currentVideo.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      currentVideo.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [activeVideoIndex, videoFailed]);

  const handleVideoReady = (index: number) => {
    const video = videoRefs.current[index];

    if (!video) {
      return;
    }

    video.playbackRate = VIDEO_PLAYBACK_RATE;

    if (index === activeVideoIndex && !videoLoaded) {
      setVideoLoaded(true);
    }
  };

  const handleVideoError = () => {
    setVideoFailed(true);
    setIsLoopCrossfading(false);
    isTransitioningRef.current = false;
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background – 4K animated video */}
      <div className="absolute inset-0">
        {/* Poster image – shows until video loads or if video fails */}
        {(!videoLoaded || videoFailed) && (
          <img
            src="/hero/hero-slide-1.png"
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
        )}
        {!videoFailed &&
          [0, 1].map((videoIndex) => {
            const incomingVideoIndex = activeVideoIndex === 0 ? 1 : 0;
            const isVisible =
              videoIndex === activeVideoIndex ||
              (isLoopCrossfading && videoIndex === incomingVideoIndex);

            return (
              <video
                key={videoIndex}
                ref={(node) => {
                  videoRefs.current[videoIndex] = node;
                }}
                autoPlay={videoIndex === 0}
                muted
                playsInline
                preload="auto"
                onCanPlay={() => handleVideoReady(videoIndex)}
                onError={handleVideoError}
                className={`absolute inset-0 w-full h-full object-cover scale-[1.02] transition-opacity duration-700 ${videoLoaded && isVisible ? "opacity-100" : "opacity-0"}`}
                src={VIDEO_SRC}
              />
            );
          })}
        {videoFailed && (
          <div className="absolute inset-0">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-primary/15 blur-[100px] animate-float will-change-transform"
                style={{
                  width: `${140 + i * 50}px`,
                  height: `${140 + i * 50}px`,
                  left: `${(i * 13) % 100}%`,
                  top: `${(i * 17) % 100}%`,
                  animationDelay: `${i * 0.8}s`,
                  animationDuration: "8s",
                }}
              />
            ))}
          </div>
        )}
        <div className="absolute inset-0 bg-background/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/45 via-transparent to-background/45" />
      </div>

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/10 blur-[100px] animate-float will-change-transform pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-primary/5 blur-[120px] animate-float will-change-transform pointer-events-none" style={{ animationDelay: "3s" }} />
      <div className="absolute top-1/2 left-1/2 w-72 h-72 rounded-full bg-primary/8 blur-[90px] animate-float will-change-transform pointer-events-none" style={{ animationDelay: "1.5s" }} />

      <div className="container relative z-10 px-4 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full liquid-glass border-glow mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground font-medium">{t("hero.tagline")}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="hero-headline-glow text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-tight mb-6"
          >
            {t("hero.headline1")}{" "}
            <span className="text-gradient-red">{t("hero.headline2")}</span>
            <br />
            {t("hero.headline3")}{" "}
            <span className="text-gradient-red">{t("hero.headline4")}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            {t("hero.subtext")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/contact">
              <Button variant="hero" size="lg" className="gap-2">
                {t("hero.getStarted")} <ArrowRight className="w-5 h-5 rtl:rotate-180" />
              </Button>
            </Link>
            <Link to="/our-work">
              <Button variant="glass" size="lg">
                {t("hero.viewOurWork")}
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
