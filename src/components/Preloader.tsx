import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/vebx-logo.png";

const DURATION_MS = 2800;
const PROGRESS_SEC = 2.2;

export default function Preloader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), DURATION_MS);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-10 bg-background"
        >
          {/* Website theme ke hisaab se: dheere dheere subtle glow/color */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 40%, hsl(357 90% 26% / 0.15), transparent 55%), radial-gradient(ellipse 100% 100% at 50% 50%, hsl(0 0% 5% / 0.5), transparent 70%)",
            }}
            aria-hidden
          />

          <div className="relative z-10 flex flex-col items-center gap-10">
            <motion.img
              src={logo}
              alt="Vebex Run"
              className="h-20 w-auto md:h-24 object-contain"
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />

            {/* Progress bar - logo ke niche */}
            <div className="w-48 md:w-56 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-primary"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: PROGRESS_SEC, ease: "easeInOut" }}
                style={{ originX: 0 }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
