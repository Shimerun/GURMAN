import React from 'react';
import ReactDOM from 'react-dom/client';
// Only the subsets and weights the brand type actually uses: Unbounded 700 for display headings
// and the wordmark, Caveat 600 (Cyrillic) for the "смачно щодня" tagline.
import '@fontsource/unbounded/latin-700.css';
import '@fontsource/unbounded/cyrillic-700.css';
import '@fontsource/caveat/cyrillic-600.css';
import App from './App';
import { initAnalytics } from './lib/analytics';
import { handleSkippedViewTransitions } from './lib/viewTransitions';
import './index.css';

handleSkippedViewTransitions();
initAnalytics();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
