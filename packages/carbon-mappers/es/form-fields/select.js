/**
   PRIVATE LICENSE
   */
  
import { extends as _extends } from '../_virtual/_rollupPluginBabelHelpers.js';
import React from 'react';
import { Select as Select$1, SelectItem } from '@carbon/react';
import { FORM_FIELD_TYPE } from '../constant/form-field-type.js';
import { editableProps, helperText, readOnly } from '../constant/field-property-props.js';
import Label from './label.js';

var _SelectItem;
const type = FORM_FIELD_TYPE.SELECT;
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
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Label, {
    labelText: labelText,
    isRequired: isRequired
  }), /*#__PURE__*/React.createElement(Select$1, _extends({
    "data-testid": id,
    id: id,
    labelText: "",
    type: type
  }, rest), _SelectItem || (_SelectItem = /*#__PURE__*/React.createElement(SelectItem, {
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
    Basic: [...editableProps.Basic, helperText],
    Condition: [...editableProps.Condition, readOnly]
  },
  advanceProps: []
};

export { Select as default };
