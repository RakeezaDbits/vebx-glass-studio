import { servicesData } from "./services";
import { newServicesData } from "./newServices";

/** Main service options for the requirement form (core + new services) */
export interface RequirementServiceOption {
  slug: string;
  title: string;
  source: "core" | "new";
}

export const requirementServices: RequirementServiceOption[] = [
  ...servicesData.map((s) => ({ slug: s.slug, title: s.title, source: "core" as const })),
  ...newServicesData.map((s) => ({ slug: s.slug, title: s.title, source: "new" as const })),
];

/** Sub-type options shown when a main service is selected (e.g. E-commerce, Blog, Social app) */
export interface SubTypeOption {
  id: string;
  labelKey: string;
  labelEn: string;
}

/** Sub-types per service slug. Keys are service slugs; values are sub-type options. */
export const subTypesByService: Record<string, SubTypeOption[]> = {
  "mobile-application": [
    { id: "ecommerce", labelKey: "customReq.subTypes.ecommerce", labelEn: "E-commerce app" },
    { id: "social", labelKey: "customReq.subTypes.social", labelEn: "Social / community app" },
    { id: "utility", labelKey: "customReq.subTypes.utility", labelEn: "Utility / productivity" },
    { id: "enterprise", labelKey: "customReq.subTypes.enterprise", labelEn: "Enterprise / internal" },
    { id: "ondemand", labelKey: "customReq.subTypes.onDemand", labelEn: "On-demand / delivery" },
    { id: "other", labelKey: "customReq.subTypes.other", labelEn: "Other" },
  ],
  "web-cms-development": [
    { id: "ecommerce", labelKey: "customReq.subTypes.ecommerce", labelEn: "E-commerce website" },
    { id: "blog", labelKey: "customReq.subTypes.blog", labelEn: "Blog / content site" },
    { id: "corporate", labelKey: "customReq.subTypes.corporate", labelEn: "Corporate / business" },
    { id: "portfolio", labelKey: "customReq.subTypes.portfolio", labelEn: "Portfolio / showcase" },
    { id: "landing", labelKey: "customReq.subTypes.landing", labelEn: "Landing / marketing page" },
    { id: "other", labelKey: "customReq.subTypes.other", labelEn: "Other" },
  ],
  "software-development": [
    { id: "saas", labelKey: "customReq.subTypes.saas", labelEn: "SaaS product" },
    { id: "enterprise", labelKey: "customReq.subTypes.enterprise", labelEn: "Enterprise system" },
    { id: "dashboard", labelKey: "customReq.subTypes.dashboard", labelEn: "Dashboard / analytics" },
    { id: "api", labelKey: "customReq.subTypes.api", labelEn: "API / backend" },
    { id: "other", labelKey: "customReq.subTypes.other", labelEn: "Other" },
  ],
  "online-digital-marketing": [
    { id: "seo", labelKey: "customReq.subTypes.seo", labelEn: "SEO & content" },
    { id: "ppc", labelKey: "customReq.subTypes.ppc", labelEn: "PPC & paid social" },
    { id: "full", labelKey: "customReq.subTypes.fullCampaign", labelEn: "Full campaign" },
    { id: "other", labelKey: "customReq.subTypes.other", labelEn: "Other" },
  ],
  "social-media-marketing": [
    { id: "organic", labelKey: "customReq.subTypes.organic", labelEn: "Organic content" },
    { id: "paid", labelKey: "customReq.subTypes.paidSocial", labelEn: "Paid social" },
    { id: "influencer", labelKey: "customReq.subTypes.influencer", labelEn: "Influencer partnership" },
    { id: "other", labelKey: "customReq.subTypes.other", labelEn: "Other" },
  ],
};

/** All technologies we offer - frontend, backend, mobile, CMS, etc. */
export interface TechnologyOption {
  id: string;
  labelKey: string;
  labelEn: string;
  category: "frontend" | "backend" | "mobile" | "cms" | "game" | "other";
}

export const technologies: TechnologyOption[] = [
  // Frontend
  { id: "react", labelKey: "customReq.tech.react", labelEn: "React", category: "frontend" },
  { id: "vue", labelKey: "customReq.tech.vue", labelEn: "Vue.js", category: "frontend" },
  { id: "angular", labelKey: "customReq.tech.angular", labelEn: "Angular", category: "frontend" },
  { id: "next", labelKey: "customReq.tech.next", labelEn: "Next.js", category: "frontend" },
  { id: "nuxt", labelKey: "customReq.tech.nuxt", labelEn: "Nuxt", category: "frontend" },
  // Backend
  { id: "laravel", labelKey: "customReq.tech.laravel", labelEn: "Laravel (PHP)", category: "backend" },
  { id: "aspnet", labelKey: "customReq.tech.aspnet", labelEn: "ASP.NET / .NET Core", category: "backend" },
  { id: "node", labelKey: "customReq.tech.node", labelEn: "Node.js", category: "backend" },
  { id: "python", labelKey: "customReq.tech.python", labelEn: "Python (Django/FastAPI)", category: "backend" },
  { id: "java", labelKey: "customReq.tech.java", labelEn: "Java / Spring", category: "backend" },
  // CMS & Web
  { id: "wordpress", labelKey: "customReq.tech.wordpress", labelEn: "WordPress", category: "cms" },
  { id: "shopify", labelKey: "customReq.tech.shopify", labelEn: "Shopify", category: "cms" },
  { id: "headless", labelKey: "customReq.tech.headless", labelEn: "Headless CMS", category: "cms" },
  // Mobile
  { id: "flutter", labelKey: "customReq.tech.flutter", labelEn: "Flutter", category: "mobile" },
  { id: "reactnative", labelKey: "customReq.tech.reactNative", labelEn: "React Native", category: "mobile" },
  { id: "native-ios", labelKey: "customReq.tech.nativeIos", labelEn: "Native iOS (Swift)", category: "mobile" },
  { id: "native-android", labelKey: "customReq.tech.nativeAndroid", labelEn: "Native Android (Kotlin)", category: "mobile" },
  // Game & XR
  { id: "unity", labelKey: "customReq.tech.unity", labelEn: "Unity", category: "game" },
  { id: "unreal", labelKey: "customReq.tech.unreal", labelEn: "Unreal Engine", category: "game" },
  // Other
  { id: "other", labelKey: "customReq.tech.other", labelEn: "Other / Not sure", category: "other" },
];

/** Pricing tiers (aligned with Pricing page). Price in USD. */
export interface PriceTier {
  id: string;
  labelKey: string;
  price: number | null; // null = Custom
}

export const priceTiers: PriceTier[] = [
  { id: "starter", labelKey: "pricing.starter", price: 999 },
  { id: "professional", labelKey: "pricing.professional", price: 4999 },
  { id: "enterprise", labelKey: "pricing.enterprise", price: null },
];

export function getPriceForTier(tierId: string): number | null {
  const tier = priceTiers.find((t) => t.id === tierId);
  return tier ? tier.price : null;
}
