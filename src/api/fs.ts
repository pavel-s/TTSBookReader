import { FileSystem } from 'react-native-unimodules';
import { BookFileJSON } from '../redux/models';

export const fs = {
  async readBook(path: string): Promise<BookFileJSON> {
    try {
      const bookString = await FileSystem.readAsStringAsync(path);
      const book = JSON.parse(bookString);
      console.log('book file read ok');
      if (!isBook(book)) {
        throw new Error('Incorrect Book format');
      }
      return book;
    } catch (error) {
      console.error(error.message);
      throw new Error(error.message);
    }
  },
  async readDirectory(path: string) {
    const entriesNames = await FileSystem.readDirectoryAsync(path);
    const promises = entriesNames.map(async (name) => {
      const info = await FileSystem.getInfoAsync(path + '/' + name);
      return { name, isDirectory: info.isDirectory, path: info.uri };
    });
    const entries = await Promise.all(promises);
    return entries;
  },
};

//todo: better validation
/**
 * validate book
 * @param book - book json
 */
const isBook = (book): book is BookFileJSON => {
  return (book as BookFileJSON).title !== undefined;
};
