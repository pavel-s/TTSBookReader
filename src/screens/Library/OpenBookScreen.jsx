import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Button,
  List,
  Divider,
  Title,
  Chip,
  Text,
  ActivityIndicator,
  Snackbar,
} from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { readDirectory, readBookFile } from './../../redux/filesReducer';
import { parseFilePath } from './../../utils/common';

const OpenBookScreen = ({ navigation }) => {
  const [visible, setVisible] = useState(false); //Snackbar visibility
  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const showSuccessMessage = () => {
    setSnackbarMessage('Book was added to Library');
    setVisible(true);
  };
  const showErrorMessage = () => {
    setSnackbarMessage('Failed to open Book');
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
    <View style={{ flexDirection: 'row' }}>
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
    </View>
  );

  if (bookFile.isFetching) {
    return (
      <View style={styles.spinner}>
        <ActivityIndicator />
      </View>
    );
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

      <View style={styles.pathChips}>{pathChips}</View>

      <ScrollView>
        {directory.entries.map((entry, i) =>
          entry.isDirectory ? (
            <List.Item
              key={i}
              title={entry.name}
              onPress={() =>
                dispatch(
                  readDirectory(`${directory.path}/${entry.name}`, entry.name)
                )
              }
              left={(props) => <List.Icon {...props} icon='folder' />}
            />
          ) : (
            <List.Item
              key={i}
              title={entry.name}
              onPress={async () => {
                const result = await dispatch(
                  readBookFile(directory.path + '/' + entry.name, entry.name)
                );
                !result.error ? showSuccessMessage() : showErrorMessage();
              }}
            />
          )
        )}
      </ScrollView>
      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        style={styles.snackbar}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  spinner: { flex: 1, justifyContent: 'center' },
  header: { marginVertical: 10, flexDirection: 'row' },
  pathChips: { marginVertical: 5 },
  pathChipsSlash: { fontSize: 20 },
  snackbar: { position: 'absolute', bottom: 0 },
});

export default OpenBookScreen;
