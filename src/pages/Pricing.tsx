import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";

const plans = [
  {
    name: "Starter",
    price: "999",
    desc: "Perfect for small businesses and startups",
    features: [
      "Single page website or app",
      "Responsive design",
      "Basic SEO setup",
      "2 rounds of revisions",
      "1 month support",
    ],
    popular: false,
  },
  {
    name: "Professional",
    price: "4,999",
    desc: "Ideal for growing businesses",
    features: [
      "Multi-page website or full app",
      "Custom UI/UX design",
      "Advanced SEO & analytics",
      "API integrations",
      "5 rounds of revisions",
      "3 months support",
      "Performance optimization",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    desc: "For large-scale digital products",
    features: [
      "Full-stack custom development",
      "Dedicated project manager",
      "Enterprise architecture",
      "Unlimited revisions",
      "12 months support",
      "CI/CD & DevOps setup",
      "Priority response time",
      "SLA guarantee",
    ],
    popular: false,
  },
];

export default function Pricing() {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full bg-primary/8 blur-[120px] animate-float" />
        <div className="container relative z-10 px-4 lg:px-8 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-display uppercase tracking-[0.3em] text-primary mb-4 block"
          >
            Pricing
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl font-display font-bold mb-6"
          >
            Transparent <span className="text-gradient-red">Pricing</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Choose the plan that fits your needs. Every project is unique — contact us for a detailed quote.
          </motion.p>
        </div>
      </section>

      {/* Plans */}
      <section className="py-16">
        <div className="container px-4 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className={`liquid-glass rounded-2xl p-8 border-glow relative ${
                  plan.popular ? "ring-2 ring-primary scale-105" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 gradient-red rounded-full text-xs font-display uppercase tracking-wider text-primary-foreground glow-red">
                    Most Popular
                  </div>
                )}
                <h3 className="font-display text-xl font-bold text-foreground mb-2">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-6">{plan.desc}</p>
                <div className="mb-8">
                  <span className="text-4xl font-display font-bold text-gradient-red">
                    {plan.price === "Custom" ? "" : "$"}{plan.price}
                  </span>
                  {plan.price !== "Custom" && <span className="text-muted-foreground text-sm ml-1">/ project</span>}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/contact">
                  <Button variant={plan.popular ? "hero" : "glass"} className="w-full gap-2">
                    Get Started <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
