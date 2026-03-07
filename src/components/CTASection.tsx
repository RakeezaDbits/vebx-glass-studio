import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[150px]" />
      </div>

      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.8 }}
        className="container relative z-10 px-4 lg:px-8"
      >
        <div className="liquid-glass-strong rounded-3xl border-glow p-12 md:p-20 text-center max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
            Ready to <span className="text-gradient-red">Transform</span> Your Business?
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-10">
            Let's build something extraordinary together. Your next big idea starts here.
          </p>
          <Link to="/contact">
            <Button variant="hero" size="lg" className="gap-2">
              Start Your Project <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
