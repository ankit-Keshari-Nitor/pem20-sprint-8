/**
   PRIVATE LICENSE
   */
  
import { extends as _extends } from '../_virtual/_rollupPluginBabelHelpers.js';
import React from 'react';
import { DatePicker as DatePicker$1, DatePickerInput } from '@carbon/react';
import { FORM_FIELD_TYPE } from '../constant/form-field-type.js';
import { editableProps, helperText } from '../constant/field-property-props.js';
import Label from './label.js';
import { Calendar } from '@carbon/icons-react';

const type = FORM_FIELD_TYPE.DATEPICKER;
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
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Label, {
    labelText: labelText,
    isRequired: isRequired
  }), /*#__PURE__*/React.createElement(DatePicker$1, {
    "data-testid": id,
    id: id,
    datePickerType: "single"
  }, /*#__PURE__*/React.createElement(DatePickerInput, _extends({
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
  icon: /*#__PURE__*/React.createElement(Calendar, null),
  editableProps: {
    Basic: [...editableProps.Basic, helperText],
    Condition: [...editableProps.Condition]
  },
  advanceProps: []
};

export { DatePicker as default };
