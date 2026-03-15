import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Shield, Zap, Users, Target } from "lucide-react";

const reasonKeys = [
  { icon: Zap, titleKey: "whyChoose.reasons.innovationTitle", descKey: "whyChoose.reasons.innovationDesc" },
  { icon: Shield, titleKey: "whyChoose.reasons.deliveryTitle", descKey: "whyChoose.reasons.deliveryDesc" },
  { icon: Users, titleKey: "whyChoose.reasons.teamTitle", descKey: "whyChoose.reasons.teamDesc" },
  { icon: Target, titleKey: "whyChoose.reasons.resultsTitle", descKey: "whyChoose.reasons.resultsDesc" },
];

export default function WhyChooseSection() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24 relative overflow-hidden section-glass-bg">
      <div className="container relative z-10 px-4 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="text-center mb-16">
          <span className="text-sm font-display uppercase tracking-[0.3em] text-primary mb-4 block">{t("whyChoose.tag")}</span>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            {t("whyChoose.heading")} <span className="text-gradient-red">{t("whyChoose.headingHighlight")}</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">{t("whyChoose.desc")}</p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasonKeys.map((r, i) => (
            <motion.div key={r.titleKey} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.1 }} className="liquid-glass-card rounded-2xl p-6 border-glow box-glow-hover text-center hover:bg-white/[0.06] transition-colors duration-300">
              <div className="w-14 h-14 rounded-xl gradient-red flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/25">
                <r.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">{t(r.titleKey)}</h3>
              <p className="text-sm text-muted-foreground">{t(r.descKey)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
