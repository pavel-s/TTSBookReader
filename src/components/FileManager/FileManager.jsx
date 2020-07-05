import React from 'react';

const FileManager = ({}) => {
  return <div></div>;
};

export default FileManager;

// const handleRootButtonPress = async () => {
//   setFetching(true);
//   try {
//     const info = await FileSystem.getInfoAsync(
//       'file:///storage/emulated/0/Download/test.json'
//     );
//     console.log(info);
//     const result = await FileSystem.readAsStringAsync(
//       'file:///storage/emulated/0/Download/test.json'
//     );
//     console.log('file read ok');
//     const json = JSON.parse(result);
//     console.log(json.title);
//     console.log(json.novelupdatesPage);
//   } catch (error) {
//     console.log(error);
//   }
//   setFetching(false);
// };
