/**
   PRIVATE LICENSE
   */
  
import { extends as _extends } from '../_virtual/_rollupPluginBabelHelpers.js';
import React from 'react';
import { NumberInput as NumberInput$1 } from '@carbon/react';
import { FORM_FIELD_TYPE } from '../constant/form-field-type.js';
import { editableProps, helperText, readOnly, minProps, maxProps } from '../constant/field-property-props.js';
import Label from './label.js';

const type = FORM_FIELD_TYPE.NUMBER;
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
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Label, {
    labelText: labelText,
    isRequired: isRequired
  }), /*#__PURE__*/React.createElement(NumberInput$1, _extends({
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
  editableProps: {
    Basic: [...editableProps.Basic, helperText],
    Condition: [...editableProps.Condition, readOnly]
  },
  advanceProps: [minProps, maxProps]
};

export { NumberInput as default };
