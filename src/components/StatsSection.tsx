import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

const stats = [
  { value: "350+", labelKey: "hero.stats.projects" },
  { value: "15+", labelKey: "hero.stats.years" },
];

export default function StatsSection() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative w-full overflow-x-hidden py-10 md:py-14">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55 }}
        className="relative w-full liquid-glass border-glow rounded-none shadow-[0_0_80px_-20px_hsla(357,90%,26%,0.45)]"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{
            background:
              "linear-gradient(90deg, hsla(357, 90%, 26%, 0.07) 0%, transparent 35%, transparent 65%, hsla(357, 90%, 26%, 0.07) 100%)",
          }}
        />
        <div className="relative z-10 mx-auto max-w-5xl px-6 py-12 md:px-12 md:py-16 lg:px-16">
          <div className="grid grid-cols-2 items-start gap-8 md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-10 lg:gap-16">
            <div className="min-w-0 text-center">
              <div className="hero-headline-glow">
                <div className="text-4xl font-display font-bold text-gradient-red sm:text-5xl md:text-6xl">
                  {stats[0].value}
                </div>
              </div>
              <div className="mt-2 text-sm text-muted-foreground md:mt-3 md:text-base">{t(stats[0].labelKey)}</div>
            </div>
            <div
              className="hidden h-20 w-px shrink-0 bg-gradient-to-b from-transparent via-white/25 to-transparent md:block"
              aria-hidden
            />
            <div className="min-w-0 text-center">
              <div className="hero-headline-glow">
                <div className="text-4xl font-display font-bold text-gradient-red sm:text-5xl md:text-6xl">
                  {stats[1].value}
                </div>
              </div>
              <div className="mt-2 text-sm text-muted-foreground md:mt-3 md:text-base">{t(stats[1].labelKey)}</div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
