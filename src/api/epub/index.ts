import { File } from '../../redux/models';
import { unzipBook } from './zip';
import { FileSystem } from 'react-native-unimodules';
import { parseEpub, ParseResult, ParseOptions } from './parse';

type EpubToJsonResult = Pick<ParseResult, 'chapters' | 'info'>;
const epubToJson = async (
  file: File,
  options?: ParseOptions
): Promise<EpubToJsonResult> => {
  let result: EpubToJsonResult;
  try {
    const { md5 } = await FileSystem.getInfoAsync(file.path, { md5: true });
    if (md5 === file.md5 && file.cacheDir) {
      // read cached version
      result = await readEpubJsonFile(file.cacheDir + 'book.json');
      if (result) return result;
    }

    // unzip book to unzipPath
    await unzipBook(file.path);

    // parse book
    const { info, chapters, cacheDir } = await parseEpub(options);
    result = { info, chapters };
    result.info.file = { ...file, md5, cacheDir, type: 'epub' };

    // save json to file
    await FileSystem.makeDirectoryAsync(result.info.file.cacheDir, {
      intermediates: true,
    });
    FileSystem.writeAsStringAsync(
      result.info.file.cacheDir + 'book.json',
      JSON.stringify(result)
    );

    return result;
  } catch (error) {
    console.error('Epub parsing error', error);
  }
};

const readEpubJsonFile = async (path: string): Promise<ParseResult> => {
  const jsonString = await FileSystem.readAsStringAsync(path);
  const json = JSON.parse(jsonString);
  return json;
};

export default epubToJson;
