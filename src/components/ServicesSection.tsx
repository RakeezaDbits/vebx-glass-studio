import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { servicesData } from "@/data/services";

const cardEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

function ServiceCard({ service, index }: { service: (typeof servicesData)[0]; index: number }) {
  const { t } = useTranslation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const Icon = service.icon;

  return (
    <Link to={`/services/${service.slug}`}>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 36 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.65, delay: index * 0.06, ease: cardEase }}
        whileHover={{ y: -6, transition: { duration: 0.35, ease: cardEase } }}
        className="group relative liquid-glass rounded-2xl overflow-hidden border-glow cursor-pointer h-full flex flex-col hover:bg-white/[0.06] transition-colors duration-300 block"
      >
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div
            className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
            style={{
              background:
                "linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.04) 45%, rgba(255,255,255,0.08) 50%, transparent 55%)",
              transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />
        </div>
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-90 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-t-2xl" />
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={`/services/${service.slug}.png`}
            alt=""
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
          <div className="absolute top-4 right-4 w-12 h-12 rounded-xl gradient-red flex items-center justify-center shadow-lg shadow-primary/25 group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-6 h-6 text-primary-foreground" aria-hidden />
          </div>
        </div>
        <div className="relative p-6 flex-1 flex flex-col">
          <h3 className="font-display text-lg font-semibold mb-2 text-foreground tracking-tight group-hover:text-primary/95 transition-colors duration-300">
            {service.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-5">
            {service.shortDesc}
          </p>
          <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white text-white text-sm font-medium transition-all duration-300 w-fit group-hover:bg-red-600 group-hover:border-red-500">
            {t("common.explore")} <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </span>
        </div>
      </motion.div>
    </Link>
  );
}

export default function ServicesSection() {
  const { t } = useTranslation();
  const headingRef = useRef(null);
  const headingInView = useInView(headingRef, { once: true });

  return (
    <section id="services" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, hsl(0 0% 100% / 0.12) 1px, transparent 0)", backgroundSize: "32px 32px" }} />
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-primary/4 blur-[120px] pointer-events-none" />
      <div className="container relative z-10 px-4 lg:px-8">
        <motion.div ref={headingRef} initial={{ opacity: 0, y: 40 }} animate={headingInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="text-center mb-16">
          <span className="text-sm font-display uppercase tracking-[0.3em] text-primary mb-4 block">{t("servicesSection.tag")}</span>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            {t("servicesSection.heading")} <span className="text-gradient-red">{t("servicesSection.headingHighlight")}</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">{t("servicesSection.desc")}</p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {servicesData.map((service, i) => (
            <ServiceCard key={service.slug} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
