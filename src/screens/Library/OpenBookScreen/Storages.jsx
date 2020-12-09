import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentStorage } from '../../../redux/filesReducer';
import { filesStorages, filesCurrentStorage } from './../../../redux/selectors';
import { Surface, List } from 'react-native-paper';

const Storages = () => {
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(false);
  const storages = useSelector(filesStorages);
  const currentStorage = useSelector(filesCurrentStorage);

  const handlePress = () => {
    setExpanded(!expanded);
  };

  return (
    <Surface>
      <List.Accordion
        title={storages[currentStorage].name}
        left={(props) => <List.Icon {...props} icon='folder' />}
        expanded={expanded}
        onPress={handlePress}
      >
        {storages.map((storage, index) => (
          <List.Item
            title={storage.name}
            onPress={() => dispatch(setCurrentStorage(index))}
            key={String(index)}
          />
        ))}
      </List.Accordion>
    </Surface>
  );
};

export default React.memo(Storages);
