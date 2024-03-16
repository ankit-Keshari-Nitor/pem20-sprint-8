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
var useMinMaxInput = require('../custom-hooks/use-min-max-input.js');
var iconsReact = require('@carbon/icons-react');

const type = formFieldType.FORM_FIELD_TYPE.TEXT_AREA;
const TextArea = _ref => {
  let {
    field
  } = _ref;
  const {
    id,
    type,
    labelText,
    isRequired,
    min,
    max,
    ...rest
  } = field;
  const {
    value,
    isValid,
    invalidText,
    valueChangeHandler,
    minChangeHandler,
    maxChangeHandler
  } = useMinMaxInput.default();
  React.useEffect(() => {
    if (min !== undefined) {
      minChangeHandler(min);
    }
    if (max !== undefined) {
      maxChangeHandler(max);
    }
  }, [min, max, minChangeHandler, maxChangeHandler]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(label.default, {
    labelText: labelText,
    isRequired: isRequired
  }), /*#__PURE__*/React.createElement(react.TextArea, _rollupPluginBabelHelpers.extends({
    "data-testid": id,
    id: id,
    type: type,
    labelText: "",
    value: value,
    invalid: isValid,
    invalidText: invalidText,
    onChange: valueChangeHandler
  }, rest)));
};

// Config of Text Area for Left Palette
TextArea.config = {
  type,
  label: 'Text Area',
  group: 'basic-input',
  icon: /*#__PURE__*/React.createElement(iconsReact.TextFill, null),
  editableProps: {
    Basic: [...fieldPropertyProps.editableProps.Basic, fieldPropertyProps.helperText],
    Condition: [...fieldPropertyProps.editableProps.Condition, fieldPropertyProps.readOnly]
  },
  advanceProps: [fieldPropertyProps.minProps, fieldPropertyProps.maxProps]
};

exports.default = TextArea;
