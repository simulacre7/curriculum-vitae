import React from 'react';

import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';

import { AppRoutes } from './AppRoutes.tsx';

const rootElement = document.getElementById('root')!;
const app = (
  <React.StrictMode>
    <Router>
      <AppRoutes />
    </Router>
  </React.StrictMode>
);

if (rootElement.hasChildNodes()) {
  ReactDOM.hydrateRoot(rootElement, app);
} else {
  ReactDOM.createRoot(rootElement).render(app);
}
