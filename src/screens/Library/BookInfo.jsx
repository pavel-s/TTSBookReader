import React from 'react';
import { Paragraph, Surface, Title } from 'react-native-paper';
import withAppBar from './../../components/hoc/withAppBar';

const BookInfo = ({ route }) => {
  const { book } = route.params;

  return (
    <Surface>
      <Title>{book.title}</Title>
      <Paragraph>{book.description}</Paragraph>
    </Surface>
  );
};

export default withAppBar(BookInfo);
