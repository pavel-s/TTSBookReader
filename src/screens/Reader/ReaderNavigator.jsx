import React from 'react';
import Reader from './Reader';
import { StackHeader } from './../../components/AppBar/StackHeader';
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';
import ReaderTOC from './ReaderTOC';

const Stack = createStackNavigator();

const ReaderNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        ...TransitionPresets.SlideFromRightIOS,
        header: StackHeader,
      }}
      initialRouteName='Reader'
    >
      <Stack.Screen name='Reader' component={Reader} />
      <Stack.Screen name='Table of Contents' component={ReaderTOC} />
    </Stack.Navigator>
  );
};

export default ReaderNavigator;
