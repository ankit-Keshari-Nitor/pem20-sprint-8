import React from 'react';
import { TrashCan } from '@carbon/icons-react';

import './field-renderer.scss';

const FieldRenderer = ({ field, removeFormField, getFormField }) => {
  const FormFieldComponent = getFormField(field.type);

  if (!FormFieldComponent) {
    throw new Error(`cannot render field <${field.type}>`);
  }

  return (
    <div className="element">
      <span className="delete-icon" onClick={() => removeFormField(field.id)}>
        <TrashCan />
      </span>
      <FormFieldComponent {...field} />
    </div>
  );
};

export default FieldRenderer;
