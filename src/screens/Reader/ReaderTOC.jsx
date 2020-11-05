import React, { useEffect, useRef, useMemo } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { ActivityIndicator, List, Surface, useTheme } from 'react-native-paper';
import { goToChapter } from '../../redux/readerReducer';

import {
  readerChapterTitles,
  readerCurrentChapter,
} from './../../redux/selectors';

// calculated manually, with default styles
const LIST_ITEM_HEIGHT = 50;

const ReaderTOC = () => {
  const dispatch = useDispatch();

  const theme = useTheme();
  const itemStyles = useMemo(() => makeItemStyles(theme), [theme]);

  const chapterTitles = useSelector(readerChapterTitles);
  const currentChapter = useSelector(readerCurrentChapter);

  const itemPressHandlers = useMemo(() =>
    chapterTitles.map((title, index) => () => dispatch(goToChapter(index)), [
      chapterTitles,
    ])
  );

  const scrollRef = useRef(null);

  // scroll to current item
  useEffect(() => {
    if (currentChapter) {
      scrollRef.current?.scrollToIndex({ index: currentChapter });
    }
  }, [currentChapter]);

  const renderItem = ({ item: title, index }) => {
    const isCurrent = currentChapter === index;
    return (
      <ListItem
        title={title}
        titleStyles={itemStyles}
        handlePress={!isCurrent && itemPressHandlers[index]}
      />
    );
  };

  if (!chapterTitles) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.container}>
      <Surface>
        <FlatList
          data={chapterTitles}
          getItemLayout={getItemLayout}
          initialScrollIndex={currentChapter}
          removeClippedSubviews
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ref={scrollRef}
          scrollEventThrottle={32}
        />
      </Surface>
    </View>
  );
};

const ListItem = React.memo(({ title, handlePress, titleStyles }) => (
  <List.Item
    title={title}
    onPress={handlePress}
    titleStyle={!handlePress && titleStyles.current}
    style={titleStyles.item}
  />
));

const getItemLayout = (data, index) => ({
  length: LIST_ITEM_HEIGHT,
  offset: LIST_ITEM_HEIGHT * index,
  index,
});

const keyExtractor = (item, index) => 'toc' + index;

const styles = StyleSheet.create({
  container: { flex: 1 },
});

const makeItemStyles = (theme) =>
  StyleSheet.create({
    item: { height: LIST_ITEM_HEIGHT },
    current: { color: theme.colors.primary },
  });

export default ReaderTOC;
