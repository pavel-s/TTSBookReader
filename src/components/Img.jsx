import React, { useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import useMounted from './../hooks/useMounted';
import { ActivityIndicator, Caption } from 'react-native-paper';
import { useTheme } from '@react-navigation/native';

const { width: screenWidth } = Dimensions.get('screen');

const initialState = { isFetching: true, error: false };

/**
 * FastImage with width = screen.width or original (if original < screen.width) and auto height.
 * Has a loading indicator and error message.
 * 300 x 300 initial size.
 * @param {Object} props
 * @param {{uri: String}} props.source
 * @param {Number} [props.screenPadding] - horizontal padding of screen
 * @param {String} [props.backgroundColor] - theme.colors.background be default
 */
const Img = ({ source, screenPadding, backgroundColor }) => {
  const theme = useTheme();
  const [state, setState] = useState(initialState);
  const isMounted = useMounted();

  const handleLoad = (e) =>
    isMounted.current &&
    e &&
    setState((state) => ({
      ...state,
      imgSize: { width: e.nativeEvent.width, height: e.nativeEvent.height },
      isFetching: false,
    }));

  const handleError = () =>
    isMounted.current &&
    setState((state) => ({
      ...state,
      isFetching: false,
      error: true,
    }));

  const maxImgWidth = screenPadding
    ? screenWidth - screenPadding * 2
    : screenWidth;

  const imgWidth = state.imgSize?.width
    ? state.imgSize.width < maxImgWidth
      ? state.imgSize.width
      : maxImgWidth
    : 300;

  const imgRatio = state.imgSize && state.imgSize.width / state.imgSize.height;

  const imgHeight = state.imgSize?.height ? imgWidth / imgRatio : 300;

  const imgStyles = {
    width: imgWidth,
    height: imgHeight,
    backgroundColor: backgroundColor || theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
  };

  return (
    <View style={containerStyles.container}>
      <FastImage
        source={source}
        style={imgStyles}
        onLoad={handleLoad}
        onError={handleError}
      >
        {state.isFetching && <ActivityIndicator />}
        {state.error && <Caption>Failed to load image</Caption>}
      </FastImage>
    </View>
  );
};

const containerStyles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'center' },
});

export default React.memo(Img);
