import { TTS_STATUSES } from './readerReducer';

export const readerChapterTitles = (state) => state.reader.chapterTitles;
export const readerCurrentChapter = (state) => state.reader.current.chapter;
export const readerIsFetching = (state) => state.reader.isFetching;
export const readerIsSpeaking = (state) =>
  state.reader.status === TTS_STATUSES.speaking;
