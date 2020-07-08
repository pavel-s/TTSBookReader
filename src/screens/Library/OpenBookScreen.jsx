/**
 * show file system entries, select book file
 */
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, FlatList } from 'react-native';
import {
  Button,
  List,
  Divider,
  Title,
  Chip,
  ActivityIndicator,
  Snackbar,
  useTheme,
} from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { readDirectory, readBookFile } from './../../redux/filesReducer';
import { parseFilePath } from './../../utils/common';
import { addBook } from './../../redux/libraryReducer';

const OpenBookScreen = ({ navigation }) => {
  const libraryBooks = useSelector((state) => state.library.books);

  const [visible, setVisible] = useState(false); //Snackbar visibility
  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const showSuccessMessage = () => {
    setSnackbarMessage('Book was added to Library');
    setVisible(true);
  };
  const showErrorMessage = (message) => {
    setSnackbarMessage(message || 'Failed to open Book');
    setVisible(true);
  };

  const bookFile = useSelector((state) => state.files.bookFile);

  const [expanded, setExpanded] = useState(false); //Storage picker state
  const handlePress = () => {
    setExpanded(!expanded);
  };

  const [storage, setStorage] = useState({
    name: 'Internal Storage',
    path: 'file:///storage/emulated/0',
  });
  const directory = useSelector((state) => state.files.directory);
  const dispatch = useDispatch();

  const pathArr = parseFilePath(directory.path.slice(storage.path.length));

  const pathChips = (
    <>
      <Chip
        mode='outlined'
        onPress={() => {
          dispatch(readDirectory(storage.path, 'root'));
        }}
      >
        root
      </Chip>
      {pathArr.map((dir, i) => (
        <Chip
          mode='outlined'
          key={i}
          onPress={() => {
            dispatch(
              readDirectory(
                storage.path + '/' + pathArr.slice(0, i + 1).join('/')
              )
            );
          }}
        >
          {dir}
        </Chip>
      ))}
    </>
  );

  const handleOpenFile = async (entry) => {
    const result = await dispatch(
      readBookFile(directory.path + '/' + entry.name, entry.name)
    );
    if (!result.error) {
      if (libraryBooks.some((book) => book.id === result.book.id)) {
        showErrorMessage('This Book already in Library');
      } else {
        await dispatch(
          addBook({
            id: result.book.id,
            title: result.book.title,
            description: result.book.description || '',
            novelupdatesPage: result.book.novelupdatesPage || '',
            image: result.book.image || null,
            createAt: Date.now(),
            bookmark: null,
            file: {
              name: entry.name,
              path: `${directory.path}/${entry.name}`,
            },
          })
        );
        showSuccessMessage();
      }
    } else {
      showErrorMessage();
    }
  };

  const renderSpinner = (
    <View style={styles.spinner}>
      <ActivityIndicator />
    </View>
  );

  if (bookFile.isFetching) {
    return renderSpinner;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button icon='arrow-left' onPress={() => navigation.goBack()} />
        <Title>Open Book</Title>
      </View>
      <Divider />

      <View>
        <List.Accordion
          title={storage.name}
          left={(props) => <List.Icon {...props} icon='folder' />}
          expanded={expanded}
          onPress={handlePress}
        >
          <List.Item title='Internal' />
          <List.Item title='External' />
        </List.Accordion>
      </View>
      <Divider />

      <View>
        <ScrollView contentContainerStyle={styles.pathChips} horizontal={true}>
          {pathChips}
        </ScrollView>
      </View>
      <Divider />

      {directory.isFetching ? (
        renderSpinner
      ) : (
        <FlatList
          data={directory.entries}
          keyExtractor={(entry) => entry.name}
          renderItem={({ item }) =>
            item.isDirectory ? (
              <List.Item
                title={item.name}
                left={(props) => <List.Icon {...props} icon='folder' />}
                onPress={() =>
                  dispatch(
                    readDirectory(`${directory.path}/${item.name}`, item.name)
                  )
                }
              />
            ) : (
              <List.Item
                title={item.name}
                onPress={() => handleOpenFile(item)}
              />
            )
          }
        />
      )}

      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        style={styles.snackbar}
        action={{ label: 'to Library', onPress: () => navigation.goBack() }}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  spinner: { flex: 1, justifyContent: 'center' },
  header: { paddingVertical: 10, flexDirection: 'row' },
  pathChips: {
    paddingVertical: 5,
  },
  snackbar: { position: 'absolute', bottom: 0 },
});

export default OpenBookScreen;
