const INIT_APP_SUCCESS = 'TTSBookReader/appReducer/INIT_APP_SUCCESS';
import { getLibrary } from './libraryReducer';

const appReducer = (state = { initialized: false }, action) => {
  switch (action.type) {
    case INIT_APP_SUCCESS:
      return { ...state, initialized: true };

    default:
      return state;
  }
};

const initializeSuccess = () => ({ type: INIT_APP_SUCCESS });

export const initializeApp = () => async (dispatch) => {
  // await dispatch(getLibrary());
  dispatch(initializeSuccess());
};

export default appReducer;
