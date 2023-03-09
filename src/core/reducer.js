import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import customizationReducer from 'global/redux/customization/reducer';
import { auth, player, assessment } from 'global/redux';

const persistConfig = {
  key: 'assessment',
  storage,
};

const persistAuthConfig = {
  key: 'auth',
  storage,
};

const persistAssessment = persistReducer(persistConfig, assessment);
const persistAuth = persistReducer(persistAuthConfig, auth);

const reducer = combineReducers({
  customization: customizationReducer,
  auth: persistAuth,
  player,
  assessment: persistAssessment,
});

export default reducer;
