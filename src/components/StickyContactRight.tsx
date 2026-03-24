import { Link } from "react-router-dom";
import { MessageCircle, Phone } from "lucide-react";

export default function StickyContactRight() {
  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-2">
      <Link
        to="/contact#live-chat"
        className="group flex items-center justify-center w-12 h-14 rounded-l-xl bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 border border-l border-white/10 border-r-0"
        aria-label="Chat / Contact"
      >
        <MessageCircle className="w-5 h-5" />
      </Link>
      <a
        href="tel:+1234567890"
        className="group flex items-center justify-center w-12 h-14 rounded-l-xl bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 border border-l border-white/10 border-r-0"
        aria-label="Call"
      >
        <Phone className="w-5 h-5" />
      </a>
      <Link
        to="/contact#live-chat"
        className="flex items-center justify-center min-h-[100px] w-12 rounded-l-xl bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground text-[10px] font-display font-semibold uppercase tracking-wider shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 border border-l border-white/10 border-r-0 py-4"
        style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
      >
        Let's Talk Live Chat
      </Link>
    </div>
  );
}
