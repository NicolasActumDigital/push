export type SupportedLanguages = "en" | "cs";

export const supportedLanguages = ["en", "cs"];

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
  cs: {
    code: "cs_CZ",
    countryCode: "CZ | CS",
    label: "Czech Republic"
  }
};
