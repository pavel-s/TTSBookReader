import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { FAB } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import {
  libraryBooks,
  libraryFilter,
  librarySortMethod,
} from '../../redux/selectors';
import BookCard, { BOOK_CARD_HEIGHT } from './BookCard';
import { sortBooks } from './sort';

const BooksScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const books = useSelector(libraryBooks);
  const sortMethod = useSelector(librarySortMethod);
  const filter = useSelector(libraryFilter);

  let resultBooks;
  if (filter) {
    resultBooks = books.filter((book) =>
      book.title.toLowerCase().includes(filter.toLowerCase())
    );
    resultBooks = sortBooks(resultBooks, sortMethod);
  } else {
    resultBooks = sortBooks(books, sortMethod);
  }

  const renderCard = ({ item }) => (
    <BookCard book={item} dispatch={dispatch} navigation={navigation} />
  );

  return (
    <View style={styles.view}>
      <FAB
        icon='plus'
        onPress={() => navigation.navigate('Open Book')}
        style={styles.fab}
      />
      <FlatList
        data={resultBooks}
        renderItem={renderCard}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const keyExtractor = (item) => item.id;

const getItemLayout = (data, index) => ({
  length: BOOK_CARD_HEIGHT,
  offset: BOOK_CARD_HEIGHT * index,
  index,
});

const styles = StyleSheet.create({
  view: { flex: 1 },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  list: {
    paddingBottom: 100,
  },
});

export default React.memo(BooksScreen);
