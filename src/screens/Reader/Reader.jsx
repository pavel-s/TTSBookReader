import React, { useCallback, useEffect, useRef, useMemo } from 'react';
import { StyleSheet, FlatList, Dimensions } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { ActivityIndicator, Surface } from 'react-native-paper';
import Chapter from './Chapter';
import { useTheme, useNavigation } from '@react-navigation/native';
import { fetchBookContent, toggleSpeaking } from './../../redux/readerReducer';
import {
  readerIsSpeaking,
  readerContent,
  settingsFontSize,
  libraryActiveBookId,
  activeBookCurrent,
  readerStatus,
} from './../../redux/selectors';
import { bookCurrentUpdated } from '../../redux/booksReducer';
import withFSPermission from './../../components/hoc/withFSPermission';
import useNavigateTo from './../../hooks/useNavigateTo';

const { width } = Dimensions.get('window');

const Reader = ({ bookContent, activeBookId, dispatch }) => {
  const fontSize = useSelector(settingsFontSize);

  const current = useSelector(activeBookCurrent);

  const isSpeaking = useSelector(readerIsSpeaking);
  const isSpeakingPrevRef = useRef(isSpeaking);
  const needScrollToParagraph =
    isSpeaking === isSpeakingPrevRef.current ||
    (isSpeaking && !isSpeakingPrevRef.current);
  isSpeakingPrevRef.current = isSpeaking;

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
    if (!current.changedByScrolling) {
      try {
        chaptersScrollRef.current?.scrollToIndex({
          animate: false,
          index: current.chapter,
        });
      } catch (error) {
        console.log('chapter scroll error', error);
      }
    }
  }, [current.chapter]);

  const scrollToNextChapter = useCallback((currentIndex) => {
    try {
      chaptersScrollRef.current?.scrollToIndex({
        animate: true,
        index: currentIndex + 1,
      });
    } catch (error) {
      console.log('next chapter scroll error', error);
    }
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
      viewableItems[0].index !== currentRef.current.chapter
    ) {
      dispatch(
        bookCurrentUpdated({
          bookId: activeBookId,
          current: { chapter: viewableItems[0].index, paragraph: 0 },
        })
      );
    }
  }, []);

  const initialScrollIndex = useMemo(() => current.chapter, [activeBookId]);

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

const ReaderContainer = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const bookContent = useSelector(readerContent);
  const status = useSelector(readerStatus);
  const activeBookId = useSelector(libraryActiveBookId);

  // fetch book content
  useEffect(() => {
    dispatch(fetchBookContent());
  }, [activeBookId]);

  if (status !== 'succeeded') {
    return <ActivityIndicator style={styles.container} />;
  }

  return (
    <Reader
      bookContent={bookContent}
      activeBookId={activeBookId}
      dispatch={dispatch}
    />
  );
};

export default React.memo(withFSPermission(ReaderContainer));
