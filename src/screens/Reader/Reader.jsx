import React, { useEffect, useRef } from 'react';
import { View, ScrollView, StyleSheet, Image, Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { ActivityIndicator, Paragraph, Button } from 'react-native-paper';
import { readBookFile } from '../../redux/filesReducer';
import { parseChapterHtml } from './parse';
import NavButton from './NavButton';
import { setBookmark } from '../../redux/libraryReducer';

const Reader = () => {
  const book = useSelector((state) => {
    if (!state.library.activeBook) {
      return { error: true, message: 'No active Book' };
    }
    const book = state.library.books.find((book) => {
      return book.id === state.library.activeBook;
    });
    return book || { error: true, message: 'Book not found' };
  });

  const bookFile = useSelector((state) => state.files.bookFile);
  const dispatch = useDispatch();

  useEffect(() => {
    if (book && !book.error) {
      if (book.file.path !== bookFile.path || !bookFile.wasRead) {
        dispatch(readBookFile(book.file.path, book.file.name));
      }
    }
  }, [book]);

  if (!book || !bookFile.wasRead || bookFile.isFetching) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }
  if (book.error) {
    return <Text>{book.message}</Text>;
  }

  const content = parseChapterHtml(
    bookFile.json.chapters[book.bookmark.chapter].content
  );

  const elements = content.reduce((acc, item) => {
    const arr = [];
    item.before &&
      arr.push(
        <Image source={item.before} key={acc.length + arr.length + 1} />
      );
    arr.push(
      <Paragraph key={acc.length + arr.length + 1}>{item.text}</Paragraph>
    );
    item.after &&
      arr.push(<Image source={item.after} key={acc.length + arr.length + 1} />);
    return [...acc, ...arr];
  }, []);
  console.log(book.bookmark);
  const handlePressNext = () => {
    console.log('go next');

    dispatch(
      setBookmark({
        bookId: book.id,
        bookmark: { chapter: book.bookmark.chapter + 1, paragraph: 0 },
      })
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>{elements}</ScrollView>
      {book.bookmark.chapter > 0 && (
        <NavButton
          prev
          handlePress={() =>
            dispatch(
              setBookmark({
                bookId: book.id,
                bookmark: { chapter: book.bookmark.chapter - 1, paragraph: 0 },
              })
            )
          }
        />
      )}
      {book.bookmark.chapter < bookFile.json.chapters.length - 1 && (
        <NavButton handlePress={handlePressNext} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 10 },
});

export default Reader;
