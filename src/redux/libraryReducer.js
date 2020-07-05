import AsyncStorage from '@react-native-community/async-storage';

const ASYNC_STORAGE_KEY = 'LIBRARY';
const ADD_BOOK = 'TTSBookReader/libraryReducer/ADD_BOOK';

const initialState = {
  fetched: false,
  isFetching: false,
  activeBook: '', //id
  books: [],
};

const appReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case typeName:
      return { ...state, ...payload };

    default:
      return state;
  }
};

const addBook = (payload) => ({
  type: ADD_BOOK,
  payload,
});

export const getLibrary = () => async (dispatch) => {
  const library = await AsyncStorage.getItem(ASYNC_STORAGE_KEY);
};

export default appReducer;
