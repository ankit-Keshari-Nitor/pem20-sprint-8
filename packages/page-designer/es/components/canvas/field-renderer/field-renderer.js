/**
   PRIVATE LICENSE
   */
  
import React from 'react';
import { TrashCan } from '@carbon/icons-react';
import './field-renderer.scss.js';

var _TrashCan;
const FieldRenderer = _ref => {
  let {
    field,
    removeFormField,
    getFormField
  } = _ref;
  const FormFieldComponent = getFormField(field.type);
  if (!FormFieldComponent) {
    throw new Error(`cannot render field <${field.type}>`);
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "element"
  }, /*#__PURE__*/React.createElement("span", {
    className: "delete-icon",
    onClick: () => removeFormField(field.id)
  }, _TrashCan || (_TrashCan = /*#__PURE__*/React.createElement(TrashCan, null))), /*#__PURE__*/React.createElement(FormFieldComponent, field));
};

export { FieldRenderer as default };
