import React from 'react';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import OpenBookScreen from './OpenBookScreen';
import { useSelector } from 'react-redux';
import BooksScreen from './BooksScreen';
import BookInfo from './BookInfo';

const Stack = createNativeStackNavigator();

const Library = () => {
  const library = useSelector((state) => state.library);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName='Books'
    >
      <Stack.Screen name='Books'>
        {(props) => <BooksScreen {...props} books={library.books} />}
      </Stack.Screen>
      <Stack.Screen name='Book Info' component={BookInfo} />
      <Stack.Screen name='Open Book' component={OpenBookScreen} />
    </Stack.Navigator>
  );
};

export default Library;
