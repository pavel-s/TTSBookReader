export const parseFilePath = (path) => {
  const result = path.split(/\/(?!$)/);
  if (result[0] === '') result.shift();
  return result;
};

export const delay = (ms) => new Promise((res) => setTimeout(res, ms));
