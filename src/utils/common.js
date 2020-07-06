export const parseFilePath = (path) => {
  const result = path.split(/\/(?!$)/);
  if (result[0] === '') result.shift();
  return result;
};
