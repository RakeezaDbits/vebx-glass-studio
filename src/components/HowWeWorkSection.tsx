import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Search, Palette, Code2, Rocket } from "lucide-react";
import { Link } from "react-router-dom";

const steps = [
  { icon: Search, step: "01", title: "Discover", desc: "We learn your vision, audience, and goals." },
  { icon: Palette, step: "02", title: "Design", desc: "UX, UI, and architecture in a clear plan." },
  { icon: Code2, step: "03", title: "Develop", desc: "Clean code, best practices, regular updates." },
  { icon: Rocket, step: "04", title: "Deliver", desc: "Launch, support, and iterate." },
];

export default function HowWeWorkSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, hsl(0 0% 100% / 0.15) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="container relative z-10 px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-display uppercase tracking-[0.3em] text-primary mb-4 block">Our Process</span>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            How We <span className="text-gradient-red">Work</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            A simple, transparent process from idea to launch.
          </p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="liquid-glass rounded-2xl p-6 border-glow relative group hover:bg-white/[0.06] transition-colors duration-300"
            >
              <span className="text-4xl font-display font-bold text-primary/20 group-hover:text-primary/40 transition-colors">{s.step}</span>
              <div className="w-12 h-12 rounded-xl gradient-red flex items-center justify-center mt-4 mb-4">
                <s.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/90 transition-colors"
          >
            Start your project <Rocket className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
