import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Title, List, useTheme, TouchableRipple } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import {
  libraryActiveBookChapterTitle,
  readerShowNav,
} from '../../redux/selectors';
import { toggleShowNav } from './../../redux/readerReducer';

const ReaderTitle = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const title = useSelector(libraryActiveBookChapterTitle);
  const showBookNav = useSelector(readerShowNav);

  const onPress = () => dispatch(toggleShowNav());

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
          color={theme.colors.onPrimary}
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
    bottom: -22,
    opacity: 0.5,
  },
  title: { marginLeft: 10, fontSize: 18, lineHeight: 20 },
});

export default React.memo(ReaderTitle);
