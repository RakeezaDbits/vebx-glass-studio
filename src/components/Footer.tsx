import { Link } from "react-router-dom";
import { Mail, MapPin, ArrowRight } from "lucide-react";
import logo from "@/assets/vebx-logo.png";
import { servicesData } from "@/data/services";

const quickLinks = [
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "Staff Augmentation", href: "/staff-augmentation" },
  { label: "Contact Us", href: "/contact" },
  { label: "Our Work", href: "/our-work" },
  { label: "Expertise", href: "/expertise" },
  { label: "About", href: "/about" },
  { label: "Privacy Policy", href: "/privacy-policy" },
];

const latestInsights = [
  {
    title: "Why Metaverse Development is the Next Big Leap",
    excerpt: "Exploring how immersive tech is reshaping digital experiences.",
    href: "/our-work",
  },
  {
    title: "Staff Augmentation vs Traditional Hiring",
    excerpt: "When to scale your team flexibly and why it matters.",
    href: "/staff-augmentation",
  },
  {
    title: "Building Apps That Users Actually Love",
    excerpt: "Design and development principles that drive engagement.",
    href: "/services",
  },
];

export default function Footer() {
  return (
    <footer className="relative mt-16 overflow-hidden">
      {/* Newsletter – glassy, outside footer card */}
      <div className="container px-4 lg:px-8 mb-6">
        <div className="liquid-glass rounded-2xl border-glow p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-4 justify-between">
          <div>
            <h3 className="font-display text-lg font-semibold text-foreground mb-1">Stay in the loop</h3>
            <p className="text-sm text-muted-foreground">Get insights and updates on digital innovation.</p>
          </div>
          <form
            className="flex flex-col sm:flex-row gap-2 w-full md:w-auto"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="you@company.com"
              className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-full sm:w-64"
            />
            <button
              type="submit"
              className="px-5 py-3 rounded-xl gradient-red text-primary-foreground font-display text-sm uppercase tracking-wider shrink-0 hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              Subscribe <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Latest insights – glassy, outside footer card */}
      <div className="container px-4 lg:px-8 mb-6">
        <div className="liquid-glass rounded-2xl border-glow p-6 md:p-8">
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider mb-4 text-foreground">
            Latest insights
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {latestInsights.map((item) => (
              <Link
                key={item.title}
                to={item.href}
                className="group block p-4 rounded-xl border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all duration-300"
              >
                <h5 className="font-display text-sm font-medium text-foreground group-hover:text-primary transition-colors mb-1 line-clamp-2">
                  {item.title}
                </h5>
                <p className="text-xs text-muted-foreground line-clamp-2">{item.excerpt}</p>
                <span className="inline-flex items-center gap-1 text-xs text-primary mt-2 font-medium">
                  Read more <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Footer – full width, links + copyright */}
      <div className="liquid-glass border-glow border-t border-white/10">
        <div className="container px-4 lg:px-8 pt-12 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
            {/* Brand */}
            <div>
              <img src={logo} alt="vebx.run" className="h-10 w-auto mb-4" />
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Imagine. Innovate. Inspire. We build digital experiences that transform businesses.
              </p>
              <div className="flex flex-col gap-3">
                <a
                  href="mailto:support@vebx.run"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
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
              <h4 className="font-display text-sm font-semibold uppercase tracking-wider mb-4 text-foreground">
                Quick Links
              </h4>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services – saari services, har ek detail page pe redirect */}
            <div>
              <h4 className="font-display text-sm font-semibold uppercase tracking-wider mb-4 text-foreground">
                Services
              </h4>
              <ul className="space-y-2">
                {servicesData.map((service) => (
                  <li key={service.slug}>
                    <Link
                      to={`/services/${service.slug}`}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                    >
                      {service.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div>
              <h4 className="font-display text-sm font-semibold uppercase tracking-wider mb-4 text-foreground">
                Let's Work Together
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                Ready to bring your vision to life? Reach out and let's create something extraordinary.
              </p>
              <Link
                to="/contact"
                className="inline-block px-6 py-3 rounded-lg gradient-red text-primary-foreground font-display text-sm uppercase tracking-wider glow-red hover:scale-105 transition-transform"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 pb-8">
          <div className="container px-4 lg:px-8">
            <p className="text-xs text-muted-foreground text-center">
              © {new Date().getFullYear()} vebx.run — All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
