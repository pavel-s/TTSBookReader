import { createAsyncThunk } from '@reduxjs/toolkit';
import { clearBooksCache } from './../api/book';

export const clearLibrary = createAsyncThunk(
  'common/clearLibrary',
  async () => {
    await clearBooksCache();
  }
);
