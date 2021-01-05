import { Book, BookFileJSON, Chapter, File } from '../redux/models';
import { getFileExtension } from './../utils/common';
import epubToJson from './epub';
import { fs } from './fs';

export type ReadBookFileResult = { book?: Partial<Book>; chapters?: Chapter[] };

export const readBookFile = async (
  file: File,
  {
    getContent = true,
    getInfo = true,
  }: { getContent?: boolean; getInfo?: boolean } = {}
): Promise<ReadBookFileResult> => {
  const extension = getFileExtension(file.name);

  switch (extension) {
    case 'json':
      const json = (await fs.readBook(file.path)) as BookFileJSON;
      return {
        book: getInfo && {
          id: json.id,
          title: json.title,
          description: json.description,
          novelupdatesPage: json.novelupdatesPage,
          image: json.image,
          file: { ...file, type: 'json' },
          fileCreatedAt: json.createdAt,
          fileUpdatedAt: json.updatedAt,
          chaptersList: Object.values(json.chapters).map(
            (chapter) => chapter.title
          ),
        },
        chapters:
          getContent &&
          Object.values(json.chapters).map((chapter) => chapter.content),
      };
    case 'epub':
      const epubJson = await epubToJson(file, {
        getInfo,
        getContent,
      });

      return {
        book: getInfo && epubJson.info,
        chapters: getContent && epubJson.chapters,
      };
    default:
      throw new Error('Unknown file format');
  }
};
