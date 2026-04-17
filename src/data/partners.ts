import { cn } from "@/lib/utils";

/**
 * Partner logos in `public/partners/`.
 * `tone: "invert"` is for dark marks on our dark UI (OpenAI, GoDaddy).
 */
export const PARTNER_LOGOS = [
  { name: "Cloudflare", src: "/partners/cloudflare-logo.png" },
  { name: "Firebase", src: "/partners/firebase-logo.png" },
  { name: "Flutter", src: "/partners/flutter.png" },
  { name: "GoDaddy", src: "/partners/godaddy.png", tone: "invert" as const },
  { name: "Google Cloud", src: "/partners/google-cloud.png" },
  { name: "Hostinger", src: "/partners/hostinger.png" },
  { name: "Laravel", src: "/partners/laravel-logo.png" },
  { name: "Meta", src: "/partners/meta.png" },
  { name: "OpenAI", src: "/partners/openai.png", tone: "invert" as const },
  { name: "Payoneer", src: "/partners/payoneer.png" },
  { name: "Stripe", src: "/partners/stripe.png" },
] as const;

export function partnerLogoClass(tone: "invert" | undefined) {
  if (tone === "invert") return "brightness-0 invert";
  return "";
}

export function partnerLogoImgClass(tone: "invert" | undefined, size: "home" | "footer" = "home") {
  const base =
    size === "footer"
      ? "h-9 w-auto max-w-[min(72vw,200px)] bg-transparent object-contain object-center sm:h-10 md:max-w-[220px] lg:h-11"
      : "h-11 w-auto max-w-[min(82vw,260px)] bg-transparent object-contain object-center sm:h-12 md:max-w-[270px] lg:h-14 lg:max-w-[280px]";
  return cn(base, partnerLogoClass(tone));
}
