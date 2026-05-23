import { useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import * as styles from './LanguageSwitcher.styles';
import { DEFAULT_LANGUAGE, SupportedLanguage } from '../../i18n';

const getPathLanguage = (pathname: string): SupportedLanguage | null => {
  if (pathname === '/en' || pathname.startsWith('/en/')) return 'en';
  if (pathname === '/ko' || pathname.startsWith('/ko/')) return 'ko';
  return null;
};

const getResolvedLanguage = (lng: string | undefined): SupportedLanguage => {
  const language = lng?.split('-')[0] ?? null;
  return language === 'ko' || language === 'en' ? language : DEFAULT_LANGUAGE;
};

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const currentLanguage =
    getPathLanguage(location.pathname) ??
    getResolvedLanguage(i18n.resolvedLanguage ?? i18n.language);

  useEffect(() => {
    if (i18n.language !== currentLanguage) {
      void i18n.changeLanguage(currentLanguage);
    }
    document.documentElement.lang = currentLanguage;
  }, [i18n, currentLanguage]);

  const changeLanguage = (lng: SupportedLanguage) => {
    navigate(`/${lng}`);
  };

  return (
    <div css={styles.containerStyle}>
      <a
        css={[
          styles.anchorStyle,
          currentLanguage === 'ko' && styles.selectedAnchorStyle,
        ]}
        href="/ko"
        onClick={(e) => {
          e.preventDefault();
          changeLanguage('ko');
        }}
      >
        한국어
      </a>
      <a
        css={[
          styles.anchorStyle,
          currentLanguage === 'en' && styles.selectedAnchorStyle,
        ]}
        href="/en"
        onClick={(e) => {
          e.preventDefault();
          changeLanguage('en');
        }}
      >
        English
      </a>
    </div>
  );
};
