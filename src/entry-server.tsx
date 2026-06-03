import React from 'react';

import { renderStylesToString } from '@emotion/server';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';

import { AppRoutes } from './AppRoutes';
import i18n, { SupportedLanguage } from './i18n';

export async function render(path: string, language: SupportedLanguage) {
  await i18n.changeLanguage(language);

  return renderStylesToString(
    renderToString(
      <React.StrictMode>
        <StaticRouter location={path}>
          <AppRoutes />
        </StaticRouter>
      </React.StrictMode>
    )
  );
}
