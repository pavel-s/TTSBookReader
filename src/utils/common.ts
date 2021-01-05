export const parseFilePath = (
  path: string,
  root: string,
  storageName: string
): { name: string; path: string }[] => {
  const first = { name: storageName, path: root };
  if (path === root) return [first];
  const result = path
    .slice(root.length)
    .split(/\/(?!$)/)
    .map((name, i, arr) => ({
      name,
      path: root + arr.slice(0, i).join('/'),
    }));
  if (result[0].name === '') {
    result[0] = first;
  } else {
    result.unshift(first);
  }
  return result;
};

export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const compareStrings = (a: string, b: string) => {
  const lA = a.toLowerCase();
  const lB = b.toLowerCase();
  return lA > lB ? 1 : lA === lB ? 0 : -1;
};

export const getFileExtension = (name: string) => {
  const dotIndex = name.lastIndexOf('.');
  return dotIndex === -1 ? '' : name.substring(dotIndex + 1);
};

/** get directory part from path */
export const getBasePath = (path: string): string => {
  const match = path.match(/.+\//);
  if (match) {
    return match[0];
  }
  return '';
};
