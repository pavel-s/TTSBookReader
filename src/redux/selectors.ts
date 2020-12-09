import { createSelector } from '@reduxjs/toolkit';
import { booksSelectors } from './booksReducer';
import { RootState } from './rootReducer';
import { sortBooks } from './booksUtils';

/* reader */
export const readerChapterTitles = (state: RootState) =>
  state.reader.chapterTitles;
export const readerIsFetching = (state: RootState) =>
  state.reader.status === 'pending';
export const readerIsSpeaking = (state: RootState) =>
  state.reader.ttsStatus === 'speaking';

export const readerShowNav = (state: RootState) => state.reader.showNav;
export const readerContent = (state: RootState) => state.reader.content;
export const readerTtsStatus = (state: RootState) => state.reader.ttsStatus;
export const readerStatus = (state: RootState) => state.reader.status;

export const readerCurrentTitle = (state: RootState) => {
  const index = activeBookCurrent(state).chapter;
  return state.reader.chapterTitles[index];
};

/* library */
export const libraryActiveBookId = (state: RootState) =>
  state.library.activeBook;

// export const libraryBooks = (state: RootState) => state.books; //!!!
export const librarySortMethod = (state: RootState) => state.library.sortMethod;
export const libraryFilter = (state: RootState) => state.library.filter;

/* settings */
export const settingsIsDarkTheme = (state: RootState) =>
  state.settings.isDarkTheme;
export const settingsFontSize = (state: RootState) => state.settings.fontSize;
export const settingsTts = (state: RootState) => state.settings.tts;

/* files */
export const filesDirectory = (state: RootState) => state.files.directory;
export const filesStorages = (state: RootState) => state.files.storages;
export const filesIsReading = (state: RootState) => state.files.isReading;
export const filesCurrentStorage = (state: RootState) =>
  state.files.currentStorage;

/* app */
export const appTtsVoices = (state: RootState) => state.app.other.ttsVoices;

/* books */
export const booksAll = (state: RootState) =>
  booksSelectors.selectAll(state.books);

export const booksAllIds = (state: RootState) =>
  booksSelectors.selectIds(state.books);

const booksFiltered = createSelector(
  [booksAll, libraryFilter],
  (books, filter) =>
    books.filter((book) =>
      book.title.toLowerCase().includes(filter.toLowerCase())
    )
);

export const booksFilteredSorted = createSelector(
  [booksFiltered, librarySortMethod],
  (books, sortMethod) => sortBooks(books, sortMethod).map((book) => book.id)
);

export const bookById = (id: string) => (state: RootState) =>
  booksSelectors.selectById(state.books, id);

export const activeBookCurrent = (state: RootState) => {
  const id = libraryActiveBookId(state);
  return bookById(id)(state).current;
};

export const activeBookCurrentChapter = (state: RootState) => {
  const id = libraryActiveBookId(state);
  return bookById(id)(state).current.chapter;
};
