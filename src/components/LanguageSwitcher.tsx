import { useTranslation } from "react-i18next";
import { languageNames } from "@/locales";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const current = i18n.language || "en";
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
