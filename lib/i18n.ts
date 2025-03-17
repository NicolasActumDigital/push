import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization"; 
import en from "@/locales/en.json";
import fr from "@/locales/fr.json";

// Creating a language detection plugin using expo
const languageDetector = {
  type: "languageDetector",
  async: true,
  detect: async () => {
    const lang = getLocales()[0]?.languageCode;
    return lang;
  },
  init: () => {},
  cacheUserLanguage: () => {},
};

(i18n as any)
  .use(languageDetector as any)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    resources: {
      en: { translation: en },
      fr: { translation: fr }
    },
    debug: true, 
    cache: {
      enabled: true,
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;