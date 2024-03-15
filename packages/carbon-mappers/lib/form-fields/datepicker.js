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

const type = formFieldType.FORM_FIELD_TYPE.DATEPICKER;
const DatePicker = _ref => {
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
  }), /*#__PURE__*/React.createElement(react.DatePicker, {
    "data-testid": id,
    id: id,
    datePickerType: "single"
  }, /*#__PURE__*/React.createElement(react.DatePickerInput, _rollupPluginBabelHelpers.extends({
    id: id,
    type: type,
    labelText: "",
    placeholder: "mm/dd/yyyy"
  }, rest))));
};

// Config of Accordion for Left Palette & Right Palette
DatePicker.config = {
  type,
  label: 'DatePicker',
  group: 'basic-input',
  editableProps: {
    Basic: [...fieldPropertyProps.editableProps.Basic, fieldPropertyProps.helperText],
    Condition: [...fieldPropertyProps.editableProps.Condition]
  },
  advanceProps: []
};

exports.default = DatePicker;
