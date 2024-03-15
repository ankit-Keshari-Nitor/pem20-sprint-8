/**
   PRIVATE LICENSE
   */
  
import { extends as _extends } from '../_virtual/_rollupPluginBabelHelpers.js';
import React, { useState } from 'react';
import { Checkbox as Checkbox$1 } from '@carbon/react';
import { FORM_FIELD_TYPE } from '../constant/form-field-type.js';
import { editableProps, helperText, readOnly } from '../constant/field-property-props.js';
import Label from './label.js';

const type = FORM_FIELD_TYPE.CHECKBOX;
const Checkbox = _ref => {
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
  const [isChecked, setIsChecked] = useState(false);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Label, {
    labelText: labelText,
    isRequired: isRequired
  }), /*#__PURE__*/React.createElement(Checkbox$1, _extends({
    "data-testid": id,
    id: id,
    type: type,
    labelText: "",
    checked: isChecked,
    onChange: (_, _ref2) => {
      let {
        checked
      } = _ref2;
      return setIsChecked(checked);
    }
  }, rest)));
};

// Config of Accordion for Left Palette & Right Palette
Checkbox.config = {
  type,
  label: 'Checkbox',
  group: 'selection',
  editableProps: {
    Basic: [...editableProps.Basic, helperText],
    Condition: [...editableProps.Condition, readOnly]
  },
  advanceProps: []
};

export { Checkbox as default };
