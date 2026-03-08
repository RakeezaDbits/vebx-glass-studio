import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export default function HeroSection() {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

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
        {!videoFailed && (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            onCanPlay={() => setVideoLoaded(true)}
            onError={() => setVideoFailed(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
            src="/videos/hero-bg.mp4"
          />
        )}
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

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="grid grid-cols-3 gap-8 mt-20 max-w-xl mx-auto"
          >
            {[
              { value: "150+", labelKey: "projects" },
              { value: "50+", labelKey: "clients" },
              { value: "8+", labelKey: "years" },
            ].map((stat) => (
              <div key={stat.labelKey} className="text-center">
                <div className="text-2xl md:text-3xl font-display font-bold text-gradient-red">{stat.value}</div>
                <div className="text-xs md:text-sm text-muted-foreground mt-1">{t(`hero.stats.${stat.labelKey}`)}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
