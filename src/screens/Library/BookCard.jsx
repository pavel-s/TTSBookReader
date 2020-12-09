import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Card, Paragraph, Title } from 'react-native-paper';
import { librarySetActiveBook } from './../../redux/libraryReducer';
import { bookById } from './../../redux/selectors';
import { useSelector } from 'react-redux';

const BookCard = ({ bookId, dispatch, navigation }) => {
  const book = useSelector(bookById(bookId));
  return (
    <Card style={styles.bookCard}>
      <Card.Content style={styles.cardContent}>
        <Card.Cover source={{ uri: book.image }} style={styles.cardImage} />
        <View style={styles.cardRight}>
          <View style={styles.cardTextContent}>
            <Title style={styles.cardTitle} numberOfLines={2}>
              {book.title}
            </Title>
            <Paragraph style={styles.cardDescription} numberOfLines={3}>
              {book.description}
            </Paragraph>
          </View>

          <Card.Actions style={styles.cardActions}>
            <Button
              onPress={async () => {
                await dispatch(librarySetActiveBook(book.id));
                navigation.navigate('Reader');
              }}
            >
              Read
            </Button>
            <Button
              onPress={() => {
                navigation.navigate('Book Info', { book: book });
              }}
            >
              More
            </Button>
          </Card.Actions>
        </View>
      </Card.Content>
    </Card>
  );
};

export const BOOK_CARD_HEIGHT = 170;
const styles = StyleSheet.create({
  bookCard: {
    margin: 5,
    height: BOOK_CARD_HEIGHT,
  },
  cardContent: {
    flexDirection: 'row',
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  cardImage: {
    width: 100,
    height: 160,
  },
  cardRight: {
    flex: 1,
    justifyContent: 'space-between',
    height: 160,
  },
  cardTextContent: {
    paddingLeft: 10,
  },
  cardTitle: {
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
});

export default React.memo(BookCard);
