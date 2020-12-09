import { SORT_METHODS, SortMethod } from './libraryReducer';
import { Book } from './models';
import { compareStrings } from './../utils/common';

// const compare = new Intl.Collator().compare;

const nameAscend = (a: Book, b: Book) => compareStrings(a.title, b.title);
const nameDescend = (a: Book, b: Book) => compareStrings(b.title, a.title);

const addedAtAscend = (a: Book, b: Book) => a.createdAt - b.createdAt;
const addedAtDescend = (a: Book, b: Book) => b.createdAt - a.createdAt;

/**
 * Copy and sort books array according to sortMethod.
 * If sortMethod.name === 'none' return source array.
 */
export const sortBooks = (books: Book[], method: SortMethod) => {
  if (method.name === SORT_METHODS.none || !books) return books;

  const result = [...books];

  switch (method.name) {
    case SORT_METHODS.name:
      result.sort(method.ascend ? nameAscend : nameDescend);
      break;

    case SORT_METHODS.addedAt:
      result.sort(method.ascend ? addedAtAscend : addedAtDescend);
      break;

    // todo: last read

    default:
      break;
  }

  return result;
};
