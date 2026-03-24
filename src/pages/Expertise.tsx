import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";

const techStacks = [
  { categoryKey: "expertise.categories.frontend", techs: ["React", "Next.js", "Vue.js", "Angular", "TypeScript", "Tailwind CSS", "Framer Motion"] },
  { categoryKey: "expertise.categories.backend", techs: ["Node.js", "Python", "Django", ".NET", "Go", "GraphQL", "REST APIs"] },
  { categoryKey: "expertise.categories.mobile", techs: ["React Native", "Flutter", "Swift", "Kotlin", "Ionic", "PWA"] },
  { categoryKey: "expertise.categories.cloudDevops", techs: ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "CI/CD", "Terraform"] },
  { categoryKey: "expertise.categories.gameXR", techs: ["Unity", "Unreal Engine", "Three.js", "WebXR", "ARKit", "ARCore", "Blender"] },
  { categoryKey: "expertise.categories.dataAI", techs: ["TensorFlow", "PyTorch", "OpenAI", "LangChain", "PostgreSQL", "MongoDB", "Redis"] },
];

const industryKeys = ["expertise.industries.healthcare","expertise.industries.fintech","expertise.industries.ecommerce","expertise.industries.education","expertise.industries.realEstate","expertise.industries.entertainment","expertise.industries.automotive","expertise.industries.logistics"];

export default function Expertise() {
  const { t } = useTranslation();
  return (
    <PageLayout
      seo={{
        title: "Expertise",
        description:
          "Our tech stack & industry expertise: React, Node.js, Flutter, AWS, Unity, AI/ML. We build for healthcare, fintech, e-commerce, education & more.",
        canonicalPath: "/expertise",
      }}
    >
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden -mt-16 pt-16 page-banner-glow">
        <div className="absolute inset-0">
          <img src="/banners/expertise-banner.jpg" alt="" className="w-full h-full object-cover opacity-50" aria-hidden />
          <div className="absolute inset-0 bg-background/55" />
        </div>
        <div className="absolute bottom-1/3 left-1/3 w-80 h-80 rounded-full bg-primary/8 blur-[120px] animate-float" />
        <div className="container relative z-10 px-4 lg:px-8 text-center">
          <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-sm font-display uppercase tracking-[0.3em] text-primary mb-4 block">{t("expertise.tag")}</motion.span>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-4xl md:text-6xl font-display font-bold mb-6">
            {t("expertise.heading")} <span className="text-gradient-red">{t("expertise.headingHighlight")}</span> {t("expertise.headingSuffix")}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("expertise.desc")}</motion.p>
        </div>
      </section>
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="/services/software-development.png" alt="" className="w-full h-full object-cover opacity-20" aria-hidden />
          <div className="absolute inset-0 bg-background/80" />
        </div>
        <div className="container relative z-10 px-4 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {techStacks.map((stack, i) => (
              <motion.div key={stack.categoryKey} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 }} className="liquid-glass rounded-2xl p-8 border-glow">
                <h3 className="font-display text-lg font-bold text-foreground mb-5">{t(stack.categoryKey)}</h3>
                <div className="flex flex-wrap gap-2">
                  {stack.techs.map((tech) => (
                    <span key={tech} className="group/btn relative liquid-glass rounded-full border-glow overflow-hidden cursor-default inline-flex items-center">
                      <span className="absolute inset-0 overflow-hidden rounded-full">
                        <img src="/services/software-development.png" alt="" className="absolute inset-0 w-full h-full object-cover blur-2xl scale-150 group-hover/btn:blur-xl group-hover/btn:scale-125 transition-all duration-500" aria-hidden />
                      </span>
                      <span className="absolute inset-0 rounded-full bg-background/75 group-hover/btn:bg-background/60 transition-colors duration-300" />
                      <span className="relative px-3 py-1.5 text-xs font-medium text-muted-foreground group-hover/btn:text-foreground group-hover/btn:text-primary/90 transition-colors">{tech}</span>
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="/services/software-development.png" alt="" className="w-full h-full object-cover opacity-15" aria-hidden />
          <div className="absolute inset-0 bg-background/90" />
        </div>
        <div className="container relative z-10 px-4 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="text-sm font-display uppercase tracking-[0.3em] text-primary mb-4 block">{t("expertise.industriesTag")}</span>
            <h2 className="text-3xl md:text-5xl font-display font-bold">{t("expertise.industriesHeading")} <span className="text-gradient-red">{t("expertise.industriesHighlight")}</span></h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {industryKeys.map((key, i) => (
              <motion.div key={key} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }} className="liquid-glass rounded-xl p-5 border-glow text-center hover:bg-white/[0.06] transition-all duration-500">
                <span className="text-sm font-medium text-foreground">{t(key)}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-24">
        <div className="container px-4 lg:px-8">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="liquid-glass-strong rounded-3xl border-glow p-12 md:p-20 text-center max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">{t("expertise.ctaHeading")} <span className="text-gradient-red">{t("expertise.ctaHighlight")}</span></h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-10">{t("expertise.ctaDesc")}</p>
            <Link to="/contact#live-chat"><Button variant="hero" size="lg" className="gap-2">{t("expertise.ctaBtn")} <ArrowRight className="w-5 h-5 rtl:rotate-180" /></Button></Link>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
