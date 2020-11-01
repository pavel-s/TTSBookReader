import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { TextInput, Surface } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { goToChapter } from '../../redux/readerReducer';

const ReaderNavMenu = () => {
  const dispatch = useDispatch();

  const book = useSelector((state) =>
    state.library.books.find((book) => book.id === state.library.activeBook)
  );

  const [inputValue, setInputValue] = useState(
    String(book?.bookmark.chapter + 1)
  );

  // update value when book was changed
  useEffect(() => {
    setInputValue(String(book?.bookmark.chapter + 1));
  }, [book]);

  const handleGoChapter = useCallback(
    (value) => {
      let number = +value;
      if (number > 0 && Number.isInteger(number)) {
        if (number < book?.chaptersList.length) {
          dispatch(goToChapter(number - 1));
          setInputValue(value);
        }
      } else {
        setInputValue('');
      }
    },
    [book?.chaptersList.length]
  );

  return (
    <Surface style={styles.bookNav}>
      <TextInput
        style={styles.input}
        label='Chapter'
        placeholder={'123'}
        value={inputValue}
        onChangeText={handleGoChapter}
        keyboardType='numeric'
      />
    </Surface>
  );
};

const styles = StyleSheet.create({
  bookNav: { alignItems: 'center' },
  input: {
    width: 120,
    backgroundColor: 'rgba(0,0,0,0.2)',
    fontSize: 20,
    margin: 5,
    marginLeft: 10,
  },
});

export default React.memo(ReaderNavMenu);
