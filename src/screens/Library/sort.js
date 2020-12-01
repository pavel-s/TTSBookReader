import { SORT_METHODS } from '../../redux/libraryReducer';

const nameAscend = (a, b) => a.title > b.title;
const nameDescend = (a, b) => a.title < b.title;

const addedAtAscend = (a, b) => a.createAt > b.createAt;
const addedAtDescend = (a, b) => a.createAt < b.createAt;

/**
 * Copy and sort books array according to sortMethod.
 * If sortMethod.name === 'none' return source array.
 * @param {[import('../../redux/libraryReducer').Book]} books
 * @param {import('../../redux/libraryReducer').SortMethod} method
 */
export const sortBooks = (books, method) => {
  if (method.name === SORT_METHODS.none) return books;

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
