import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { FAB } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import BookCard, { BOOK_CARD_HEIGHT } from './BookCard';

const BooksScreen = React.memo(({ navigation, books }) => {
  const dispatch = useDispatch();

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
        data={books}
        renderItem={renderCard}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
      />
    </View>
  );
});

const keyExtractor = (item, index) => 'bookCard' + index; // todo: change to item.id

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
});

export default BooksScreen;
