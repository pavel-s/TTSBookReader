import * as React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as StoreProvider } from 'react-redux';
import App from './src/App';
import store from './src/redux/store';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function Main() {
  return (
    <StoreProvider store={store}>
      <PaperProvider>
        <SafeAreaProvider>
          <App />
        </SafeAreaProvider>
      </PaperProvider>
    </StoreProvider>
  );
}
