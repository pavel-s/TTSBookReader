import React, { useEffect, useRef, useState } from 'react';
import { View, ScrollView, StyleSheet, Image, Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { ActivityIndicator, Paragraph, Button } from 'react-native-paper';
import NavButton from './NavButton';
import {
  getChapter,
  speakAll,
  stopSpeaking,
  TTS_STATUSES,
  goToChapter,
} from '../../redux/readerReducer';

const Reader = () => {
  console.log('render Reader');
  const dispatch = useDispatch();
  const scrollRef = useRef(null);

  // Y offsets for paragraphs
  const layoutRef = useRef({});

  const ttsStatus = useSelector((state) => state.reader.status);
  const isSpeaking = ttsStatus === TTS_STATUSES.speaking;

  const current = useSelector((state) => state.reader.current);

  const totalChapters = useSelector((state) => state.reader.totalChapters);

  //initially request chapter content
  useEffect(() => {
    dispatch(getChapter());
  }, []);

  //scroll to top when navigate between chapters
  useEffect(() => {
    scrollRef.current &&
      scrollRef.current.scrollTo({ x: 0, y: 0, animated: true });
  }, [current.chapter]);

  //scroll to active paragraph
  useEffect(() => {
    const currentParagraphOffsetY = layoutRef.current[current.paragraph];

    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        x: 0,
        y: currentParagraphOffsetY,
        animated: true,
      });
    }
  }, [current.paragraph]);

  if (!current.content.length) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  const handlePressNav = (prev) => {
    dispatch(goToChapter(prev ? current.chapter - 1 : current.chapter + 1));
  };

  const handlePressParagraph = (index) => {
    dispatch(speakAll(index));
  };

  const elements = current.content.reduce((acc, item, index) => {
    const arr = [];

    item.before &&
      arr.push(
        <Image source={item.before} key={acc.length + arr.length + 1} />
      );
    arr.push(
      <Paragraph
        key={acc.length + arr.length + 1}
        onLayout={(e) => {
          layoutRef.current[index] = e.nativeEvent.layout.y;
        }}
        style={current.paragraph === index ? styles.currentSpeaking : null}
        onPress={
          !isSpeaking
            ? () => handlePressParagraph(index)
            : () => dispatch(stopSpeaking())
        }
      >
        {item.text}
      </Paragraph>
    );
    item.after &&
      arr.push(<Image source={item.after} key={acc.length + arr.length + 1} />);
    return [...acc, ...arr];
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} ref={scrollRef}>
        {elements}
      </ScrollView>
      {current.chapter > 0 && (
        <NavButton prev handlePress={() => handlePressNav(true)} />
      )}
      {current.chapter < totalChapters - 1 && (
        <NavButton handlePress={() => handlePressNav()} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 10 },
  currentSpeaking: { backgroundColor: 'lightblue' },
});

export default Reader;

//onPress={isSpeaking ? () => dispatch(stopSpeaking()) : null}
