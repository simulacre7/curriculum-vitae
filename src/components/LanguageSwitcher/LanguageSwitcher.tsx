import { useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import * as styles from './LanguageSwitcher.styles';

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const currentLanguage = i18n.language;

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const lng = queryParams.get('lng');
    if (lng && lng !== currentLanguage) {
      i18n.changeLanguage(lng);
    }
  }, [location.search, i18n, currentLanguage]);

  const changeLanguage = (lng: string) => {
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
