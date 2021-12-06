/**
 * info: modified HTMLElement.structuredText from node-html-parser module
 */
import {
  NodeType,
  HTMLElement as Element,
  TextNode,
  parse,
} from 'node-html-parser';
import { resolve } from 'url';
import { getBasePath } from './../../utils/common';
import { unzipPath } from './zip';

var kBlockElements = new Map();
kBlockElements.set('DIV', true);
kBlockElements.set('div', true);
kBlockElements.set('P', true);
kBlockElements.set('p', true);
// ul: true,
// ol: true,
kBlockElements.set('LI', true);
kBlockElements.set('li', true);
// table: true,
// tr: true,
kBlockElements.set('TD', true);
kBlockElements.set('td', true);
kBlockElements.set('SECTION', true);
kBlockElements.set('section', true);
kBlockElements.set('BR', true);
kBlockElements.set('br', true);
// for image inside svg
kBlockElements.set('svg', true);

type Block = string[] & { prependWhitespace?: boolean; image?: string };
type HTMLElement = Element & TextNode & { childNodes: HTMLElement[] };

export const parseChapterNode = (
  chapter: string,
  cacheDir: string,
  chapterPathRel: string,
  packageDirRel: string
) => {
  const node = parse(chapter).querySelector('body') as HTMLElement;

  const chapterDirRel = resolve(packageDirRel, getBasePath(chapterPathRel)); // relative path to chapter directory (relative to unzipPath)

  const images: { source: string; target: string }[] = [];

  var currentBlock: Block = [];
  var blocks = [currentBlock];

  function dfs(node: HTMLElement) {
    if (node.rawTagName === 'image') {
      const path = node.attributes.href; // todo: srcset?
      if (typeof path === 'string' && path.length > 0) {
        // todo: http:// links
        const image = {
          source: resolve(unzipPath, resolve(chapterDirRel, path)),
          // source: resolve(chapterDirPath, path),
          target: resolve(
            cacheDir,
            resolve(chapterDirRel, path.match(/[^\/]+$/)[0])
          ),
        };
        images.push(image);
        currentBlock.image = image.target;
        blocks.push((currentBlock = []));
      }
    }
    if (node.nodeType === NodeType.ELEMENT_NODE) {
      if (kBlockElements.get(node.rawTagName)) {
        if (currentBlock.length && currentBlock.length > 0) {
          blocks.push((currentBlock = []));
        }
        node.childNodes.forEach(dfs);
        if (currentBlock.length > 0) {
          blocks.push((currentBlock = []));
        }
      } else {
        node.childNodes.forEach(dfs);
      }
    } else if (node.nodeType === NodeType.TEXT_NODE) {
      if (node.isWhitespace) {
        // Whitespace node, postponed output
        currentBlock.prependWhitespace = true;
      } else {
        // var text = node.structuredText;
        var text = node.text;
        if (currentBlock.prependWhitespace) {
          text = ' ' + text;
          currentBlock.prependWhitespace = false;
        }
        currentBlock.push(text);
      }
    }
  }
  dfs(node);
  return {
    items: blocks.map(function (block) {
      if (block.image) return { image: block.image };
      // Normalize each line's whitespace
      return {
        text: block
          .join('')
          .trim()
          .replace(/\s{2,}/g, ' ') // clear excessive whitespace
          .replace(/\n/g, ''), // clear excessive '\n'
      };
    }),
    images,
  };
};

/**
 * parse epub v3 xhtml navigation
 * @param tocString
 */
export const parseTOCv3 = (tocString: string) => {
  const links = parse(tocString).querySelectorAll('nav a');
  const resultList = new Map<string, string>();
  links.forEach((link) => {
    if (!link.attributes.href.includes('#')) {
      resultList.set(link.attributes.href, link.text);
    }
  });

  return resultList;
};

// const parseNavPoint = (navPoint: NavPoint) => {
//   if (Array.isArray(navPoint)) {
//     navPoint.forEach((node) => parseNavPoint(node));
//   } else {
//     if (!navPoint.content['@_src'].includes('#')) {
//       titleList.set(navPoint.content['@_src'], navPoint.navLabel.text);
//     }
//     if (navPoint.navPoint) {
//       parseNavPoint(navPoint.navPoint);
//     }
//   }
// };
