import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Mail, MapPin, ArrowRight, Facebook, Twitter, Linkedin, Instagram, Youtube, Bell, Briefcase } from "lucide-react";
const logo = "/logo-main.png";
import { servicesData } from "@/data/services";

const footerSocialLinks = [
  { icon: Facebook, href: "https://www.facebook.com/share/1CWVq6YSS1/", label: "Facebook" },
  {
    icon: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    href: "https://x.com/vebxrun",
    label: "X",
  },
  { icon: Linkedin, href: "https://www.linkedin.com/company/vebxrun/", label: "LinkedIn" },
  { icon: Instagram, href: "https://www.instagram.com/vebxrun?igsh=MWJyZGV4ZHV6NHFpZw%3D%3D", label: "Instagram" },
  { icon: Youtube, href: "https://youtube.com/@vebxrun?si=O4k6SCr8Vdd-b10p", label: "YouTube" },
  {
    icon: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.612.612l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.205 0-4.247-.712-5.906-1.924l-.412-.31-2.647.888.888-2.647-.31-.412A9.935 9.935 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" />
      </svg>
    ),
    href: "https://wa.me/13438901358",
    label: "WhatsApp",
  },
  {
    icon: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.75a8.18 8.18 0 004.77 1.52V6.84a4.84 4.84 0 01-1-.15z" />
      </svg>
    ),
    href: "https://www.tiktok.com/@vebxrun?lang=en-GB",
    label: "TikTok",
  },
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
            {/* Column 1: Brand + Notifications / Working Process */}
            <div>
              <img src={logo} alt="vebxrun" className="h-10 w-auto mb-4" />
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">{t("footer.brandDesc")}</p>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Bell className="w-4 h-4 text-primary shrink-0" />
                  <span>Notifications & updates managed via dashboard</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Briefcase className="w-4 h-4 text-primary shrink-0" />
                  <span>Active projects tracked in real-time</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                  117 S Lexington Street STN 100, Harrisonville MO 64701
                </div>
              </div>
            </div>

            {/* Column 2: Quick Links */}
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

            {/* Column 3: Services */}
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

            {/* Column 4: Email Newsletter */}
            <div>
              <h4 className="font-display text-sm font-semibold uppercase tracking-wider mb-4 text-foreground">Get In Touch</h4>
              <p className="text-sm text-muted-foreground mb-4">Have a project in mind? Reach out and let's create something extraordinary.</p>
              <a href="mailto:support@vebx.run" className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors mb-3">
                <Mail className="w-4 h-4" /> support@vebx.run
              </a>
              <Link to="/contact#live-chat" className="inline-block px-6 py-3 rounded-lg gradient-red text-primary-foreground font-display text-sm uppercase tracking-wider glow-red hover:scale-105 transition-transform">{t("footer.getInTouch")}</Link>
            </div>
          </div>
        </div>

        {/* Dock-style social icons */}
        <div className="border-t border-white/10">
          <div className="container px-4 lg:px-8 py-6">
            <div className="liquid-glass rounded-2xl border-glow p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <p className="text-sm font-display uppercase tracking-wider text-muted-foreground">Follow us for updates</p>
              <div className="flex items-end gap-6">
                {footerSocialLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.label}
                      className="dock-icon liquid-glass flex items-center justify-center w-14 h-14 rounded-2xl border-glow text-muted-foreground transition-all duration-300 ease-out hover:text-primary"
                    >
                      <Icon className="w-6 h-6" />
                    </a>
                  );
                })}
              </div>
              <p className="text-sm font-display uppercase tracking-wider text-muted-foreground">Let's connect</p>
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
