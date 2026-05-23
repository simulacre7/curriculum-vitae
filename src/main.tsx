import React, { Suspense, lazy, useLayoutEffect } from 'react';

import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import App from './App.tsx';
import i18n, { LANGUAGE_STORAGE_KEY, SupportedLanguage } from './i18n.ts';

const BashResume = lazy(() =>
  import('./components/BashResume').then((module) => ({
    default: module.BashResume,
  }))
);

function LocalizedApp({ language }: { language: SupportedLanguage }) {
  useLayoutEffect(() => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    void i18n.changeLanguage(language);
  }, [language]);

  return <App />;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/ko" element={<LocalizedApp language="ko" />} />
        <Route path="/en" element={<LocalizedApp language="en" />} />
        <Route
          path="/bash"
          element={
            <Suspense fallback={null}>
              <BashResume />
            </Suspense>
          }
        />
        <Route
          path="/bash/ko"
          element={
            <Suspense fallback={null}>
              <BashResume routeLanguage="ko" />
            </Suspense>
          }
        />
        <Route
          path="/bash/en"
          element={
            <Suspense fallback={null}>
              <BashResume routeLanguage="en" />
            </Suspense>
          }
        />
      </Routes>
    </Router>
  </React.StrictMode>
);
