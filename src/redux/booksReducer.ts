import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  EntityState,
  nanoid,
  PayloadAction,
} from '@reduxjs/toolkit';
import { Book, Bookmark, Current, File, BookFileJSON } from './models';
import { RootState } from './rootReducer';
import { fs } from './../api/fs';
import { AppDispatch } from './store';

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
export const fetchAndAddBook = createAsyncThunk<
  FetchAndAddBookPayload,
  File,
  { state: RootState }
>('books/fetchBook', async (file, { getState }) => {
  const json = (await fs.readBook(file.path)) as BookFileJSON;
  return {
    book: {
      id: json.id,
      title: json.title,
      description: json.description,
      novelupdatesPage: json.novelupdatesPage,
      image: json.image,
      file: file,
      current: { chapter: 0, paragraph: 0 },
      bookmarks: [],
      createdAt: Date.now(),
      fileCreatedAt: json.createdAt,
      fileUpdatedAt: json.updatedAt,
      chaptersList: Object.values(json.chapters).map(
        (chapter) => chapter.title
      ),
    },
    isUpdate: !!getState().books.entities[json.id],
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
