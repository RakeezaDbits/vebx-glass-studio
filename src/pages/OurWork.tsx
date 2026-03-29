import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ExternalLink, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";

const projectKeys = [
  { key: "emaanai", tech: ["React Native", "Firebase", "Node.js"], image: "/our-work/emaanai.png" },
  { key: "healthsync", tech: ["React Native", "Node.js", "PostgreSQL"], image: "/our-work/healthsync.png" },
  { key: "taskflow", tech: ["React", "Firebase", "Tailwind"], image: "/our-work/taskflow.png" },
  { key: "fooddash", tech: ["Flutter", "Node.js", "MongoDB"], image: "/our-work/fooddash.png" },
  { key: "eventify", tech: ["Next.js", "Stripe", "PostgreSQL"], image: "/our-work/eventify.png" },
  { key: "docvault", tech: ["React", "AWS", "Node.js"], image: "/our-work/docvault.png" },
  { key: "fittrack", tech: ["Flutter", "Firebase", "REST APIs"], image: "/our-work/fittrack.png" },
  { key: "cloudflow", tech: ["React", "Node.js", "PostgreSQL"], image: "/our-work/cloudflow.png" },
  { key: "neondrift", tech: ["Unity", "C#", "Blender"], image: "/our-work/neondrift.png" },
  { key: "shopverse", tech: ["Next.js", "Stripe", "MongoDB"], image: "/our-work/shopverse.png" },
  { key: "paybridge", tech: ["React", "Node.js", "AWS"], image: "/our-work/paybridge.png" },
  { key: "learnhub", tech: ["React", "Django", "PostgreSQL"], image: "/our-work/learnhub.png" },
  { key: "smartops", tech: ["Python", "IoT", "React"], image: "/our-work/smartops.png" },
  { key: "engagelab", tech: ["Next.js", "Analytics", "APIs"], image: "/our-work/engagelab.png" },
];

export default function OurWork() {
  const { t } = useTranslation();
  return (
    <PageLayout
      seo={{
        title: "Our Work",
        description:
          "Portfolio of vebxrun — mobile apps, web apps, games, and digital products we've built. See our projects in AI, health, events, e-commerce & more.",
        canonicalPath: "/our-work",
      }}
    >
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden -mt-16 pt-16 page-banner-glow">
        <div className="absolute inset-0">
          <img src="/banners/ourwork-banner.jpg" alt="" className="w-full h-full object-cover opacity-50" aria-hidden />
          <div className="absolute inset-0 bg-background/55" />
        </div>
        <div className="absolute top-1/4 right-1/4 w-80 h-80 rounded-full bg-primary/8 blur-[120px] animate-float" />
        <div className="container relative z-10 px-4 lg:px-8 text-center">
          <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-sm font-display uppercase tracking-[0.3em] text-primary mb-4 block">{t("ourWork.tag")}</motion.span>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-4xl md:text-6xl font-display font-bold mb-6">
            {t("ourWork.heading")} <span className="text-gradient-red">{t("ourWork.headingHighlight")}</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("ourWork.desc")}</motion.p>
        </div>
      </section>
      <section className="py-16">
        <div className="container px-4 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectKeys.map((project, i) => (
              <motion.div key={project.key} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 }} className="group liquid-glass rounded-2xl overflow-hidden border-glow box-glow-hover hover:bg-primary/5 transition-all duration-500">
                <div className="h-48 relative overflow-hidden bg-secondary/30">
                  <div className="absolute inset-0 gradient-red opacity-20 group-hover:opacity-30 transition-opacity" />
                  {"image" in project && project.image && (
                    <img src={project.image} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><ExternalLink className="w-8 h-8 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300" /></div>
                </div>
                <div className="p-6">
                  <span className="text-xs font-display uppercase tracking-wider text-primary">{t(`ourWork.projects.${project.key}.category`)}</span>
                  <h3 className="font-display text-lg font-semibold mt-2 mb-3 text-foreground">{t(`ourWork.projects.${project.key}.title`)}</h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{t(`ourWork.projects.${project.key}.desc`)}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech) => (<span key={tech} className="px-3 py-1 rounded-full text-xs bg-secondary text-muted-foreground">{tech}</span>))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-24">
        <div className="container px-4 lg:px-8">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="liquid-glass-strong rounded-3xl border-glow box-glow-hover p-12 md:p-20 text-center max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">{t("ourWork.ctaHeading")} <span className="text-gradient-red">{t("ourWork.ctaHighlight")}</span> {t("ourWork.ctaSuffix")}</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-10">{t("ourWork.ctaDesc")}</p>
            <Link to="/contact#live-chat"><Button variant="hero" size="lg" className="gap-2">{t("ourWork.ctaBtn")} <ArrowRight className="w-5 h-5 rtl:rotate-180" /></Button></Link>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
