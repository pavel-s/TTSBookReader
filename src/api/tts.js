import * as Speech from 'expo-speech';
import { delay } from '../utils/common';

/**
 * Get available TTS voices
 */
export const getVoices = async () => {
  let count = 50; // number of attempts to get voices
  const interval = 100; // time interval in ms

  let result = [];

  while (!result.length || !count) {
    result = await Speech.getAvailableVoicesAsync();
    if (result.length) {
      break;
    }
    count--;
    await delay(interval);
  }

  return result;
};

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
