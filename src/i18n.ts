import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

export const SUPPORTED_LANGUAGES = ['ko', 'en'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
export const DEFAULT_LANGUAGE: SupportedLanguage = 'ko';
export const LANGUAGE_STORAGE_KEY = 'cvLng';

const isSupportedLanguage = (lng: string | null): lng is SupportedLanguage =>
  SUPPORTED_LANGUAGES.some((supportedLng) => supportedLng === lng);

const getInitialLanguage = () => {
  if (typeof window === 'undefined') {
    return DEFAULT_LANGUAGE;
  }

  const queryParams = new URLSearchParams(window.location.search);
  const queryLanguage = queryParams.get('lng');
  if (isSupportedLanguage(queryLanguage)) {
    return queryLanguage;
  }

  const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (isSupportedLanguage(storedLanguage)) {
    return storedLanguage;
  }

  return DEFAULT_LANGUAGE;
};

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: SUPPORTED_LANGUAGES,
    fallbackLng: DEFAULT_LANGUAGE,
    lng: getInitialLanguage(),
    debug: false,
    detection: {
      order: ['querystring', 'localStorage'],
      lookupQuerystring: 'lng',
      lookupLocalStorage: LANGUAGE_STORAGE_KEY,
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
  });

export default i18n;
