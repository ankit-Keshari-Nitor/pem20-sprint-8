/**
   PRIVATE LICENSE
   */
  
import React from 'react';
import FieldRenderer from './field-renderer/field-renderer.js';

const Canvas = _ref => {
  let {
    schema,
    removeFormField,
    selectedField,
    getFormField
  } = _ref;
  return schema.map(formField => {
    return /*#__PURE__*/React.createElement("div", {
      key: formField.id,
      onClick: () => {
        selectedField(formField);
      }
    }, /*#__PURE__*/React.createElement(FieldRenderer, {
      field: formField,
      removeFormField: removeFormField,
      getFormField: getFormField
    }));
  });
};

export { Canvas as default };
