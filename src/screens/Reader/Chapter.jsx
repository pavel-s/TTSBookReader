import React, { useEffect, useRef, useCallback } from 'react';
import { StyleSheet, Image, FlatList, Dimensions, Text } from 'react-native';
import defaultImage from '../../../assets/default_image.png';

class ChapterParagraph extends React.PureComponent {
  handlePress = () => {
    this.props.handlePressParagraph(this.props.index);
  };

  render() {
    return this.props.item.image ? (
      <Image
        source={{ uri: this.props.item.image }}
        loadingIndicatorSource={defaultImage}
        style={chapterStyles.image}
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
    if (current && scrollRef.current && appState.current === 'active') {
      setTimeout(() => {
        scrollRef.current.scrollToIndex({
          animate: false,
          index: currentParagraph,
        });
      }, 50);
    }
  };
  useEffect(scrollToCurrentParagraph, [currentParagraph, appState.current]);

  const handleScrollToIndexFailed = useCallback(
    ({ index, highestMeasuredFrameIndex }) => {
      if (
        index > highestMeasuredFrameIndex &&
        highestMeasuredFrameIndex + 5 < (chapter ? chapter.length : 0)
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
    />
  );
};

const keyExtractor = (item, index) => 'p' + index;

const chapterStyles = StyleSheet.create({
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
    marginBottom: 5,
  },
});

export default React.memo(Chapter);

/*

      <Paragraph
        style={
          isActive
            ? { ...styles.paragraph, backgroundColor: activeParagraphColor }
            : styles.paragraph
        }
        onPress={() => handlePressParagraph(index)}
      >
        {item.text}
      </Paragraph>

*/

/*


  const ChapterParagraph = React.memo(({ item, index, isActive }) =>
    item.image ? (
      <Image source={item.image} />
    ) : (
      <Text
        onPress={() => {
          handlePressParagraph(index);
        }}
        style={
          isActive ? chapterStyles.activeParagraph : chapterStyles.paragraph
        }
      >
        {item.text}
      </Text>
    )
  );

*/
