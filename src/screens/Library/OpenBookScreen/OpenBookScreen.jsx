/**
 * show file system entries, select book file
 */
import React, { useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, FlatList } from 'react-native';
import {
  List,
  Divider,
  Chip,
  ActivityIndicator,
  Snackbar,
  Surface,
} from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAndAddBook } from '../../../redux/booksReducer';
import useSnackbar from './../../../hooks/useSnackbar';
import Storages from './Storages';
import { getDirectory, setIsReading } from './../../../redux/filesReducer';
import { sortEntries } from './sortEntries';
import { useEffect } from 'react';
import {
  filesStorages,
  filesDirectory,
  filesCurrentStorage,
  filesIsReading,
} from './../../../redux/selectors';
import withFSPermission from './../../../components/hoc/withFSPermission';

const OpenBookScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const { visible, message, onDismiss, showSuccess, showError } = useSnackbar();

  const [storagesVisible, setStoragesVisible] = useState(false);
  const toggleStoragesVisible = () => setStoragesVisible((prev) => !prev);

  const isReading = useSelector(filesIsReading);

  const directory = useSelector(filesDirectory);
  const storages = useSelector(filesStorages);
  const currentStorage = useSelector(filesCurrentStorage);

  useEffect(() => {
    if (!directory || directory.storage !== currentStorage) {
      dispatch(getDirectory(storages[currentStorage]));
    }
  }, [storages, currentStorage, directory]);

  if (isReading || !directory) {
    return <ActivityIndicator style={styles.container} />;
  }

  const pathArr = directory.pathArr;

  const pathChips = pathArr.map((dir, i) => (
    <Chip
      mode='outlined'
      key={String(i)}
      onPress={() => {
        dispatch(
          getDirectory({
            path: dir.path,
            name: dir.name,
          })
        );
      }}
      onLongPress={i === 0 ? toggleStoragesVisible : null}
    >
      {dir.name}
    </Chip>
  ));

  const handleOpenFile = async (entry) => {
    dispatch(setIsReading(true));
    try {
      const {
        payload: { isUpdate },
      } = await dispatch(
        fetchAndAddBook({
          name: entry.name,
          path: directory.path + '/' + entry.name,
        })
      );
      showSuccess(isUpdate && 'Book was updated from file.');
    } catch (error) {
      showError(error.message);
    } finally {
      dispatch(setIsReading(false));
    }
  };

  const handlePressDirectory = async (item) => {
    try {
      await dispatch(
        getDirectory({
          path: `${directory.path}/${item.name}`,
          name: item.name,
        })
      );
    } catch (error) {
      showError(error.message);
    }
  };

  const entries = sortEntries(directory.children);

  const renderItem = ({ item }) =>
    item.isDirectory ? (
      <List.Item
        title={item.name}
        left={(props) => <List.Icon {...props} icon='folder' />}
        onPress={() => handlePressDirectory(item)}
      />
    ) : (
      <List.Item title={item.name} onPress={() => handleOpenFile(item)} />
    );

  return (
    <View style={styles.container}>
      {storagesVisible && <Storages />}
      <Divider />

      <Surface>
        <ScrollView contentContainerStyle={styles.pathChips} horizontal={true}>
          {pathChips}
        </ScrollView>
      </Surface>
      <Divider />

      <Surface style={styles.container}>
        {directory.isFetching ? (
          renderSpinner
        ) : (
          <FlatList
            data={entries}
            keyExtractor={(entry) => entry.name}
            renderItem={renderItem}
          />
        )}
      </Surface>

      <Snackbar
        visible={visible}
        onDismiss={onDismiss}
        style={styles.snackbar}
        action={{ label: 'to Library', onPress: () => navigation.goBack() }}
      >
        {message}
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

export default React.memo(withFSPermission(OpenBookScreen));
