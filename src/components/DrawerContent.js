import React from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {
  Drawer,
  Switch,
  TouchableRipple,
  Text,
  IconButton,
} from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { syncBookmarkGet, syncBookmarkSet } from '../redux/booksReducer';

const DrawerContent = ({
  props,
  isDarkTheme,
  toggleTheme,
  fontSize,
  setFontSize,
}) => {
  const dispatch = useDispatch(syncBookmarkGet);

  const handleGetBookmark = () => {
    dispatch(syncBookmarkGet());
  };

  const handleSetBookmark = () => {
    dispatch(syncBookmarkSet());
  };

  return (
    <DrawerContentScrollView {...props}>
      <Drawer.Section>
        <DrawerItemList {...props} />
      </Drawer.Section>

      <Drawer.Section title={'Preferences'}>
        <TouchableRipple onPress={toggleTheme}>
          <View style={styles.preference}>
            <Text style={styles.text}>Dark Theme</Text>
            <View pointerEvents='none'>
              <Switch value={isDarkTheme} />
            </View>
          </View>
        </TouchableRipple>
        <View style={styles.preference}>
          <Text style={styles.text}>Font Size</Text>
          <View style={styles.fontSize}>
            <IconButton
              style={styles.text}
              icon='minus'
              onPress={() => setFontSize('decrease')}
            />
            <Text style={styles.text}>{fontSize}</Text>
            <IconButton
              style={styles.text}
              icon='plus'
              onPress={() => setFontSize('increase')}
            />
          </View>
        </View>
      </Drawer.Section>
      <Drawer.Section title='Sync'>
        <Drawer.Item
          label='Get Bookmark'
          onPress={handleGetBookmark}
          icon='cloud-download-outline'
        />
        <Drawer.Item
          label='Set Bookmark'
          onPress={handleSetBookmark}
          icon='cloud-upload-outline'
        />
      </Drawer.Section>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 15,
    paddingVertical: 15,
  },
  fontSize: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    opacity: 0.68,
  },
});

export default DrawerContent;
