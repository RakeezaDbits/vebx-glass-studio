import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const partners = [
  { name: "Hostinger", logo: "https://upload.wikimedia.org/wikipedia/commons/0/09/Hostinger_logo_purple.svg" },
  { name: "GoDaddy", logo: "https://upload.wikimedia.org/wikipedia/commons/6/6e/GoDaddy_Logo.svg" },
  { name: "Cloudflare", logo: "https://upload.wikimedia.org/wikipedia/commons/9/94/Cloudflare_Logo.png" },
  { name: "Vercel", logo: "https://assets.vercel.com/image/upload/v1588805858/repositories/vercel/logo.png" },
  { name: "AWS", logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" },
  { name: "Google Cloud", logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg" },
  { name: "DigitalOcean", logo: "https://upload.wikimedia.org/wikipedia/commons/f/ff/DigitalOcean_logo.svg" },
  { name: "Stripe", logo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" },
  { name: "Shopify", logo: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg" },
  { name: "Firebase", logo: "https://upload.wikimedia.org/wikipedia/commons/3/37/Firebase_Logo.svg" },
  { name: "MongoDB", logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/MongoDB_Logo.svg" },
  { name: "Figma", logo: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg" },
];

export default function PartnersSection() {
  const { t } = useTranslation();

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="container px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-sm font-display uppercase tracking-[0.3em] text-primary mb-3 block">
            {t("trusted.partnersTag")}
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
            {t("trusted.partnersHeading")} <span className="text-gradient-red">{t("trusted.partnersHeadingHighlight")}</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-[11px] md:text-xs leading-relaxed">
            {t("trusted.partnersDesc")}
          </p>
        </motion.div>

        {/* Infinite scroll marquee */}
        <div className="relative overflow-hidden">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-r from-background to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-l from-background to-transparent pointer-events-none" />

          <div className="partners-marquee-track flex w-max min-w-max items-center gap-16 py-6 md:gap-20">
            {[...partners, ...partners, ...partners].map((p, i) => (
              <div
                key={`${p.name}-${i}`}
                className="flex-shrink-0 flex items-center justify-center h-28 md:h-32 w-[240px] md:w-[300px] px-5 transition-all duration-500 hover:scale-110"
              >
                <img
                  src={p.logo}
                  alt={p.name}
                  className="max-h-24 md:max-h-28 max-w-[220px] md:max-w-[260px] object-contain"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    const span = document.createElement("span");
                    span.className = "text-base md:text-lg font-display font-bold text-muted-foreground whitespace-nowrap";
                    span.textContent = p.name;
                    target.parentElement?.appendChild(span);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
