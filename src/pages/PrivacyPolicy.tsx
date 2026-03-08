import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import PageLayout from "@/components/PageLayout";

export default function PrivacyPolicy() {
  const { t } = useTranslation();
  const sections = [1,2,3,4,5,6];
  return (
    <PageLayout>
      <section className="py-24 relative">
        <div className="container px-4 lg:px-8 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-16">
            <span className="text-sm font-display uppercase tracking-[0.3em] text-primary mb-4 block">{t("privacy.tag")}</span>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">{t("privacy.heading")} <span className="text-gradient-red">{t("privacy.headingHighlight")}</span></h1>
            <p className="text-muted-foreground">{t("privacy.lastUpdated")}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="liquid-glass rounded-2xl p-8 md:p-12 border-glow prose prose-invert max-w-none">
            <div className="space-y-8 text-muted-foreground leading-relaxed">
              {sections.map((n) => (
                <div key={n}>
                  <h2 className="font-display text-xl font-semibold text-foreground mb-3">{t(`privacy.section${n}Title`)}</h2>
                  <p>{t(`privacy.section${n}`)}</p>
                  {n === 6 && (
                    <p className="mt-2">
                      <strong className="text-foreground">{t("privacy.email")}</strong> support@vebx.run<br />
                      <strong className="text-foreground">{t("privacy.address")}</strong> 117 S Lexington Street STN 100, Harrisonville MO 64701
                    </p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
