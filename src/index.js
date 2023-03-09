import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import * as serviceWorker from 'serviceWorker';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

import App from 'core/App';
import { store, persistor } from 'core/store';
import { PersistGate } from 'redux-persist/integration/react';

const root = ReactDOM.createRoot(document.getElementById('root'));

//process.env.NODE_ENV === 'production' &&
Sentry.init({
  dsn: 'https://b0f7885101784392a1db3069ccd55c90@o4504477896867840.ingest.sentry.io/4504477963059200',
  integrations: [new BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 0.3,
});

root.render(
  <React.StrictMode>
    <Provider store={store}>    
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>

);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
