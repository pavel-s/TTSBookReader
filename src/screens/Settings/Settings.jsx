import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Surface } from 'react-native-paper';
import { TransitionPresets } from '@react-navigation/stack';
import VoiceSelector from './VoiceSelector';
import { TTSSettings } from './TTSSettings';
import { createStackNavigator } from '@react-navigation/stack';
import { StackHeader } from './../../components/AppBar/StackHeader';

const Stack = createStackNavigator();

const Settings = ({ navigation }) => {
  return (
    <Surface style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <TTSSettings navigation={navigation} />
      </ScrollView>
    </Surface>
  );
};

const SettingsContainer = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        ...TransitionPresets.SlideFromRightIOS,
        header: StackHeader,
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
