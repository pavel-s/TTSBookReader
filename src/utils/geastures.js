import { PanResponder } from 'react-native';

export const createSwipePanResponder = (callback) => {
  return PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderRelease: (e, gestureState) => {
      console.log(gestureState);
      // callback()
    },
  });
};
