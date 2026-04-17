import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Sparkles, ArrowRight } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import MediaBlackOverlay from "@/components/MediaBlackOverlay";
import { Button } from "@/components/ui/button";

export default function Projects() {
  const { t } = useTranslation();
  return (
    <PageLayout
      seo={{
        title: t("projects.seoTitle"),
        description: t("projects.seoDescription"),
        canonicalPath: "/projects",
      }}
    >
      {/* Hero */}
      <section className="relative min-h-[52vh] flex flex-col items-center justify-center overflow-hidden -mt-16 pt-24 pb-12 page-banner-glow md:min-h-[58vh] md:pb-16">
        <div className="absolute inset-0">
          <img
            src="/banners/services-banner.jpg"
            alt=""
            className="h-full w-full object-cover"
            aria-hidden
          />
          <MediaBlackOverlay />
        </div>
        <div className="pointer-events-none absolute bottom-1/4 left-1/4 h-72 w-72 rounded-full bg-primary/10 blur-[100px] animate-float" />
        <div className="pointer-events-none absolute top-1/3 right-1/4 h-56 w-56 rounded-full bg-primary/6 blur-[90px] animate-float" style={{ animationDelay: "1.5s" }} />

        <div className="container relative z-10 mx-auto max-w-4xl px-4 text-center lg:px-8">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 block font-display text-sm uppercase tracking-[0.3em] text-primary"
          >
            {t("projects.tag")}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08 }}
            className="mb-5 font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
          >
            {t("projects.heading")}{" "}
            <span className="text-gradient-red">{t("projects.headingHighlight")}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            {t("projects.heroDesc")}
          </motion.p>
        </div>
      </section>

      {/* Coming soon card */}
      <section className="relative -mt-8 pb-20 pt-4 md:-mt-10 md:pb-28">
        <div className="container mx-auto max-w-3xl px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="liquid-glass border-glow relative overflow-hidden rounded-2xl p-8 shadow-[0_0_60px_-20px_hsla(357,90%,26%,0.35)] md:p-12"
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-12 -left-10 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />

            <div className="relative z-10 flex flex-col items-center text-center">
              <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/35 bg-primary/10 px-4 py-1.5 font-display text-xs font-semibold uppercase tracking-wider text-primary">
                <Sparkles className="h-3.5 w-3.5" aria-hidden />
                {t("projects.badge")}
              </span>

              <p className="font-display text-2xl font-semibold leading-snug text-foreground md:text-3xl md:leading-tight">
                {t("projects.comingSoon")}
              </p>

              <p className="mt-8 max-w-md text-sm text-muted-foreground">{t("projects.ctaHint")}</p>

              <Button variant="hero" size="lg" className="mt-8 gap-2 shadow-[0_0_24px_hsla(357,90%,40%,0.35)]" asChild>
                <Link to="/contact">
                  {t("projects.cta")}
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
