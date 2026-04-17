import type { TFunction } from "i18next";
import type { ServiceItem } from "@/data/services";
import type { NewServiceItem } from "@/data/newServices";

type Highlight = { title: string; desc: string };

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
  return {
    title: t(`${prefix}.title`, { defaultValue: service.title }),
    shortDesc: t(`${prefix}.shortDesc`, { defaultValue: service.shortDesc }),
    longDesc: t(`${prefix}.longDesc`, { defaultValue: service.longDesc }),
    features: readFeatures(t, prefix, service.features),
    highlights: readHighlights(t, prefix, service.highlights),
  };
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
