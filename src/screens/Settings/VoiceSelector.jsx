import React, { useState, useMemo } from 'react';
import { List, ActivityIndicator, TextInput } from 'react-native-paper';
import { FlatList, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setTTSOption } from './../../redux/settingsReducer';
import { settingsTts, appTtsVoices } from './../../redux/selectors';

const VoiceSelector = () => {
  const dispatch = useDispatch();

  const isReady = true; //!!!
  const ttsOptions = useSelector(settingsTts);
  const voices = useSelector(appTtsVoices);
  voices.sort((a, b) => (a.name < b.name ? -1 : 1));

  const [filterText, setFilterText] = useState('');
  const [filteredVoices, setFilteredVoices] = useState();

  const setVoice = (id) => {
    dispatch(setTTSOption({ option: 'voice', value: id }));
  };

  const callbacks = useMemo(() => {
    const result = {};
    for (let i = 0; i < voices.length; i++) {
      result[voices[i].identifier] = () => setVoice(voices[i].identifier);
    }
    return result;
  }, [voices]);

  if (!isReady) return <ActivityIndicator style={styles.flex1} />;

  const renderItem = ({ item: voice }) => (
    <VoicesListItem
      title={voice.name}
      key={voice.identifier}
      onPress={callbacks[voice.identifier]}
      style={ttsOptions.voice === voice.identifier ? styles.currentVoice : null}
    />
  );

  const Filter = (
    <TextInput
      label='Filter'
      value={filterText}
      dense
      onChangeText={(text) => {
        setFilterText(text);
        setFilteredVoices(
          voices.filter(
            (voice) =>
              voice.name.toLowerCase().search(text.toLowerCase()) !== -1
          )
        );
      }}
    />
  );

  return (
    <>
      {Filter}
      <FlatList
        data={filteredVoices || voices}
        renderItem={renderItem}
        contentContainerStyle={styles.container}
        keyExtractor={(item) => item.identifier}
      />
    </>
  );
};

const VoicesListItem = React.memo((props) => <List.Item {...props} />);

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  container: { paddingHorizontal: 10 },
  currentVoice: { backgroundColor: 'darkblue' },
});

export default VoiceSelector;
