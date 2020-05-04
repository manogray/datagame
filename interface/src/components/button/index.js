import React from 'react';

import { Container } from './style';

export default function Button(props) {
  return (
    <Container {...props}>
        { props.children }
    </Container>
  );
}
