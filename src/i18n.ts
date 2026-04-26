import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { languageNames, resources } from "./locales";

const STORAGE_KEY = "vebx-lang";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    supportedLngs: Object.keys(resources),
    /** Use e.g. `ur` not `ur-PK` so we always match bundled `ur.json` (avoids English fallbacks). */
    load: "languageOnly",
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: STORAGE_KEY,
    },
  });

const rtlLangs = ["ar", "ur", "he", "fa"];

function rtlBase(lng: string): boolean {
  const base = lng.split("-")[0]?.toLowerCase() ?? lng;
  return rtlLangs.includes(base);
}

i18n.on("languageChanged", (lng) => {
  if (typeof document !== "undefined") {
    document.documentElement.lang = lng;
    document.documentElement.dir = rtlBase(lng) ? "rtl" : "ltr";
  }
});

if (typeof document !== "undefined") {
  const lng = i18n.language;
  document.documentElement.lang = lng;
  document.documentElement.dir = rtlBase(lng) ? "rtl" : "ltr";
}

/** Persisted or detected codes like `ur-PK` must match bundled `ur.json`; normalize once. */
queueMicrotask(() => {
  const lng = i18n.language;
  if (!lng?.includes("-")) return;
  const base = lng.split("-")[0]?.toLowerCase();
  if (base && base !== lng && Object.prototype.hasOwnProperty.call(languageNames, base)) {
    void i18n.changeLanguage(base);
  }
});

export default i18n;
