import React, { Suspense, lazy } from 'react';

import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import App from './App.tsx';

const BashResume = lazy(() =>
  import('./components/BashResume').then((module) => ({
    default: module.BashResume,
  }))
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route
          path="/bash"
          element={
            <Suspense fallback={null}>
              <BashResume />
            </Suspense>
          }
        />
      </Routes>
    </Router>
  </React.StrictMode>
);
