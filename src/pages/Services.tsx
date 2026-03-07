import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";
import {
  Smartphone, Globe, Code2, Palette, TrendingUp, Film,
  Box, Glasses, Gamepad2, Share2, Monitor, ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";

const services = [
  { icon: Smartphone, title: "Mobile Application", desc: "Native & cross-platform apps that captivate users. We build for iOS, Android, and beyond with cutting-edge frameworks.", color: "from-rose-600 to-red-800" },
  { icon: Globe, title: "Web CMS Development", desc: "Powerful content management solutions. Custom WordPress, headless CMS, and enterprise web platforms.", color: "from-rose-600 to-red-800" },
  { icon: Code2, title: "Software Development", desc: "Custom software tailored to your needs. From SaaS platforms to enterprise systems, built for scale.", color: "from-rose-600 to-red-800" },
  { icon: Palette, title: "Corporate Branding", desc: "Bold brand identities that stand out. Logo design, brand strategy, and complete visual identity packages.", color: "from-rose-600 to-red-800" },
  { icon: TrendingUp, title: "Online Digital Marketing", desc: "Data-driven strategies for growth. SEO, PPC, content marketing, and conversion optimization.", color: "from-rose-600 to-red-800" },
  { icon: Film, title: "2D/3D & Animation", desc: "Stunning visuals that tell your story. Motion graphics, explainer videos, and cinematic animations.", color: "from-rose-600 to-red-800" },
  { icon: Box, title: "3D Rendering Services", desc: "Photorealistic 3D visualizations. Architectural renders, product visualization, and CGI for any industry.", color: "from-rose-600 to-red-800" },
  { icon: Monitor, title: "Metaverse Development", desc: "Next-gen immersive digital worlds. Virtual spaces, digital twins, and metaverse experiences.", color: "from-rose-600 to-red-800" },
  { icon: Gamepad2, title: "Game Development", desc: "Engaging games across all platforms. Unity, Unreal Engine, mobile, PC, and console game development.", color: "from-rose-600 to-red-800" },
  { icon: Glasses, title: "Extended Reality", desc: "AR/VR/MR experiences that transform industries. Training simulations, virtual tours, and immersive apps.", color: "from-rose-600 to-red-800" },
  { icon: Share2, title: "Social Media Marketing", desc: "Strategic social presence & engagement. Content creation, community management, and influencer partnerships.", color: "from-rose-600 to-red-800" },
];

function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className="group liquid-glass rounded-2xl p-8 border-glow hover:bg-primary/5 transition-all duration-500"
    >
      <div className="w-14 h-14 rounded-xl gradient-red flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
        <service.icon className="w-7 h-7 text-primary-foreground" />
      </div>
      <h3 className="font-display text-lg font-semibold mb-3 text-foreground">{service.title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{service.desc}</p>
    </motion.div>
  );
}

export default function Services() {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full bg-primary/8 blur-[120px] animate-float" />
        <div className="container relative z-10 px-4 lg:px-8 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-display uppercase tracking-[0.3em] text-primary mb-4 block"
          >
            What We Do
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl font-display font-bold mb-6"
          >
            Our <span className="text-gradient-red">Services</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            End-to-end digital solutions designed to elevate your business. From concept to deployment, we've got you covered.
          </motion.p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container px-4 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <ServiceCard key={service.title} service={service} index={i} />
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
              Need a <span className="text-gradient-red">Custom Solution</span>?
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-10">
              Don't see exactly what you're looking for? We build custom digital solutions tailored to your unique requirements.
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
