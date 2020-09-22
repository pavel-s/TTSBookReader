import React from 'react';
import { View, ScrollView, Image, StyleSheet } from 'react-native';
import {
  FAB,
  Button,
  Card,
  Title,
  Paragraph,
  Surface,
} from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { setActiveBook, clearLibrary } from './../../redux/libraryReducer';
import withAppBar from './../../components/hoc/withAppBar';

const BooksScreen = React.memo(({ navigation, books }) => {
  const dispatch = useDispatch();

  const bookCards = books.map((book) => (
    <Surface key={book.id} style={styles.bookCard} elevation={2}>
      <Image source={{ uri: book.image }} style={styles.cardImage} />
      <View style={styles.cardRight}>
        <View style={styles.cardContent}>
          <Title style={styles.cardTitle} numberOfLines={2}>
            {book.title}
          </Title>
          <Paragraph style={styles.cardDescription} numberOfLines={2}>
            {book.description}
          </Paragraph>
        </View>

        <Card.Actions style={styles.cardActions}>
          <Button
            onPress={async () => {
              await dispatch(setActiveBook(book.id));
              navigation.navigate('Reader');
            }}
          >
            Read
          </Button>
          <Button
            onPress={async () => {
              navigation.navigate('Book Info', { book: book });
            }}
          >
            More
          </Button>
        </Card.Actions>
      </View>
    </Surface>
  ));

  return (
    <View style={styles.view}>
      <FAB
        icon='plus'
        onPress={() => navigation.navigate('Open Book')}
        style={styles.fab}
      />
      <ScrollView style={styles.view}>
        {bookCards}
        <Button
          onPress={() => dispatch(clearLibrary())}
          style={styles.clearButton}
        >
          Clear Library
        </Button>
      </ScrollView>
    </View>
  );
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
  bookCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    margin: 5,
  },
  cardImage: {
    width: 100,
    height: 100,
  },
  cardRight: {
    flex: 1,
  },
  cardContent: {
    paddingLeft: 10,
  },
  cardTitle: {
    marginVertical: 0,
    marginTop: 5,
    lineHeight: 24,
    minHeight: 24,
  },
  cardDescription: {
    marginVertical: 0,
    fontSize: 13,
  },
  cardActions: {
    justifyContent: 'space-between',
  },
  clearButton: { marginTop: 40 },
});

export default withAppBar(BooksScreen);
