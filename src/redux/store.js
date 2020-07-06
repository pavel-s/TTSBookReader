import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import appReducer from './appReducer';
import filesReducer from './filesReducer';

const store = createStore(
  combineReducers({ app: appReducer, files: filesReducer }),
  applyMiddleware(thunk)
);

// window.store = store;

export default store;
