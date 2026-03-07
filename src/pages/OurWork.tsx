import { motion } from "framer-motion";
import { ExternalLink, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";

const projects = [
  { title: "FinTech Dashboard", category: "Web Application", desc: "A real-time financial analytics platform with AI-powered insights and interactive charts.", tech: ["React", "Node.js", "AWS"] },
  { title: "MedConnect", category: "Mobile Application", desc: "HIPAA-compliant telemedicine app connecting patients with doctors through secure video calls.", tech: ["React Native", "Firebase", "WebRTC"] },
  { title: "VirtuWorld", category: "Metaverse", desc: "An immersive virtual showroom for a luxury automotive brand with 3D car configurator.", tech: ["Three.js", "WebXR", "Blender"] },
  { title: "GreenGrow", category: "Software Development", desc: "IoT-powered smart agriculture platform monitoring crop health with drone imagery.", tech: ["Python", "TensorFlow", "IoT"] },
  { title: "PixelForge", category: "Game Development", desc: "Cross-platform multiplayer RPG with procedurally generated worlds and real-time combat.", tech: ["Unity", "C#", "Photon"] },
  { title: "BrandSphere", category: "Corporate Branding", desc: "Complete brand overhaul for a Fortune 500 company including digital and print assets.", tech: ["Figma", "After Effects", "Illustrator"] },
];

export default function OurWork() {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-80 h-80 rounded-full bg-primary/8 blur-[120px] animate-float" />
        <div className="container relative z-10 px-4 lg:px-8 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-display uppercase tracking-[0.3em] text-primary mb-4 block"
          >
            Portfolio
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl font-display font-bold mb-6"
          >
            Our <span className="text-gradient-red">Work</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            A showcase of projects that demonstrate our expertise across industries and technologies.
          </motion.p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16">
        <div className="container px-4 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group liquid-glass rounded-2xl overflow-hidden border-glow hover:bg-primary/5 transition-all duration-500"
              >
                {/* Placeholder visual */}
                <div className="h-48 gradient-red opacity-20 group-hover:opacity-30 transition-opacity relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ExternalLink className="w-8 h-8 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
                <div className="p-6">
                  <span className="text-xs font-display uppercase tracking-wider text-primary">{project.category}</span>
                  <h3 className="font-display text-lg font-semibold mt-2 mb-3 text-foreground">{project.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{project.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((t) => (
                      <span key={t} className="px-3 py-1 rounded-full text-xs bg-secondary text-muted-foreground">
                        {t}
                      </span>
                    ))}
                  </div>
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
              Want to Be Our <span className="text-gradient-red">Next Success</span> Story?
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-10">
              Let's discuss your project and create something extraordinary together.
            </p>
            <Link to="/contact">
              <Button variant="hero" size="lg" className="gap-2">
                Start a Project <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
