import { motion } from "framer-motion";
import PageLayout from "@/components/PageLayout";

export default function PrivacyPolicy() {
  return (
    <PageLayout>
      <section className="py-24 relative">
        <div className="container px-4 lg:px-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="text-sm font-display uppercase tracking-[0.3em] text-primary mb-4 block">Legal</span>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
              Privacy <span className="text-gradient-red">Policy</span>
            </h1>
            <p className="text-muted-foreground">Last updated: March 2026</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="liquid-glass rounded-2xl p-8 md:p-12 border-glow prose prose-invert max-w-none"
          >
            <div className="space-y-8 text-muted-foreground leading-relaxed">
              <div>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">1. Information We Collect</h2>
                <p>We collect information you provide directly, such as your name, email address, and project details when you contact us or use our services. We also automatically collect certain information about your device and how you interact with our website.</p>
              </div>

              <div>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">2. How We Use Your Information</h2>
                <p>We use the information we collect to provide, maintain, and improve our services, communicate with you about projects and updates, and ensure the security of our platforms.</p>
              </div>

              <div>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">3. Information Sharing</h2>
                <p>We do not sell, trade, or rent your personal information to third parties. We may share information with trusted service providers who assist us in operating our website and conducting our business.</p>
              </div>

              <div>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">4. Data Security</h2>
                <p>We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
              </div>

              <div>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">5. Your Rights</h2>
                <p>You have the right to access, correct, or delete your personal information. You may also opt out of marketing communications at any time by contacting us at support@vebx.run.</p>
              </div>

              <div>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">6. Contact Us</h2>
                <p>If you have any questions about this Privacy Policy, please contact us at:</p>
                <p className="mt-2">
                  <strong className="text-foreground">Email:</strong> support@vebx.run<br />
                  <strong className="text-foreground">Address:</strong> 117 S Lexington Street STN 100, Harrisonville MO 64701
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
