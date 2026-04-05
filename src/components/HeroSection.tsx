import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const HERO_SLIDES = [
  "/hero/hero-slide-1.png",
  "/hero/hero-slide-2.png",
  "/hero/hero-slide-3.png",
  "/hero/hero-slide-4.png",
  "/hero/hero-slide-5.png",
];

const SLIDE_DURATION = 5000;

export default function HeroSection() {
  const { t } = useTranslation();
  const [activeSlide, setActiveSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background slider */}
      <div className="absolute inset-0">
        <AnimatePresence mode="popLayout">
          <motion.img
            key={activeSlide}
            src={HERO_SLIDES[activeSlide]}
            alt=""
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>

        {/* Light overlay – reduced opacity so images show through */}
        <div className="absolute inset-0 bg-background/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/25 to-background/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/20 via-transparent to-background/20" />
      </div>

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/10 blur-[100px] animate-float will-change-transform pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-primary/5 blur-[120px] animate-float will-change-transform pointer-events-none" style={{ animationDelay: "3s" }} />

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveSlide(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === activeSlide
                ? "w-8 bg-primary"
                : "w-3 bg-foreground/25 hover:bg-foreground/40"
            }`}
          />
        ))}
      </div>

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
