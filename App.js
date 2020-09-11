import 'react-native-console-time-polyfill';
import * as React from 'react';
import { Provider as StoreProvider } from 'react-redux';
import App from './src/App';
import store from './src/redux/store';

import { extendMath } from './src/utils/math';
extendMath();
import { enableScreens } from 'react-native-screens';
enableScreens();

export default function Main() {
  return (
    <StoreProvider store={store}>
      <App />
    </StoreProvider>
  );
}
