import { motion } from "framer-motion";
import PageLayout from "@/components/PageLayout";
import MediaBlackOverlay from "@/components/MediaBlackOverlay";

const termsSections = [
  {
    title: "Acceptance of Terms",
    body:
      "By accessing or using vebxrun services, website, or digital products, you agree to these Terms & Conditions. If you do not agree with any part of these terms, please do not use our services.",
  },
  {
    title: "Services and Project Scope",
    body:
      "We provide digital services including design, development, marketing, AI solutions, and related consulting. Project scope, timelines, deliverables, and pricing are defined through proposals, invoices, or written agreements shared with the client.",
  },
  {
    title: "Payments and Refunds",
    body:
      "Clients agree to pay according to the approved quotation, package, or contract. Milestone payments may be required before work continues. Refunds are not guaranteed once work has started, but we will always aim to resolve issues fairly and professionally.",
  },
  {
    title: "Client Responsibilities",
    body:
      "Clients must provide accurate project information, timely feedback, approvals, and any required assets or access credentials. Delays in communication or approval may affect timelines and delivery schedules.",
  },
  {
    title: "Intellectual Property",
    body:
      "Unless otherwise agreed in writing, final deliverables are transferred to the client after full payment is received. vebxrun retains the right to display completed work in its portfolio or marketing materials unless a separate confidentiality agreement applies.",
  },
  {
    title: "Limitation of Liability",
    body:
      "We strive to deliver reliable, high-quality services, but we are not liable for indirect, incidental, or consequential damages arising from the use of our website, services, third-party tools, hosting providers, or integrations.",
  },
  {
    title: "Changes to These Terms",
    body:
      "We may update these Terms & Conditions from time to time. Continued use of our services or website after updates means you accept the revised terms. We recommend reviewing this page periodically for the latest version.",
  },
  {
    title: "Contact Information",
    body:
      "For any questions regarding these terms, please contact us at support@vebx.run. You can also reach us through our contact page for project-specific concerns.",
  },
];

export default function TermsConditions() {
  return (
    <PageLayout
      seo={{
        title: "Terms & Conditions",
        description:
          "Read the terms and conditions for using vebxrun services, website, and digital products.",
        canonicalPath: "/terms-and-conditions",
      }}
    >
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden -mt-16 pt-16 page-banner-glow">
        <div className="absolute inset-0">
          <img src="/banners/privacy-banner.jpg" alt="" className="w-full h-full object-cover" aria-hidden />
          <MediaBlackOverlay />
        </div>

        <div className="container relative z-10 px-4 lg:px-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="text-sm font-display uppercase tracking-[0.3em] text-primary mb-4 block">
              Legal
            </span>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
              Terms & <span className="text-gradient-red">Conditions</span>
            </h1>
            <p className="text-muted-foreground">Last updated: April 16, 2026</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="liquid-glass rounded-2xl p-8 md:p-12 border-glow prose prose-invert max-w-none"
          >
            <div className="space-y-8 text-muted-foreground leading-relaxed">
              {termsSections.map((section) => (
                <div key={section.title}>
                  <h2 className="font-display text-xl font-semibold text-foreground mb-3">{section.title}</h2>
                  <p>{section.body}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
