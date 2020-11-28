import { TTS_STATUSES } from './readerReducer';

/* reader */
export const readerChapterTitles = (state) => state.reader.chapterTitles;
export const readerCurrentChapter = (state) => state.reader.current.chapter;
export const readerIsFetching = (state) => state.reader.isFetching;
export const readerIsSpeaking = (state) =>
  state.reader.status === TTS_STATUSES.speaking;
export const readerShowNav = (state) => state.reader.showNav;

/* library */
export const libraryActiveBookChapterTitle = (state) => {
  const book = state.library.books.find(
    (book) => book.id === state.library.activeBook
  );
  return book?.chaptersList[book.bookmark.chapter];
};
export const libraryActiveBook = (state) =>
  state.library.books.find((book) => book.id === state.library.activeBook);
export const libraryBooks = (state) => state.library.books;
