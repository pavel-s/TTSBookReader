import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Caption, Subheading, Title } from 'react-native-paper';
import Slider from '@react-native-community/slider';

export const ParamSlider = ({ param, min, max, onComplete }) => {
  const [sliderState, setSliderState] = useState(param.value);
  return (
    <View style={styles.row}>
      <Title style={styles.title}>{param.name}</Title>
      <Slider
        style={{ flexGrow: 1, height: 40 }}
        value={param.value}
        step={0.1}
        minimumValue={min || 0.1}
        maximumValue={max || 5}
        minimumTrackTintColor='#EEEEEE'
        maximumTrackTintColor='#000000'
        onSlidingComplete={(val) => onComplete(Math.round10(val, -1))}
        onValueChange={(val) => setSliderState(Math.round10(val, -1))}
      />
      <Caption style={styles.sliderCurrent}>{sliderState}</Caption>
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 5 },
  title: { minWidth: 70, fontSize: 16 },
  sliderCurrent: { minWidth: 20 },
});
