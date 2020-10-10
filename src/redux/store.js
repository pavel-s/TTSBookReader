import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import appReducer from './appReducer';
import filesReducer from './filesReducer';
import libraryReducer from './libraryReducer';
import readerReducer from './readerReducer';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['library'],
};

const rootReducer = combineReducers({
  app: appReducer,
  files: filesReducer,
  library: libraryReducer,
  reader: readerReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

function logger({ getState }) {
  return (next) => (action) => {
    // console.log('will dispatch', action.type);

    // Call the next dispatch method in the middleware chain.
    const returnValue = next(action);

    // console.log('state after dispatch', getState());

    // This will likely be the action itself, unless
    // a middleware further in chain changed it.
    return returnValue;
  };
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  persistedReducer,
  // applyMiddleware(thunk, logger)
  composeEnhancers(applyMiddleware(thunk, logger))
);

export const persistor = persistStore(store);

export default store;
