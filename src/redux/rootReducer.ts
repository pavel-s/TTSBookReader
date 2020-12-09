import { persistCombineReducers } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import appReducer from './appReducer';
import filesReducer from './filesReducer';
import libraryReducer from './libraryReducer';
import readerReducer from './readerReducer';
import settingsReducer from './settingsReducer';
import booksReducer from './booksReducer';
import { createSelectorHook } from 'react-redux';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['library', 'settings', 'books'],
};

export const persistedReducer = persistCombineReducers(persistConfig, {
  app: appReducer,
  files: filesReducer,
  library: libraryReducer,
  reader: readerReducer,
  settings: settingsReducer,
  books: booksReducer,
});

export type RootState = ReturnType<typeof persistedReducer>;

export const useTypedSelector = createSelectorHook<RootState>();
