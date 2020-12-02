import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { persistStore, persistCombineReducers } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import appReducer from './appReducer';
import filesReducer from './filesReducer';
import libraryReducer from './libraryReducer';
import readerReducer from './readerReducer';
import settingsReducer from './settingsReducer';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['library', 'settings'],
};

const persistedReducer = persistCombineReducers(persistConfig, {
  app: appReducer,
  files: filesReducer,
  library: libraryReducer,
  reader: readerReducer,
  settings: settingsReducer,
});

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware({
    immutableCheck: false,
    serializableCheck: false,
  }),
});

export const persistor = persistStore(store);

export default store;
