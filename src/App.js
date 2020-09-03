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

const PERSISTENCE_KEY = 'NAVIGATION_STATE';

const Drawer = createDrawerNavigator();

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [initialState, setInitialState] = useState();
  const activeBook = useSelector((state) => state.library.activeBook);
  const ref = React.useRef(null);

  useEffect(() => {
    // dispatch(initTTS());
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
    }
  }, [isReady]);

  if (!isReady) {
    return (
      <View style={styles.spinner}>
        <ActivityIndicator />
      </View>
    );
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer
        initialState={initialState}
        onStateChange={(state) => {
          AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state));
        }}
        ref={ref}
      >
        <Drawer.Navigator initialRouteName='Library'>
          <Drawer.Screen name='Library' component={withAppBar(Library)} />
          {activeBook && (
            <Drawer.Screen name='Reader' component={withAppBar(Reader)} />
          )}
          <Drawer.Screen name='Settings' component={withAppBar(Settings)} />
        </Drawer.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  spinner: { flex: 1, justifyContent: 'center' },
});
