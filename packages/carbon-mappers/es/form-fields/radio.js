/**
   PRIVATE LICENSE
   */
  
import { extends as _extends } from '../_virtual/_rollupPluginBabelHelpers.js';
import React from 'react';
import { RadioButtonGroup, RadioButton as RadioButton$1 } from '@carbon/react';
import { FORM_FIELD_TYPE } from '../constant/form-field-type.js';
import { editableProps } from '../constant/field-property-props.js';
import Label from './label.js';

const type = FORM_FIELD_TYPE.RADIO;
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
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Label, {
    labelText: labelText,
    isRequired: isRequired
  }), /*#__PURE__*/React.createElement(RadioButtonGroup, {
    name: ""
  }, /*#__PURE__*/React.createElement(RadioButton$1, _extends({
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
    Basic: [...editableProps.Basic],
    Condition: [...editableProps.Condition]
  },
  advanceProps: []
};

export { RadioButton as default };
