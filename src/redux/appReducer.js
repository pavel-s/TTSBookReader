const INIT_APP_SUCCESS = 'TTSBookReader/appReducer/INIT_APP_SUCCESS';
const TOGGLE_THEME = 'TTSBookReader/appReducer/TOGGLE_THEME';
import { getLibrary } from './libraryReducer';

const appReducer = (
  state = { initialized: false, isDarkTheme: true },
  action
) => {
  switch (action.type) {
    case INIT_APP_SUCCESS:
      return { ...state, initialized: true };

    case TOGGLE_THEME:
      return { ...state, isDarkTheme: !state.isDarkTheme };

    default:
      return state;
  }
};

const initializeSuccess = () => ({ type: INIT_APP_SUCCESS });

export const initializeApp = () => async (dispatch) => {
  // await dispatch(getLibrary());
  dispatch(initializeSuccess());
};

export const toggleTheme = () => ({ type: TOGGLE_THEME });

export default appReducer;
