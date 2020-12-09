import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { tts } from '../api/tts';
import { bookById, activeBookCurrent } from './selectors';
import { fs } from './../api/fs';
import { bookCurrentUpdated } from './booksReducer';
import { BookFileJSON, Chapter } from './models';
import { RootState } from './rootReducer';
import { AppDispatch } from './store';

type TTSStatus = 'speaking' | 'pause' | 'stop';

interface ReaderState {
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  ttsStatus: TTSStatus;
  bookId: string;
  chapterTitles: string[];
  totalChapters: number;
  content: Chapter[];
  showNav: boolean;
}

interface FetchBookContentPayload {
  total: number;
  titles: string[];
  content: Chapter[];
}

export const fetchBookContent = createAsyncThunk<
  FetchBookContentPayload,
  string | void,
  {
    dispatch: AppDispatch;
    state: RootState;
  }
>('reader/fetchBookContent', async (bookId, thunkApi) => {
  thunkApi.dispatch(contentRequested());

  const state = thunkApi.getState();
  const path = bookById(bookId || state.library.activeBook)(state).file.path;
  const json = (await fs.readBook(path)) as BookFileJSON;
  const content = Object.values(json.chapters).map(
    (chapter) => chapter.content
  );
  const titles = Object.values(json.chapters).map((chapter) => chapter.title);

  return {
    content,
    titles,
    total: content.length,
  };
});

export const speakFrom = createAsyncThunk<
  void,
  number | void,
  {
    dispatch: AppDispatch;
    state: RootState;
  }
>('reader/speakFrom', async (index, thunkApi) => {
  let state = thunkApi.getState();
  if (!state.library.activeBook) return;

  //todo: implement pause(): add reader.lastPaused as book.current when pause() and then if lastPaused === index - call resume() instead of speak()

  // fetch book content if needed
  if (state.reader.status !== 'succeeded') {
    await thunkApi.dispatch(fetchBookContent());
    state = thunkApi.getState();
  }

  // prepare indexes
  const currentFrom = activeBookCurrent(state);
  let chapterIndexFrom = currentFrom.chapter;
  const totalChapters = state.reader.totalChapters;

  let paragraphFromIndex = index;
  if (typeof paragraphFromIndex !== 'number') {
    paragraphFromIndex = currentFrom.paragraph;
  }

  // speaking cycles
  for (
    let chapterIndex = chapterIndexFrom;
    chapterIndex < totalChapters;
    chapterIndex++
  ) {
    const currentContent = state.reader.content[chapterIndex];
    for (
      let paragraphIndex = paragraphFromIndex;
      paragraphIndex < currentContent.length;
      paragraphIndex++
    ) {
      if (thunkApi.getState().reader.ttsStatus !== 'speaking') return; //? try cancel thunk instead
      const currentElement = currentContent[paragraphIndex];
      if (!('text' in currentElement)) continue; // check if currentElement is ChapterParagraph type

      // update book.current
      thunkApi.dispatch(
        bookCurrentUpdated({
          bookId: state.library.activeBook,
          current: { chapter: chapterIndex, paragraph: paragraphIndex },
        })
      );

      await tts.speak(currentElement.text, state.settings.tts);
    }
    paragraphFromIndex = 0;
  }
});

export const stopSpeaking = createAsyncThunk(
  'reader/stopSpeaking',
  async () => {
    await tts.stop();
  }
);

// export const toggleSpeaking = createAsyncThunk<
//   void,
//   number,
//   { dispatch: AppDispatch; state: RootState }
// >('reader/toggleSpeaking', (index, { dispatch, getState }) => {
//   if (getState().reader.ttsStatus === 'speaking') {
//     dispatch(stopSpeaking());
//   } else {
//     dispatch(speakFrom(index));
//   }
// });

export const toggleSpeaking = (index: number) => (
  dispatch: AppDispatch,
  getState: () => RootState
) => {
  if (getState().reader.ttsStatus === 'speaking') {
    dispatch(stopSpeaking());
  } else {
    dispatch(speakFrom(index));
  }
};

const initialState: ReaderState = {
  status: 'idle',
  ttsStatus: 'stop',
  bookId: '',
  chapterTitles: [],
  totalChapters: null,
  content: [],
  showNav: false,
};

const readerSlice = createSlice({
  name: 'reader',
  initialState: initialState,
  reducers: {
    contentRequested(state) {
      state.status = 'pending';
    },
    contentReceived(state, { payload }: PayloadAction<Chapter[]>) {
      state.status = 'succeeded';
      state.content = payload;
    },
    setTtsStatus(state, { payload }: PayloadAction<TTSStatus>) {
      state.ttsStatus = payload;
    },
    toggleShowNav(state) {
      state.showNav = !state.showNav;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBookContent.pending, (state) => {
      state.status = 'pending';
    });
    builder.addCase(fetchBookContent.rejected, (state) => {
      state.status = 'failed';
    });
    builder.addCase(fetchBookContent.fulfilled, (state, { payload }) => {
      state.status = 'succeeded';
      state.content = payload.content;
      state.totalChapters = payload.total;
      state.chapterTitles = payload.titles;
    });
    builder.addCase(stopSpeaking.pending, (state) => {
      state.ttsStatus = 'stop';
    });
    builder.addCase(speakFrom.pending, (state) => {
      state.ttsStatus = 'speaking';
    });
    builder.addCase(speakFrom.fulfilled, (state) => {
      state.ttsStatus = 'stop';
    });
    builder.addCase(speakFrom.rejected, (state) => {
      state.ttsStatus = 'stop';
    });
  },
});

export const {
  contentRequested,
  setTtsStatus,
  toggleShowNav,
} = readerSlice.actions;

export default readerSlice.reducer;
