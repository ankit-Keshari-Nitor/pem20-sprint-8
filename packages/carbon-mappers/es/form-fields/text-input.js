/**
   PRIVATE LICENSE
   */
  
import { extends as _extends } from '../_virtual/_rollupPluginBabelHelpers.js';
import React, { useEffect } from 'react';
import { TextInput as TextInput$1 } from '@carbon/react';
import { FORM_FIELD_TYPE } from '../constant/form-field-type.js';
import { editableProps, helperText, readOnly, minProps, maxProps } from '../constant/field-property-props.js';
import Label from './label.js';
import useMinMaxInput from '../custom-hooks/use-min-max-input.js';

const type = FORM_FIELD_TYPE.TEXT_INPUT;
const TextInput = _ref => {
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
  } = useMinMaxInput();
  useEffect(() => {
    if (min !== undefined) {
      minChangeHandler(min);
    }
    if (max !== undefined) {
      maxChangeHandler(max);
    }
  }, [min, max, minChangeHandler, maxChangeHandler]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Label, {
    labelText: labelText,
    isRequired: isRequired
  }), /*#__PURE__*/React.createElement(TextInput$1, _extends({
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

// Config of Accordion for Left Palette & Right Palette
TextInput.config = {
  type,
  label: 'Text Input',
  group: 'basic-input',
  editableProps: {
    Basic: [...editableProps.Basic, helperText],
    Condition: [...editableProps.Condition, readOnly]
  },
  advanceProps: [minProps, maxProps]
};

export { TextInput as default };
