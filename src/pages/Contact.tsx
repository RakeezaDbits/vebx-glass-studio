import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Mail, Send, Clock, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import PageLayout from "@/components/PageLayout";
import MediaBlackOverlay from "@/components/MediaBlackOverlay";
import { postContact } from "@/lib/api";
import { toast } from "sonner";

export default function Contact() {
  const { t } = useTranslation();
  const liveChatUrl =
    import.meta.env.VITE_LIVE_CHAT_URL?.trim() ||
    "https://wa.me/923001234567?text=Hi%20Vebx.run%2C%20I%20want%20to%20discuss%20my%20project.";
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
          "Get in touch with vebxrun. Send a message for mobile app, web, game development, or digital marketing. We respond quickly.",
        canonicalPath: "/contact",
      }}
    >
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden -mt-16 pt-16 page-banner-glow">
        <div className="absolute inset-0">
          <img src="/banners/contact-banner.jpg" alt="" className="w-full h-full object-cover" aria-hidden />
          <MediaBlackOverlay />
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
              <div id="live-chat" className="mb-6 space-y-3">
                <h3 className="font-display text-xl font-bold text-foreground">{t("contact.sendMessage")}</h3>
                <a href={liveChatUrl} target="_blank" rel="noopener noreferrer" className="block">
                  <Button variant="hero" size="lg" className="w-full gap-2">
                    {t("contact.liveChat")} <MessageCircle className="w-4 h-4" />
                  </Button>
                </a>
                <p className="text-sm text-muted-foreground">{t("contact.liveChatDesc")}</p>
              </div>
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
                <MessageCircle className="w-8 h-8 text-primary mb-4" />
                <h4 className="font-display text-lg font-semibold text-foreground mb-2">{t("contact.liveChat")}</h4>
                <p className="text-sm text-muted-foreground mb-4">{t("contact.liveChatDesc")}</p>
                <a href={liveChatUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="hero" className="gap-2">
                    {t("contact.liveChat")} <MessageCircle className="w-4 h-4" />
                  </Button>
                </a>
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
