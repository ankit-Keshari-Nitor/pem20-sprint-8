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

var _SelectItem;
const type = formFieldType.FORM_FIELD_TYPE.SELECT;
const Select = _ref => {
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
  }), /*#__PURE__*/React.createElement(react.Select, _rollupPluginBabelHelpers.extends({
    "data-testid": id,
    id: id,
    labelText: "",
    type: type
  }, rest), _SelectItem || (_SelectItem = /*#__PURE__*/React.createElement(react.SelectItem, {
    text: "No Option",
    value: "no-option"
  }))));
};

// Config of Accordion for Left Palette & Right Palette
Select.config = {
  type,
  label: 'Select',
  group: 'selection',
  editableProps: {
    Basic: [...fieldPropertyProps.editableProps.Basic, fieldPropertyProps.helperText],
    Condition: [...fieldPropertyProps.editableProps.Condition, fieldPropertyProps.readOnly]
  },
  advanceProps: []
};

exports.default = Select;
