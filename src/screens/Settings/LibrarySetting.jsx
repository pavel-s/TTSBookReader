import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, Dialog, Portal, Title, Paragraph } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { bookRemovedAll } from './../../redux/booksReducer';

const LibrarySettings = () => {
  const dispatch = useDispatch();

  const [visible, setVisible] = useState(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const clear = () => {
    dispatch(bookRemovedAll());
    hideDialog();
  };

  return (
    <View>
      <Title>Library</Title>

      <Button onPress={showDialog}>Clear Library</Button>

      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Clear Library</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Clear Library? This action is permanent!</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Cancel</Button>
            <Button onPress={clear}>Clear</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

export default LibrarySettings;
