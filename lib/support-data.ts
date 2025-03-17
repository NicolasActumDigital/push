export type SupportedLanguages = "en" | "fr"

export const supportedLanguages = ["en", "fr"];

export const supportData: Record<
  SupportedLanguages,
  {
    code: string;
    countryCode: string;
    label: string;
  }
> = {
  en: {
    code: "en_GB",
    countryCode: "UK | EN",
    label: "United Kingdom"
  },
  fr: {
    code: "fr_FR",
    countryCode: "FR | FR",
    label: "France"
  }
};
