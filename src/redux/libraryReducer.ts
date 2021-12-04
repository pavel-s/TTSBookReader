// todo: cancel speakFrom thunk when change activeBook
import { createSlice } from '@reduxjs/toolkit';
import { PayloadAction } from '@reduxjs/toolkit';
import { clearLibrary } from './actions';

export const SORT_METHODS = {
  none: 'none',
  name: 'Name',
  lastRead: 'Last Read',
  addedAt: 'Added at',
};

export interface SortMethod {
  name: 'none' | 'Name' | 'Last Read' | 'Added At';
  ascend?: boolean;
}

interface LibraryState {
  activeBook: string;
  sortMethod: SortMethod;
  filter: string;
}

const initialState2: LibraryState = {
  activeBook: null,
  sortMethod: { name: 'none' },
  filter: '',
};

const librarySlice = createSlice({
  name: 'library',
  initialState: initialState2,
  reducers: {
    librarySetActiveBook(state, { payload }: PayloadAction<string>) {
      state.activeBook = payload;
    },
    librarySetFilter(state, { payload }: PayloadAction<string>) {
      state.filter = payload;
    },
    librarySetSortMethod(state, { payload }: PayloadAction<SortMethod>) {
      state.sortMethod = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(clearLibrary.fulfilled, (state) => {
      state.activeBook = null;
    });
  },
});

export const { librarySetActiveBook, librarySetFilter, librarySetSortMethod } =
  librarySlice.actions;

export default librarySlice.reducer;
