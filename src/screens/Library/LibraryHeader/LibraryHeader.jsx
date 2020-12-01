import { throttle } from 'lodash';
import React, { useCallback, useState, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter } from '../../../redux/libraryReducer';
import { libraryFilter } from '../../../redux/selectors';
import MoreMenu from './MoreMenu';

const THROTTLE_WAIT = 1000;

const LibraryHeader = () => {
  const dispatch = useDispatch();

  const filter = useSelector(libraryFilter);

  const [filterValue, setFilterValue] = useState(filter);

  const handleTextChange = useMemo(() => {
    const setBooksFilterThrottled = throttle(
      (filter) => dispatch(setFilter(filter)),
      THROTTLE_WAIT
    );
    return (value) => {
      setFilterValue(value);
      setBooksFilterThrottled(value);
    };
  }, [setFilterValue]);

  return (
    <View style={styles.container}>
      <Searchbar
        style={styles.searchbar}
        placeholder='Search'
        onChangeText={handleTextChange}
        value={filterValue}
        inputStyle={styles.inputStyle}
      />
      <MoreMenu dispatch={dispatch} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  searchbar: { flex: 1, height: 40 },
  inputStyle: { padding: 0, paddingLeft: 0 },
});

export default React.memo(LibraryHeader);
