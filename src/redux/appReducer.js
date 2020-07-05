const INIT_APP_SUCCESS = 'TTSBookReader/appReducer/INIT_APP_SUCCESS';

const appReducer = (state = { initialized: false }, action) => {
  switch (action.type) {
    case INIT_APP_SUCCESS:
      return { ...state, initialized: true };

    default:
      return state;
  }
};

const initializeSuccess = () => ({ type: INIT_APP_SUCCESS });

export const initializeApp = () => (dispatch) => {
  const wait = async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, 3000);
    });
    dispatch(initializeSuccess());
  };
  wait();
};

export default appReducer;
