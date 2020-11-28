import React from 'react';
import OpenBookScreen from './OpenBookScreen';
import BooksScreen from './BooksScreen';
import BookInfo from './BookInfo';
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';
import { StackHeader } from './../../components/AppBar/StackHeader';

const Stack = createStackNavigator();

const Library = () => (
  <Stack.Navigator
    screenOptions={{
      ...TransitionPresets.SlideFromRightIOS,
      header: StackHeader,
    }}
    initialRouteName='Books'
  >
    <Stack.Screen name='Books' component={BooksScreen} />
    <Stack.Screen name='Book Info' component={BookInfo} />
    <Stack.Screen name='Open Book' component={OpenBookScreen} />
  </Stack.Navigator>
);

export default Library;
