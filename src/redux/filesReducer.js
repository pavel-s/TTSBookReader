//TODO: permissions
import * as FileSystem from 'expo-file-system';

const REQUEST_DIRECTORY = 'TTSBookReader/filesReducer/REQUEST_DIRECTORY';
const SET_DIRECTORY = 'TTSBookReader/filesReducer/SET_DIRECTORY';
const REQUEST_BOOK_FILE = 'TTSBookReader/filesReducer/REQUEST_BOOK_FILE';
const SET_BOOK_FILE = 'TTSBookReader/filesReducer/SET_BOOK_FILE';

const initialState = {
  bookFile: {
    name: null,
    path: '',
    isFetching: false,
    wasRead: false,
    json: null,
  },
  directory: {
    name: 'root',
    path: 'file:///storage/emulated/0',
    entries: [],
    isFetching: false,
    wasRead: false,
  },
};

const filesReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case REQUEST_DIRECTORY:
    case SET_DIRECTORY:
      return { ...state, directory: { ...payload } };

    case REQUEST_BOOK_FILE:
    case SET_BOOK_FILE:
      return { ...state, bookFile: { ...payload } };

    default:
      return state;
  }
};

const requestDirectory = (payload) => ({
  type: REQUEST_DIRECTORY,
  payload,
});

const setDirectory = (payload) => ({
  type: SET_DIRECTORY,
  payload,
});

const requestBookFile = (payload) => ({
  type: REQUEST_BOOK_FILE,
  payload,
});

const setBookFile = (payload) => ({
  type: SET_BOOK_FILE,
  payload,
});

export const readDirectory = (path, name) => async (dispatch) => {
  dispatch(
    requestDirectory({
      name,
      path,
      entries: [],
      isFetching: true,
      wasRead: false,
    })
  );

  try {
    const entriesNames = await FileSystem.readDirectoryAsync(path);
    const entries = [];
    for (let i = 0; i < entriesNames.length; i++) {
      const entry = await FileSystem.getInfoAsync(path + '/' + entriesNames[i]);
      entries.push({ name: entriesNames[i], ...entry });
    }
    dispatch(
      setDirectory({
        name,
        path,
        isFetching: false,
        wasRead: true,
        entries,
      })
    );
  } catch (error) {
    console.log(error);
  }
};

export const readBookFile = (path, name) => async (dispatch) => {
  dispatch(
    requestBookFile({
      name,
      path,
      entries: [],
      isFetching: true,
      wasRead: false,
      json: null,
    })
  );
  console.log('read file: ' + path);

  try {
    const bookString = await FileSystem.readAsStringAsync(path);
    const book = JSON.parse(bookString);
    if (!book.title) {
      throw new Error('Incorrect Book format');
    }
    console.log('book file read ok');
    dispatch(
      setBookFile({
        name,
        path,
        isFetching: false,
        wasRead: true,
        json: book,
      })
    );
    return { error: false, book };
  } catch (error) {
    console.log(error);
    dispatch(
      setBookFile({
        name,
        path,
        isFetching: false,
        wasRead: false,
      })
    );
    return { error: true };
  }
};

export default filesReducer;
