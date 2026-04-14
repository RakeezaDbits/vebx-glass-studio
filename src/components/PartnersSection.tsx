import { motion } from "framer-motion";

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
            Trusted By Industry Leaders
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
            Our <span className="text-gradient-red">Partners</span>
          </h2>
        </motion.div>

        {/* Infinite scroll marquee */}
        <div className="relative overflow-hidden">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-r from-background to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-l from-background to-transparent pointer-events-none" />

          <div className="flex animate-marquee gap-12 items-center py-6">
            {[...partners, ...partners].map((p, i) => (
              <div
                key={`${p.name}-${i}`}
                className="flex-shrink-0 flex items-center justify-center h-12 w-[140px] grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
              >
                <img
                  src={p.logo}
                  alt={p.name}
                  className="max-h-10 max-w-[120px] object-contain invert brightness-200"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback to text if logo fails
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    const span = document.createElement("span");
                    span.className = "text-sm font-display font-bold text-muted-foreground whitespace-nowrap";
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
