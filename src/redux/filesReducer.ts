//TODO: permissions
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { fs } from './../api/fs';
import { File } from './models';
import { FSDirectoryEntry, FSStorage } from './models';
import { parseFilePath } from './../utils/common';
import { RootState } from './rootReducer';

interface FilesState {
  directory: FSDirectoryEntry;
  storages: FSStorage[];
  currentStorage: number;
  isReading: boolean;
}

const initialState2: FilesState = {
  directory: null,
  storages: [{ name: 'internal', path: 'file:///storage/emulated/0' }],
  currentStorage: 0,
  isReading: false,
};

export const getDirectory = createAsyncThunk<
  FSDirectoryEntry,
  File,
  { state: RootState }
>('files/getDirectory', async ({ name, path }, { getState }) => {
  const children = await fs.readDirectory(path);
  const { files } = getState();
  const currentStorage = files.currentStorage;
  const { name: storageName, path: storagePath } = files.storages[
    currentStorage
  ];
  const pathArr = parseFilePath(path, storagePath, storageName);
  return { isDirectory: true, name, path, children, pathArr };
});

const filesSlice = createSlice({
  name: 'files',
  initialState: initialState2,
  reducers: {
    setDirectory(state, { payload }: PayloadAction<FSDirectoryEntry>) {
      state.directory = payload;
    },
    setCurrentStorage(state, { payload }: PayloadAction<number>) {
      state.currentStorage = payload;
    },
    setIsReading(state, { payload }: PayloadAction<boolean>) {
      state.isReading = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getDirectory.pending, (state) => {
      state.isReading = true;
    });
    builder.addCase(getDirectory.rejected, (state) => {
      state.isReading = false;
    });
    builder.addCase(getDirectory.fulfilled, (state, { payload }) => {
      state.directory = payload;
      state.isReading = false;
    });
  },
});

export const {
  setDirectory,
  setCurrentStorage,
  setIsReading,
} = filesSlice.actions;

export default filesSlice.reducer;
