import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { FAB } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { booksFilteredSorted } from '../../redux/selectors';
import BookCard, { BOOK_CARD_HEIGHT } from './BookCard';

const BooksScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const books = useSelector(booksFilteredSorted);

  const renderCard = ({ item }) => (
    <BookCard bookId={item} dispatch={dispatch} navigation={navigation} />
  );

  return (
    <View style={styles.view}>
      <FAB
        icon='plus'
        onPress={() => navigation.navigate('Open Book')}
        style={styles.fab}
      />
      <FlatList
        data={books}
        renderItem={renderCard}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const keyExtractor = (item) => item;

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
