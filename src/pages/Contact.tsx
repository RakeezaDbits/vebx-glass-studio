import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Mail, Send, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import PageLayout from "@/components/PageLayout";
import { postContact } from "@/lib/api";
import { toast } from "sonner";

export default function Contact() {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill name, email and message.");
      return;
    }
    setLoading(true);
    try {
      await postContact({ name: name.trim(), email: email.trim(), subject: subject.trim() || undefined, message: message.trim() });
      toast.success("Message sent. We'll get back to you soon.");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout
      seo={{
        title: "Contact",
        description:
          "Get in touch with vebx.run. Send a message for mobile app, web, game development, or digital marketing. We respond quickly.",
        canonicalPath: "/contact",
      }}
    >
      <section className="py-24 relative overflow-hidden page-banner-glow">
        <div className="absolute inset-0">
          <img src="/services/software-development.png" alt="" className="w-full h-full object-cover opacity-45" aria-hidden />
          <div className="absolute inset-0 bg-background/65" />
        </div>
        <div className="absolute bottom-1/3 left-1/3 w-80 h-80 rounded-full bg-primary/8 blur-[120px] animate-float" />
        <div className="container relative z-10 px-4 lg:px-8 text-center">
          <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-sm font-display uppercase tracking-[0.3em] text-primary mb-4 block">{t("contact.tag")}</motion.span>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-4xl md:text-6xl font-display font-bold mb-6">
            {t("contact.heading")} <span className="text-gradient-red">{t("contact.headingHighlight")}</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("contact.desc")}</motion.p>
        </div>
      </section>
      <section className="py-16">
        <div className="container px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="liquid-glass rounded-2xl p-8 border-glow">
              <h3 className="font-display text-xl font-bold text-foreground mb-6">{t("contact.sendMessage")}</h3>
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input placeholder={t("contact.yourName")} className="bg-secondary/50 border-border" value={name} onChange={(e) => setName(e.target.value)} />
                  <Input placeholder={t("contact.yourEmail")} type="email" className="bg-secondary/50 border-border" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <Input placeholder={t("contact.subject")} className="bg-secondary/50 border-border" value={subject} onChange={(e) => setSubject(e.target.value)} />
                <Textarea placeholder={t("contact.tellUs")} rows={5} className="bg-secondary/50 border-border resize-none" value={message} onChange={(e) => setMessage(e.target.value)} />
                <Button variant="hero" size="lg" className="w-full gap-2" type="submit" disabled={loading}>{t("contact.sendBtn")} <Send className="w-4 h-4" /></Button>
              </form>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="flex flex-col gap-8">
              <div className="liquid-glass rounded-2xl p-8 border-glow">
                <Mail className="w-8 h-8 text-primary mb-4" />
                <h4 className="font-display text-lg font-semibold text-foreground mb-2">{t("contact.emailUs")}</h4>
                <a href="mailto:support@vebx.run" className="text-muted-foreground hover:text-primary transition-colors">support@vebx.run</a>
              </div>
              <div className="liquid-glass rounded-2xl p-8 border-glow">
                <Clock className="w-8 h-8 text-primary mb-4" />
                <h4 className="font-display text-lg font-semibold text-foreground mb-2">{t("contact.businessHours")}</h4>
                <p className="text-muted-foreground mb-1">24/7</p>
                <p className="text-sm text-muted-foreground">{t("contact.monToSun")}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
