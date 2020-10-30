const SET_OPTIONS = 'TTSBookReader/settingsReducer/SET_OPTIONS';
const SET_OPTION = 'TTSBookReader/settingsReducer/SET_OPTION';
const SET_TTS_OPTION = 'TTSBookReader/settingsReducer/SET_TTS_OPTION';
const SET_FONT_SIZE = 'TTSBookReader/settingsReducer/SET_FONT_SIZE';
const TOGGLE_THEME = 'TTSBookReader/appReducer/TOGGLE_THEME';

/**
 * @typedef {Object} State
 * @property {TTSOptions} tts
 * @property {String} fontSize
 * @property {Boolean} isDarkTheme
 */

/**
 * @typedef {Object} TTSOptions
 * @property {Number} pitch
 * @property {Number} rate
 * @property {String} language
 * @property {String} voice
 */

/**
 * @constant
 * @type {State}
 */
const initialState = {
  tts: {
    pitch: 1,
    rate: 2.6,
    language: 'en',
    voice: null,
  },
  fontSize: 15,
  isDarkTheme: true,
};

const settingsReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_OPTIONS:
      return { ...state, options: payload };

    case SET_OPTION:
      return { ...state, options: payload };

    case SET_TTS_OPTION:
      return {
        ...state,
        tts: { ...state.tts, [payload.option]: payload.value },
      };

    case SET_FONT_SIZE:
      const newSize =
        typeof payload === 'number'
          ? payload
          : payload === 'increase'
          ? state.fontSize + 1
          : state.fontSize - 1;
      return {
        ...state,
        fontSize: newSize,
      };

    case TOGGLE_THEME:
      return { ...state, isDarkTheme: !state.isDarkTheme };

    default:
      return state;
  }
};

/**
 * Set all options at once
 * @param {State} payload
 */
export const setOptions = (payload) => ({
  type: SET_OPTIONS,
  payload,
});

/**
 * @param {*} payload - option
 */
export const setOption = (payload) => ({
  type: SET_OPTION,
  payload,
});

/**
 * @param {{option: String, value: String | Number }} payload - tts option
 */
export const setTTSOption = (payload) => ({
  type: SET_TTS_OPTION,
  payload,
});

/**
 * @param {Number | String} payload - font size Number or 'increase'/'decrease' String
 */
export const setFontSize = (payload) => ({ type: SET_FONT_SIZE, payload });

export const toggleTheme = () => ({ type: TOGGLE_THEME });

export default settingsReducer;
