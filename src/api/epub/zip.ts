import { FileSystem } from 'react-native-unimodules';
import { unzip } from 'react-native-zip-archive';

export const unzipPath = FileSystem.cacheDirectory + 'temp-unzip/';
const charset = 'UTF-8';

export const unzipBook = async (sourcePath: string) => {
  await FileSystem.deleteAsync(unzipPath, { idempotent: true });
  await unzip(sourcePath, unzipPath, charset);
};
