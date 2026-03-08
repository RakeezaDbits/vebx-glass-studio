import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/vebx-logo.png";

const MIN_DISPLAY_MS = 2200;

export default function Preloader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const start = Date.now();
    const finish = () => {
      const elapsed = Date.now() - start;
      const delay = Math.max(0, MIN_DISPLAY_MS - elapsed);
      setTimeout(() => setVisible(false), delay);
    };
    if (document.readyState === "complete") finish();
    else window.addEventListener("load", finish);
    const t = setTimeout(() => setVisible(false), MIN_DISPLAY_MS + 500);
    return () => {
      window.removeEventListener("load", finish);
      clearTimeout(t);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-8 bg-background"
        >
          <motion.img
            src={logo}
            alt="Vebex Run"
            className="h-16 w-auto md:h-20"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
          />
          <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
