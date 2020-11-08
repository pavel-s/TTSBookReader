import React, { useEffect, useRef, useCallback } from 'react';
import { FlatList, Text } from 'react-native';
import Img from '../../components/Img';

class ChapterParagraph extends React.PureComponent {
  handlePress = () => {
    this.props.handlePressParagraph(this.props.index);
  };

  render() {
    return this.props.item.image ? (
      <Img
        source={{ uri: this.props.item.image }}
        screenPadding={this.props.chapterStyles.content.padding}
      />
    ) : (
      <Text
        onPress={this.handlePress}
        style={
          this.props.isActive
            ? this.props.chapterStyles.activeParagraph
            : this.props.chapterStyles.paragraph
        }
      >
        {this.props.item.text}
      </Text>
    );
  }
}

const Chapter = ({
  chapter,
  appState,
  chapterIndex,
  current,
  handlePressParagraph,
  chapterStyles,
}) => {
  const scrollRef = useRef(null);
  const currentParagraph = current ? current.paragraph : 0;

  //scroll to active paragraph
  const scrollToCurrentParagraph = () => {
    if (current && scrollRef.current && appState === 'active') {
      scrollRef.current.scrollToIndex({
        animate: false,
        index: currentParagraph,
      });
    }
  };
  useEffect(scrollToCurrentParagraph, [currentParagraph, appState]);

  const handleScrollToIndexFailed = useCallback(
    ({ index, highestMeasuredFrameIndex }) => {
      if (
        index > highestMeasuredFrameIndex &&
        highestMeasuredFrameIndex + 5 < (chapter ? chapter.length : 0)
      ) {
        //scroll to +5 paragraph
        setTimeout(() => {
          scrollRef.current?.scrollToIndex({
            animate: false,
            index: highestMeasuredFrameIndex + 5,
          });
          //then try scroll to index again
          setTimeout(() => {
            scrollRef.current?.scrollToIndex({
              animate: false,
              index: index,
            });
          }, 10);
        }, 10);
      }
    },
    [chapter]
  );

  const renderParagraph = ({ item, index }) => (
    <ChapterParagraph
      item={item}
      index={index}
      isActive={index === currentParagraph}
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
      contentContainerStyle={chapterStyles.content}
      extraData={currentParagraph}
      scrollEventThrottle={32}
      maxToRenderPerBatch={3}
      updateCellsBatchingPeriod={80}
      windowSize={20}
      initialNumToRender={10}
    />
  );
};

const keyExtractor = (item, index) => 'p' + index;

export default React.memo(Chapter);
