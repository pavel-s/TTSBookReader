import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import appReducer from './appReducer';

const store = createStore(
  combineReducers({app: appReducer}),
  applyMiddleware(thunk),
);

// window.store = store;

export default store;
