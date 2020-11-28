import React from 'react';
import AppBar from './AppBar';

/**
 * AppBar wrapper for Stack Navigator 'header' option
 * @param {import('./AppBar').Props} props
 */
export const StackHeader = ({ scene, ...rest }) => (
  <AppBar route={scene.route} {...rest} />
);
