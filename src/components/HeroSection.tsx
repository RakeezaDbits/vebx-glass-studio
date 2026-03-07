import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const HERO_SLIDES = ["/hero/hero-slide-1.png", "/hero/hero-slide-2.png", "/hero/hero-slide-3.png"];
const AUTOPLAY_MS = 5000;

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setCurrent((i) => (i + 1) % HERO_SLIDES.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background – auto carousel */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait" initial={false}>
          <motion.img
            key={current}
            src={HERO_SLIDES[current]}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-100"
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
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/10 blur-[100px] animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-primary/5 blur-[120px] animate-float" style={{ animationDelay: "3s" }} />

      <div className="container relative z-10 px-4 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full liquid-glass border-glow mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground font-medium">Imagine. Innovate. Inspire.</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="hero-headline-glow text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-tight mb-6"
          >
            We Build{" "}
            <span className="text-gradient-red">Digital</span>
            <br />
            Experiences That{" "}
            <span className="text-gradient-red">Matter</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            From mobile apps to metaverse development, we craft cutting-edge solutions 
            that transform ideas into reality. Your vision, our expertise.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/contact">
              <Button variant="hero" size="lg" className="gap-2">
                Get Started <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/our-work">
              <Button variant="glass" size="lg">
                View Our Work
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="grid grid-cols-3 gap-8 mt-20 max-w-xl mx-auto"
          >
            {[
              { value: "150+", label: "Projects Delivered" },
              { value: "50+", label: "Happy Clients" },
              { value: "8+", label: "Years Experience" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-display font-bold text-gradient-red">{stat.value}</div>
                <div className="text-xs md:text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
