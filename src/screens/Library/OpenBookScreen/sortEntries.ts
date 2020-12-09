import { FSEntry } from '../../../redux/models';
import { compareStrings } from './../../../utils/common';

export const sortEntries = (entries: FSEntry[]) => {
  const directories = entries.filter((entry) => entry.isDirectory);
  const files = entries.filter((entry) => !entry.isDirectory);

  directories.sort((a, b) => compareStrings(a.name, b.name));
  files.sort((a, b) => compareStrings(a.name, b.name));

  return [...directories, ...files];
};
