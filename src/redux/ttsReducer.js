const initialState = {
  isSpeaking: false,
};

const ttsReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case typeName:
      return { ...state, ...payload };

    default:
      return state;
  }
};

export default ttsReducer;
