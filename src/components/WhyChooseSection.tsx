import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Shield, Zap, Users, Target } from "lucide-react";

const reasons = [
  { icon: Zap, title: "Innovation First", desc: "Cutting-edge tech so your product stays ahead." },
  { icon: Shield, title: "Reliable Delivery", desc: "On-time and on-budget with clear communication." },
  { icon: Users, title: "Expert Team", desc: "Senior developers and designers who care." },
  { icon: Target, title: "Results That Matter", desc: "Metrics that grow your business." },
];

export default function WhyChooseSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      <div className="container relative z-10 px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-sm font-display uppercase tracking-[0.3em] text-primary mb-4 block">Why vebx.run</span>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            Why <span className="text-gradient-red">Choose Us</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Technical excellence with a commitment to your success.
          </p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="liquid-glass rounded-2xl p-6 border-glow text-center hover:bg-white/[0.06] transition-colors duration-300"
            >
              <div className="w-14 h-14 rounded-xl gradient-red flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/25">
                <r.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">{r.title}</h3>
              <p className="text-sm text-muted-foreground">{r.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
