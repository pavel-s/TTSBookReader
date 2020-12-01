import { TTS_STATUSES } from './readerReducer';

/* reader */
export const readerChapterTitles = (state) => state.reader.chapterTitles;
export const readerCurrent = (state) => state.reader.current;
export const readerCurrentChapter = (state) => state.reader.current.chapter;
export const readerIsFetching = (state) => state.reader.isFetching;
export const readerIsSpeaking = (state) =>
  state.reader.status === TTS_STATUSES.speaking;
export const readerShowNav = (state) => state.reader.showNav;
export const readerContent = (state) => state.reader.content;

/* library */
export const libraryActiveBookChapterTitle = (state) => {
  const book = state.library.books.find(
    (book) => book.id === state.library.activeBook
  );
  return book?.chaptersList[book.bookmark.chapter];
};
export const libraryActiveBookId = (state) => state.library.activeBook;
export const libraryActiveBook = (state) =>
  state.library.books.find((book) => book.id === state.library.activeBook);
/**
 * @returns {[import('./libraryReducer').Book]}
 */
export const libraryBooks = (state) => state.library.books;
export const librarySortMethod = (state) => state.library.sortMethod;
export const libraryFilter = (state) => state.library.filter;

/* settings */
export const settingsIsDarkTheme = (state) => state.settings.isDarkTheme;
export const settingsFontSize = (state) => state.settings.fontSize;
export const settingsTts = (state) => state.settings.tts;

/* files */
export const filesBookFile = (state) => state.files.bookFile;
export const filesDirectory = (state) => state.files.directory;

/* app */
export const appTtsVoices = (state) => state.app.other.ttsVoices;
