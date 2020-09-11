import React, {
  useEffect,
  useRef,
  useCallback,
  useState,
  useMemo,
} from 'react';
import { View, StyleSheet, Image, FlatList, AppState } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
  ActivityIndicator,
  Paragraph,
  Surface,
  useTheme,
} from 'react-native-paper';
import NavButton from './NavButton';
import {
  getChapter,
  speakAll,
  stopSpeaking,
  TTS_STATUSES,
  goToChapter,
} from '../../redux/readerReducer';

const Reader = () => {
  const dispatch = useDispatch();
  const scrollRef = useRef(null);
  const activeParagraphColor = useTheme().colors.activeParagraph;
  const fontSize = useSelector((state) => state.reader.fontSize);

  const ttsStatus = useSelector((state) => state.reader.status);
  const isSpeaking = useRef();
  isSpeaking.current = ttsStatus === TTS_STATUSES.speaking;

  const current = useSelector((state) => state.reader.current);
  const totalChapters = useSelector((state) => state.reader.totalChapters);

  // is App 'active' or 'background'
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    const listener = (state) => setAppState(state);
    AppState.addEventListener('change', listener);
    return () => AppState.removeEventListener('change', listener);
  }, []);

  //initially request chapter content
  useEffect(() => {
    dispatch(getChapter());
  }, []);

  //scroll to active paragraph
  const scrollToCurrentParagraph = () => {
    if (scrollRef.current && appState === 'active') {
      setTimeout(() => {
        scrollRef.current.scrollToIndex({
          animate: false,
          index: current.paragraph,
        });
      }, 50);
    }
  };
  useEffect(scrollToCurrentParagraph, [
    current.paragraph,
    current.chapter,
    appState,
  ]);

  const handleScrollToIndexFailed = useCallback(
    ({ index, highestMeasuredFrameIndex }) => {
      if (
        index > highestMeasuredFrameIndex &&
        highestMeasuredFrameIndex + 5 < current.content.length
      ) {
        //scroll to +5 paragraph
        setTimeout(() => {
          scrollRef.current.scrollToIndex({
            animate: false,
            index: highestMeasuredFrameIndex + 5,
          });
          //then try scroll to index again
          setTimeout(() => {
            scrollRef.current.scrollToIndex({
              animate: false,
              index: index,
            });
          }, 10);
        }, 10);
      }
    },
    [current]
  );

  const handlePressNav = (prev) => {
    dispatch(goToChapter(prev ? current.chapter - 1 : current.chapter + 1));
  };

  const handlePressParagraph = (index) => {
    if (isSpeaking.current) {
      dispatch(stopSpeaking());
    } else {
      dispatch(speakAll(index));
    }
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1 },
        content: { padding: 5 },
        paragraph: { fontSize: fontSize, paddingVertical: 5 },
      }),
    [fontSize]
  );

  const renderItem = useCallback(
    ({ item, index }) =>
      item.image ? (
        <Image source={item.image} />
      ) : (
        <Paragraph
          style={
            current.paragraph === index
              ? { ...styles.paragraph, backgroundColor: activeParagraphColor }
              : styles.paragraph
          }
          onPress={() => handlePressParagraph(index)}
        >
          {item.text}
        </Paragraph>
      ),
    [current]
  );

  if (!current.content.length) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.container}>
      <Surface>
        <FlatList
          ref={scrollRef}
          data={current.content}
          renderItem={renderItem}
          keyExtractor={(item, index) => 'p' + index}
          onScrollToIndexFailed={handleScrollToIndexFailed}
          contentContainerStyle={styles.content}
        />
      </Surface>
      {current.chapter > 0 && (
        <NavButton prev handlePress={() => handlePressNav(true)} />
      )}
      {current.chapter < totalChapters - 1 && (
        <NavButton handlePress={() => handlePressNav()} />
      )}
    </View>
  );
};

export default Reader;
