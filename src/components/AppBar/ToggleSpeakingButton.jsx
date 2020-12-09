import React from 'react';
import { StyleSheet } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { stopSpeaking, speakFrom } from './../../redux/readerReducer';
import { libraryActiveBookId, readerTtsStatus } from './../../redux/selectors';

const ToggleSpeakingButton = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const ttsStatus = useSelector(readerTtsStatus);
  const isSpeaking = ttsStatus === 'speaking';
  const hasActiveBook = useSelector(libraryActiveBookId);

  const handleToggleSpeaking = () => {
    if (isSpeaking) {
      dispatch(stopSpeaking());
    } else {
      dispatch(speakFrom());
    }
  };

  return (
    <Appbar.Action
      style={styles.toggleSpeakingBtn}
      icon={isSpeaking ? 'pause' : 'play'}
      onPress={handleToggleSpeaking}
      color={theme.colors.onPrimary}
      disabled={!hasActiveBook}
    />
  );
};

const styles = StyleSheet.create({
  toggleSpeakingBtn: { marginLeft: 'auto' },
});

export default React.memo(ToggleSpeakingButton);
