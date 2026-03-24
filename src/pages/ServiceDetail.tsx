import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import { getServiceBySlug } from "@/data/services";
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
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden -mt-16 pt-16">
        {/* Background image – viewport top se, header ke niche */}
        <div className="absolute inset-0">
          <img
            src={`/services/${service.slug}.png`}
            alt=""
            className="w-full h-full object-cover"
            aria-hidden
          />
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
          <div className="absolute inset-0 bg-background/40 backdrop-blur-[1px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/30 to-background/60" />
        </div>
        {/* Hero accent – center */}
        <div className="container relative z-10 px-4 lg:px-8 text-center py-24 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center"
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
              className="text-4xl md:text-6xl font-display font-bold mb-6"
            >
              {service.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8"
            >
              {service.longDesc}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="flex justify-center"
            >
              <Link
                to="/services"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl liquid-glass border-glow text-sm font-medium text-foreground hover:text-primary hover:bg-white/10 transition-all duration-300"
              >
                ← All Services
              </Link>
            </motion.div>
          </motion.div>
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
