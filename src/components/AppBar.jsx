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
} from '../redux/readerReducer';

const AppBar = ({ route, navigation }) => {
  console.log('render Appbar', route);
  const dispatch = useDispatch();
  const ttsStatus = useSelector((state) => state.reader.status);
  const theme = useTheme();

  const [showBookNav, setShowBookNav] = useState(false);

  const book = useSelector((state) =>
    state.library.books.find((book) => book.id === state.library.activeBook)
  );

  const bookFile = useSelector((state) => state.files.bookFile);

  const [inputValue, setInputValue] = useState(
    book && String(book.bookmark.chapter + 1)
  );
  useEffect(() => setInputValue(book && String(book.bookmark.chapter + 1)), [
    book,
  ]);

  const handleGoChapter = useCallback(
    (value) => {
      let number = +value;

      if (number > 0) {
        if (number < book.chaptersList.length) {
          dispatch(goToChapter(number - 1));
          setInputValue(value);
        }
      } else {
        setInputValue('');
      }
    },
    [book]
  );

  const handlePressMenu = useCallback(() => {
    navigation.dispatch(DrawerActions.toggleDrawer());
  }, []);

  const handleToggleSpeaking = useCallback((index) => {
    dispatch(toggleSpeaking(index));
  }, []);

  return (
    <>
      <Appbar>
        <Appbar.Action icon='menu' onPress={handlePressMenu} />
        {route === 'Reader' && book && bookFile.wasRead && (
          <TouchableHighlight
            underlayColor={'rgba(0,0,0,0.1)'}
            style={styles.flex1}
            onPress={() => setShowBookNav(!showBookNav)}
          >
            <View style={styles.chapterHeader}>
              <Title
                style={[styles.title, { color: theme.colors.onPrimary }]}
                numberOfLines={2}
              >
                {book.chaptersList[book.bookmark.chapter]}
              </Title>
              <List.Icon
                icon={showBookNav ? 'chevron-up' : 'chevron-down'}
                style={styles.chapterHeaderMore}
              />
            </View>
          </TouchableHighlight>
        )}
        {route !== 'Reader' && (
          <View style={styles.routeHeader}>
            <View style={styles.row}>
              {route !== 'Books' && route !== 'Settings' && (
                <Appbar.BackAction
                  onPress={() => navigation.popToTop()}
                  color={theme.colors.onPrimary}
                />
              )}
              <Appbar.Content title={route} />
            </View>
          </View>
        )}
        <Appbar.Action
          style={styles.toggleSpeakingBtn}
          icon={ttsStatus === TTS_STATUSES.speaking ? 'pause' : 'play'}
          onPress={handleToggleSpeaking}
        />
      </Appbar>
      {showBookNav && (
        <Surface style={styles.bookNav}>
          <TextInput
            style={styles.input}
            label='go chapter'
            placeholder={inputValue}
            value={inputValue}
            onChangeText={handleGoChapter}
            keyboardType='numeric'
          />
        </Surface>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chapterHeader: {
    flex: 1,
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chapterHeaderMore: {
    position: 'absolute',
    width: '100%',
    bottom: -21,
    opacity: 0.5,
  },
  title: { marginLeft: 10, fontSize: 18, lineHeight: 20 },
  bookNav: { alignItems: 'center' },
  routeHeader: {
    flexGrow: 1,
  },
  input: {
    width: 120,
    backgroundColor: 'rgba(0,0,0,0.2)',
    fontSize: 20,
    margin: 5,
    marginLeft: 10,
  },
  toggleSpeakingBtn: { marginLeft: 'auto' },
});

export default AppBar;
// export default <View>123</View>;
