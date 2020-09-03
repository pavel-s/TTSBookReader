import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { FAB, Button, List, Card, Title, Paragraph } from 'react-native-paper';
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
      <Button onPress={() => dispatch(clearLibrary())}>Clear Library</Button>
      <ScrollView style={styles.view}>
        {books.map((book) => (
          <Card key={book.id} style={styles.bookCard}>
            <Card.Cover source={{ uri: book.image }} />
            <Card.Content>
              <Title>{book.title}</Title>
              <Paragraph>{book.description}</Paragraph>
            </Card.Content>
            <Card.Actions>
              <Button
                onPress={async () => {
                  await dispatch(setActiveBook(book.id));
                  navigation.navigate('Reader');
                }}
              >
                Read
              </Button>
            </Card.Actions>
          </Card>
        ))}
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
    padding: 10,
  },
});

export default Library;
