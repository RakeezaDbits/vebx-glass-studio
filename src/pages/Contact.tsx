import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Mail, Clock } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import MediaBlackOverlay from "@/components/MediaBlackOverlay";
import LiveChatPanel from "@/components/LiveChatPanel";

export default function Contact() {
  const { t } = useTranslation();

  return (
    <PageLayout
      seo={{
        title: "Contact",
        description:
          "Get in touch with vebxrun. Chat live, email support@vebx.run, or reach us anytime. We respond quickly.",
        canonicalPath: "/contact",
      }}
    >
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden -mt-16 pt-16 page-banner-glow">
        <div className="absolute inset-0">
          <img src="/banners/contact-banner.jpg" alt="" className="w-full h-full object-cover" aria-hidden />
          <MediaBlackOverlay />
        </div>
        <div className="absolute bottom-1/3 left-1/3 w-80 h-80 rounded-full bg-primary/8 blur-[120px] animate-float" />
        <div className="container relative z-10 px-4 lg:px-8 text-center">
          <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-sm font-display uppercase tracking-[0.3em] text-primary mb-4 block">{t("contact.tag")}</motion.span>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-4xl md:text-6xl font-display font-bold mb-6">
            {t("contact.heading")} <span className="text-gradient-red">{t("contact.headingHighlight")}</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("contact.desc")}</motion.p>
        </div>
      </section>
      <section className="py-16">
        <div className="container px-4 lg:px-8">
          <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2">
            <motion.div
              id="live-chat"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="liquid-glass flex h-[min(520px,72vh)] max-h-[72vh] min-h-0 flex-col overflow-hidden rounded-2xl border-glow p-6 sm:p-8"
            >
              <h3 className="mb-4 font-display text-xl font-bold text-foreground">{t("contact.sendMessage")}</h3>
              <p className="mb-4 text-sm text-muted-foreground">{t("contact.liveChatDesc")}</p>
              <LiveChatPanel active embedded className="min-h-0 w-full flex-1" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col gap-8"
            >
              <div className="liquid-glass rounded-2xl p-8 border-glow">
                <Mail className="mb-4 h-8 w-8 text-primary" />
                <h4 className="mb-2 font-display text-lg font-semibold text-foreground">{t("contact.emailUs")}</h4>
                <a href="mailto:support@vebx.run" className="text-muted-foreground transition-colors hover:text-primary">
                  support@vebx.run
                </a>
              </div>
              <div className="liquid-glass rounded-2xl p-8 border-glow">
                <Clock className="mb-4 h-8 w-8 text-primary" />
                <h4 className="mb-2 font-display text-lg font-semibold text-foreground">{t("contact.businessHours")}</h4>
                <p className="mb-1 text-muted-foreground">24/7</p>
                <p className="text-sm text-muted-foreground">{t("contact.monToSun")}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
