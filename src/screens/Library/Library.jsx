import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import {
  FAB,
  Button,
  List,
  Card,
  Title,
  Paragraph,
  Surface,
  Subheading,
} from 'react-native-paper';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { enableScreens } from 'react-native-screens';
import OpenBookScreen from './OpenBookScreen';
import { useSelector, useDispatch } from 'react-redux';
import {
  setActiveBook,
  clearLibrary,
  setBookmark,
} from './../../redux/libraryReducer';

// enableScreens();
const Stack = createNativeStackNavigator();

const BooksScreen = React.memo(({ navigation, books }) => {
  const dispatch = useDispatch();
  return (
    <View style={styles.view}>
      <FAB
        icon='plus'
        onPress={() => navigation.navigate('Open Book')}
        style={styles.fab}
      />
      <ScrollView style={styles.view}>
        {books.map((book) => (
          <Surface key={book.id} style={styles.bookCard} elevation={3}>
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
                    // await dispatch(setActiveBook(book.id));
                    // navigation.navigate('Reader');
                  }}
                >
                  More
                </Button>
              </Card.Actions>
            </View>
          </Surface>
        ))}
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

const Library = () => {
  // const renderBooks = books.map((book, index) => <List)
  const library = useSelector((state) => state.library);

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName='Books'
    >
      <Stack.Screen name='Books'>
        {(props) => <BooksScreen {...props} books={library.books} />}
      </Stack.Screen>
      <Stack.Screen name='Open Book' component={OpenBookScreen} />
    </Stack.Navigator>
  );
};

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

export default Library;
