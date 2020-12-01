import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSpeaking } from '../../redux/readerReducer';
import { readerIsSpeaking } from '../../redux/selectors';

const ToggleSpeakingButton = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isSpeaking = useSelector(readerIsSpeaking);

  const handleToggleSpeaking = useCallback((index) => {
    dispatch(toggleSpeaking(index));
  }, []);

  return (
    <Appbar.Action
      style={styles.toggleSpeakingBtn}
      icon={isSpeaking ? 'pause' : 'play'}
      onPress={handleToggleSpeaking}
      color={theme.colors.onPrimary}
    />
  );
};

const styles = StyleSheet.create({
  toggleSpeakingBtn: { marginLeft: 'auto' },
});

export default React.memo(ToggleSpeakingButton);
