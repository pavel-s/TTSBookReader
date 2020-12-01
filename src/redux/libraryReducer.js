const ADD_BOOK = 'TTSBookReader/libraryReducer/ADD_BOOK';
const REQUEST_LIBRARY = 'TTSBookReader/libraryReducer/REQUEST_LIBRARY';
const RECEIVE_LIBRARY = 'TTSBookReader/libraryReducer/RECEIVE_LIBRARY';
const SET_ACTIVE_BOOK = 'TTSBookReader/libraryReducer/SET_ACTIVE_BOOK';
const SET_BOOKMARK = 'TTSBookReader/libraryReducer/SET_BOOKMARK';
const CLEAR_LIBRARY = 'TTSBookReader/libraryReducer/CLEAR_LIBRARY';
const SET_SORT_METHOD = 'TTSBookReader/libraryReducer/SET_SORT_METHOD';
const SET_FILTER = 'TTSBookReader/libraryReducer/SET_FILTER';

export const SORT_METHODS = {
  none: 'none',
  name: 'Name',
  lastRead: 'Last Read',
  addedAt: 'Added at',
};

/**
 * @typedef {Object} Book
 * @property {String} id
 * @property {String} title
 * @property {String} description
 * @property {String} novelupdatesPage
 * @property {String} image - url
 * @property {Date} createAt
 * @property {{ name: String, path: String }} file
 * @property {{chapter: String, paragraph: Number}} bookmark
 */

/**
 * @typedef {{name: 'none' | 'Name' | 'Last Read' | 'Added At', ascend?: Boolean}} SortMethod
 */

/**
 * @typedef {Object} State
 * @property {Boolean} fetched
 * @property {Boolean} isFetching
 * @property {String} activeBook
 * @property {[Book]} books
 * @property {SortMethod} sortMethod
 * @property {String} filter
 */

/**
 * @type State
 */
const initialState = {
  fetched: false,
  isFetching: false,
  activeBook: null,
  books: [],
  sortMethod: { name: 'none' },
  filter: '',
};

/**
 * @param {State} state
 * @returns {State}
 */
const libraryReducer = (state = initialState, { type, payload }) => {
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

    case SET_SORT_METHOD:
      return { ...state, sortMethod: payload };

    case SET_FILTER:
      return { ...state, filter: payload };

    default:
      return state;
  }
};

/**
 * @param {Book} payload
 */
export const addBook = (payload) => ({
  type: ADD_BOOK,
  payload,
});

/**
 * @param {String} payload - book id
 */
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

/**
 * @param {SortMethod} payload - sort method
 */
export const setSortMethod = (payload) => ({ type: SET_SORT_METHOD, payload });

/**
 * @param {String} payload - filter string
 */
export const setFilter = (payload) => ({ type: SET_FILTER, payload });

export default libraryReducer;
