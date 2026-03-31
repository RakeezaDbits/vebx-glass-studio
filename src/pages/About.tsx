import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Shield, Zap, Users, Target, Award, Lightbulb, Globe, Heart } from "lucide-react";
import PageLayout from "@/components/PageLayout";

export default function About() {
  const { t } = useTranslation();
  const features = [
    { icon: Zap, titleKey: "about.features.innovationTitle", descKey: "about.features.innovationDesc" },
    { icon: Shield, titleKey: "about.features.secureTitle", descKey: "about.features.secureDesc" },
    { icon: Users, titleKey: "about.features.teamTitle", descKey: "about.features.teamDesc" },
    { icon: Target, titleKey: "about.features.resultsTitle", descKey: "about.features.resultsDesc" },
  ];
  const values = [
    { icon: Lightbulb, titleKey: "about.values.creativeTitle", descKey: "about.values.creativeDesc" },
    { icon: Award, titleKey: "about.values.qualityTitle", descKey: "about.values.qualityDesc" },
    { icon: Globe, titleKey: "about.values.globalTitle", descKey: "about.values.globalDesc" },
    { icon: Heart, titleKey: "about.values.clientTitle", descKey: "about.values.clientDesc" },
  ];

  return (
    <PageLayout
      seo={{
        title: "About Us",
        description:
          "Meet the team behind vebxrun. We build mobile apps, web solutions, games, metaverse experiences, and digital marketing that help brands grow globally.",
        canonicalPath: "/about",
      }}
    >
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden -mt-16 pt-16">
        <div className="absolute inset-0">
          <img
            src="/about/about-hero-bg.png"
            alt=""
            className="h-full w-full object-cover object-center"
            decoding="async"
            fetchPriority="high"
          />
          {/* Overlay stack: scrim + brand tint + readability + vignette */}
          <div className="pointer-events-none absolute inset-0 bg-black/45" aria-hidden />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.18] via-transparent to-primary/[0.08]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/92 via-background/55 to-background/95"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/65"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_75%_at_50%_42%,transparent_0%,hsl(0_0%_2%/0.65)_100%)]"
            aria-hidden
          />
        </div>
        <div className="container relative z-10 px-4 lg:px-8 text-center">
          <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-sm font-display uppercase tracking-[0.3em] text-primary mb-4 block">{t("about.tag")}</motion.span>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-4xl md:text-6xl font-display font-bold mb-6">
            {t("about.heading")} <span className="text-gradient-red">{t("about.headingHighlight")}</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("about.heroDesc")}</motion.p>
        </div>
      </section>
      <section className="py-16 relative">
        <div className="container px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              {t("about.fromStartups")} <span className="text-gradient-red">{t("about.enterprises")}</span>
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">{t("about.fromStartupsDesc1")}</p>
            <p className="text-muted-foreground leading-relaxed">{t("about.fromStartupsDesc2")}</p>
          </motion.div>
        </div>
      </section>
      <section className="py-16">
        <div className="container px-4 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <motion.div key={f.titleKey} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} className="liquid-glass rounded-xl p-6 border-glow text-center">
                <f.icon className="w-8 h-8 text-primary mb-3 mx-auto" />
                <h4 className="text-sm font-display font-semibold text-foreground mb-2">{t(f.titleKey)}</h4>
                <p className="text-xs text-muted-foreground">{t(f.descKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-24">
        <div className="container px-4 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="text-sm font-display uppercase tracking-[0.3em] text-primary mb-4 block">{t("about.valuesTag")}</span>
            <h2 className="text-3xl md:text-5xl font-display font-bold">{t("about.valuesHeading")} <span className="text-gradient-red">{t("about.valuesHighlight")}</span> {t("about.valuesSuffix")}</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((v, i) => (
              <motion.div key={v.titleKey} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 }} className="liquid-glass rounded-2xl p-8 border-glow group hover:bg-primary/5 transition-all duration-500">
                <div className="w-12 h-12 rounded-xl gradient-red flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><v.icon className="w-6 h-6 text-primary-foreground" /></div>
                <h3 className="font-display text-lg font-semibold mb-2 text-foreground">{t(v.titleKey)}</h3>
                <p className="text-muted-foreground leading-relaxed">{t(v.descKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
        <div className="container relative z-10 px-4 lg:px-8">
          <div className="liquid-glass-strong rounded-3xl border-glow p-12 md:p-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: "350+", labelKey: "about.stats.projects" },
                { value: "300+", labelKey: "about.stats.clients" },
                { value: "15+", labelKey: "about.stats.years" },
                { value: "30+", labelKey: "about.stats.team" },
              ].map((stat, i) => (
                <motion.div key={stat.labelKey} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                  <div className="text-3xl md:text-4xl font-display font-bold text-gradient-red">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-2">{t(stat.labelKey)}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
