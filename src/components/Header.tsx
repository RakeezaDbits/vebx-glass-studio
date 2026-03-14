import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import LanguageSwitcher from "@/components/LanguageSwitcher";
const logo = "/logo-main.png";

const navItems = [
  { labelKey: "home", href: "/" },
  { labelKey: "about", href: "/about" },
  { labelKey: "services", href: "/services", showNewBadge: true },
  { labelKey: "pricing", href: "/pricing" },
  { labelKey: "customRequirement", href: "/custom-requirement" },
  { labelKey: "ourWork", href: "/our-work" },
  { labelKey: "expertise", href: "/expertise" },
];

const SCROLL_THRESHOLD = 20;

export default function Header() {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-[padding] duration-300 ${
        isScrolled ? "px-5 pt-4 pb-4 lg:px-8" : "px-4 pt-4"
      }`}
    >
      <div
        className={`container mx-auto flex items-center justify-between h-16 px-4 lg:px-8 transition-all duration-300 ${
          isScrolled
            ? "liquid-glass-strong rounded-full"
            : "bg-transparent rounded-2xl"
        }`}
      >
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="vebx.run logo" className="h-12 w-auto lg:h-14" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`px-3 py-2 text-sm hover:text-foreground transition-colors duration-300 font-medium relative group inline-flex items-center ${
                location.pathname === item.href ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {t(`nav.${item.labelKey}`)}
              {"showNewBadge" in item && item.showNewBadge && (
                <span className="absolute -top-1 -right-0.5 flex">
                  <Badge className="bg-red-600 hover:bg-red-600 text-white border-0 text-[9px] min-w-[1.25rem] h-4 px-1.5 py-0 font-bold shadow-[0_0_12px_2px_rgba(220,38,38,0.5)] animate-badge-blink">
                    {t("nav.newBadge")}
                  </Badge>
                </span>
              )}
              <span
                className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-primary transition-all duration-300 ${
                  location.pathname === item.href ? "w-3/4" : "w-0 group-hover:w-3/4"
                }`}
              />
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <LanguageSwitcher />
          <Link to="/contact">
            <Button variant="hero" size="sm">
              {t("nav.contactUs")}
            </Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`lg:hidden liquid-glass-strong border-t border-border rounded-b-2xl ${
              isScrolled ? "mx-5 lg:mx-8 rounded-b-3xl" : "mx-4"
            }`}
          >
            <nav className="flex flex-col p-4 gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 hover:text-foreground hover:bg-primary/10 rounded-lg transition-all flex items-center justify-between relative ${
                    location.pathname === item.href ? "text-foreground bg-primary/10" : "text-muted-foreground"
                  }`}
                >
                  {t(`nav.${item.labelKey}`)}
                  {"showNewBadge" in item && item.showNewBadge && (
                    <span className="absolute top-2 right-3 flex">
                      <Badge className="bg-red-600 hover:bg-red-600 text-white border-0 text-[9px] min-w-[1.25rem] h-4 px-1.5 py-0 font-bold shadow-[0_0_12px_2px_rgba(220,38,38,0.5)] animate-badge-blink">
                        {t("nav.newBadge")}
                      </Badge>
                    </span>
                  )}
                </Link>
              ))}
              <div className="px-4 pt-2">
                <LanguageSwitcher />
              </div>
              <Link to="/contact" onClick={() => setMobileOpen(false)}>
                <Button variant="hero" size="sm" className="mt-2 w-full">
                  {t("nav.contactUs")}
                </Button>
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
