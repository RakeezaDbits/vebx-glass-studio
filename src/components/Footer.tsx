import { Mail, MapPin } from "lucide-react";
import logo from "@/assets/vebx-logo.png";

const quickLinks = [
  { label: "Services", href: "#services" },
  { label: "Pricing", href: "#pricing" },
  { label: "Staff Augmentation", href: "#staff" },
  { label: "Contact Us", href: "#contact" },
  { label: "Our Work", href: "#work" },
  { label: "Expertise", href: "#expertise" },
  { label: "About", href: "#about" },
  { label: "Privacy Policy", href: "#privacy" },
];

const services = [
  "Mobile Application",
  "Web CMS Development",
  "Software Development",
  "Game Development",
  "Metaverse Development",
  "Extended Reality",
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 pt-16 pb-8">
      <div className="container px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <img src={logo} alt="vebx.run" className="h-10 w-auto mb-4" />
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Imagine. Innovate. Inspire. We build digital experiences that transform businesses.
            </p>
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

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider mb-4 text-foreground">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider mb-4 text-foreground">Services</h4>
            <ul className="space-y-2">
              {services.map((s) => (
                <li key={s}>
                  <span className="text-sm text-muted-foreground">{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider mb-4 text-foreground">Let's Work Together</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Ready to bring your vision to life? Reach out and let's create something extraordinary.
            </p>
            <a
              href="mailto:support@vebx.run"
              className="inline-block px-6 py-3 rounded-lg gradient-red text-primary-foreground font-display text-sm uppercase tracking-wider glow-red hover:scale-105 transition-transform"
            >
              Get in Touch
            </a>
          </div>
        </div>

        <div className="border-t border-border pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} vebx.run — All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
