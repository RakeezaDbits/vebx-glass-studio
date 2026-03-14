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
    <section ref={ref} className="py-16 relative overflow-hidden">
      <div className="container px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="liquid-glass rounded-2xl border-glow p-10 md:p-14 max-w-2xl mx-auto"
        >
          <div className="grid grid-cols-2 gap-10 md:gap-16">
            {stats.map((stat) => (
              <div key={stat.labelKey} className="text-center">
                <div className="text-3xl md:text-4xl font-display font-bold text-gradient-red">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-2">{t(stat.labelKey)}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
