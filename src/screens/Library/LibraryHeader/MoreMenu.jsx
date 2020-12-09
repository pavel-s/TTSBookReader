import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Appbar, Caption, Menu, useTheme } from 'react-native-paper';
import { useSelector } from 'react-redux';
import {
  librarySetSortMethod,
  setSortMethod,
  SORT_METHODS,
} from '../../../redux/libraryReducer';
import { librarySortMethod } from './../../../redux/selectors';

const MoreMenu = ({ dispatch }) => {
  const theme = useTheme();
  const sortMethod = useSelector(librarySortMethod);

  const [visible, setVisible] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const menuItems = Object.values(SORT_METHODS).map((method) => {
    const handlePress = () =>
      dispatch(
        librarySetSortMethod({
          name: method,
          ascend: method === sortMethod.name ? !sortMethod.ascend : true,
        })
      );
    return (
      <Menu.Item
        onPress={handlePress}
        title={method}
        icon={
          method !== SORT_METHODS.none && method === sortMethod.name
            ? sortMethod.ascend
              ? 'chevron-up'
              : 'chevron-down'
            : undefined
        }
        key={method}
      />
    );
  });

  return (
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      anchor={
        <Appbar.Action
          icon='dots-vertical'
          color={theme.colors.onPrimary}
          onPress={openMenu}
        />
      }
      style={styles.menu}
    >
      <Caption style={styles.menuHeader}>sort by:</Caption>
      {menuItems}
    </Menu>
  );
};

const styles = StyleSheet.create({
  menu: { width: 184 },
  menuHeader: { paddingHorizontal: 10, paddingTop: 5 },
});

export default React.memo(MoreMenu);
