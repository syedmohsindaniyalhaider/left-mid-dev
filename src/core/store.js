import { configureStore } from '@reduxjs/toolkit';
import { persistStore } from 'redux-persist';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';

import reducer from './reducer';

const store = configureStore({
  reducer: reducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
}, composeWithDevTools());

const persistor = persistStore(store);

export { persistor, store };
