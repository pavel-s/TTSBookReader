import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { RadioButton, Caption, Title } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import Slider from '@react-native-community/slider';
import { setTTSOptions } from '../../redux/readerReducer';

const Settings = () => {
  const dispatch = useDispatch();

  const ttsOptions = useSelector((state) => state.reader.options);
  const setTTSOption = (option, val) =>
    dispatch(setTTSOptions({ ...ttsOptions, [option]: Math.round10(val, -1) }));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Title>TTS Options</Title>

      <ParamSlider
        param={{ name: 'Rate', value: ttsOptions.rate }}
        onComplete={(val) => setTTSOption('rate', val)}
      />
      <ParamSlider
        param={{ name: 'Pitch', value: ttsOptions.pitch }}
        onComplete={(val) => setTTSOption('pitch', val)}
      />
    </ScrollView>
  );
};

const ParamSlider = ({ param, min, max, onComplete }) => {
  const [sliderState, setSliderState] = useState(param.value);
  return (
    <View style={styles.row}>
      <Caption>{param.name}</Caption>
      <Slider
        style={{ width: 200, height: 40 }}
        value={param.value}
        step={0.1}
        minimumValue={min || 0.1}
        maximumValue={max || 5}
        minimumTrackTintColor='#FFFFFF'
        maximumTrackTintColor='#000000'
        onSlidingComplete={(val) => onComplete(val)}
        onValueChange={(val) => setSliderState(Math.round10(val, -1))}
      />
      <Caption style={styles.sliderCurrent}>{sliderState}</Caption>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: 'center',
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  sliderCurrent: { minWidth: 20 },
});

export default Settings;

/*

 const [value, setValue] = React.useState('first');

      <RadioButton.Group
        onValueChange={(value) => setValue(value)}
        value={value}
      >
        {ttsOptions.availableVoices.map((voice) => (
          <View key={voice.name}>
            <Text>{voice.name}</Text>
            <RadioButton value={voice.name} />
          </View>
        ))}

        <View>
          <Text>Second</Text>
          <RadioButton value='second' />
        </View>
      </RadioButton.Group>




*/
