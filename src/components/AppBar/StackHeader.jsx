import React from 'react';
import { AppBar } from './AppBar';

// AppBar wrapper for Stack Navigator 'header' option
export const StackHeader = ({ scene, previous, navigation }) => (
  <AppBar route={scene.route} navigation={navigation} previous={previous} />
);
