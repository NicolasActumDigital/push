import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import {
  SupportedLanguages,
  supportData,
  supportedLanguages,
} from "@/lib/support-data";
import { getLocales } from "expo-localization";

type LanguageStoreState = {
  language: SupportedLanguages;
  languages: SupportedLanguages[];
  setLanguage: (lang: SupportedLanguages) => void;
  setLanguages: (langs: SupportedLanguages[]) => void;
  initializeLanguage: () => void;
};

const sortLanguagesByLabel = (langs: SupportedLanguages[]) => {
  return [...langs].sort((a, b) => {
    const labelA = supportData[a]?.label || a;
    const labelB = supportData[b]?.label || b;
    return String(labelA).localeCompare(String(labelB));
  });
};

export const useLanguageStore = create<LanguageStoreState>()(
  immer((set) => ({
    language: "en" as SupportedLanguages,
    languages: [],
    setLanguage: (lang: SupportedLanguages) =>
      set((state) => {
        state.language = lang;
      }),
    setLanguages: (langs: SupportedLanguages[]) =>
      set((state) => {
        state.languages = sortLanguagesByLabel(langs);
      }),
    initializeLanguage: () => {
      const locales = getLocales();
      const languageCode = locales[0]?.languageCode ?? "en";
      const languages = Object.keys(supportData) as SupportedLanguages[];

      let language: SupportedLanguages = "en";
      if (supportedLanguages.includes(languageCode)) {
        language = languageCode as SupportedLanguages;
      }

      set((state) => {
        state.language = language;
        state.languages = sortLanguagesByLabel(languages);
      });
    },
  })),
);