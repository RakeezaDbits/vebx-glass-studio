import en from "./en.json";
import ar from "./ar.json";
import pt from "./pt.json";
import ur from "./ur.json";
import es from "./es.json";
import fr from "./fr.json";
import de from "./de.json";

export const resources = {
  en: { translation: en },
  ar: { translation: ar },
  pt: { translation: pt },
  ur: { translation: ur },
  es: { translation: es },
  fr: { translation: fr },
  de: { translation: de },
};

export const languageNames: Record<string, string> = {
  en: "English",
  ar: "العربية",
  pt: "Português",
  ur: "اردو",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
};
