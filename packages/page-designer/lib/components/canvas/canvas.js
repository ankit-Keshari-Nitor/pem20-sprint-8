/**
   PRIVATE LICENSE
   */
  
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var fieldRenderer = require('./field-renderer/field-renderer.js');

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
    }, /*#__PURE__*/React.createElement(fieldRenderer.default, {
      field: formField,
      removeFormField: removeFormField,
      getFormField: getFormField
    }));
  });
};

exports.default = Canvas;
