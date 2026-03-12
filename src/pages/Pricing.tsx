import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { servicesData } from "@/data/services";
import { cn } from "@/lib/utils";

export default function Pricing() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(servicesData[0].slug);

  const planTiers = [
    { nameKey: "pricing.starter", descKey: "pricing.starterDesc", price: "999", features: ["pricing.features.coreScope","pricing.features.responsive","pricing.features.basicSupport","pricing.features.2revisions","pricing.features.1monthSupport"], popular: false },
    { nameKey: "pricing.professional", descKey: "pricing.professionalDesc", price: "4,999", features: ["pricing.features.fullScope","pricing.features.advancedFeatures","pricing.features.apiIntegrations","pricing.features.5revisions","pricing.features.3monthsSupport","pricing.features.perfOptimization"], popular: true },
    { nameKey: "pricing.enterprise", descKey: "pricing.enterpriseDesc", price: "Custom", features: ["pricing.features.fullStack","pricing.features.dedicatedPM","pricing.features.unlimitedRevisions","pricing.features.12monthsSupport","pricing.features.cicd","pricing.features.sla"], popular: false },
  ];

  return (
    <PageLayout
      seo={{
        title: "Pricing",
        description:
          "Transparent pricing for mobile apps, web development, and digital solutions. Starter, Professional & Enterprise plans. Get a quote from vebx.run.",
        canonicalPath: "/pricing",
      }}
    >
      <section className="py-24 relative overflow-hidden">
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full bg-primary/8 blur-[120px] animate-float" />
        <div className="container relative z-10 px-4 lg:px-8 text-center">
          <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-sm font-display uppercase tracking-[0.3em] text-primary mb-4 block">{t("pricing.tag")}</motion.span>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-4xl md:text-6xl font-display font-bold mb-6">
            {t("pricing.heading")} <span className="text-gradient-red">{t("pricing.headingHighlight")}</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("pricing.desc")}</motion.p>
        </div>
      </section>
      <section className="py-16">
        <div className="container px-4 lg:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <p className="text-sm font-display uppercase tracking-wider text-muted-foreground mb-3 text-center">{t("pricing.chooseService")}</p>
            <div className="liquid-glass border-glow rounded-2xl p-3 mb-10">
              <TabsList className="w-full flex flex-wrap h-auto gap-2 p-0 bg-transparent border-0 justify-center">
                {servicesData.map((service) => (
                  <TabsTrigger key={service.slug} value={service.slug} className={cn("rounded-xl px-4 py-2.5 text-sm font-medium transition-all","data-[state=inactive]:bg-white/5 data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:bg-white/10","data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:ring-0")}>
                    {service.title}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            {servicesData.map((service) => (
              <TabsContent key={service.slug} value={service.slug} className="mt-0">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                  {planTiers.map((plan, i) => (
                    <motion.div key={plan.nameKey} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.1 }} className={cn("liquid-glass rounded-2xl p-8 border-glow relative", plan.popular && "ring-2 ring-primary scale-105")}>
                      {plan.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 gradient-red rounded-full text-xs font-display uppercase tracking-wider text-primary-foreground glow-red">{t("pricing.mostPopular")}</div>}
                      <h3 className="font-display text-xl font-bold text-foreground mb-2">{t(plan.nameKey)}</h3>
                      <p className="text-sm text-muted-foreground mb-6">{t(plan.descKey)}</p>
                      <div className="mb-8">
                        <span className="text-4xl font-display font-bold text-gradient-red">{plan.price === "Custom" ? "" : "$"}{plan.price}</span>
                        {plan.price !== "Custom" && <span className="text-muted-foreground text-sm ml-1">{t("pricing.perProject")}</span>}
                      </div>
                      <ul className="space-y-3 mb-8">
                        {plan.features.map((fKey) => (
                          <li key={fKey} className="flex items-start gap-2 text-sm text-muted-foreground"><Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />{t(fKey)}</li>
                        ))}
                      </ul>
                      <Link to="/contact"><Button variant={plan.popular ? "hero" : "glass"} className="w-full gap-2">{t("pricing.getStarted")} <ArrowRight className="w-4 h-4 rtl:rotate-180" /></Button></Link>
                    </motion.div>
                  ))}
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>
    </PageLayout>
  );
}
