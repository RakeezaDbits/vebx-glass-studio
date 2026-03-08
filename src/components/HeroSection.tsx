import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const HERO_SLIDES = ["/hero/hero-slide-1.png", "/hero/hero-slide-2.png", "/hero/hero-slide-3.png"];
const AUTOPLAY_MS = 5000;
const VIDEO_SRC = "/videos/hero-orbs.mp4";

export default function HeroSection() {
  const { t } = useTranslation();
  const [current, setCurrent] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((i) => (i + 1) % HERO_SLIDES.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onErr = () => setVideoError(true);
    v.addEventListener("error", onErr);
    return () => v.removeEventListener("error", onErr);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background – image carousel */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait" initial={false}>
          <motion.img
            key={current}
            src={HERO_SLIDES[current]}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/30 to-background/45" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/35 via-transparent to-background/35" />
        {/* Carousel dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Slide ${i + 1}`}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? "w-6 bg-primary" : "w-1.5 bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/10 blur-[100px] animate-float will-change-transform pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-primary/5 blur-[120px] animate-float will-change-transform pointer-events-none" style={{ animationDelay: "3s" }} />
      <div className="absolute top-1/2 left-1/2 w-72 h-72 rounded-full bg-primary/8 blur-[90px] animate-float will-change-transform pointer-events-none" style={{ animationDelay: "1.5s" }} />

      <div className="container relative z-10 px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left – Text content */}
          <div className="flex-1 text-center lg:text-start max-w-2xl">
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
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 mb-10 leading-relaxed"
            >
              {t("hero.subtext")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
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

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              className="grid grid-cols-3 gap-8 mt-16 max-w-xl mx-auto lg:mx-0"
            >
              {[
                { value: "150+", labelKey: "projects" },
                { value: "50+", labelKey: "clients" },
                { value: "8+", labelKey: "years" },
              ].map((stat) => (
                <div key={stat.labelKey} className="text-center lg:text-start">
                  <div className="text-2xl md:text-3xl font-display font-bold text-gradient-red">{stat.value}</div>
                  <div className="text-xs md:text-sm text-muted-foreground mt-1">{t(`hero.stats.${stat.labelKey}`)}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right – Circular Video */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
            className="relative flex-shrink-0"
          >
            {/* Glow behind circle */}
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-[60px] scale-110 animate-pulse pointer-events-none" />

            {/* Rotating border ring */}
            <div className="absolute -inset-3 rounded-full border border-primary/30 animate-[spin_12s_linear_infinite]" />
            <div className="absolute -inset-6 rounded-full border border-primary/10 animate-[spin_20s_linear_infinite_reverse]" />

            {/* Circle video container */}
            <div className="relative w-[280px] h-[280px] md:w-[360px] md:h-[360px] lg:w-[420px] lg:h-[420px] rounded-full overflow-hidden border-2 border-white/10 shadow-[0_0_60px_rgba(220,38,38,0.15)]">
              {!videoError ? (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                  src={VIDEO_SRC}
                />
              ) : (
                /* Fallback: animated orbs if video missing */
                <div className="relative w-full h-full bg-background/80">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute rounded-full bg-primary/25 blur-[40px] animate-float will-change-transform"
                      style={{
                        width: `${60 + i * 20}px`,
                        height: `${60 + i * 20}px`,
                        left: `${(i * 15) % 80}%`,
                        top: `${(i * 18) % 80}%`,
                        animationDelay: `${i * 0.5}s`,
                        animationDuration: "6s",
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
