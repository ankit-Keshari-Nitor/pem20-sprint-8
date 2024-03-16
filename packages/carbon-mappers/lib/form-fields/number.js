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
var iconsReact = require('@carbon/icons-react');

const type = formFieldType.FORM_FIELD_TYPE.NUMBER;
const NumberInput = _ref => {
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
  }), /*#__PURE__*/React.createElement(react.NumberInput, _rollupPluginBabelHelpers.extends({
    "data-testid": id,
    id: id,
    type: type,
    label: ""
  }, rest)));
};

// Config of Accordion for Left Palette & Right Palette
NumberInput.config = {
  type,
  label: 'Number',
  group: 'basic-input',
  icon: /*#__PURE__*/React.createElement(iconsReact.CharacterWholeNumber, null),
  editableProps: {
    Basic: [...fieldPropertyProps.editableProps.Basic, fieldPropertyProps.helperText],
    Condition: [...fieldPropertyProps.editableProps.Condition, fieldPropertyProps.readOnly]
  },
  advanceProps: [fieldPropertyProps.minProps, fieldPropertyProps.maxProps]
};

exports.default = NumberInput;
