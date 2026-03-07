import { motion } from "framer-motion";
import { Shield, Zap, Users, Target, Award, Lightbulb, Globe, Heart } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import servicesBg from "@/assets/services-bg.jpg";

const features = [
  { icon: Zap, title: "Innovation First", desc: "Cutting-edge tech stack for modern solutions" },
  { icon: Shield, title: "Reliable & Secure", desc: "Enterprise-grade security in every project" },
  { icon: Users, title: "Expert Team", desc: "Seasoned developers & designers worldwide" },
  { icon: Target, title: "Results Driven", desc: "Measurable outcomes that exceed goals" },
];

const values = [
  { icon: Lightbulb, title: "Creative Thinking", desc: "We approach every project with fresh perspectives, challenging conventional solutions to deliver truly innovative results." },
  { icon: Award, title: "Quality Excellence", desc: "Every line of code, every pixel, every interaction is crafted to the highest standards of quality and performance." },
  { icon: Globe, title: "Global Reach", desc: "Serving clients across the globe with culturally aware, locally relevant digital solutions." },
  { icon: Heart, title: "Client-Centric", desc: "Your success is our success. We build lasting partnerships based on trust, transparency, and shared goals." },
];

export default function About() {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/10 blur-[100px] animate-float" />
        <div className="container relative z-10 px-4 lg:px-8 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-sm font-display uppercase tracking-[0.3em] text-primary mb-4 block"
          >
            About Us
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl font-display font-bold mb-6"
          >
            Crafting <span className="text-gradient-red">Digital Excellence</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            At vebx.run, we're more than developers — we're digital architects. We combine creative vision with technical mastery to build products that don't just work, they inspire.
          </motion.p>
        </div>
      </section>

      {/* Image + Content */}
      <section className="py-16 relative">
        <div className="container px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="rounded-3xl overflow-hidden border-glow liquid-glass"
            >
              <img src={servicesBg} alt="About vebx.run" className="w-full h-80 lg:h-[28rem] object-cover" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                From Startups to <span className="text-gradient-red">Enterprises</span>
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Founded with a mission to democratize cutting-edge technology, vebx.run has grown into a global digital agency serving clients across industries. We bring your boldest ideas to life with precision and passion.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our team of seasoned professionals spans across mobile development, web platforms, metaverse experiences, game design, and beyond. We don't just build software — we engineer digital futures.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16">
        <div className="container px-4 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="liquid-glass rounded-xl p-6 border-glow text-center"
              >
                <f.icon className="w-8 h-8 text-primary mb-3 mx-auto" />
                <h4 className="text-sm font-display font-semibold text-foreground mb-2">{f.title}</h4>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24">
        <div className="container px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-display uppercase tracking-[0.3em] text-primary mb-4 block">Our Values</span>
            <h2 className="text-3xl md:text-5xl font-display font-bold">
              What <span className="text-gradient-red">Drives</span> Us
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="liquid-glass rounded-2xl p-8 border-glow group hover:bg-primary/5 transition-all duration-500"
              >
                <div className="w-12 h-12 rounded-xl gradient-red flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <v.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2 text-foreground">{v.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
        <div className="container relative z-10 px-4 lg:px-8">
          <div className="liquid-glass-strong rounded-3xl border-glow p-12 md:p-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: "150+", label: "Projects Delivered" },
                { value: "50+", label: "Happy Clients" },
                { value: "8+", label: "Years Experience" },
                { value: "30+", label: "Team Members" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div className="text-3xl md:text-4xl font-display font-bold text-gradient-red">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-2">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
