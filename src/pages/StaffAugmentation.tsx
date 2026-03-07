import { motion } from "framer-motion";
import { Users, Clock, Shield, Zap, Code2, Palette, TrendingUp, Gamepad2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";

const benefits = [
  { icon: Users, title: "Dedicated Experts", desc: "Hand-picked professionals who integrate seamlessly with your team." },
  { icon: Clock, title: "Flexible Scaling", desc: "Scale your team up or down based on project demands — no long-term contracts." },
  { icon: Shield, title: "Vetted Talent", desc: "Every developer is rigorously tested and verified for technical excellence." },
  { icon: Zap, title: "Fast Onboarding", desc: "Get your augmented team members productive within days, not weeks." },
];

const roles = [
  { icon: Code2, title: "Full-Stack Developers", desc: "React, Node.js, Python, .NET, and more" },
  { icon: Palette, title: "UI/UX Designers", desc: "Figma, Adobe XD, user research specialists" },
  { icon: TrendingUp, title: "Project Managers", desc: "Agile/Scrum certified PMs for seamless delivery" },
  { icon: Gamepad2, title: "Game Developers", desc: "Unity, Unreal Engine, and mobile game experts" },
  { icon: Shield, title: "QA Engineers", desc: "Automation and manual testing professionals" },
  { icon: Users, title: "DevOps Engineers", desc: "AWS, Azure, GCP, CI/CD pipeline experts" },
];

const steps = [
  { step: "01", title: "Tell Us Your Needs", desc: "Share your project requirements, tech stack, and team dynamics." },
  { step: "02", title: "We Match Talent", desc: "We handpick the best candidates from our vetted talent pool." },
  { step: "03", title: "Interview & Select", desc: "You interview and select the professionals you want on your team." },
  { step: "04", title: "Onboard & Build", desc: "Quick onboarding, then your augmented team starts delivering." },
];

export default function StaffAugmentation() {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-primary/8 blur-[120px] animate-float" />
        <div className="container relative z-10 px-4 lg:px-8 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-display uppercase tracking-[0.3em] text-primary mb-4 block"
          >
            Staff Augmentation
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl font-display font-bold mb-6"
          >
            Scale Your <span className="text-gradient-red">Team</span> Instantly
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Access top-tier tech talent on demand. Our staff augmentation services help you fill skill gaps and accelerate delivery.
          </motion.p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16">
        <div className="container px-4 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="liquid-glass rounded-2xl p-6 border-glow text-center"
              >
                <div className="w-12 h-12 rounded-xl gradient-red flex items-center justify-center mb-4 mx-auto">
                  <b.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-display text-base font-semibold mb-2 text-foreground">{b.title}</h3>
                <p className="text-sm text-muted-foreground">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24">
        <div className="container px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-display uppercase tracking-[0.3em] text-primary mb-4 block">How It Works</span>
            <h2 className="text-3xl md:text-5xl font-display font-bold">
              Simple <span className="text-gradient-red">4-Step</span> Process
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="liquid-glass rounded-2xl p-8 border-glow relative group hover:bg-primary/5 transition-all duration-500"
              >
                <span className="text-5xl font-display font-bold text-primary/20 group-hover:text-primary/40 transition-colors">{s.step}</span>
                <h3 className="font-display text-base font-semibold mt-4 mb-2 text-foreground">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="py-16">
        <div className="container px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-display uppercase tracking-[0.3em] text-primary mb-4 block">Available Roles</span>
            <h2 className="text-3xl md:text-5xl font-display font-bold">
              Talent We <span className="text-gradient-red">Provide</span>
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((r, i) => (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="liquid-glass rounded-xl p-6 border-glow flex items-start gap-4 group hover:bg-primary/5 transition-all duration-500"
              >
                <div className="w-10 h-10 rounded-lg gradient-red flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <r.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h4 className="font-display text-sm font-semibold text-foreground mb-1">{r.title}</h4>
                  <p className="text-xs text-muted-foreground">{r.desc}</p>
                </div>
              </motion.div>
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
              Ready to <span className="text-gradient-red">Augment</span> Your Team?
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-10">
              Tell us what you need and we'll match you with the perfect talent within 48 hours.
            </p>
            <Link to="/contact">
              <Button variant="hero" size="lg" className="gap-2">
                Hire Talent <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
