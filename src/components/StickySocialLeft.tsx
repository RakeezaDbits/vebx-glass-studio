import { Facebook, Twitter, Linkedin, Instagram, Mail, Youtube, Phone } from "lucide-react";

const socialLinks = [
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Mail, href: "mailto:support@vebx.run", label: "Email" },
  { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
  { icon: Phone, href: "tel:+1234567890", label: "Phone" },
];

export default function StickySocialLeft() {
  return (
    <div className="fixed left-0 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-3 pl-2">
      {socialLinks.map((item) => {
        const Icon = item.icon;
        return (
          <a
            key={item.label}
            href={item.href}
            target={item.href.startsWith("http") ? "_blank" : undefined}
            rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
            aria-label={item.label}
            className="group flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-110 transition-all duration-300 border border-white/10"
          >
            <Icon className="w-5 h-5" />
          </a>
        );
      })}
    </div>
  );
}
