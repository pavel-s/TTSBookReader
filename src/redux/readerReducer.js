import * as Speech from 'expo-speech';
import { speak } from '../utils/tts-promise';
import { readBookFile } from './filesReducer';
import { parseChapterHtmlAsync } from './../screens/Reader/parse';
import { setBookmark } from './libraryReducer';

const SET_OPTIONS = 'TTSBookReader/readerReducer/SET_OPTIONS';
export const TTS_STATUSES = { speaking: 'speaking', paused: 'paused' };
const SET_STATUS = 'TTSBookReader/readerReducer/SET_STATUS';
const SET_CURRENT = 'TTSBookReader/readerReducer/SET_CURRENT';
const SET_TOTAL_CHAPTERS = 'TTSBookReader/readerReducer/SET_TOTAL_CHAPTERS';

/**
 * @typedef {Object} State
 * @property {String} status
 * @property {Boolean} available
 * @property {{chapter: Number, paragraph: Number, content: []}} current
 * @property {Number} totalChapters
 * @property {{pitch: Number, rate: Number, language: String}} options
 */

/**
 * @constant
 * @type {State}
 */
const initialState = {
  status: '',
  available: false,
  current: { content: [] },
  totalChapters: 0,
  options: {
    pitch: 1,
    rate: 2.6,
    language: 'en',
  },
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
      const newCurrent = payload;
      if (!payload.content) {
        newCurrent.content = state.current.content;
      }
      return { ...state, current: newCurrent };

    case SET_TOTAL_CHAPTERS:
      return { ...state, totalChapters: payload };

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

export const setCurrent = (payload) => ({
  type: SET_CURRENT,
  payload,
});

export const setTotalChapters = (payload) => ({
  type: SET_TOTAL_CHAPTERS,
  payload,
});

/**
 * Speak all chapters form current chapter and paragraph[index]
 * @param {Number} index
 * @return {void}
 */
export const speakAll = (index) => async (dispatch, getState) => {
  const state = getState();
  const paragraphIndex = index > -1 ? index : state.reader.current.paragraph;

  const currentChapterIndex = state.reader.current.chapter;
  if (!currentChapterIndex) return;

  const strings = state.reader.current.content;

  dispatch(setTTSStatus(TTS_STATUSES.speaking));

  for (let i = paragraphIndex; i < strings.length; i++) {
    const newBookmark = { chapter: currentChapterIndex, paragraph: i };

    dispatch(setCurrent(newBookmark));
    dispatch(
      setBookmark({
        bookId: state.library.activeBook,
        bookmark: newBookmark,
      })
    );

    await speak(strings[i].text, state.reader.options);

    //check if Speaking was stopped from outside
    if (getState().reader.status === TTS_STATUSES.paused) {
      return;
    }
  }

  //set bookmark to next chapter
  await dispatch(
    setBookmark({
      bookId: state.library.activeBook,
      bookmark: { chapter: currentChapterIndex + 1, paragraph: 0 },
    })
  );

  const error = await dispatch(getChapter());
  if (error) {
    dispatch(setTTSStatus(TTS_STATUSES.paused));
    return;
  }

  //speak next chapter
  dispatch(speakAll(0));
};

export const stopSpeaking = () => async (dispatch, getState) => {
  dispatch(setTTSStatus(TTS_STATUSES.paused));
  Speech.stop();
};

export const goToChapter = (index) => async (dispatch, getState) => {
  const state = getState();
  dispatch(stopSpeaking());

  await dispatch(
    setBookmark({
      bookId: state.library.activeBook,
      bookmark: { chapter: index, paragraph: 0 },
    })
  );

  const error = await dispatch(getChapter());

  if (error) {
    console.log(error.error);
  }
};

export const getChapter = () => async (dispatch, getState) => {
  const state = getState();
  const activeBookId = state.library.activeBook;
  const book = state.library.books.find(({ id }) => id === activeBookId);
  let bookFile = state.files.bookFile;
  const chapterIndex = book.bookmark.chapter;

  //read book file if needed
  if (book.file.path !== bookFile.path || !bookFile.wasRead) {
    await dispatch(readBookFile(book.file.path, book.file.name));
  }

  bookFile = getState().files.bookFile;

  if (!bookFile.wasRead) {
    console.log('readerReducer: Fail to open book file');
    return { error: true, message: 'Fail to open book file' };
  }

  dispatch(setTotalChapters(bookFile.json.chapters.length));

  const paragraphs = await parseChapterHtmlAsync(
    bookFile.json.chapters[chapterIndex].content
  );
  // dispatch(setQueue({ [chapterIndex]: paragraphs }));

  dispatch(setCurrent({ ...book.bookmark, content: paragraphs }));
  //todo: continue parseAndSet?
};

export default readerReducer;
