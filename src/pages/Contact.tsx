import { motion } from "framer-motion";
import { Mail, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import PageLayout from "@/components/PageLayout";

export default function Contact() {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/10 blur-[100px] animate-float" />
        <div className="container relative z-10 px-4 lg:px-8 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-display uppercase tracking-[0.3em] text-primary mb-4 block"
          >
            Contact Us
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl font-display font-bold mb-6"
          >
            Let's <span className="text-gradient-red">Talk</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Have a project in mind? We'd love to hear from you. Send us a message and we'll get back to you within 24 hours.
          </motion.p>
        </div>
      </section>

      {/* Contact Form + Info */}
      <section className="py-16">
        <div className="container px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="liquid-glass rounded-2xl p-8 border-glow"
            >
              <h3 className="font-display text-xl font-bold text-foreground mb-6">Send a Message</h3>
              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input placeholder="Your Name" className="bg-secondary/50 border-border" />
                  <Input placeholder="Your Email" type="email" className="bg-secondary/50 border-border" />
                </div>
                <Input placeholder="Subject" className="bg-secondary/50 border-border" />
                <Textarea placeholder="Tell us about your project..." rows={5} className="bg-secondary/50 border-border resize-none" />
                <Button variant="hero" size="lg" className="w-full gap-2">
                  Send Message <Send className="w-4 h-4" />
                </Button>
              </form>
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col gap-8"
            >
              <div className="liquid-glass rounded-2xl p-8 border-glow">
                <Mail className="w-8 h-8 text-primary mb-4" />
                <h4 className="font-display text-lg font-semibold text-foreground mb-2">Email Us</h4>
                <a href="mailto:support@vebx.run" className="text-muted-foreground hover:text-primary transition-colors">
                  support@vebx.run
                </a>
              </div>

              <div className="liquid-glass rounded-2xl p-8 border-glow">
                <MapPin className="w-8 h-8 text-primary mb-4" />
                <h4 className="font-display text-lg font-semibold text-foreground mb-2">Visit Us</h4>
                <p className="text-muted-foreground">
                  117 S Lexington Street STN 100,<br />
                  Harrisonville MO 64701
                </p>
              </div>

              <div className="liquid-glass rounded-2xl p-8 border-glow">
                <h4 className="font-display text-lg font-semibold text-foreground mb-4">Business Hours</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Monday – Friday</span>
                    <span className="text-foreground">9:00 AM – 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span className="text-foreground">10:00 AM – 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="text-foreground">Closed</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
