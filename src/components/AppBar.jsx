import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableHighlight } from 'react-native';
import { DrawerActions } from '@react-navigation/native';
import { Appbar, TextInput, Title, List, Surface } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { setBookmark } from '../redux/libraryReducer';
import { TTS_STATUSES, stopSpeaking, speakAll } from './../redux/readerReducer';
import { goToChapter } from './../redux/readerReducer';

const AppBar = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const ttsStatus = useSelector((state) => state.reader.status);

  const [showBookNav, setShowBookNav] = useState(false);

  const book = useSelector((state) =>
    state.library.books.find((book) => book.id === state.library.activeBook)
  );

  const bookFile = useSelector((state) => state.files.bookFile);

  const [inputValue, setInputValue] = useState(
    book && String(book.bookmark.chapter + 1)
  );
  useEffect(
    () => setInputValue(book && String(book.bookmark.chapter + 1), [book]),
    []
  );

  let chapters;
  if (book && bookFile.wasRead) {
    chapters = bookFile.json.chapters;
  }

  const handleGoChapter = (value) => {
    let number = +value;

    if (number > 0) {
      if (number < chapters.length) {
        dispatch(goToChapter(number - 1));
        setInputValue(value);
      }
    } else {
      setInputValue('');
    }
  };

  return (
    <>
      <Appbar style={{ justifyContent: 'space-between' }}>
        <Appbar.Action
          icon='menu'
          onPress={() => {
            navigation.dispatch(DrawerActions.toggleDrawer());
          }}
        />
        <View style={styles.row}>
          {route === 'Reader' && book && bookFile.wasRead && (
            <TouchableHighlight
              underlayColor={'rgba(0,0,0,0.1)'}
              style={styles.row}
              onPress={() => setShowBookNav(!showBookNav)}
            >
              <View style={styles.row}>
                <Title style={styles.title}>
                  Chapter {book.bookmark.chapter + 1}
                </Title>
                <List.Icon icon={showBookNav ? 'chevron-up' : 'chevron-down'} />
              </View>
            </TouchableHighlight>
          )}
        </View>
        <Appbar.Action
          icon={ttsStatus === TTS_STATUSES.speaking ? 'pause' : 'play'}
          onPress={
            ttsStatus === TTS_STATUSES.speaking
              ? () => dispatch(stopSpeaking())
              : () => dispatch(speakAll())
          }
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: { marginLeft: 10 },
  bookNav: { alignItems: 'center' },
  input: {
    width: 120,
    backgroundColor: 'rgba(0,0,0,0.2)',
    fontSize: 20,
    margin: 5,
    marginLeft: 10,
  },
});

export default AppBar;
