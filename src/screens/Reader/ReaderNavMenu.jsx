import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { TextInput, Surface, IconButton } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { activeBookUpdateCurrent } from '../../redux/booksReducer';
// import { goToChapter } from '../../redux/readerReducer';
import {
  activeBookCurrent,
  libraryActiveBook,
  readerShowNav,
  readerChapterTitles,
} from './../../redux/selectors';

const ReaderNavMenu = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  // const book = useSelector(libraryActiveBook);
  const bookCurrent = useSelector(activeBookCurrent);
  const bookTitles = useSelector(readerChapterTitles);

  const [inputValue, setInputValue] = useState(String(bookCurrent.chapter + 1));

  // update inputValue when book was changed
  useEffect(() => {
    setInputValue(String(bookCurrent.chapter + 1));
  }, [bookCurrent]);

  // set and dispatch index on input change
  const handleTextChange = useCallback(
    (value) => {
      let number = +value;
      if (number > 0 && Number.isInteger(number)) {
        if (number < bookTitles.length) {
          // use current index
          dispatch(
            activeBookUpdateCurrent({ chapter: number - 1, paragraph: 0 })
          ); // note: index start from 1 in ui
          setInputValue(value);
        } else {
          // use last available index
          dispatch(
            activeBookUpdateCurrent({
              chapter: bookTitles.length - 2,
              paragraph: 0,
            })
          );
          setInputValue(String(bookTitles.length - 2));
        }
      } else {
        // clear input
        setInputValue('');
      }
    },
    [bookTitles.length]
  );

  return (
    <Surface style={styles.bookNav} elevation={5}>
      <TextInput
        style={styles.input}
        label='Chapter'
        placeholder={'123'}
        value={inputValue}
        onChangeText={handleTextChange}
        keyboardType='numeric'
      />
      <IconButton
        icon='table-of-contents'
        size={30}
        onPress={() => navigation.navigate({ name: 'Table of Contents' })}
      />
    </Surface>
  );
};

const styles = StyleSheet.create({
  bookNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: 120,
    backgroundColor: 'rgba(0,0,0,0.2)',
    fontSize: 20,
    margin: 5,
    marginLeft: 10,
  },
});

const ReaderNavMenuContainer = () => {
  const showNav = useSelector(readerShowNav);
  if (!showNav) return null;
  return <ReaderNavMenu />;
};

export default React.memo(ReaderNavMenuContainer);
