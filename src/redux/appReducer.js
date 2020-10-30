const INIT_APP_SUCCESS = 'TTSBookReader/appReducer/INIT_APP_SUCCESS';
const SET_TTS_VOICES = 'TTSBookReader/appReducer/SET_TTS_VOICES';

import { getVoices } from '../api/tts';
import { setTTSOption } from './settingsReducer';

const appReducer = (
  state = { initialized: false, other: { ttsVoices: [] } },
  { type, payload }
) => {
  switch (type) {
    case INIT_APP_SUCCESS:
      return { ...state, initialized: true };

    case SET_TTS_VOICES:
      return { ...state, other: { ...state.other, ttsVoices: payload } };

    default:
      return state;
  }
};

const initializeSuccess = () => ({ type: INIT_APP_SUCCESS });

/**
 * initialize success in any case for now
 */
export const initializeApp = () => async (dispatch) => {
  dispatch(initializeTTS());
  dispatch(initializeSuccess());
};

/**
 * get and save available tts voices, verify state.settings.tts.voice
 */
const initializeTTS = () => async (dispatch, getState) => {
  const currentTTSVoice = getState().settings.tts.voice;
  const voices = await getVoices();
  dispatch(setTTSVoices(voices)); // save array in state.app.other

  if (
    currentTTSVoice &&
    !voices.some((voice) => voice.identifier === currentTTSVoice)
  ) {
    dispatch(setTTSOption({ option: 'voice', value: null })); // reset voice when he is not exist for some reason
  }
};

export const setTTSVoices = (payload) => ({ type: SET_TTS_VOICES, payload });

export default appReducer;
