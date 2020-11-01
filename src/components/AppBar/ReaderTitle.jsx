import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Title, List, useTheme, TouchableRipple } from 'react-native-paper';
import { useSelector } from 'react-redux';

const ReaderTitle = ({ onPress, showBookNav }) => {
  const theme = useTheme();

  const title = useSelector((state) => {
    const book = state.library.books.find(
      (book) => book.id === state.library.activeBook
    );
    return book?.chaptersList[book.bookmark.chapter];
  });

  if (!title) return null;

  return (
    <TouchableRipple
      underlayColor={'rgba(0,0,0,0.1)'}
      style={styles.flex1}
      onPress={onPress}
    >
      <View style={styles.chapterHeader}>
        <Title
          style={[styles.title, { color: theme.colors.onPrimary }]}
          numberOfLines={2}
        >
          {title}
        </Title>
        <List.Icon
          icon={showBookNav ? 'chevron-up' : 'chevron-down'}
          style={styles.chapterHeaderMore}
        />
      </View>
    </TouchableRipple>
  );
};

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  chapterHeader: {
    flex: 1,
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chapterHeaderMore: {
    position: 'absolute',
    width: '100%',
    bottom: -21,
    opacity: 0.5,
  },
  title: { marginLeft: 10, fontSize: 18, lineHeight: 20 },
});

export default React.memo(ReaderTitle);
