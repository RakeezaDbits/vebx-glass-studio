import { useTranslation } from "react-i18next";
import { languageNames } from "@/locales";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function toBaseLanguageCode(lng: string | undefined): string {
  if (!lng) return "en";
  const base = lng.split("-")[0] || "en";
  return base in languageNames ? base : "en";
}

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const current = toBaseLanguageCode(i18n.resolvedLanguage || i18n.language);
  const langs = Object.keys(languageNames);

  return (
    <Select
      value={current}
      onValueChange={(value) => i18n.changeLanguage(value)}
    >
      <SelectTrigger className="h-8 w-[160px] border-white/10 bg-white/5 text-xs font-medium text-foreground">
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        {langs.map((code) => (
          <SelectItem key={code} value={code} className="text-xs">
            {languageNames[code]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
