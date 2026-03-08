import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

const highlightKeys = ["trusted.items.mobileWeb", "trusted.items.metaverseXR", "trusted.items.enterpriseSaaS", "trusted.items.startupsToFortune"];

export default function TrustedSection() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section ref={ref} className="py-16 relative overflow-hidden">
      <div className="container px-4 lg:px-8">
        <motion.p initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="text-center text-sm font-display uppercase tracking-[0.25em] text-muted-foreground mb-8">
          {t("trusted.tag")}
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.15 }} className="flex flex-wrap justify-center gap-6 md:gap-10">
          {highlightKeys.map((key) => (
            <span key={key} className="text-lg md:text-xl font-display font-semibold text-muted-foreground/90 hover:text-primary transition-colors">
              {t(key)}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
