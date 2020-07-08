import { DOMParser } from 'xmldom';

export const parseChapterHtml = (
  raw,
  settings = { method: 'byChildNodes' }
) => {
  // raw =
  //   '<img src="https://cdn.novelupdates.com/images/2017/03/castleofblackiron.jpg">';
  const method = settings.method;

  const doc = new DOMParser({
    errorHandler: { warning: null },
  }).parseFromString(raw, 'text/html');

  const childNodes = doc.childNodes;
  // const pars = doc.getElementsByTagName('p');
  switch (method) {
    case 'byChildNodes':
      return parseByChildNodes(childNodes);

    default:
      return [];
  }
};

/**
 * for html string with plain "paragraph paragraph image paragraph" structure
 * @param {NodeList} childNodes
 * @return {Array} Array
 */
const parseByChildNodes = (childNodes) => {
  const result = [];
  let before = null;
  for (let i = 0; i < childNodes.length; i++) {
    if (childNodes[i].tagName === 'p') {
      result.push({ text: childNodes[i].textContent });
      if (before) {
        result[result.length - 1].before = before;
        before = null;
      }
    } else if (childNodes[i].tagName === 'img')
      result[0]
        ? (result[result.length - 1].after = childNodes[i].src)
        : (before = childNodes[i].src);
  }
  return result;
};
