import React from 'react';
import { Image, StyleSheet, ScrollView, View } from 'react-native';
import {
  Caption,
  Paragraph,
  Subheading,
  Surface,
  Title,
} from 'react-native-paper';
import * as Linking from 'expo-linking';

const BookInfo = ({ route }) => {
  const { book } = route.params;

  return (
    <ScrollView>
      <Surface style={styles.container}>
        <Title style={styles.title}>{book.title}</Title>
        {book.image && (
          <Image source={{ uri: book.image }} style={styles.image} />
        )}

        {book.novelupdatesPage && (
          <Caption onPress={() => Linking.openURL(book.novelupdatesPage)}>
            Novelupdates page
          </Caption>
        )}
        <Caption>Added: {Date(book.createAt)}</Caption>
        {book.bookmark && (
          <Caption>Bookmark: chapter {book.bookmark.chapter}</Caption>
        )}
        {book.chaptersList && (
          <Caption>Length: {book.chaptersList.length} chapters</Caption>
        )}

        <Subheading>Description: </Subheading>
        <Paragraph>{book.description}</Paragraph>
      </Surface>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { paddingVertical: 10, paddingHorizontal: 5 },
  title: { textAlign: 'center', marginBottom: 5 },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 5,
  },
});

export default BookInfo;
