import i18n from "i18next";
import { initReactI18next } from "react-i18next";
// Import getLocales via require to avoid TypeScript issues if necessary
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

// Use type assertions to bypass TypeScript errors
(i18n as any)
  .use(languageDetector as any)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    resources: {
      en,
      fr,
    },
    debug: false,
    cache: {
      enabled: true,
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;