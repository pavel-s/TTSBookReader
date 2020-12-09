export interface File {
  name: string;
  path: string;
}

export interface Current {
  chapter: number;
  paragraph: number;
}

export interface Bookmark extends Current {
  key: string;
  name?: string;
}

export interface Book {
  id: string;
  title: string;
  description?: string;
  /** book page on novelupdates.com */
  novelupdatesPage?: string;
  /** url of book cover */
  image?: string;
  /** name and path to book file */
  file: File;
  /** current reading position */
  current: Current;
  bookmarks: Bookmark[];
  createdAt: number;
  updatedAt?: number;
  fileCreatedAt?: number;
  fileUpdatedAt?: number;
  chaptersList?: string[];
}

type ChapterParagraph = { text: string };
type ChapterImage = { image: string };
type ChapterElement = ChapterParagraph | ChapterImage;

export type Chapter = ChapterElement[];

export interface BookFileJSON {
  id: string;
  title: string;
  description?: string;
  novelupdatesPage?: string;
  image?: string;
  createdAt?: number;
  updatedAt?: number;
  chapters?: { [id: string]: { title: string; content: ChapterElement[] } };
}

export interface TTSOptions {
  pitch: number;
  rate: number;
  language: string;
  voice?: string;
}

/* files */

export interface FSEntry {
  isDirectory: boolean;
  name: string;
  path: string;
}

export interface FSDirectoryEntry extends FSEntry {
  isDirectory: true;
  children: FSEntry[];
  pathArr: { name: string; path: string }[];
}

export interface FSStorage {
  name: string;
  path: string;
}
