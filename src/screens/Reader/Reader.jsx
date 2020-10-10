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
  TTS_STATUSES,
  goToChapter,
  toggleSpeaking,
} from '../../redux/readerReducer';
import Chapter from './Chapter';
import { useTheme } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const Reader = () => {
  const dispatch = useDispatch();

  const fontSize = useSelector((state) => state.reader.fontSize);

  const ttsStatus = useSelector((state) => state.reader.status);
  const isSpeaking = useRef();
  isSpeaking.current = ttsStatus === TTS_STATUSES.speaking;

  const current = useSelector((state) => state.reader.current);
  const bookContent = useSelector((state) => state.reader.content);

  // is App 'active' or 'background' //todo: try ref instead
  // const [appState, setAppState] = useState(AppState.currentState);
  const appState = useRef(AppState.currentState);
  useEffect(() => {
    const listener = (state) => (appState.current = state);
    AppState.addEventListener('change', listener);
    return () => AppState.removeEventListener('change', listener);
  }, []);

  //initially request chapter content
  useEffect(() => {
    dispatch(getBook());
  }, []);

  //styles for chapter
  const {
    activeParagraph: activeParagraphColor,
    onSurface,
  } = useTheme().colors;

  const chapterStyles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1 },
        content: { padding: 5, width: width },
        paragraph: {
          color: onSurface,
          fontSize: fontSize,
          paddingVertical: 5,
        },
        activeParagraph: {
          color: onSurface,
          fontSize: fontSize,
          backgroundColor: activeParagraphColor,
        },
      }),
    [fontSize]
  );

  //horizontal scroll to current chapter cell of FlatList
  const chaptersScrollRef = useRef(null);
  useEffect(() => {
    chaptersScrollRef.current &&
      chaptersScrollRef.current.scrollToIndex({
        animate: false,
        index: current.chapter,
      });
  }, [current.chapter]);

  const handlePressParagraph = useCallback((index) => {
    dispatch(toggleSpeaking(index));
  }, []);

  const renderChapter = ({ item: chapter, index }) => {
    return (
      <Chapter
        chapter={chapter}
        appState={appState}
        fontSize={fontSize}
        chapterIndex={index}
        handlePressParagraph={handlePressParagraph}
        current={current.chapter === index ? current : false}
        chapterStyles={chapterStyles}
      />
    );
  };

  const setCurrentChapter = useCallback(
    ({ nativeEvent: { contentOffset, layoutMeasurement } }) => {
      const chapterIndex = Math.floor(
        contentOffset.x / layoutMeasurement.width
      );
      dispatch(goToChapter(chapterIndex));
    },
    []
  );

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
          maxToRenderPerBatch={3}
          updateCellsBatchingPeriod={100}
          initialScrollIndex={current.chapter}
          initialNumToRender={3}
          removeClippedSubviews
          keyExtractor={keyExtractor}
          renderItem={renderChapter}
          ref={chaptersScrollRef}
          onMomentumScrollEnd={setCurrentChapter}
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

export default Reader;

/*

  const handlePressNav = (prev) => {
    dispatch(goToChapter(prev ? current.chapter - 1 : current.chapter + 1));
  };

      {current.chapter > 0 && (
        <NavButton prev handlePress={() => handlePressNav(true)} />
      )}
      {current.chapter < totalChapters - 1 && (
        <NavButton handlePress={() => handlePressNav()} />
      )}


*/
