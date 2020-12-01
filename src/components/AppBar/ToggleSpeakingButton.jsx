import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { TTS_STATUSES, toggleSpeaking } from '../../redux/readerReducer';

const ToggleSpeakingButton = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const ttsStatus = useSelector((state) => state.reader.status);

  const handleToggleSpeaking = useCallback((index) => {
    dispatch(toggleSpeaking(index));
  }, []);

  return (
    <Appbar.Action
      style={styles.toggleSpeakingBtn}
      icon={ttsStatus === TTS_STATUSES.speaking ? 'pause' : 'play'}
      onPress={handleToggleSpeaking}
      color={theme.colors.onPrimary}
    />
  );
};

const styles = StyleSheet.create({
  toggleSpeakingBtn: { marginLeft: 'auto' },
});

export default React.memo(ToggleSpeakingButton);
