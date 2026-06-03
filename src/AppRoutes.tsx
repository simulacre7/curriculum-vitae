import { Suspense, lazy, useEffect } from 'react';

import { Global } from '@emotion/react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import App from './App';
import * as bashStyles from './components/BashResume/BashResume.styles';
import i18n, { LANGUAGE_STORAGE_KEY, SupportedLanguage } from './i18n';

const BashResume = lazy(() =>
  import('./components/BashResume').then((module) => ({
    default: module.BashResume,
  }))
);

function LocalizedApp({ language }: { language: SupportedLanguage }) {
  useEffect(() => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    void i18n.changeLanguage(language);
  }, [language]);

  return <App />;
}

function LegacyLocaleRedirect() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const queryLanguage = queryParams.get('lng');
    if (queryLanguage !== 'ko' && queryLanguage !== 'en') return;

    if (location.pathname === '/') {
      navigate(`/${queryLanguage}`, { replace: true });
      return;
    }

    if (location.pathname === '/bash') {
      navigate(`/bash/${queryLanguage}`, { replace: true });
      return;
    }

    queryParams.delete('lng');
    navigate(
      {
        pathname: location.pathname,
        search: queryParams.toString(),
        hash: location.hash,
      },
      { replace: true }
    );
  }, [location.hash, location.pathname, location.search, navigate]);

  return null;
}

function BashFallback() {
  const quickCommands = ['about', 'work', 'projects'];

  return (
    <>
      <Global styles={bashStyles.globalStyles} />
      <main css={bashStyles.screenStyle}>
        <section css={bashStyles.terminalStyle} aria-busy="true">
          <header css={bashStyles.titleBarStyle}>
            <div css={bashStyles.trafficLightsStyle} aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <div css={bashStyles.titleStyle}>kihwan.kim/bash</div>
            <nav css={bashStyles.toolbarStyle} aria-label="quick commands">
              {quickCommands.map((command) => (
                <button key={command} type="button" disabled>
                  {command}
                </button>
              ))}
            </nav>
          </header>
          <div css={bashStyles.bodyStyle}>
            <pre css={bashStyles.outputStyle} aria-live="polite">
              <div css={[bashStyles.lineStyle, bashStyles.systemStyle]}>
                mounting terminal...
              </div>
              <div css={[bashStyles.lineStyle, bashStyles.commandStyle]}>
                kihwan@cv:~$
              </div>
            </pre>
          </div>
        </section>
      </main>
    </>
  );
}

export function AppRoutes() {
  return (
    <>
      <LegacyLocaleRedirect />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/ko" element={<LocalizedApp language="ko" />} />
        <Route path="/en" element={<LocalizedApp language="en" />} />
        <Route
          path="/bash"
          element={
            <Suspense fallback={<BashFallback />}>
              <BashResume />
            </Suspense>
          }
        />
        <Route
          path="/bash/ko"
          element={
            <Suspense fallback={<BashFallback />}>
              <BashResume routeLanguage="ko" />
            </Suspense>
          }
        />
        <Route
          path="/bash/en"
          element={
            <Suspense fallback={<BashFallback />}>
              <BashResume routeLanguage="en" />
            </Suspense>
          }
        />
      </Routes>
    </>
  );
}
