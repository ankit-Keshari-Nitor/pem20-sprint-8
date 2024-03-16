/**
   PRIVATE LICENSE
   */
  
import { extends as _extends } from '../_virtual/_rollupPluginBabelHelpers.js';
import React from 'react';
import { Button as Button$1 } from '@carbon/react';
import { FORM_FIELD_TYPE } from '../constant/form-field-type.js';
import { editableProps } from '../constant/field-property-props.js';
import { ButtonCentered } from '@carbon/icons-react';

const type = FORM_FIELD_TYPE.BUTTON;
const Button = _ref => {
  let {
    field
  } = _ref;
  const {
    id,
    type,
    labelText,
    ...rest
  } = field;
  return /*#__PURE__*/React.createElement(Button$1, _extends({
    "data-testid": id,
    id: id
  }, rest), field.labelText);
};

// Config of Button for Left Palette & Right Palette
Button.config = {
  type,
  label: 'Button',
  group: 'action',
  icon: /*#__PURE__*/React.createElement(ButtonCentered, null),
  editableProps: {
    Basic: [...editableProps.Basic],
    Condition: [...editableProps.Condition]
  },
  advanceProps: []
};

export { Button as default };
