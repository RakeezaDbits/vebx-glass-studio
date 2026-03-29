import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import { getServiceBySlug } from "@/data/services";
import ServiceHeroIllustration from "@/components/ServiceHeroIllustration";
import MediaBlackOverlay from "@/components/MediaBlackOverlay";
import NotFound from "./NotFound";

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const service = slug ? getServiceBySlug(slug) : undefined;

  if (!service) return <NotFound />;

  const Icon = service.icon;

  return (
    <PageLayout
      seo={{
        title: service.title,
        description: service.shortDesc,
        canonicalPath: `/services/${service.slug}`,
      }}
    >
      {/* Hero – bg top pe, header ke niche hi (no gap); 2D/3D Animation par thora animated bg */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-x-clip overflow-y-visible -mt-16 pt-16">
        {/* Background image – viewport top se, header ke niche */}
        <div className="absolute inset-0">
          {service.slug !== "game-development" && (
            <img
              src={`/services/${service.slug}.png`}
              alt=""
              className="w-full h-full object-cover"
              aria-hidden
            />
          )}
          {service.slug === "game-development" && (
            <div className="absolute inset-0 bg-background" aria-hidden />
          )}
          {service.slug === "2d-3d-animation" && (
            <>
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full bg-primary/15 blur-[80px]"
                    style={{
                      width: `${120 + i * 60}px`,
                      height: `${120 + i * 60}px`,
                      left: `${(i * 22) % 80}%`,
                      top: `${(i * 18) % 70}%`,
                    }}
                    animate={{
                      x: [0, 30, -20, 0],
                      y: [0, -25, 15, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 8 + i * 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
              <div className="hero-bg-gradient-animated" aria-hidden />
            </>
          )}
          {service.slug === "game-development" && (
            <div
              className="absolute inset-0 w-full pointer-events-none overflow-hidden"
              aria-hidden
            >
              <dotlottie-wc
                src="https://lottie.host/962b09e3-b30a-46d8-9bd4-6da57d8e8224/SMq5eW6HgK.lottie"
                autoplay
                loop
                layout={JSON.stringify({ fit: "cover", align: [0.5, 0.5] })}
                className="block h-full min-h-full w-full max-w-none"
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          )}
          <MediaBlackOverlay className="bg-black/90" />
        </div>
        {/* Hero: copy left, illustration always right (desktop); mobile stacks text then image */}
        <div className="container relative z-10 px-4 lg:px-8 py-24 pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 xl:gap-12 items-center min-h-[min(68vh,760px)]">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center text-center lg:items-start lg:text-left lg:col-span-5"
            >
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl gradient-red flex items-center justify-center shrink-0 shadow-lg shadow-primary/25 mb-6">
                <Icon className="w-12 h-12 md:w-14 md:h-14 text-primary-foreground" />
              </div>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-sm font-display uppercase tracking-[0.3em] text-primary mb-2 block"
              >
                Service
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="text-4xl md:text-5xl xl:text-6xl font-display font-bold mb-6"
              >
                {service.title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="text-lg text-muted-foreground max-w-2xl lg:max-w-none leading-relaxed mb-8"
              >
                {service.longDesc}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="flex justify-center lg:justify-start w-full"
              >
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl liquid-glass border-glow text-sm font-medium text-foreground hover:text-primary hover:bg-white/10 transition-all duration-300"
                >
                  ← All Services
                </Link>
              </motion.div>
            </motion.div>
            <motion.div
              className="relative flex items-center justify-center lg:justify-end pointer-events-none select-none lg:col-span-7 w-full min-h-0 lg:py-4"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <motion.div
                className="relative w-full max-w-none flex items-center justify-center lg:justify-end min-h-0"
                animate={{ y: [0, -14, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <ServiceHeroIllustration slug={service.slug} aria-hidden />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What we offer */}
      <section className="py-16 relative">
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, hsl(0 0% 100% / 0.15) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="container relative z-10 px-4 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-4xl font-display font-bold mb-10"
          >
            What we <span className="text-gradient-red">offer</span>
          </motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {service.features.map((feature, i) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="flex items-center gap-3 liquid-glass rounded-xl p-4 border-glow"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose / Highlights */}
      <section className="py-16">
        <div className="container px-4 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-4xl font-display font-bold mb-10 text-center"
          >
            Why work with <span className="text-gradient-red">us</span>
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {service.highlights.map((h, i) => (
              <motion.div
                key={h.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="liquid-glass rounded-2xl p-6 border-glow text-center hover:bg-white/[0.06] transition-colors duration-300"
              >
                <h3 className="font-display text-base font-semibold text-foreground mb-2">{h.title}</h3>
                <p className="text-sm text-muted-foreground">{h.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="liquid-glass-strong rounded-3xl border-glow p-12 md:p-20 text-center max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              Ready for <span className="text-gradient-red">{service.title}</span>?
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-10">
              Let's discuss your project and build something great together.
            </p>
            <Link to="/contact#live-chat">
              <Button variant="hero" size="lg" className="gap-2">
                Let's Talk <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
