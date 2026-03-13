import React from 'react';
import { Placeholder } from 'react-bootstrap';

const Skeleton = ({ width, height }) => {
  return (
    <Placeholder as="div" animation="glow" style={{ width, height }}>
      <Placeholder xs={12} style={{ height: '100%' }} />
    </Placeholder>
  );
};

export default Skeleton;