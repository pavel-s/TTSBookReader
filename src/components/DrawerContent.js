import React from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import {
  Divider,
  Drawer,
  Switch,
  TouchableRipple,
  Title,
  Text,
  Button,
  IconButton,
} from 'react-native-paper';
import { View, StyleSheet } from 'react-native';

const DrawerContent = ({
  props,
  isDarkTheme,
  toggleTheme,
  fontSize,
  setFontSize,
}) => {
  return (
    <DrawerContentScrollView {...props}>
      <Drawer.Section>
        <DrawerItemList {...props} />
        <DrawerItem label='Custom item' />
      </Drawer.Section>

      <Drawer.Section title={'Preferences'}>
        <TouchableRipple onPress={toggleTheme}>
          <View style={styles.preference}>
            <Text>Dark Theme</Text>
            <View pointerEvents='none'>
              <Switch value={isDarkTheme} />
            </View>
          </View>
        </TouchableRipple>
        <View style={styles.preference}>
          <Text>Font Size</Text>
          <View style={styles.fontSize}>
            <IconButton icon='minus' onPress={() => setFontSize('decrease')} />
            <Text>{fontSize}</Text>
            <IconButton icon='plus' onPress={() => setFontSize('increase')} />
          </View>
        </View>
      </Drawer.Section>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  fontSize: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default DrawerContent;
