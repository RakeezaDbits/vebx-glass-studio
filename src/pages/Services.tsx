import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import { servicesData } from "@/data/services";
import { newServicesData } from "@/data/newServices";

const cardEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

function ServiceCard({ service, index }: { service: (typeof servicesData)[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const { t } = useTranslation();
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

function NewServiceCard({
  service,
  index,
}: {
  service: (typeof newServicesData)[0];
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const { t } = useTranslation();
  const Icon = service.icon;

  return (
    <Link to={`/new-services/${service.slug}`}>
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
            src={service.image}
            alt=""
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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

export default function Services() {
  const { t } = useTranslation();
  return (
    <PageLayout
      seo={{
        title: "Services",
        description:
          "Mobile apps, web & CMS development, software development, corporate branding, digital marketing, 2D/3D animation, metaverse, game development & more. Explore vebx.run services.",
        canonicalPath: "/services",
      }}
    >
      {/* Hero – bg image (generated theme image), content centered */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background image – separate from header */}
        <div className="absolute inset-0">
          <img
            src="/services/software-development.png"
            alt=""
            className="w-full h-full object-cover"
            aria-hidden
          />
          <div className="absolute inset-0 bg-background/85 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
        </div>
        {/* Hero accent – center */}
        <div className="container relative z-10 px-4 lg:px-8 text-center py-24">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-display uppercase tracking-[0.3em] text-primary mb-4 block"
          >
            {t("servicesPage.whatWeDo")}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl font-display font-bold mb-6"
          >
            {t("servicesPage.ourServicesHighlight") ? (
              <>
                {t("servicesPage.ourServices").replace(t("servicesPage.ourServicesHighlight"), "").trim()}{" "}
                <span className="text-gradient-red">{t("servicesPage.ourServicesHighlight")}</span>
              </>
            ) : (
              <span className="text-gradient-red">{t("servicesPage.ourServices")}</span>
            )}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            {t("servicesPage.subtitle")}
          </motion.p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, hsl(0 0% 100% / 0.15) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="container relative z-10 px-4 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicesData.map((service, i) => (
              <ServiceCard key={service.slug} service={service} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* New Services Section */}
      <section id="new-services" className="py-16 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, hsl(0 0% 100% / 0.15) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="container relative z-10 px-4 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-sm font-display uppercase tracking-[0.3em] text-primary mb-4 block">
              {t("newServicesPage.tag")}
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              {t("newServicesPage.heading")}{" "}
              <span className="text-gradient-red">{t("newServicesPage.headingHighlight")}</span>
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              {t("newServicesPage.subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {newServicesData.map((service, i) => (
              <NewServiceCard key={service.id} service={service} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="liquid-glass-strong rounded-3xl border-glow p-12 md:p-20 text-center max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              {t("servicesPage.customSolution")}
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-10">
              {t("servicesPage.customSolutionDesc")}
            </p>
            <Link to="/contact">
              <Button variant="hero" size="lg" className="gap-2">
                {t("servicesPage.getInTouch")} <ArrowRight className="w-5 h-5 rtl:rotate-180" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
