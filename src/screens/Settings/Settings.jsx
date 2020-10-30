import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { RadioButton, Surface } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { TransitionPresets } from '@react-navigation/stack';
import VoiceSelector from './VoiceSelector';
import withAppBar from './../../components/hoc/withAppBar';
import { TTSSettings } from './TTSSettings';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const Settings = withAppBar(({ navigation }) => {
  return (
    <Surface style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <TTSSettings navigation={navigation} />
      </ScrollView>
    </Surface>
  );
});

const SettingsContainer = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.SlideFromRightIOS,
      }}
      initialRouteName='Settings'
    >
      <Stack.Screen name='Settings' component={Settings} />
      <Stack.Screen name='Voices' component={VoiceSelector} />
    </Stack.Navigator>
  );
};

export const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: {
    paddingHorizontal: 20,
    // alignItems: 'center',
  },
});

export default SettingsContainer;
