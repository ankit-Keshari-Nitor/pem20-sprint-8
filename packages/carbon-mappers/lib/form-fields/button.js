/**
   PRIVATE LICENSE
   */
  
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _rollupPluginBabelHelpers = require('../_virtual/_rollupPluginBabelHelpers.js');
var React = require('react');
var react = require('@carbon/react');
var formFieldType = require('../constant/form-field-type.js');
var fieldPropertyProps = require('../constant/field-property-props.js');

const type = formFieldType.FORM_FIELD_TYPE.BUTTON;
const Button = _ref => {
  let {
    field
  } = _ref;
  const {
    id,
    type,
    labelText,
    ...rest
  } = field;
  return /*#__PURE__*/React.createElement(react.Button, _rollupPluginBabelHelpers.extends({
    "data-testid": id,
    id: id
  }, rest), field.labelText);
};

// Config of Button for Left Palette & Right Palette
Button.config = {
  type,
  label: 'Button',
  group: 'action',
  editableProps: {
    Basic: [...fieldPropertyProps.editableProps.Basic],
    Condition: [...fieldPropertyProps.editableProps.Condition]
  },
  advanceProps: []
};

exports.default = Button;
