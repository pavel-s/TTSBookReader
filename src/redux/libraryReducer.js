import AsyncStorage from '@react-native-community/async-storage';

const ADD_BOOK = 'TTSBookReader/libraryReducer/ADD_BOOK';
const REQUEST_LIBRARY = 'TTSBookReader/libraryReducer/REQUEST_LIBRARY';
const RECEIVE_LIBRARY = 'TTSBookReader/libraryReducer/RECEIVE_LIBRARY';
const SET_ACTIVE_BOOK = 'TTSBookReader/libraryReducer/SET_ACTIVE_BOOK';
const SET_BOOKMARK = 'TTSBookReader/libraryReducer/SET_BOOKMARK';
const CLEAR_LIBRARY = 'TTSBookReader/libraryReducer/CLEAR_LIBRARY';

/**
 * @typedef {Object} Book
 * @property {chapter: String, paragraph: Number} bookmark
 */

/**
 * @typedef {Object} State
 * @property {Boolean} fetched
 * @property {Boolean} isFetching
 * @property {String} activeBook
 * @property {[Book]} books
 */

const initialState = {
  fetched: false,
  isFetching: false,
  activeBook: null,
  books: [],
};

/**
 * @param {State} state
 */
const libraryReducer = (state = initialState, { type, payload }) => {
  // console.log('library reducer payload: ' + JSON.stringify(payload));
  switch (type) {
    case REQUEST_LIBRARY:
      return { ...state, fetched: false, isFetching: true };

    case RECEIVE_LIBRARY:
      return { ...state, ...payload, fetched: true, isFetching: false };

    case ADD_BOOK:
      const newBook = payload;
      newBook.bookmark = { chapter: 0, paragraph: 0 };
      return { ...state, books: [...state.books, newBook] };

    case SET_ACTIVE_BOOK:
      return { ...state, activeBook: payload };

    case SET_BOOKMARK:
      const newBooks = [...state.books];
      const bookIndex = newBooks.findIndex(
        (book) => book.id === payload.bookId
      );
      newBooks[bookIndex] = {
        ...newBooks[bookIndex],
        bookmark: payload.bookmark,
      };
      return { ...state, books: newBooks };

    case CLEAR_LIBRARY:
      return { ...state, books: [], activeBook: null };

    default:
      return state;
  }
};

/**
 * @param {{
     id: String,
     title: String,
     description: String,
     novelupdatesPage: String,
     image: String,
     createAt: Date,
     file: { name: String, path: String }
   }} payload
 */
export const addBook = (payload) => ({
  type: ADD_BOOK,
  payload,
});

export const setActiveBook = (payload) => ({
  type: SET_ACTIVE_BOOK,
  payload,
});

/**
 * @param {{bookId: String, bookmark: {chapter: Number, paragraph: Number}}} payload
 */
export const setBookmark = (payload) => ({
  type: SET_BOOKMARK,
  payload,
});

//TODO: add dispatch(resetReader())
export const clearLibrary = () => ({
  type: CLEAR_LIBRARY,
});

// export const getLibrary = () => async (dispatch) => {
//   try {
//     const library = await AsyncStorage.getItem(ASYNC_STORAGE_KEY);
//   } catch (error) {}
// };

export default libraryReducer;
