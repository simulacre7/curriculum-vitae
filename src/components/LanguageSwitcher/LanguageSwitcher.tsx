import { useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import * as styles from './LanguageSwitcher.styles';
import {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  SupportedLanguage,
} from '../../i18n';

const isSupportedLanguage = (lng: string | null): lng is SupportedLanguage =>
  SUPPORTED_LANGUAGES.some((supportedLng) => supportedLng === lng);

const getResolvedLanguage = (lng: string | undefined): SupportedLanguage => {
  const language = lng?.split('-')[0] ?? null;
  return isSupportedLanguage(language) ? language : DEFAULT_LANGUAGE;
};

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const currentLanguage = getResolvedLanguage(
    i18n.resolvedLanguage ?? i18n.language
  );

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const lng = queryParams.get('lng');
    if (!lng) {
      document.documentElement.lang = currentLanguage;
      return;
    }

    if (!isSupportedLanguage(lng)) {
      queryParams.delete('lng');
      navigate(
        {
          search: queryParams.toString(),
        },
        { replace: true }
      );
      return;
    }

    if (lng !== currentLanguage) {
      i18n.changeLanguage(lng);
      return;
    }

    document.documentElement.lang = currentLanguage;
  }, [location.search, navigate, i18n, currentLanguage]);

  const changeLanguage = (lng: SupportedLanguage) => {
    const queryParams = new URLSearchParams(location.search);
    queryParams.set('lng', lng);
    navigate({ search: queryParams.toString() });
  };

  return (
    <div css={styles.containerStyle}>
      <a
        css={[
          styles.anchorStyle,
          currentLanguage === 'ko' && styles.selectedAnchorStyle,
        ]}
        href="?lng=ko"
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
        href="?lng=en"
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
