import React, {
  useEffect,
  useRef,
  useCallback,
  useState,
  useMemo,
} from 'react';
import { FlatList, Text } from 'react-native';
import { Constants } from 'react-native-unimodules';
import Img from '../../components/Img';
import useMounted from './../../hooks/useMounted';
import ChapterFooter from './ChapterFooter';

const ChapterParagraph = React.memo(
  ({ item, index, isActive, handlePressParagraph, chapterStyles }) =>
    item.image ? (
      <Img
        source={{ uri: item.image }}
        screenPadding={chapterStyles.content.padding}
      />
    ) : (
      <Text
        onPress={() => handlePressParagraph(index)}
        style={[
          chapterStyles.paragraph,
          isActive && chapterStyles.activeParagraph,
        ]}
      >
        {Constants.isDevice ? item.text : index + item.text}
      </Text>
    )
);

const maxToRenderPerBatch = 28;

const Chapter = ({
  chapter,
  current,
  handlePressParagraph,
  chapterStyles,
  chapterIndex,
  isLastChapter,
  scrollToNextChapter,
  isSpeaking,
}) => {
  const isCurrentChapter = !!current;
  const isMounted = useMounted();
  const scrollRef = useRef(null);
  const scrollErrorRef = useRef(false);

  const currentParagraphRef = useRef(null);
  currentParagraphRef.current = isCurrentChapter ? current.paragraph : 0;

  const isCurrentNotInWindow =
    currentParagraphRef.current + 1 > maxToRenderPerBatch;

  // if loadUntilCurrent is true - set initialNumToRender = current.paragraph + 1 to load all items (paragraphs)
  // up to current index. After that we can scroll to needed index
  const [loadUntilCurrent, setLoadUntilCurrent] = useState(
    isCurrentNotInWindow
  );

  const scrollToCurrentParagraph = useCallback(() => {
    scrollRef.current?.scrollToIndex({
      animate: true,
      index: currentParagraphRef.current,
    });
  }, []);

  useEffect(() => {
    if (isCurrentChapter && currentParagraphRef.current > 0)
      scrollToCurrentParagraph();
  }, [currentParagraphRef.current, isCurrentChapter, isSpeaking]);

  const scrollToCurrentIfError = useCallback(() => {
    if (isMounted.current && scrollErrorRef.current) {
      scrollErrorRef.current = false;
      scrollToCurrentParagraph();
      // setLoadUntilCurrent(false);
    }
  }, []);

  const handleScrollToIndexFailed = useCallback(
    ({ index, highestMeasuredFrameIndex }) => {
      if (isMounted.current && index > highestMeasuredFrameIndex) {
        scrollErrorRef.current = true;
        setLoadUntilCurrent(true);
      }
    },
    []
  );

  const chapterFooter = useMemo(
    () => (
      <ChapterFooter
        {...{ chapterIndex, isLastChapter, scrollToNextChapter }}
      />
    ),
    [chapterIndex, isLastChapter, scrollToNextChapter]
  );

  const renderParagraph = ({ item, index }) => (
    <ChapterParagraph
      item={item}
      index={index}
      isActive={index === currentParagraphRef.current}
      chapterStyles={chapterStyles}
      handlePressParagraph={handlePressParagraph}
    />
  );

  return (
    <FlatList
      ref={scrollRef}
      data={chapter}
      renderItem={renderParagraph}
      keyExtractor={keyExtractor}
      onScrollToIndexFailed={handleScrollToIndexFailed}
      onContentSizeChange={isCurrentChapter && scrollToCurrentIfError}
      contentContainerStyle={chapterStyles.content}
      extraData={currentParagraphRef.current}
      scrollEventThrottle={64}
      maxToRenderPerBatch={maxToRenderPerBatch}
      updateCellsBatchingPeriod={32}
      windowSize={isCurrentChapter ? 7 : 3}
      initialNumToRender={
        isCurrentChapter && loadUntilCurrent
          ? currentParagraphRef.current + maxToRenderPerBatch // render additional items, then current item will be on top
          : maxToRenderPerBatch
      }
      removeClippedSubviews={false}
      ListFooterComponent={chapterFooter}
    />
  );
};

const keyExtractor = (item, index) => 'p' + index;

export default React.memo(Chapter);
