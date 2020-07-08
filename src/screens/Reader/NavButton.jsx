import React from 'react';
import { StyleSheet, TouchableHighlight, Text } from 'react-native';

/**
 * @param {Boolean} prev - it's a prev button if component receives this param, next button if not
 * @param {Function} handlePress - callback
 */
const NavButton = ({ prev, handlePress }) => {
  const styles = StyleSheet.create({
    button: {
      position: 'absolute',
      [prev ? 'left' : 'right']: 0,
      bottom: 0,
      width: 100,
      height: 80,
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.1)',
    },
    inner: { fontSize: 50, color: 'rgba(0,0,0,0.3)' },
  });

  return (
    <TouchableHighlight
      underlayColor={'rgba(0,0,0,0.5)'}
      style={styles.button}
      onPress={handlePress}
    >
      <Text style={styles.inner}>{prev ? '<' : '>'}</Text>
    </TouchableHighlight>
  );
};

export default NavButton;

/*
onPress={
        (() => {
          handlePress();
        }) && (() => console.log(prev ? 'prev' : 'next' + ' chapter'))
      }
*/
