import React from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { Divider } from 'react-native-paper';

const DrawerContent = (props) => {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <Divider />
      <DrawerItem label='Custom item' />
    </DrawerContentScrollView>
  );
};

export default DrawerContent;
