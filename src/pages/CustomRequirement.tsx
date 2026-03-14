import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft, Upload, MessageCircle, User, CheckCircle2 } from "lucide-react";
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

const TOTAL_STEPS = 5;

export default function CustomRequirement() {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentStep, setCurrentStep] = useState(1);

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

  useEffect(() => {
    setReferenceImageRef(getStoredAIQuoteRef());
  }, [currentStep]);

  const subTypes = serviceSlug ? subTypesByService[serviceSlug] ?? [] : [];
  const price = tierId ? getPriceForTier(tierId) : null;

  const toggleTech = (id: string) => {
    setTechIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const canGoNext = () => {
    if (currentStep === 1) {
      if (!name.trim()) return false;
      if (!email.trim()) return false;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) return false;
      return true;
    }
    if (currentStep === 2) return !!serviceSlug;
    if (currentStep === 3) return true;
    return true;
  };

  const handleNext = () => {
    if (currentStep < 4 && canGoNext()) {
      if (currentStep === 1 && !name.trim()) {
        toast.error(t("customReq.yourName") + " " + "required");
        return;
      }
      if (currentStep === 1 && !email.trim()) {
        toast.error(t("customReq.yourEmail") + " " + "required");
        return;
      }
      setCurrentStep((s) => s + 1);
    } else if (currentStep === 1) {
      if (!name.trim()) toast.error("Please enter your name.");
      else if (!email.trim()) toast.error("Please enter your email.");
      else toast.error("Please enter a valid email.");
    } else if (currentStep === 2 && !serviceSlug) {
      toast.error("Please select a service.");
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep !== 4) {
      handleNext();
      return;
    }
    if (!name.trim()) {
      toast.error("Please enter your name.");
      return;
    }
    if (!email.trim()) {
      toast.error("Please enter your email.");
      return;
    }
    if (!serviceSlug) {
      toast.error("Please select a service.");
      return;
    }
    const payload = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
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
      setCurrentStep(5);
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
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setStoredAIQuoteRef(null);
    setReferenceImageRef(null);
    setCurrentStep(1);
  };

  const stepTitles = [
    t("customReq.step1Title"),
    t("customReq.step2Title"),
    t("customReq.step3Title"),
    t("customReq.step4Title"),
    t("customReq.step5Title"),
  ];

  return (
    <PageLayout
      seo={{
        title: "Get a Quote | Custom Requirement",
        description:
          "Submit your project requirement. Choose service, technology, and get an instant price estimate. vebx.run custom quote form.",
        canonicalPath: "/custom-requirement",
      }}
    >
      <section className="py-24 relative overflow-hidden page-banner-glow">
        <div className="absolute inset-0">
          <img src="/services/software-development.png" alt="" className="w-full h-full object-cover opacity-45" aria-hidden />
          <div className="absolute inset-0 bg-background/65" />
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
            {t("customReq.heading")}{" "}
            <span className="text-gradient-red">{t("customReq.headingHighlight")}</span>
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
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-1 sm:gap-2 mb-12">
            {stepTitles.map((title, i) => (
              <div key={i} className="flex items-center">
                <div
                  className={cn(
                    "flex flex-col items-center",
                    currentStep > i + 1 && "opacity-60"
                  )}
                >
                  <div
                    className={cn(
                      "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-display font-semibold transition-colors",
                      currentStep === i + 1
                        ? "bg-primary text-primary-foreground"
                        : currentStep > i + 1
                          ? "bg-primary/80 text-primary-foreground"
                          : "bg-secondary border border-border text-muted-foreground"
                    )}
                  >
                    {currentStep > i + 1 ? "✓" : i + 1}
                  </div>
                  <span className="hidden sm:block text-xs mt-2 text-muted-foreground max-w-[5rem] text-center truncate">
                    {title}
                  </span>
                </div>
                {i < TOTAL_STEPS - 1 && (
                  <div
                    className={cn(
                      "w-4 sm:w-12 h-0.5 mx-0.5 sm:mx-1 rounded",
                      currentStep > i + 1 ? "bg-primary/60" : "bg-border"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground mb-10">
            {t("customReq.stepOf", { current: currentStep, total: TOTAL_STEPS })}
          </p>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="liquid-glass rounded-2xl border-glow p-8 md:p-12"
          >
            <AnimatePresence mode="wait">
              {/* Step 1: Name, Email, Phone */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-8"
                >
                  <div className="flex items-center gap-3 mb-8">
                    <User className="w-6 h-6 text-primary shrink-0" />
                    <h2 className="font-display text-xl font-semibold text-foreground">
                      {t("customReq.step1Title")}
                    </h2>
                  </div>
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
                    <Label htmlFor="phone" className="text-foreground">{t("customReq.yourPhone")}</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={t("customReq.phonePlaceholder")}
                      className="bg-secondary/50 border-border h-12"
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 2: Service + Sub-type */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-8"
                >
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
                </motion.div>
              )}

              {/* Step 3: Technologies + Tier + Price */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-8"
                >
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
                      <span className="text-sm text-muted-foreground block mb-1">
                        {t("customReq.priceLabel")}
                      </span>
                      {price != null ? (
                        <span className="text-2xl font-display font-bold text-gradient-red">
                          ${price.toLocaleString()}
                          <span className="text-sm font-normal text-muted-foreground ml-1">
                            {t("customReq.perProject")}
                          </span>
                        </span>
                      ) : (
                        <span className="text-lg font-display font-bold text-primary">
                          {t("customReq.priceCustom")}
                        </span>
                      )}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Step 4: Reference + Submit */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-8"
                >
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
                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                      {t("customReq.referenceImageHint")}
                    </p>
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
                </motion.div>
              )}

              {/* Step 5: Thank You */}
              {currentStep === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="py-8 md:py-12 text-center space-y-8"
                >
                  <div className="flex justify-center">
                    <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                      <CheckCircle2 className="w-12 h-12 text-primary" />
                    </div>
                  </div>
                  <div className="space-y-4 max-w-md mx-auto">
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                      {t("customReq.thankYouTitle")}
                    </h2>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      {t("customReq.thankYouMessage")}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Link to="/">
                      <Button variant="hero" size="lg" className="gap-2 min-w-[180px]">
                        {t("customReq.backToHome")}
                        <ArrowRight className="w-5 h-5 rtl:rotate-180" />
                      </Button>
                    </Link>
                    <Button
                      type="button"
                      variant="glass"
                      size="lg"
                      className="gap-2 min-w-[180px]"
                      onClick={resetForm}
                    >
                      {t("customReq.submitAnother")}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step actions - hidden on thank you step */}
            {currentStep !== 5 && (
            <div className="flex flex-col sm:flex-row gap-4 mt-10 pt-8 border-t border-border">
              {currentStep > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="gap-2 order-2 sm:order-1"
                  onClick={handlePrev}
                >
                  <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
                  {t("customReq.prevStep")}
                </Button>
              ) : (
                <div className="order-2 sm:order-1" />
              )}
              <div className="flex-1 flex flex-col sm:flex-row gap-3 order-1 sm:order-2">
                {currentStep < 4 ? (
                  <Button
                    type="button"
                    variant="hero"
                    size="lg"
                    className="flex-1 gap-2"
                    onClick={handleNext}
                  >
                    {t("customReq.nextStep")}
                    <ArrowRight className="w-5 h-5 rtl:rotate-180" />
                  </Button>
                ) : (
                  <>
                    <Button type="submit" variant="hero" size="lg" className="flex-1 gap-2" disabled={submitting}>
                      {t("customReq.developBtn")}{" "}
                      <ArrowRight className="w-5 h-5 rtl:rotate-180" />
                    </Button>
                    <Link to="/contact" className="flex-1">
                      <Button type="button" variant="glass" size="lg" className="w-full gap-2">
                        <MessageCircle className="w-5 h-5" />
                        {t("customReq.talkToTeam")}
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
            )}
          </motion.form>
        </div>
      </section>
    </PageLayout>
  );
}
