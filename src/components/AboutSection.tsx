import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Shield, Zap, Users, Target } from "lucide-react";
import servicesBg from "@/assets/services-bg.jpg";

const featureKeys = [
  { icon: Zap, titleKey: "about.features.innovationTitle", descKey: "about.features.innovationDesc" },
  { icon: Shield, titleKey: "about.features.secureTitle", descKey: "about.features.secureDesc" },
  { icon: Users, titleKey: "about.features.teamTitle", descKey: "about.features.teamDesc" },
  { icon: Target, titleKey: "about.features.resultsTitle", descKey: "about.features.resultsDesc" },
];

export default function AboutSection() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="container relative z-10 px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div ref={ref} initial={{ opacity: 0, x: -60 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8 }} className="relative">
            <div className="rounded-3xl overflow-hidden border-glow liquid-glass">
              <img src={servicesBg} alt="About vebx.run" className="w-full h-80 lg:h-[28rem] object-cover" />
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-2xl gradient-red opacity-20 blur-2xl" />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 60 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, delay: 0.2 }}>
            <span className="text-sm font-display uppercase tracking-[0.3em] text-primary mb-4 block">{t("about.tag")}</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              {t("about.heading")} <span className="text-gradient-red">{t("about.headingHighlight")}</span> {t("about.headingSuffix")}
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">{t("about.desc")}</p>
            <div className="grid grid-cols-2 gap-4">
              {featureKeys.map((f, i) => (
                <motion.div key={f.titleKey} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }} className="liquid-glass rounded-xl p-4 border-glow">
                  <f.icon className="w-5 h-5 text-primary mb-2" />
                  <h4 className="text-sm font-semibold text-foreground mb-1">{t(f.titleKey)}</h4>
                  <p className="text-xs text-muted-foreground">{t(f.descKey)}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
