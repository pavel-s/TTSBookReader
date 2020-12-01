import React, { useEffect, useState } from 'react';
import {
  Title,
  Subheading,
  List,
  Text,
  TouchableRipple,
} from 'react-native-paper';
import { ParamSlider } from './ParamSlider';
import { useDispatch, useSelector } from 'react-redux';
import { setTTSOption } from './../../redux/settingsReducer';
import { Pressable, StyleSheet, View } from 'react-native';
import { settingsTts } from '../../redux/selectors';

export const TTSSettings = ({ navigation }) => {
  const dispatch = useDispatch();

  const ttsOptions = useSelector(settingsTts);
  const setOption = (option, value) =>
    dispatch(setTTSOption({ option, value }));

  const navToVoices = () => navigation.navigate('Voices');

  return (
    <List.Section>
      <Title>TTS Options</Title>

      <ParamSlider
        param={{ name: 'Rate', value: ttsOptions.rate }}
        onComplete={(val) => setOption('rate', val)}
      />
      <ParamSlider
        param={{ name: 'Pitch', value: ttsOptions.pitch }}
        onComplete={(val) => setOption('pitch', val)}
      />

      <TouchableRipple onPress={navToVoices}>
        <View style={styles.paramMore}>
          <Title style={styles.title}>Voice</Title>
          <Text style={styles.subheading}>
            {ttsOptions.voice ? ttsOptions.voice : 'default'}
          </Text>
          <List.Icon icon='chevron-right' />
        </View>
      </TouchableRipple>
    </List.Section>
  );
};

const styles = StyleSheet.create({
  paramMore: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { minWidth: 70, fontSize: 16 },
});
