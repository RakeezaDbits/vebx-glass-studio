import { Link } from "react-router-dom";
import { Phone, MessageCircle } from "lucide-react";

export default function HeroBelowSection() {
  return (
    <section className="relative py-8 border-t border-white/5">
      <div className="container px-4 lg:px-8">
        {/* Contact bar – Message, Call, Let's Build */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/contact"
            className="liquid-glass flex items-center gap-2 px-5 py-3 rounded-xl border-glow text-sm font-medium text-muted-foreground hover:text-primary hover:bg-white/[0.08] transition-all duration-300"
            aria-label="Message / Contact"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Message</span>
          </Link>
          <a
            href="tel:+1234567890"
            className="liquid-glass flex items-center gap-2 px-5 py-3 rounded-xl border-glow text-sm font-medium text-muted-foreground hover:text-primary hover:bg-white/[0.08] transition-all duration-300"
            aria-label="Call"
          >
            <Phone className="w-5 h-5" />
            <span>Call</span>
          </a>
          <Link
            to="/contact"
            className="liquid-glass flex items-center gap-2 px-6 py-3 rounded-xl border-glow gradient-red text-sm font-display font-semibold uppercase tracking-wider text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Let's Build Website
          </Link>
        </div>
      </div>
    </section>
  );
}
