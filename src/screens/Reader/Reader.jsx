import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from 'react';
import { View, StyleSheet, FlatList, AppState, Dimensions } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { ActivityIndicator, Surface } from 'react-native-paper';
import {
  getBook,
  goToChapter,
  toggleSpeaking,
} from '../../redux/readerReducer';
import Chapter from './Chapter';
import { useTheme } from '@react-navigation/native';
import withAppBar from '../../components/hoc/withAppBar';

const { width } = Dimensions.get('window');

const Reader = () => {
  const dispatch = useDispatch();

  const fontSize = useSelector((state) => state.settings.fontSize);

  const current = useSelector((state) => state.reader.current);
  const bookContent = useSelector((state) => state.reader.content);

  // system app state: active, background (in another app, on the home screen,
  // [Android] on another Activity (even if it was launched by your app)), [iOS] inactive
  const [appState, setAppState] = useState(AppState.currentState);
  useEffect(() => {
    const listener = (state) => setAppState(state);
    AppState.addEventListener('change', listener);
    return () => AppState.removeEventListener('change', listener);
  }, []);

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
          color: themeColors.onSurface,
          fontSize: fontSize,
          backgroundColor: themeColors.activeParagraph,
        },
      }),
    [fontSize, themeColors]
  );

  //horizontal scroll to current chapter cell of FlatList
  const chaptersScrollRef = useRef(null);
  useEffect(() => {
    if (chaptersScrollRef.current && appState === 'active') {
      chaptersScrollRef.current.scrollToIndex({
        animate: false,
        index: current.chapter,
      });
    }
  }, [current.chapter]);

  const handlePressParagraph = useCallback((index) => {
    dispatch(toggleSpeaking(index));
  }, []);

  const renderChapter = ({ item: chapter, index }) => {
    const isCurrent = current.chapter === index;
    return (
      <Chapter
        chapter={chapter}
        appState={isCurrent && appState}
        fontSize={fontSize}
        chapterIndex={index}
        handlePressParagraph={handlePressParagraph}
        current={isCurrent && current}
        chapterStyles={chapterStyles}
      />
    );
  };

  const setCurrentChapter = useCallback(
    ({ nativeEvent: { contentOffset, layoutMeasurement } }) => {
      const chapterIndex = Math.round(
        contentOffset.x / layoutMeasurement.width
      );
      if (chapterIndex !== current.chapter) {
        dispatch(goToChapter(chapterIndex));
      }
    },
    [current.chapter]
  );

  if (appState !== 'active') {
    return null;
  }

  if (!bookContent || !bookContent.length) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.container}>
      <Surface>
        <FlatList
          data={bookContent}
          horizontal
          pagingEnabled
          getItemLayout={getItemLayout}
          maxToRenderPerBatch={1}
          updateCellsBatchingPeriod={100}
          windowSize={5}
          initialNumToRender={5}
          initialScrollIndex={current.chapter}
          removeClippedSubviews
          keyExtractor={keyExtractor}
          renderItem={renderChapter}
          ref={chaptersScrollRef}
          onMomentumScrollEnd={setCurrentChapter}
          scrollEventThrottle={32}
        />
      </Surface>
    </View>
  );
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

// export default withAppBar(Reader);
export default Reader;
