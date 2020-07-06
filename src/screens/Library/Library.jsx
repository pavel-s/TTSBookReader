import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FAB, Button } from 'react-native-paper';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { enableScreens } from 'react-native-screens';
import OpenBookScreen from './OpenBookScreen';

enableScreens();
const Stack = createNativeStackNavigator();

const BooksScreen = ({ navigation, books }) => {
  return (
    <View style={styles.view}>
      <FAB
        icon='plus'
        onPress={() => navigation.navigate('Open Book')}
        style={styles.fab}
      />
      <Text>Some Book</Text>
      <Text>Some Book</Text>
      <Text>Some Book</Text>
      <Text>Some Book</Text>
      <Text>Some Book</Text>
    </View>
  );
};

const Library = () => {
  // const renderBooks = books.map((book, index) => <List)
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Books' component={BooksScreen} />
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
  },
});

export default Library;
