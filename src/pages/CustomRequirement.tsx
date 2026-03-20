import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight, Upload, MessageCircle, User, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PageLayout from "@/components/PageLayout";
import {
  requirementServices,
  subTypesByService,
  technologies,
  priceTiers,
  getPriceForTier,
} from "@/data/customRequirement";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { postQuote, getStoredAIQuoteRef, setStoredAIQuoteRef } from "@/lib/api";

const WHATSAPP_TARGET = import.meta.env.VITE_WHATSAPP_NUMBER || "";

function toWhatsappNumber(value: string): string {
  return value.replace(/[^\d]/g, "");
}

export default function CustomRequirement() {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceSlug, setServiceSlug] = useState("");
  const [subTypeId, setSubTypeId] = useState("");
  const [techIds, setTechIds] = useState<string[]>([]);
  const [tierId, setTierId] = useState("");
  const [referenceLink, setReferenceLink] = useState("");
  const [referenceFile, setReferenceFile] = useState<File | null>(null);
  const [referenceImageRef, setReferenceImageRef] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setReferenceImageRef(getStoredAIQuoteRef());
  }, []);

  const subTypes = serviceSlug ? subTypesByService[serviceSlug] ?? [] : [];
  const price = tierId ? getPriceForTier(tierId) : null;

  const toggleTech = (id: string) => {
    setTechIds((prev) => (prev.includes(id) ? prev.filter((tch) => tch !== id) : [...prev, id]));
  };

  const resetForm = () => {
    setStoredAIQuoteRef(null);
    setReferenceImageRef(null);
    setSubmitted(false);
    setName("");
    setEmail("");
    setPhone("");
    setServiceSlug("");
    setSubTypeId("");
    setTechIds([]);
    setTierId("");
    setReferenceLink("");
    setReferenceFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const openWhatsappLead = () => {
    const target = toWhatsappNumber(WHATSAPP_TARGET);
    if (!target) return;

    const selectedService = requirementServices.find((s) => s.slug === serviceSlug)?.title || serviceSlug;
    const selectedTier = priceTiers.find((tier) => tier.id === tierId);
    const msgLines = [
      "New Get a Quote submission",
      `Name: ${name.trim()}`,
      `WhatsApp: ${phone.trim()}`,
      `Email: ${email.trim()}`,
      `Service: ${selectedService || "-"}`,
      `Sub Type: ${subTypeId || "-"}`,
      `Tech: ${techIds.length ? techIds.join(", ") : "-"}`,
      `Budget Tier: ${selectedTier ? t(selectedTier.labelKey) : "-"}`,
      `Reference Link: ${referenceLink.trim() || "-"}`,
      `AI Image Ref: ${referenceImageRef || "-"}`,
    ];

    const text = encodeURIComponent(msgLines.join("\n"));
    const url = `https://wa.me/${target}?text=${text}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter your name.");
      return;
    }
    if (!email.trim()) {
      toast.error("Please enter your email.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error("Please enter a valid email.");
      return;
    }
    if (!phone.trim()) {
      toast.error("Please enter your WhatsApp number.");
      return;
    }
    if (!serviceSlug) {
      toast.error("Please select a service.");
      return;
    }

    const payload = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      serviceSlug,
      subTypeId: subTypeId || undefined,
      techIds,
      tierId: tierId || undefined,
      referenceLink: referenceLink.trim() || undefined,
      referenceFileName: referenceFile?.name,
      referenceImageRef: referenceImageRef || undefined,
    };

    setSubmitting(true);
    try {
      await postQuote(payload);
      setStoredAIQuoteRef(null);
      setReferenceImageRef(null);
      toast.success(t("customReq.submitSuccess"));
      setSubmitted(true);
      openWhatsappLead();
      if (!toWhatsappNumber(WHATSAPP_TARGET)) {
        toast.message("To auto-send WhatsApp message, set VITE_WHATSAPP_NUMBER in env.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageLayout
      seo={{
        title: "Get a Quote | Custom Requirement",
        description:
          "Submit your project requirement. Choose service, technology, and get an instant price estimate. vebx.run custom quote form.",
        canonicalPath: "/custom-requirement",
      }}
    >
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden -mt-16 pt-16 page-banner-glow">
        <div className="absolute inset-0">
          <img src="/banners/quote-banner.jpg" alt="" className="w-full h-full object-cover opacity-50" aria-hidden />
          <div className="absolute inset-0 bg-background/55" />
        </div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full bg-primary/8 blur-[120px] animate-float" />
        <div className="container relative z-10 px-4 lg:px-8 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-display uppercase tracking-[0.3em] text-primary mb-4 block"
          >
            {t("customReq.tag")}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl font-display font-bold mb-6"
          >
            {t("customReq.heading")} <span className="text-gradient-red">{t("customReq.headingHighlight")}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            {t("customReq.desc")}
          </motion.p>
        </div>
      </section>

      <section className="py-16 pb-24">
        <div className="container px-4 lg:px-8 max-w-4xl mx-auto">
          {!submitted ? (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              onSubmit={handleSubmit}
              className="liquid-glass rounded-2xl border-glow p-8 md:p-12 space-y-10"
            >
              <div className="flex items-center gap-3">
                <User className="w-6 h-6 text-primary shrink-0" />
                <h2 className="font-display text-xl font-semibold text-foreground">Contact Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-foreground">{t("customReq.yourName")}</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t("customReq.namePlaceholder")}
                    className="bg-secondary/50 border-border h-12"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="whatsapp" className="text-foreground">Your WhatsApp Number</Label>
                  <Input
                    id="whatsapp"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +92 300 1234567"
                    className="bg-secondary/50 border-border h-12"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="email" className="text-foreground">{t("customReq.yourEmail")}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("customReq.emailPlaceholder")}
                  className="bg-secondary/50 border-border h-12"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="service" className="text-foreground">{t("customReq.selectService")}</Label>
                <select
                  id="service"
                  value={serviceSlug}
                  onChange={(e) => {
                    setServiceSlug(e.target.value);
                    setSubTypeId("");
                  }}
                  className="w-full h-12 px-4 rounded-xl bg-secondary/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">{t("customReq.selectServicePlaceholder")}</option>
                  {requirementServices.map((s) => (
                    <option key={s.slug} value={s.slug}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>

              {subTypes.length > 0 && (
                <div className="space-y-3">
                  <Label htmlFor="subType" className="text-foreground">{t("customReq.selectSubType")}</Label>
                  <select
                    id="subType"
                    value={subTypeId}
                    onChange={(e) => setSubTypeId(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl bg-secondary/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="">{t("customReq.selectSubTypePlaceholder")}</option>
                    {subTypes.map((st) => (
                      <option key={st.id} value={st.id}>
                        {t(st.labelKey)}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-4">
                <Label className="text-foreground">{t("customReq.selectTech")}</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-52 overflow-y-auto p-1">
                  {technologies.map((tech) => (
                    <label
                      key={tech.id}
                      className={cn(
                        "flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors",
                        techIds.includes(tech.id)
                          ? "bg-primary/15 border-primary/50 text-foreground"
                          : "bg-secondary/30 border-border hover:bg-secondary/50"
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={techIds.includes(tech.id)}
                        onChange={() => toggleTech(tech.id)}
                        className="rounded border-border text-primary focus:ring-primary"
                      />
                      <span className="text-sm">{t(tech.labelKey)}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-foreground">{t("customReq.selectTier")}</Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {priceTiers.map((tier) => (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setTierId(tier.id)}
                      className={cn(
                        "p-4 rounded-xl border text-left transition-all",
                        tierId === tier.id
                          ? "border-primary bg-primary/15 ring-2 ring-primary/50"
                          : "border-border bg-secondary/30 hover:bg-secondary/50"
                      )}
                    >
                      <span className="font-medium block">{t(tier.labelKey)}</span>
                      {tier.price != null ? (
                        <span className="text-lg font-display text-primary">
                          ${tier.price.toLocaleString()}
                          <span className="text-sm text-muted-foreground font-normal ml-1">
                            {t("customReq.perProject")}
                          </span>
                        </span>
                      ) : (
                        <span className="text-muted-foreground">{t("customReq.priceCustom")}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {tierId && (
                <div className="rounded-xl bg-primary/10 border border-primary/30 p-6 text-center">
                  <span className="text-sm text-muted-foreground block mb-1">{t("customReq.priceLabel")}</span>
                  {price != null ? (
                    <span className="text-2xl font-display font-bold text-gradient-red">
                      ${price.toLocaleString()}
                      <span className="text-sm font-normal text-muted-foreground ml-1">{t("customReq.perProject")}</span>
                    </span>
                  ) : (
                    <span className="text-lg font-display font-bold text-primary">{t("customReq.priceCustom")}</span>
                  )}
                </div>
              )}

              <div className="space-y-3">
                <Label htmlFor="refLink" className="text-foreground">{t("customReq.referenceLink")}</Label>
                <Input
                  id="refLink"
                  type="url"
                  value={referenceLink}
                  onChange={(e) => setReferenceLink(e.target.value)}
                  placeholder={t("customReq.referenceLinkPlaceholder")}
                  className="bg-secondary/50 border-border h-12"
                />
              </div>

              {referenceImageRef && (
                <div className="rounded-xl bg-primary/10 border border-primary/30 p-4 flex items-center justify-between gap-3">
                  <span className="text-sm text-foreground">AI reference image attached (from Design idea chat)</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setStoredAIQuoteRef(null);
                      setReferenceImageRef(null);
                    }}
                  >
                    Remove
                  </Button>
                </div>
              )}

              <div className="space-y-3">
                <Label className="text-foreground">{t("customReq.referenceImage")}</Label>
                <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{t("customReq.referenceImageHint")}</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => setReferenceFile(e.target.files?.[0] ?? null)}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-4 h-4" />
                  {referenceFile ? referenceFile.name : t("customReq.referenceImageHint")}
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
                <Button type="submit" variant="hero" size="lg" className="flex-1 gap-2" disabled={submitting}>
                  {t("customReq.developBtn")} <ArrowRight className="w-5 h-5 rtl:rotate-180" />
                </Button>
                <Link to="/contact" className="flex-1">
                  <Button type="button" variant="glass" size="lg" className="w-full gap-2">
                    <MessageCircle className="w-5 h-5" />
                    {t("customReq.talkToTeam")}
                  </Button>
                </Link>
              </div>
            </motion.form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="liquid-glass rounded-2xl border-glow p-8 md:p-12 text-center space-y-8"
            >
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-primary" />
                </div>
              </div>
              <div className="space-y-4 max-w-md mx-auto">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">{t("customReq.thankYouTitle")}</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">{t("customReq.thankYouMessage")}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link to="/">
                  <Button variant="hero" size="lg" className="gap-2 min-w-[180px]">
                    {t("customReq.backToHome")}
                    <ArrowRight className="w-5 h-5 rtl:rotate-180" />
                  </Button>
                </Link>
                <Button type="button" variant="glass" size="lg" className="gap-2 min-w-[180px]" onClick={resetForm}>
                  {t("customReq.submitAnother")}
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
