import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableHighlight } from 'react-native';
import { DrawerActions } from '@react-navigation/native';
import { Appbar, TextInput, Title, List, Surface } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
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
  useEffect(() => setInputValue(book && String(book.bookmark.chapter + 1)), [
    book,
    book.bookmark.chapter,
  ]);

  const handleGoChapter = (value) => {
    let number = +value;

    if (number > 0) {
      if (number < book.chaptersList.length) {
        dispatch(goToChapter(number - 1));
        setInputValue(value);
      }
    } else {
      setInputValue('');
    }
  };

  return (
    <>
      <Appbar>
        <Appbar.Action
          icon='menu'
          onPress={() => {
            navigation.dispatch(DrawerActions.toggleDrawer());
          }}
        />
        {route === 'Reader' && book && bookFile.wasRead && (
          <TouchableHighlight
            underlayColor={'rgba(0,0,0,0.1)'}
            style={{ flex: 1 }}
            onPress={() => setShowBookNav(!showBookNav)}
          >
            <View style={styles.chapterHeader}>
              <Title style={styles.title} numberOfLines={2}>
                {book.chaptersList[book.bookmark.chapter]}
              </Title>
              <List.Icon
                icon={showBookNav ? 'chevron-up' : 'chevron-down'}
                style={styles.chapterHeaderMore}
              />
            </View>
          </TouchableHighlight>
        )}
        {route !== 'Reader' && route !== 'Settings' && (
          <View style={styles.routeHeader}>
            <View style={styles.row}>
              {route !== 'Books' && (
                <Appbar.BackAction onPress={() => navigation.goBack()} />
              )}
              <Appbar.Content title={route} />
            </View>
          </View>
        )}
        <Appbar.Action
          style={{ marginLeft: 'auto' }}
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
});

export default AppBar;
