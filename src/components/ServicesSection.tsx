import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  Smartphone,
  Globe,
  Code2,
  Palette,
  TrendingUp,
  Film,
  Box,
  Glasses,
  Gamepad2,
  Share2,
  Monitor,
} from "lucide-react";

const services = [
  { icon: Smartphone, title: "Mobile Application", desc: "Native & cross-platform apps that captivate users" },
  { icon: Globe, title: "Web CMS Development", desc: "Powerful content management solutions" },
  { icon: Code2, title: "Software Development", desc: "Custom software tailored to your needs" },
  { icon: Palette, title: "Corporate Branding", desc: "Bold brand identities that stand out" },
  { icon: TrendingUp, title: "Online Digital Marketing", desc: "Data-driven strategies for growth" },
  { icon: Film, title: "2D/3D & Animation", desc: "Stunning visuals that tell your story" },
  { icon: Box, title: "3D Rendering Services", desc: "Photorealistic 3D visualizations" },
  { icon: Monitor, title: "Metaverse Development", desc: "Next-gen immersive digital worlds" },
  { icon: Gamepad2, title: "Game Development", desc: "Engaging games across all platforms" },
  { icon: Glasses, title: "Extended Reality", desc: "AR/VR/MR experiences that transform" },
  { icon: Share2, title: "Social Media Marketing", desc: "Strategic social presence & engagement" },
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
      className="group liquid-glass rounded-2xl p-6 border-glow hover:bg-primary/5 transition-all duration-500 cursor-pointer"
    >
      <div className="w-12 h-12 rounded-xl gradient-red flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
        <service.icon className="w-6 h-6 text-primary-foreground" />
      </div>
      <h3 className="font-display text-base font-semibold mb-2 text-foreground">{service.title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{service.desc}</p>
    </motion.div>
  );
}

export default function ServicesSection() {
  const headingRef = useRef(null);
  const headingInView = useInView(headingRef, { once: true });

  return (
    <section id="services" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      
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
          {services.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
