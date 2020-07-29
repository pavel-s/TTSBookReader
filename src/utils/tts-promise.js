import * as Speech from 'expo-speech';

export const speak = (text, options) =>
  new Promise((resolve, reject) => {
    Speech.speak(text, {
      ...options,
      onStopped: resolve,
      onPause: resolve,
      onDone: resolve,
      // onError: resolve,
      onError: reject,
    });
  });
