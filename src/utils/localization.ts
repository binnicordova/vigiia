import * as Localization from "expo-localization";

export const getLocales = () => {
    return Localization.getLocales();
};

export const getCurrentLanguage = (): string => {
    const locales = Localization.getLocales();
    return locales[0]?.languageCode ?? "es";
};
