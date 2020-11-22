import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import useNavigateTo from '../../hooks/useNavigateTo';

const ChapterFooter = ({
  chapterIndex,
  isLastChapter,
  scrollToNextChapter,
}) => {
  const navigateToLibrary = useNavigateTo('Library');

  return (
    <Button
      mode='contained'
      style={styles.button}
      onPress={
        isLastChapter
          ? navigateToLibrary
          : () => scrollToNextChapter(chapterIndex)
      }
    >
      {isLastChapter ? 'To Library' : 'Next Chapter'}
    </Button>
  );
};

const styles = StyleSheet.create({
  button: { marginVertical: 20 },
});

export default React.memo(ChapterFooter);
