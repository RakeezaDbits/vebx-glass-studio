import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { servicesData } from "@/data/services";

const cardEase = [0.22, 1, 0.36, 1];

function ServiceCard({ service, index }: { service: (typeof servicesData)[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const num = String(index + 1).padStart(2, "0");
  const Icon = service.icon;

  return (
    <Link to={`/services/${service.slug}`}>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 36 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.65, delay: index * 0.06, ease: cardEase }}
        whileHover={{ y: -6, transition: { duration: 0.35, ease: cardEase } }}
        className="group relative liquid-glass rounded-2xl p-6 border-glow overflow-hidden cursor-pointer hover:bg-white/[0.06] transition-colors duration-300 block h-full"
      >
        {/* Hover shine sweep */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div
            className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
            style={{
              background: "linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.04) 45%, rgba(255,255,255,0.08) 50%, transparent 55%)",
              transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />
        </div>
        <span className="absolute top-4 right-4 text-[10px] font-display font-bold text-white/20 group-hover:text-primary/40 transition-colors duration-300 tabular-nums">
          {num}
        </span>
        <div
          className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-90 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-t-2xl"
          style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
        />
        <div className="relative">
          <div className="w-12 h-12 rounded-xl gradient-red flex items-center justify-center mb-4 shadow-lg shadow-primary/25 group-hover:scale-110 group-hover:shadow-primary/30 transition-all duration-300 ease-out">
            <Icon className="w-6 h-6 text-primary-foreground" />
          </div>
          <h3 className="font-display text-base font-semibold mb-2 text-foreground tracking-tight group-hover:text-primary/95 transition-colors duration-300">
            {service.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">{service.shortDesc}</p>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary/80 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
            Explore <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </motion.div>
    </Link>
  );
}

export default function ServicesSection() {
  const headingRef = useRef(null);
  const headingInView = useInView(headingRef, { once: true });

  return (
    <section id="services" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      {/* Soft dot grid */}
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, hsl(0 0% 100% / 0.12) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />
      {/* Soft glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-primary/4 blur-[120px] pointer-events-none" />

      <div className="container relative z-10 px-4 lg:px-8">
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 40 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-display uppercase tracking-[0.3em] text-primary mb-4 block">
            What We Do
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            Our <span className="text-gradient-red">Services</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            End-to-end digital solutions designed to elevate your business
          </p>
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
