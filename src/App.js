import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  ActivityIndicator,
  Image,
  Platform,
  Linking,
} from 'react-native';
import {
  NavigationContainer,
  useNavigation,
  DrawerActions,
} from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-community/async-storage';
import { Appbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Library from './screens/Library/Library';
import Reader from './screens/Reader/Reader';
import Settings from './screens/Settings/Settings';

const PERSISTENCE_KEY = 'NAVIGATION_STATE';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const AppBar = ({ nav }) => {
  return (
    <Appbar style={{ justifyContent: 'space-between' }}>
      <Appbar.Action
        icon='menu'
        onPress={() => {
          nav.current && nav.current.dispatch(DrawerActions.toggleDrawer());
        }}
      />
      <Appbar.Action icon='play' onPress={() => console.log('Pressed play')} />
    </Appbar>
  );
};

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [initialState, setInitialState] = useState();
  const ref = React.useRef(null);

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
    }
  }, [isReady]);

  if (!isReady) {
    return <ActivityIndicator />;
  }
  return (
    <>
      {/* <StatusBar /> */}
      <SafeAreaView />
      <AppBar nav={ref} />

      <NavigationContainer
        initialState={initialState}
        onStateChange={(state) => {
          // console.log(state);
          AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state));
        }}
        ref={ref}
      >
        <Drawer.Navigator initialRouteName='Library'>
          <Drawer.Screen name='Library' component={Library} />
          <Drawer.Screen name='Reader' component={Reader} />
          <Drawer.Screen name='Settings' component={Settings} />
        </Drawer.Navigator>
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({ block: { height: 100 } });
