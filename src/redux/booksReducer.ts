import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  nanoid,
  PayloadAction,
} from '@reduxjs/toolkit';
import { Book, Bookmark, Current } from './models';
import { RootState } from './rootReducer';
import { AppDispatch } from './store';
import { readBookFile, clearBooksCache } from './../api/book';
import { clearLibrary } from './actions';

interface AddBookmarkPayload {
  bookId: string;
  bookmark: Bookmark;
}

interface RemoveBookmarkPayload {
  bookId: string;
  bookmarkKey: string;
}

interface UpdateCurrentPayload {
  bookId: string;
  current: Current;
}

interface FetchAndAddBookPayload {
  book: Book;
  isUpdate: boolean;
}

interface File {
  name: string;
  path: string;
}

export const fetchAndAddBook = createAsyncThunk<
  FetchAndAddBookPayload,
  File,
  { state: RootState }
>('books/fetchBook', async (file, { getState }) => {
  const state = getState();

  const { book } = await readBookFile(file);

  return {
    book: {
      id: book.id || nanoid(),
      title: book.title,
      description: book.description,
      novelupdatesPage: book.novelupdatesPage,
      image: book.image,
      author: book.author,
      language: book.language,
      file: book.file,
      chaptersList: book.chaptersList,
      current: { chapter: 0, paragraph: 0 },
      bookmarks: [],
      createdAt: Date.now(),
      fileCreatedAt: book.createdAt,
      fileUpdatedAt: book.updatedAt,
    },
    isUpdate: !!state.books.entities[book.id],
  };
});

export const activeBookUpdateCurrent = (current: Current) => (
  dispatch: AppDispatch,
  getState: () => RootState
) => {
  const state = getState();
  dispatch(
    bookCurrentUpdated({
      bookId: state.library.activeBook,
      current,
    })
  );
};

const booksAdapter = createEntityAdapter<Book>();

const booksSlice = createSlice({
  name: 'books',
  initialState: booksAdapter.getInitialState(),
  reducers: {
    bookAdded: booksAdapter.addOne,
    bookRemoved: booksAdapter.removeOne,
    bookBookmarkAdded: {
      reducer(state, { payload }: PayloadAction<AddBookmarkPayload>) {
        if (state.entities[payload.bookId]) {
          state.entities[payload.bookId].bookmarks.push(payload.bookmark);
        }
      },
      prepare(bookId: string, bookmark: Omit<Bookmark, 'key'>) {
        const bookmarkWithKey: Bookmark = { ...bookmark, key: nanoid() };
        return {
          payload: {
            bookId,
            bookmark: bookmarkWithKey,
          },
        };
      },
    },
    bookBookmarkRemoved(
      state,
      { payload: { bookId, bookmarkKey } }: PayloadAction<RemoveBookmarkPayload>
    ) {
      const book = state.entities[bookId];
      if (book) {
        const index = book.bookmarks.findIndex(
          (bookmark) => bookmark.key === bookmarkKey
        );
        if (index !== -1) book.bookmarks.splice(index, 1);
      }
    },
    bookCurrentUpdated(
      state,
      { payload }: PayloadAction<UpdateCurrentPayload>
    ) {
      booksAdapter.updateOne(state, {
        id: payload.bookId,
        changes: { current: payload.current },
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchAndAddBook.fulfilled,
      (state, { payload: { book } }) => {
        booksAdapter.addOne(state, book);
      }
    );
    builder.addCase(clearLibrary.fulfilled, (state) => {
      booksAdapter.removeAll(state);
    });
  },
});

export const {
  bookAdded,
  bookRemoved,
  bookBookmarkAdded,
  bookBookmarkRemoved,
  bookCurrentUpdated,
} = booksSlice.actions;

export const booksSelectors = booksAdapter.getSelectors();

export default booksSlice.reducer;
