import React from 'react';
import Canvas from '../canvas';
import { Form } from '@carbon/react';
import { Button } from '@carbon/react';
import './preview-mode.scss';

const FormPreview = ({ layout, handleDrop, renderRow, componentMapper, onFieldSelect, onFieldDelete }) => {
  console.log(layout);
  return (
    <div className="view-schema-container">
      <Form aria-label="form">
        <Canvas layout={layout} renderRow={renderRow} componentMapper={componentMapper} previewMode />
        {layout.length > 0 && (
          <div className="preview-submit-btn">
            <Button>Submit</Button>
          </div>
        )}
      </Form>
    </div>
  );
};

export default FormPreview;
