/**
   PRIVATE LICENSE
   */
  
import { extends as _extends } from '../_virtual/_rollupPluginBabelHelpers.js';
import React from 'react';
import { TextInput } from '@carbon/react';
import { FORM_FIELD_TYPE } from '../constant/form-field-type.js';
import { editableProps, helperText } from '../constant/field-property-props.js';
import { Password as Password$1 } from '@carbon/icons-react';
import Label from './label.js';

const type = FORM_FIELD_TYPE.PASSWORD;
const Password = _ref => {
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
  }), /*#__PURE__*/React.createElement(TextInput.PasswordInput, _extends({
    "data-testid": id,
    id: id,
    type: type,
    labelText: ""
  }, rest)));
};

// Config of Accordion for Left Palette & Right Palette
Password.config = {
  type,
  label: 'Password Input',
  group: 'basic-input',
  icon: /*#__PURE__*/React.createElement(Password$1, null),
  editableProps: {
    Basic: [...editableProps.Basic, helperText],
    Condition: [...editableProps.Condition]
  },
  advanceProps: []
};

export { Password as default };
