import React, { useCallback, useEffect, useRef, useMemo } from 'react';
import { StyleSheet, FlatList, Dimensions } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { ActivityIndicator, Surface } from 'react-native-paper';
import {
  getBook,
  goToChapter,
  toggleSpeaking,
} from '../../redux/readerReducer';
import Chapter from './Chapter';
import { useTheme } from '@react-navigation/native';
import { readerIsFetching, readerIsSpeaking } from './../../redux/selectors';

const { width } = Dimensions.get('window');

const Reader = () => {
  const dispatch = useDispatch();

  const fontSize = useSelector((state) => state.settings.fontSize);

  const current = useSelector((state) => state.reader.current);
  const isReaderNotInit = current.chapter === undefined; // todo: remove after add container for Reader
  const bookContent = useSelector((state) => state.reader.content);
  const isFetching = useSelector(readerIsFetching);

  const isSpeaking = useSelector(readerIsSpeaking);
  const isSpeakingPrevRef = useRef(isSpeaking);
  const needScrollToParagraph =
    isSpeaking === isSpeakingPrevRef.current ||
    (isSpeaking && !isSpeakingPrevRef.current);
  isSpeakingPrevRef.current = isSpeaking;

  const activeBookId = useSelector((state) => state.library.activeBook);
  //initially request chapter content
  useEffect(() => {
    dispatch(getBook());
  }, [activeBookId]);

  //styles for chapter
  const themeColors = useTheme().colors;

  const chapterStyles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1 },
        content: { padding: 5, width },
        paragraph: {
          color: themeColors.onSurface,
          fontSize: fontSize,
          paddingVertical: 5,
        },
        activeParagraph: {
          backgroundColor: themeColors.activeParagraph,
        },
      }),
    [fontSize, themeColors]
  );

  // Horizontal scroll to current chapter cell of FlatList.
  const chaptersScrollRef = useRef(null);
  useEffect(() => {
    if (!isReaderNotInit && !current.changedByScrolling) {
      chaptersScrollRef.current?.scrollToIndex({
        animate: false,
        index: current.chapter,
      });
    }
  }, [current.chapter]);

  const scrollToNextChapter = useCallback((currentIndex) => {
    chaptersScrollRef.current?.scrollToIndex({
      animate: true,
      index: currentIndex + 1,
    });
  }, []);

  const handlePressParagraph = useCallback((index) => {
    dispatch(toggleSpeaking(index));
  }, []);

  const renderChapter = ({ item: chapter, index }) => {
    const isCurrent = current.chapter === index;
    return (
      <Chapter
        chapter={chapter}
        chapterIndex={index}
        handlePressParagraph={handlePressParagraph}
        current={isCurrent && current}
        chapterStyles={chapterStyles}
        isLastChapter={index === bookContent.length - 1}
        scrollToNextChapter={scrollToNextChapter}
        needScrollToParagraph={isCurrent && needScrollToParagraph}
      />
    );
  };

  const currentRef = useRef(null);
  currentRef.current = current;
  const setCurrentChapter = useCallback(({ viewableItems }) => {
    if (
      viewableItems.length &&
      viewableItems[0].index !== currentRef.current.chapter &&
      currentRef.current.chapter !== undefined //isReaderNotInit //todo: remove
    ) {
      dispatch(goToChapter(viewableItems[0].index, true));
    }
  }, []);

  const initialScrollIndex = useMemo(() => current.chapter, [
    activeBookId,
    isReaderNotInit,
  ]);

  if (isFetching || isReaderNotInit) {
    return <ActivityIndicator style={styles.container} />;
  }

  return (
    <Surface style={styles.container}>
      <FlatList
        data={bookContent}
        horizontal
        pagingEnabled
        getItemLayout={getItemLayout}
        maxToRenderPerBatch={1}
        updateCellsBatchingPeriod={100}
        windowSize={5}
        initialNumToRender={1}
        initialScrollIndex={initialScrollIndex}
        keyExtractor={keyExtractor}
        renderItem={renderChapter}
        ref={chaptersScrollRef}
        scrollEventThrottle={64}
        style={styles.container}
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={setCurrentChapter}
      />
    </Surface>
  );
};

const viewabilityConfig = {
  itemVisiblePercentThreshold: 99,
  minimumViewTime: 10,
};

const getItemLayout = (data, index) => ({
  length: width,
  offset: width * index,
  index,
});

const keyExtractor = (item, index) => 'ch' + index;

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default Reader;
