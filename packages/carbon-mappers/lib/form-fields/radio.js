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
var label = require('./label.js');

const type = formFieldType.FORM_FIELD_TYPE.RADIO;
const RadioButton = _ref => {
  let {
    field
  } = _ref;
  const {
    id,
    type,
    labelText,
    isRequired,
    ...rest
  } = field;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(label.default, {
    labelText: labelText,
    isRequired: isRequired
  }), /*#__PURE__*/React.createElement(react.RadioButtonGroup, {
    name: ""
  }, /*#__PURE__*/React.createElement(react.RadioButton, _rollupPluginBabelHelpers.extends({
    "data-testid": id,
    id: id,
    labelText: "",
    value: id
  }, rest))));
};

// Config of Accordion for Left Palette & Right Palette
RadioButton.config = {
  type,
  label: 'Radio Group',
  group: 'selection',
  editableProps: {
    Basic: [...fieldPropertyProps.editableProps.Basic],
    Condition: [...fieldPropertyProps.editableProps.Condition]
  },
  advanceProps: []
};

exports.default = RadioButton;
