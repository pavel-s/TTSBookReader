import React from 'react';
import AppBar from '../AppBar';

const withAppBar = (Component) => (props) => (
  <>
    <AppBar route={props.route.name} navigation={props.navigation} />
    <Component {...props} />
  </>
);

export default withAppBar;
