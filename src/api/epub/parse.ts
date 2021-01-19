import { Book, Chapter } from '../../redux/models';
import { unzipPath } from './zip';
import * as parser from 'fast-xml-parser';
import { FileSystem } from 'react-native-unimodules';
import { parseChapterNode, parseTOCv3 } from './parseXHTML';
import { register } from './cacheRegister';
import { getBasePath } from './../../utils/common';
import { resolve } from 'url';

type EpubMeta = Partial<Book> & { file?: Partial<File> };

export type ParseResult = {
  chapters: Chapter[];
  info?: EpubMeta;
  toc?: string[];
  cacheDir: string;
};

export type ParseOptions = { getInfo?: boolean; getContent?: boolean };

/** parse unzipped book files from unzipPath directory */
export const parseEpub = async ({
  getContent,
}: ParseOptions): Promise<ParseResult> => {
  // path to epub package file
  const { packagePath, packageDirRel } = await getPackageFile(); // rel path to package file and directory part
  const packageDir = unzipPath + packageDirRel; // abs path to package directory

  const packageObj = await getPackage(packagePath);

  const epubVersion = Number(packageObj['@_version']);
  // if (epubVersion >= 3) {
  //   throw new Error('Unsupported epub version');
  // }

  const info = getEpubInfo(packageObj, epubVersion);
  let chapters: Chapter[];

  const cacheDir = (await register.get(info.id)).item.dir;

  const pathsToChapters = makeChaptersPaths(packageObj);
  if (getContent) {
    chapters = await parseChapters(pathsToChapters, {
      cacheDir,
      packageDir,
      packageDirRel,
    });
  }

  if (info.image) {
    const imageToCopy = {
      source: resolve(packageDir, info.image),
      target: resolve(resolve(cacheDir, packageDirRel), info.image),
    };
    await copyImagesToCache([imageToCopy]);
    info.image = imageToCopy.target;
  }

  const chaptersList = await parseTOC(packageObj, packageDir, epubVersion);
  // ncx toc may not be full (poor generated epub file)
  // therefore verify chaptersList with pathsToChapters from package.spine
  const finalChaptersList = pathsToChapters.map(
    (href) => chaptersList.get(href) || ''
  );

  info.chaptersList = finalChaptersList;

  return { chapters, info, cacheDir };
};

const getPackageFile = async (): Promise<{
  packagePath: string;
  packageDirRel: string;
}> => {
  const container = await FileSystem.readAsStringAsync(
    unzipPath + 'META-INF/container.xml'
  );
  const containerParsed = parser.parse(container, {
    ignoreAttributes: false,
  });
  const fullPath =
    containerParsed?.container?.rootfiles?.rootfile['@_full-path'];
  if (fullPath) {
    return { packagePath: fullPath, packageDirRel: getBasePath(fullPath) };
  }
  throw new Error('rootfile path not found');
};

const getPackage = async (path: string) => {
  const packageString = await FileSystem.readAsStringAsync(unzipPath + path);
  const packageParsed = parser.parse(packageString, {
    ignoreAttributes: false,
  });

  if (packageParsed.package) {
    return packageParsed.package;
  }

  throw new Error('package not fond');
};

const makeChaptersPaths = (packageJson) => {
  // todo: for version >= 3 find guide items in nav landmarks
  // https://www.w3.org/publishing/epub3/epub-packages.html#sec-opf2-guide
  const guideItems = packageJson.guide
    ? Array.isArray(packageJson.guide.reference)
      ? packageJson.guide.reference.map((guideItem) => guideItem['@_href'])
      : [packageJson.guide.reference]
    : [];

  return packageJson.spine.itemref.reduce((acc, spinItem) => {
    const href = packageJson.manifest.item.find(
      (manifestItem) => manifestItem['@_id'] === spinItem['@_idref']
    )['@_href'];
    if (guideItems.indexOf(href) === -1) {
      return [...acc, href];
    }
    return acc;
  }, []);
};

type ChapterPaths = {
  cacheDir: string;
  packageDir: string;
  packageDirRel: string;
};
const parseChapters = async (
  list: string[],
  paths: ChapterPaths
): Promise<Chapter[]> => {
  const { cacheDir, packageDir, packageDirRel } = paths;
  const promises = list.map(async (path) => {
    const chapterPath = resolve(packageDir, path); // abs path to chapter html file
    const chapter = await FileSystem.readAsStringAsync(chapterPath);
    const { items, images } = parseChapterNode(
      chapter,
      cacheDir,
      path,
      packageDirRel
    );
    await copyImagesToCache(images);
    return items;
  });
  return await Promise.all(promises);
};

const getEpubInfo = (packageObj, version: number): EpubMeta => {
  const meta = packageObj.metadata;
  const title = getXmlValue(meta['dc:title']);
  const author = getXmlValue(meta['dc:creator']);
  const language = getXmlValue(meta['dc:language']);
  const id = getId(packageObj);
  let image: string;
  if (version < 3) {
    const imageId = getCover(packageObj);
    image = packageObj.manifest.item.find((item) => item['@_id'] === imageId)?.[
      '@_href'
    ];
  }
  if (version >= 3) {
    image = packageObj.manifest.item.find(
      (item) => item['@_properties'] === 'cover-image'
    )?.['@_href'];
  }

  return { title, author, language, id, image };
};

type GetXmlValue = {
  (node): string;
  (node: any[], { pickFromArray }: { pickFromArray: [string, string] }): string;
  (node: any[], { arrayAsArray }: { arrayAsArray: true }): string[];
  (node, isRecursive: true): string;
};
const getXmlValue: GetXmlValue = (node, options?) => {
  if (Array.isArray(node)) {
    const { pickFromArray = undefined, arrayAsArray = false } =
      typeof options === 'object' ? options : {};

    if (options === true) return; // don't go deep

    if (pickFromArray) {
      const picked = node.find(
        (item) => item[pickFromArray[0]] === pickFromArray[1]
      );
      const result = getXmlValue(picked, true);
      return typeof result === 'string' ? result : undefined;
    }
    if (arrayAsArray) {
      return node.map((item) => {
        const result = getXmlValue(item, true);
        return typeof result === 'string' ? result : '';
      });
    }

    const result = getXmlValue(node[0], true);
    return typeof result === 'string' ? result : undefined;
  } else {
    if (typeof node === 'string') {
      return node;
    } else if (typeof node === 'object') {
      return node['#text'];
    }
  }
};

/** return epub unique identifier */
const getId = (packageObj): string => {
  const uniqueId = packageObj['@_unique-identifier'];
  if (packageObj) {
    return getXmlValue(packageObj.metadata['dc:identifier'], {
      pickFromArray: ['@_id', uniqueId],
    });
  }
};

/** return cover image path */
const getCover = (packageObj): string => {
  const node = packageObj.metadata.meta;
  if (Array.isArray) {
    return node.find((item) => item['@_name'] === 'cover')?.['@_content'];
  }
  if (typeof node === 'object' && node['@_name'] === 'cover') {
    return node['@_content'];
  }
};

const getTOCPath = (packageObj, version: number): string => {
  const predicate =
    version < 3
      ? (item) => item['@_id'] === 'ncx'
      : (item) => item['@_properties'] === 'nav';

  const node = packageObj.manifest.item.find(predicate);
  return node['@_href'];
};

type NavPoint =
  | {
      navLabel: { text: string };
      content: { '@_src': string };
      navPoint: NavPoint;
    }
  | NavPoint[];

/** parse TOC file and return list of chapters titles */
const parseTOC = async (
  packageObj,
  dir: string,
  version: number
): Promise<Map<string, string>> => {
  const path = getTOCPath(packageObj, version);
  const tocString = await FileSystem.readAsStringAsync(dir + path);

  if (version < 3) {
    const tocObj = await parser.parse(tocString, {
      ignoreAttributes: false,
    });

    const titleList = new Map<string, string>();
    const parseNavPoint = (navPoint: NavPoint) => {
      if (Array.isArray(navPoint)) {
        navPoint.forEach((node) => parseNavPoint(node));
      } else {
        if (!navPoint.content['@_src'].includes('#')) {
          titleList.set(navPoint.content['@_src'], navPoint.navLabel.text);
        }
        if (navPoint.navPoint) {
          parseNavPoint(navPoint.navPoint);
        }
      }
    };

    parseNavPoint(tocObj.ncx.navMap.navPoint);

    return titleList;
  }

  if (version >= 3) {
    return parseTOCv3(tocString);
  }
};

const copyImagesToCache = async (
  images: { source: string; target: string }[]
) => {
  try {
    const promises = images.map(
      async (image) =>
        await FileSystem.copyAsync({
          from: image.source,
          to: image.target,
        })
    );
    await Promise.all(promises);
  } catch (error) {
    console.error(error);
  }
};
