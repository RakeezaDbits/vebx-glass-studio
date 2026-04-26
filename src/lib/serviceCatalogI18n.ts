import type { TFunction } from "i18next";
import type { ServiceItem } from "@/data/services";
import type { NewServiceItem } from "@/data/newServices";
import { getServiceBySlug } from "@/data/services";
import { getNewServiceBySlug } from "@/data/newServices";

type Highlight = { title: string; desc: string };

/** Maps core service slug → `services` namespace keys for title + short line (often translated per locale). */
const SERVICE_NAV_I18N: Record<string, readonly [titleKey: string, shortKey: string]> = {
  "mobile-application": ["mobileApplication", "mobileApplicationShort"],
  "web-cms-development": ["webCmsDevelopment", "webCmsDevelopmentShort"],
  "software-development": ["softwareDevelopment", "softwareDevelopmentShort"],
  "corporate-branding": ["corporateBranding", "corporateBrandingShort"],
  "online-digital-marketing": ["onlineDigitalMarketing", "onlineDigitalMarketingShort"],
  "2d-3d-animation": ["2d3dAnimation", "2d3dAnimationShort"],
  "3d-rendering-services": ["3dRenderingServices", "3dRenderingServicesShort"],
  "metaverse-development": ["metaverseDevelopment", "metaverseDevelopmentShort"],
  "game-development": ["gameDevelopment", "gameDevelopmentShort"],
  "extended-reality": ["extendedReality", "extendedRealityShort"],
  "social-media-marketing": ["socialMediaMarketing", "socialMediaMarketingShort"],
};

function readFeatures(t: TFunction, prefix: string, fallback: string[]): string[] {
  const raw = t(`${prefix}.features`, { returnObjects: true });
  if (Array.isArray(raw) && raw.length && raw.every((x) => typeof x === "string")) {
    return raw as string[];
  }
  return fallback;
}

function readHighlights(t: TFunction, prefix: string, fallback: Highlight[]): Highlight[] {
  const raw = t(`${prefix}.highlights`, { returnObjects: true });
  if (
    Array.isArray(raw) &&
    raw.length &&
    raw.every((x) => x && typeof x === "object" && "title" in x && "desc" in x)
  ) {
    return raw as Highlight[];
  }
  return fallback;
}

/** Resolved copy for a legacy /services/:slug page (falls back to data file). */
export function getTranslatedService(t: TFunction, service: ServiceItem) {
  const prefix = `serviceCatalog.${service.slug}`;
  const nav = SERVICE_NAV_I18N[service.slug];
  const catalogTitle = t(`${prefix}.title`, { defaultValue: service.title });
  const catalogShort = t(`${prefix}.shortDesc`, { defaultValue: service.shortDesc });
  return {
    title: nav
      ? t(`services.${nav[0]}`, { defaultValue: catalogTitle })
      : catalogTitle,
    shortDesc: nav
      ? t(`services.${nav[1]}`, { defaultValue: catalogShort })
      : catalogShort,
    longDesc: t(`${prefix}.longDesc`, { defaultValue: service.longDesc }),
    features: readFeatures(t, prefix, service.features),
    highlights: readHighlights(t, prefix, service.highlights),
  };
}

/** Label for quote / chat dropdowns (core + new services), from active locale. */
export function getTranslatedRequirementServiceTitle(
  t: TFunction,
  slug: string,
  source: "core" | "new",
  fallbackTitle: string,
): string {
  if (source === "core") {
    const s = getServiceBySlug(slug);
    return s ? getTranslatedService(t, s).title : fallbackTitle;
  }
  const s = getNewServiceBySlug(slug);
  return s ? getTranslatedNewService(t, s).title : fallbackTitle;
}

/** Resolved copy for a /new-services/:slug page (falls back to data file). */
export function getTranslatedNewService(t: TFunction, service: NewServiceItem) {
  const prefix = `newServiceCatalog.${service.slug}`;
  return {
    title: t(`${prefix}.title`, { defaultValue: service.title }),
    shortDesc: t(`${prefix}.shortDesc`, { defaultValue: service.shortDesc }),
    longDesc: t(`${prefix}.longDesc`, { defaultValue: service.longDesc }),
    features: readFeatures(t, prefix, service.features),
    highlights: readHighlights(t, prefix, service.highlights),
  };
}
