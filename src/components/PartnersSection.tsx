import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import FooterPartnersMarquee from "@/components/FooterPartnersMarquee";

export default function PartnersSection() {
  const { t } = useTranslation();

  return (
    <section className="relative w-full overflow-hidden bg-background py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="text-sm font-display uppercase tracking-[0.3em] text-primary mb-3 block">
            {t("trusted.partnersTag")}
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
            {t("trusted.partnersHeading")}{" "}
            <span className="text-gradient-red">{t("trusted.partnersHeadingHighlight")}</span>
          </h2>
        </motion.div>
      </div>

      <FooterPartnersMarquee variant="inline" />

      <div className="container mx-auto px-4 lg:px-8">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="mt-2 max-w-2xl mx-auto text-center text-[11px] md:text-xs leading-relaxed text-primary"
        >
          {t("trusted.partnersDesc")}
        </motion.p>
      </div>
    </section>
  );
}
