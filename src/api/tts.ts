import * as Speech from 'expo-speech';
import { delay } from '../utils/common';
import { TTSOptions } from './../redux/models';

/**
 * Get available TTS voices
 */
export const getVoices = async (): Promise<Speech.Voice[]> => {
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

export const tts = {
  speak: (text: string, options: TTSOptions) =>
    new Promise((resolve, reject) => {
      Speech.speak(text, {
        ...options,
        onStopped: () => resolve('stop'),
        onPause: () => resolve('pause'),
        onDone: () => resolve('done'),
        onError: reject,
      });
    }),
  stop: Speech.stop,
  pause: Speech.pause,
  resume: Speech.resume,
  isSpeaking: Speech.isSpeakingAsync,
};
