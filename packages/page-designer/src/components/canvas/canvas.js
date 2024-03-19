import React from 'react';
import FieldRenderer from './field-renderer';

const Canvas = ({ schema, removeFormField, selectedField, getFormField }) => {
  return schema.map((formField) => {
    return (
      <div
        key={formField.id}
        onClick={() => {
          selectedField(formField);
        }}
      >
        <FieldRenderer field={formField} removeFormField={removeFormField} getFormField={getFormField} />
      </div>
    );
  });
};

export default Canvas;
