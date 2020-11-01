import React from 'react';
import AppBar from '../AppBar/AppBar';

const withAppBar = (Component) => (props) => (
  <>
    <AppBar route={props.route} navigation={props.navigation} />
    <Component {...props} />
  </>
);

export default withAppBar;
