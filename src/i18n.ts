import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { resources } from "./locales";

const STORAGE_KEY = "vebx-lang";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    supportedLngs: Object.keys(resources),
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: STORAGE_KEY,
    },
  });

const rtlLangs = ["ar", "ur", "he", "fa"];
i18n.on("languageChanged", (lng) => {
  if (typeof document !== "undefined") {
    document.documentElement.lang = lng;
    document.documentElement.dir = rtlLangs.includes(lng) ? "rtl" : "ltr";
  }
});

if (typeof document !== "undefined") {
  const lng = i18n.language;
  document.documentElement.lang = lng;
  document.documentElement.dir = rtlLangs.includes(lng) ? "rtl" : "ltr";
}

export default i18n;
