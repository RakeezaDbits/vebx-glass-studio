import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import logo from "@/assets/vebx-logo.png";

const INTRO_STORAGE_KEY = "vebx-intro-seen";

export default function IntroScreen() {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem(INTRO_STORAGE_KEY);
    if (!seen) setVisible(true);
  }, []);

  const handleEnter = () => {
    setExiting(true);
    sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
  };

  return (
    <AnimatePresence>
      {visible && !exiting && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-background"
        >
          {/* Liquid glass blobs – morphing background */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute rounded-full opacity-30"
              style={{
                width: "80vmax",
                height: "80vmax",
                left: "-20vmax",
                top: "-20vmax",
                background: "radial-gradient(circle, hsl(357 90% 26% / 0.4) 0%, transparent 70%)",
                filter: "blur(60px)",
              }}
              animate={{
                borderRadius: [
                  "60% 40% 30% 70% / 60% 30% 70% 40%",
                  "30% 60% 70% 40% / 50% 60% 30% 60%",
                  "60% 40% 30% 70% / 60% 30% 70% 40%",
                ],
                scale: [1, 1.15, 1],
                x: [0, 30, 0],
                y: [0, -20, 0],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute rounded-full opacity-25"
              style={{
                width: "60vmax",
                height: "60vmax",
                right: "-15vmax",
                bottom: "-15vmax",
                background: "radial-gradient(circle, hsl(357 80% 40% / 0.35) 0%, transparent 70%)",
                filter: "blur(80px)",
              }}
              animate={{
                borderRadius: [
                  "30% 70% 70% 30% / 30% 30% 70% 70%",
                  "70% 30% 30% 70% / 70% 70% 30% 30%",
                  "30% 70% 70% 30% / 30% 30% 70% 70%",
                ],
                scale: [1.1, 1, 1.1],
                x: [0, -25, 0],
                y: [0, 15, 0],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute rounded-full opacity-20"
              style={{
                width: "50vmax",
                height: "50vmax",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                background: "radial-gradient(circle, hsl(0 0% 100% / 0.08) 0%, transparent 70%)",
                filter: "blur(40px)",
              }}
              animate={{
                borderRadius: [
                  "50% 50% 50% 50% / 50% 50% 50% 50%",
                  "40% 60% 60% 40% / 60% 40% 60% 40%",
                  "50% 50% 50% 50% / 50% 50% 50% 50%",
                ],
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          {/* Center glass panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="liquid-glass border-glow rounded-3xl p-10 md:p-14 text-center relative z-10 max-w-lg mx-4"
          >
            <img src={logo} alt="Vebex Run" className="h-16 md:h-20 w-auto mx-auto mb-6" />
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
              Vebex Run
            </h1>
            <p className="text-sm text-muted-foreground mb-8">
              Imagine. Innovate. Inspire.
            </p>
            <Link
              to="/"
              onClick={handleEnter}
              className="inline-block px-8 py-3 rounded-xl gradient-red text-primary-foreground font-display text-sm uppercase tracking-wider glow-red hover:opacity-90 transition-opacity"
            >
              Enter
            </Link>
          </motion.div>

          {/* Optional: skip text */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            onClick={handleEnter}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs text-muted-foreground hover:text-foreground transition-colors z-10"
          >
            Skip intro
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
