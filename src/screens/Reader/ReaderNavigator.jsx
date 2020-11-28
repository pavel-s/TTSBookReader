import React from 'react';
import Reader from './Reader';
import { StackHeader } from './../../components/AppBar/StackHeader';
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';
import ReaderTOC from './ReaderTOC';
import ReaderTitle from './ReaderTitle';
import ReaderNavMenu from './ReaderNavMenu';

const Stack = createStackNavigator();

const ReaderNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptions} initialRouteName='Reader'>
      <Stack.Screen
        name='Reader'
        component={Reader}
        options={readerScreenOptions}
      />
      <Stack.Screen name='Table of Contents' component={ReaderTOC} />
    </Stack.Navigator>
  );
};

const screenOptions = {
  ...TransitionPresets.SlideFromRightIOS,
  header: (props) => <StackHeader {...props} />,
};

const readerScreenOptions = {
  header: (props) => (
    <StackHeader
      {...props}
      renderTitle={() => <ReaderTitle />}
      renderAfter={() => <ReaderNavMenu />}
    />
  ),
};

export default ReaderNavigator;
