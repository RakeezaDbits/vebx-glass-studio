import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";

const techStacks = [
  {
    category: "Frontend",
    techs: ["React", "Next.js", "Vue.js", "Angular", "TypeScript", "Tailwind CSS", "Framer Motion"],
  },
  {
    category: "Backend",
    techs: ["Node.js", "Python", "Django", ".NET", "Go", "GraphQL", "REST APIs"],
  },
  {
    category: "Mobile",
    techs: ["React Native", "Flutter", "Swift", "Kotlin", "Ionic", "PWA"],
  },
  {
    category: "Cloud & DevOps",
    techs: ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "CI/CD", "Terraform"],
  },
  {
    category: "Game & XR",
    techs: ["Unity", "Unreal Engine", "Three.js", "WebXR", "ARKit", "ARCore", "Blender"],
  },
  {
    category: "Data & AI",
    techs: ["TensorFlow", "PyTorch", "OpenAI", "LangChain", "PostgreSQL", "MongoDB", "Redis"],
  },
];

const industries = [
  "Healthcare & MedTech", "FinTech & Banking", "E-Commerce & Retail", "Education & EdTech",
  "Real Estate & PropTech", "Entertainment & Media", "Automotive", "Logistics & Supply Chain",
];

export default function Expertise() {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute bottom-1/3 left-1/3 w-80 h-80 rounded-full bg-primary/8 blur-[120px] animate-float" />
        <div className="container relative z-10 px-4 lg:px-8 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-display uppercase tracking-[0.3em] text-primary mb-4 block"
          >
            Expertise
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl font-display font-bold mb-6"
          >
            Our <span className="text-gradient-red">Technology</span> Stack
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            We master the tools that matter. Our expertise spans across the entire digital ecosystem.
          </motion.p>
        </div>
      </section>

      {/* Tech Stacks */}
      <section className="py-16">
        <div className="container px-4 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {techStacks.map((stack, i) => (
              <motion.div
                key={stack.category}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="liquid-glass rounded-2xl p-8 border-glow"
              >
                <h3 className="font-display text-lg font-bold text-foreground mb-5">{stack.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {stack.techs.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 rounded-full text-xs font-medium bg-secondary text-muted-foreground hover:bg-primary/20 hover:text-foreground transition-colors cursor-default"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-24">
        <div className="container px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-display uppercase tracking-[0.3em] text-primary mb-4 block">Industries</span>
            <h2 className="text-3xl md:text-5xl font-display font-bold">
              Industries We <span className="text-gradient-red">Serve</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {industries.map((ind, i) => (
              <motion.div
                key={ind}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="liquid-glass rounded-xl p-5 border-glow text-center hover:bg-primary/5 transition-all duration-500"
              >
                <span className="text-sm font-medium text-foreground">{ind}</span>
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
              Let's Build Something <span className="text-gradient-red">Amazing</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-10">
              Have a project in mind? Our team of experts is ready to bring your vision to life.
            </p>
            <Link to="/contact">
              <Button variant="hero" size="lg" className="gap-2">
                Get in Touch <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
