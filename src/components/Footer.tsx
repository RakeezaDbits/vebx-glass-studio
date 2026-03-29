import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Mail, MapPin, ArrowRight, Facebook, Twitter, Linkedin, Instagram, Youtube } from "lucide-react";
const logo = "/logo-main.png";
import { servicesData } from "@/data/services";

const footerSocialLinks = [
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
];

const quickLinks = [
  { labelKey: "linkServices", href: "/services" },
  { labelKey: "linkPricing", href: "/pricing" },
  { labelKey: "linkCustomRequirement", href: "/custom-requirement" },
  { labelKey: "linkContactUs", href: "/contact" },
  { labelKey: "linkOurWork", href: "/our-work" },
  { labelKey: "linkExpertise", href: "/expertise" },
  { labelKey: "linkAbout", href: "/about" },
  { labelKey: "linkPrivacyPolicy", href: "/privacy-policy" },
];

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="relative mt-16 overflow-hidden">
      <div className="liquid-glass border-glow border-t border-white/10">
        <div className="container px-4 lg:px-8 pt-12 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
            <div>
              <img src={logo} alt="vebxrun" className="h-10 w-auto mb-4" />
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">{t("footer.brandDesc")}</p>
              <div className="flex flex-col gap-3">
                <a href="mailto:support@vebx.run" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <Mail className="w-4 h-4" /> support@vebx.run
                </a>
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                  117 S Lexington Street STN 100, Harrisonville MO 64701
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-display text-sm font-semibold uppercase tracking-wider mb-4 text-foreground">{t("footer.quickLinks")}</h4>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link to={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300">{t(`footer.${link.labelKey}`)}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-display text-sm font-semibold uppercase tracking-wider mb-4 text-foreground">{t("footer.services")}</h4>
              <ul className="space-y-2">
                {servicesData.map((service) => (
                  <li key={service.slug}>
                    <Link to={`/services/${service.slug}`} className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300">{service.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-display text-sm font-semibold uppercase tracking-wider mb-4 text-foreground">{t("footer.letsWork")}</h4>
              <p className="text-sm text-muted-foreground mb-4">{t("footer.letsWorkDesc")}</p>
              <Link to="/contact#live-chat" className="inline-block px-6 py-3 rounded-lg gradient-red text-primary-foreground font-display text-sm uppercase tracking-wider glow-red hover:scale-105 transition-transform mb-4">{t("footer.getInTouch")}</Link>
              <div className="flex flex-wrap gap-2">
                {footerSocialLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.label}
                      className="liquid-glass flex items-center justify-center w-10 h-10 rounded-xl border-glow text-muted-foreground hover:text-primary hover:bg-white/[0.08] transition-all duration-300"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="container px-4 lg:px-8 py-6">
            <div className="liquid-glass rounded-2xl border-glow p-6 md:p-8">
              <div className="w-full flex flex-col lg:flex-row lg:items-center gap-4 justify-between">
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-1">{t("footer.stayInLoop")}</h3>
                  <p className="text-sm text-muted-foreground">{t("footer.stayInLoopDesc")}</p>
                </div>
                <form
                  className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 w-full lg:w-auto"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <input
                    type="email"
                    placeholder="you@company.com"
                    autoComplete="email"
                    className="min-w-0 flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-full sm:w-64 sm:max-w-xs"
                  />
                  <button
                    type="submit"
                    className="px-5 py-3 rounded-xl gradient-red text-primary-foreground font-display text-sm uppercase tracking-wider shrink-0 shadow-md shadow-primary/25 border border-primary/30 hover:opacity-90 transition-opacity flex items-center justify-center gap-2 w-full sm:w-auto"
                  >
                    {t("footer.subscribe")} <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 pb-8">
          <div className="container px-4 lg:px-8">
            <p className="text-xs text-muted-foreground text-center sm:text-left">
              {t("footer.copyright")} <Link to="/" className="text-primary hover:underline font-medium">{t("footer.vebexRun")}</Link>.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
