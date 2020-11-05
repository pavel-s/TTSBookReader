import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { TextInput, Surface, IconButton } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { goToChapter } from '../../redux/readerReducer';

const ReaderNavMenu = ({ navigation }) => {
  const dispatch = useDispatch();

  const book = useSelector((state) =>
    state.library.books.find((book) => book.id === state.library.activeBook)
  );

  const [inputValue, setInputValue] = useState(
    String(book?.bookmark.chapter + 1)
  );

  // update inputValue when book was changed
  useEffect(() => {
    setInputValue(String(book?.bookmark.chapter + 1));
  }, [book]);

  // set and dispatch index on input change
  const handleTextChange = useCallback(
    (value) => {
      let number = +value;
      if (number > 0 && Number.isInteger(number)) {
        if (number < book?.chaptersList.length) {
          // use current index
          dispatch(goToChapter(number - 1)); // note: index start from 1 in ui
          setInputValue(value);
        } else {
          // use last available index
          dispatch(goToChapter(book?.chaptersList.length - 2));
          setInputValue(String(book?.chaptersList.length - 2));
        }
      } else {
        // clear input
        setInputValue('');
      }
    },
    [book?.chaptersList.length]
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

export default React.memo(ReaderNavMenu);
