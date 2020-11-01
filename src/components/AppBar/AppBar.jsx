import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, TouchableHighlight } from 'react-native';
import { DrawerActions } from '@react-navigation/native';
import {
  Appbar,
  TextInput,
  Title,
  List,
  Surface,
  useTheme,
} from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import {
  TTS_STATUSES,
  goToChapter,
  toggleSpeaking,
} from '../../redux/readerReducer';
import ReaderTitle from './ReaderTitle';
import ReaderNavMenu from './ReaderNavMenu';

export const AppBar = ({ route, navigation, previous }) => {
  console.log(`previous: `, previous);
  const dispatch = useDispatch();
  const ttsStatus = useSelector((state) => state.reader.status);
  const theme = useTheme();

  const [showBookNav, setShowBookNav] = useState(false);

  const handlePressMenu = useCallback(() => {
    navigation.dispatch(DrawerActions.toggleDrawer());
  }, []);

  const handleToggleSpeaking = useCallback((index) => {
    dispatch(toggleSpeaking(index));
  }, []);

  const handlePressReaderTitle = useCallback(
    () => setShowBookNav(!showBookNav),
    [showBookNav]
  );

  return (
    <>
      <Appbar>
        <Appbar.Action icon='menu' onPress={handlePressMenu} />
        {previous && (
          <Appbar.BackAction
            onPress={() => navigation.popToTop()}
            color={theme.colors.onPrimary}
          />
        )}
        {route.name === 'Reader' && (
          <ReaderTitle
            onPress={handlePressReaderTitle}
            showBookNav={showBookNav}
          />
        )}
        {route.name !== 'Reader' && <Appbar.Content title={route.name} />}
        <Appbar.Action
          style={styles.toggleSpeakingBtn}
          icon={ttsStatus === TTS_STATUSES.speaking ? 'pause' : 'play'}
          onPress={handleToggleSpeaking}
        />
      </Appbar>
      {showBookNav && <ReaderNavMenu />}
    </>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeHeader: {
    flexGrow: 1,
  },
  toggleSpeakingBtn: { marginLeft: 'auto' },
});

export default AppBar;
