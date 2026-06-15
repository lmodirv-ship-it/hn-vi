import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import ar from "./locales/ar.json";
import en from "./locales/en.json";
import fr from "./locales/fr.json";

export const SUPPORTED_LANGS = [
  { code: "ar", label: "العربية", dir: "rtl" },
  { code: "en", label: "English", dir: "ltr" },
  { code: "fr", label: "Français", dir: "ltr" },
] as const;

export type LangCode = (typeof SUPPORTED_LANGS)[number]["code"];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ar: { translation: ar },
      en: { translation: en },
      fr: { translation: fr },
    },
    fallbackLng: "ar",
    supportedLngs: SUPPORTED_LANGS.map((l) => l.code),
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "ff_lang",
    },
  });

export function applyLangSideEffects(lang: string) {
  const meta = SUPPORTED_LANGS.find((l) => l.code === lang) ?? SUPPORTED_LANGS[0];
  document.documentElement.lang = meta.code;
  document.documentElement.dir = meta.dir;
}

applyLangSideEffects(i18n.language || "ar");
i18n.on("languageChanged", applyLangSideEffects);

export default i18n;