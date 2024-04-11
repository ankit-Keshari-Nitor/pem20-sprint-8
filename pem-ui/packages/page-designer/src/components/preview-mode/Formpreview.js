import React from 'react';
import Canvas from '../canvas';
import { Form } from '@carbon/react';
import { Stack } from '@carbon/react';

const Formpreview = ({ layout, handleDrop, renderRow, componentMapper, selectedField, deleteFormField }) => {
  return (
    <div className="view-schema-container">
      <Form aria-label="form">
        <Stack>
          <Canvas layout={layout} renderRow={renderRow} componentMapper={componentMapper} previewMode={true} />
        </Stack>
      </Form>
    </div>
  );
};

export default Formpreview;
