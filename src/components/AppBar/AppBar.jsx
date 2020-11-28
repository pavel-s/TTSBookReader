import React, { useCallback } from 'react';
import { DrawerActions } from '@react-navigation/native';
import { Appbar, useTheme } from 'react-native-paper';
import ToggleSpeakingButton from './ToggleSpeakingButton';

/**
 * @typedef {Object} Props
 * @property {Function=} renderTitle - function which returns React element to render instead of default title
 * @property {Function=} renderAfter - function which returns React element to render after appbar
 * @param {Props} props
 */
const AppBar = ({ route, navigation, previous, renderTitle, renderAfter }) => {
  const theme = useTheme();

  const handlePressMenu = useCallback(() => {
    navigation.dispatch(DrawerActions.toggleDrawer());
  }, []);

  return (
    <>
      <Appbar>
        <Appbar.Action icon='menu' onPress={handlePressMenu} />
        {previous && (
          <Appbar.BackAction
            onPress={() => navigation.popToTop()}
            color={theme.colors.onPrimary}
          />
        )}
        {renderTitle ? (
          renderTitle(route.name)
        ) : (
          <Appbar.Content title={route.name} />
        )}
        <ToggleSpeakingButton />
      </Appbar>
      {renderAfter && renderAfter()}
    </>
  );
};

export default AppBar;
