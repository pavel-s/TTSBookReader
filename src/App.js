import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-community/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import Library from './screens/Library/Library';
import Reader from './screens/Reader/Reader';
import Settings from './screens/Settings/Settings';
import { useSelector, useDispatch } from 'react-redux';
import withAppBar from './components/hoc/withAppBar';
import DrawerContent from './components/DrawerContent';

import {
  Provider as PaperProvider,
  DefaultTheme as PaperDefaultTheme,
  DarkTheme as PaperDarkTheme,
} from 'react-native-paper';

import { persistor } from './redux/store';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PersistGate } from 'redux-persist/integration/react';

import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import { stopSpeaking } from './redux/readerReducer';
import CallDetectorManager from 'react-native-call-detection';
import KeyEvent from 'react-native-keyevent';
import { setFontSize, toggleTheme } from './redux/settingsReducer';
import { initializeApp } from './redux/appReducer';
import ReaderNavigator from './screens/Reader/ReaderNavigator';

const PERSISTENCE_KEY = 'NAVIGATION_STATE';

const Drawer = createDrawerNavigator();

const customDarkTheme = {
  ...NavigationDarkTheme,
  ...PaperDarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    ...PaperDarkTheme.colors,
    activeParagraph: 'darkblue',
    onPrimary: 'rgba(255, 255, 255, 0.87)',
  },
};

const customDefaultTheme = {
  ...NavigationDefaultTheme,
  ...PaperDefaultTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    ...PaperDefaultTheme.colors,
    activeParagraph: 'lightblue',
    onPrimary: '#ffffff',
  },
};

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [initialState, setInitialState] = useState();
  const activeBook = useSelector((state) => state.library.activeBook);
  const ref = React.useRef(null);
  const dispatch = useDispatch();

  const isDarkTheme = useSelector((state) => state.settings.isDarkTheme);
  const theme = isDarkTheme ? customDarkTheme : customDefaultTheme;
  const fontSize = useSelector((state) => state.settings.fontSize);

  useEffect(() => {
    /**
     * Restore navigation state from AsyncStorage
     */
    const restoreState = async () => {
      try {
        if (Platform.OS !== 'web') {
          // Only restore state if there's [(no deep link) - removed] and we're not on web
          const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY);

          const state = savedStateString
            ? JSON.parse(savedStateString)
            : undefined;

          if (state !== undefined) {
            setInitialState(state);
          }
        }
      } finally {
        setIsReady(true);
      }
    };

    if (!isReady) {
      restoreState();
      dispatch(initializeApp());
    }
  }, [isReady]);

  // stop/resume speaking on phone call
  useEffect(() => {
    const callDetector = new CallDetectorManager((event) => {
      if (event === 'Disconnected' || event === 'Missed') {
        // resume
      } else if (
        event === 'Connected' ||
        event === 'Incoming' ||
        event === 'Dialing' ||
        event === 'Offhook'
      ) {
        dispatch(stopSpeaking());
      }
    }, false);

    // KeyEvent.onKeyDownListener((keyEvent) => {
    //   console.log(`onKeyDown keyCode: ${keyEvent.keyCode}`);
    //   console.log(`Action: ${keyEvent.action}`);
    //   console.log(`Key: ${keyEvent.pressedKey}`);
    // });

    return () => {
      callDetector.dispose();
      // KeyEvent.removeKeyDownListener();
    };
  }, []);

  const handleToggleTheme = () => dispatch(toggleTheme());
  const handleSetFontSize = (value) => dispatch(setFontSize(value));

  if (!isReady) {
    return (
      <View style={styles.spinner}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <PersistGate loading={null} persistor={persistor}>
      <PaperProvider theme={theme}>
        <SafeAreaProvider>
          <SafeAreaView style={styles.container}>
            <StatusBar
              style={isDarkTheme ? 'light' : 'dark'}
              backgroundColor={theme.colors.background}
            />
            <NavigationContainer
              initialState={initialState}
              onStateChange={saveNavState}
              ref={ref}
              theme={theme}
            >
              <Drawer.Navigator
                initialRouteName='Library'
                drawerContent={(props) => (
                  <DrawerContent
                    props={props}
                    isDarkTheme={isDarkTheme}
                    toggleTheme={handleToggleTheme}
                    fontSize={fontSize}
                    setFontSize={handleSetFontSize}
                  />
                )}
              >
                <Drawer.Screen name='Library' component={Library} />
                {activeBook && (
                  <Drawer.Screen name='Reader' component={ReaderNavigator} />
                  // <Drawer.Screen name='Reader' component={withAppBar(Reader)} />
                )}
                <Drawer.Screen name='Settings' component={Settings} />
              </Drawer.Navigator>
            </NavigationContainer>
          </SafeAreaView>
        </SafeAreaProvider>
      </PaperProvider>
    </PersistGate>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  spinner: { flex: 1, justifyContent: 'center' },
});

const saveNavState = (state) => {
  AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state));
};
