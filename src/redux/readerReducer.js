import * as Speech from 'expo-speech';
import { speak } from '../utils/tts-promise';
import { readBookFile } from './filesReducer';
import { setBookmark } from './libraryReducer';

const SET_OPTIONS = 'TTSBookReader/readerReducer/SET_OPTIONS';
export const TTS_STATUSES = { speaking: 'speaking', paused: 'paused' };
const SET_STATUS = 'TTSBookReader/readerReducer/SET_STATUS';
const SET_CURRENT = 'TTSBookReader/readerReducer/SET_CURRENT';
const SET_BOOK = 'TTSBookReader/readerReducer/SET_BOOK';
const SET_FONT_SIZE = 'TTSBookReader/readerReducer/SET_FONT_SIZE';

//todo: add in progress state
/**
 * @typedef {Object} State
 * @property {String} status
 * @property {Boolean} available
 * @property {String} bookId
 * @property {Number} totalChapters
 * @property {[Array]} content - chapters or pages
 * @property {{chapter: Number, paragraph: Number}} current - index of current chapter and paragraph
 * @property {{pitch: Number, rate: Number, language: String}} options
 */

/**
 * @constant
 * @type {State}
 */
const initialState = {
  status: '',
  // available: false,
  bookId: '',
  totalChapters: 0,
  content: [],
  current: { chapter: 0, paragraph: 0 },
  options: {
    pitch: 1,
    rate: 2.6,
    language: 'en',
  },
  fontSize: 15,
};

/**
 *
 * @param {State} state
 */
const readerReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_OPTIONS:
      return { ...state, options: payload };

    case SET_STATUS:
      return { ...state, status: payload };

    case SET_CURRENT:
      return { ...state, current: payload };

    case SET_BOOK:
      return {
        ...state,
        bookId: payload.id,
        totalChapters: payload.totalChapters,
        content: payload.content,
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

    default:
      return state;
  }
};

/**
 * @param {{voice: String, pitch: Number, rate: Number}} payload
 */
export const setTTSOptions = (payload) => ({
  type: SET_OPTIONS,
  payload,
});

/**
 * @param {String} payload - TTS_STATUSES
 */
export const setTTSStatus = (payload) => ({
  type: SET_STATUS,
  payload,
});

/**
 * set current chapter and paragraph index
 * @param {{chapter: Number, paragraph: Number}} payload
 */
export const setCurrent = (payload) => ({
  type: SET_CURRENT,
  payload,
});

/**
 *
 * @param {{id: String, totalChapters: Number}} payload
 */
export const setBook = (payload) => ({
  type: SET_BOOK,
  payload,
});

/**
 *
 * @param {*} payload - font size Integer or 'increase'/'decrease' String
 */
export const setFontSize = (payload) => ({ type: SET_FONT_SIZE, payload });

/**
 * Speak all chapters form current chapter and paragraph[index]
 * @param {Number} index
 * @return {void}
 */
export const speakAll = (index) => async (dispatch, getState) => {
  let state = getState();

  //get book content if needed
  if (!state.reader.content.length) {
    try {
      await dispatch(getBook());
    } catch (error) {
      console.log(error);
      return;
    }
  }

  let paragraphIndex = index > -1 ? index : state.reader.current.paragraph;
  const currentChapterIndex = state.reader.current.chapter;

  dispatch(setTTSStatus(TTS_STATUSES.speaking));

  //from current chapter to end of book
  for (let k = currentChapterIndex; k < state.reader.totalChapters; k++) {
    //from current paragraph to end of chapter
    const content = state.reader.content[k];
    for (let i = paragraphIndex; i < content.length; i++) {
      if (content[i].image) break;

      const newBookmark = { chapter: k, paragraph: i };

      dispatch(setCurrent(newBookmark));
      dispatch(
        setBookmark({
          bookId: state.reader.bookId,
          bookmark: newBookmark,
        })
      );

      try {
        await speak(content[i].text, state.reader.options);
      } catch (error) {
        console.log(error);
      }

      //get current state
      state = getState();

      //check if Speaking was stopped from outside
      if (state.reader.status === TTS_STATUSES.paused) {
        return;
      }
    }
    paragraphIndex = 0;
  }
};

export const stopSpeaking = () => async (dispatch, getState) => {
  dispatch(setTTSStatus(TTS_STATUSES.paused));
  Speech.stop();
};

export const toggleSpeaking = (index) => (dispatch, getState) => {
  const state = getState();
  if (state.reader.status === TTS_STATUSES.speaking) {
    dispatch(stopSpeaking());
  } else {
    // await dispatch(setCurrent({ ...state.reader.current, paragraph: index }));
    dispatch(speakAll(index));
  }
};

export const goToChapter = (index) => async (dispatch, getState) => {
  const state = getState();
  const bookmark = { chapter: index, paragraph: 0 };

  dispatch(stopSpeaking());

  dispatch(
    setBookmark({
      bookId: state.library.activeBook,
      bookmark: bookmark,
    })
  );

  dispatch(setCurrent(bookmark));
};

export const getBook = () => async (dispatch, getState) => {
  dispatch(stopSpeaking());

  const state = getState();
  const activeBookId = state.library.activeBook;
  const book = state.library.books.find(({ id }) => id === activeBookId);
  let bookFile = state.files.bookFile;

  //read book file if needed
  if (book.file.path !== bookFile.path || !bookFile.wasRead) {
    await dispatch(readBookFile(book.file.path, book.file.name));
  }

  bookFile = getState().files.bookFile;

  if (!bookFile.wasRead) {
    console.log('readerReducer: Fail to open book file');
    return { error: true, message: 'Fail to open book file' };
  }

  dispatch(
    setBook({
      id: activeBookId,
      totalChapters: bookFile.json.chapters.length,
      content: Object.values(bookFile.json.chapters).map(
        (chapter) => chapter.content
      ),
    })
  );

  dispatch(
    setCurrent({
      ...book.bookmark,
    })
  );
};

export default readerReducer;
