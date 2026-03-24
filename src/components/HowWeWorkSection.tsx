import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Search, Palette, Code2, Rocket } from "lucide-react";
import { Link } from "react-router-dom";

const stepKeys = [
  { icon: Search, step: "01", titleKey: "howWeWork.steps.discoverTitle", descKey: "howWeWork.steps.discoverDesc" },
  { icon: Palette, step: "02", titleKey: "howWeWork.steps.designTitle", descKey: "howWeWork.steps.designDesc" },
  { icon: Code2, step: "03", titleKey: "howWeWork.steps.developTitle", descKey: "howWeWork.steps.developDesc" },
  { icon: Rocket, step: "04", titleKey: "howWeWork.steps.deliverTitle", descKey: "howWeWork.steps.deliverDesc" },
];

export default function HowWeWorkSection() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24 relative overflow-hidden section-glass-bg">
      <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, hsl(0 0% 100% / 0.15) 1px, transparent 0)", backgroundSize: "32px 32px" }} />
      <div className="container relative z-10 px-4 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="text-center mb-16">
          <span className="text-sm font-display uppercase tracking-[0.3em] text-primary mb-4 block">{t("howWeWork.tag")}</span>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            {t("howWeWork.heading")} <span className="text-gradient-red">{t("howWeWork.headingHighlight")}</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">{t("howWeWork.desc")}</p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stepKeys.map((s, i) => (
            <motion.div key={s.step} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.12 }} className="liquid-glass-card rounded-2xl p-6 border-glow box-glow-hover relative group hover:bg-white/[0.06] transition-colors duration-300">
              <span className="text-4xl font-display font-bold text-primary/20 group-hover:text-primary/40 transition-colors">{s.step}</span>
              <div className="w-12 h-12 rounded-xl gradient-red flex items-center justify-center mt-4 mb-4">
                <s.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">{t(s.titleKey)}</h3>
              <p className="text-sm text-muted-foreground">{t(s.descKey)}</p>
            </motion.div>
          ))}
        </div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.5 }} className="text-center mt-12">
          <Link to="/contact#live-chat" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/90 transition-colors">
            {t("howWeWork.startProject")} <Rocket className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
