import { useTranslation } from "react-i18next";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SUPPORTED_LANGS } from "@/i18n";
import { Languages } from "lucide-react";

export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { i18n } = useTranslation();
  return (
    <Select value={i18n.language?.slice(0, 2)} onValueChange={(v) => i18n.changeLanguage(v)}>
      <SelectTrigger className={compact ? "h-9 w-[140px] glass border-white/10" : "glass border-white/10"}>
        <div className="flex items-center gap-2">
          <Languages className="h-4 w-4 text-primary" />
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent>
        {SUPPORTED_LANGS.map((l) => (
          <SelectItem key={l.code} value={l.code}>{l.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}