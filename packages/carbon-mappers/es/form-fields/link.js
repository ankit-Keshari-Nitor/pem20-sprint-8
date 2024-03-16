/**
   PRIVATE LICENSE
   */
  
import { extends as _extends } from '../_virtual/_rollupPluginBabelHelpers.js';
import React from 'react';
import { Link as Link$2 } from '@carbon/react';
import { FORM_FIELD_TYPE } from '../constant/form-field-type.js';
import { editableProps } from '../constant/field-property-props.js';
import { Link as Link$1 } from '@carbon/icons-react';

const type = FORM_FIELD_TYPE.LINK;
const Link = _ref => {
  let {
    field
  } = _ref;
  const {
    id,
    type,
    labelText,
    ...rest
  } = field;
  return /*#__PURE__*/React.createElement(Link$2, _extends({
    "data-testid": id,
    id: id
  }, rest), field.labelText);
};

// Config of Link for Left Palette & Right Palette
Link.config = {
  type,
  label: 'Link',
  group: 'basic-input',
  icon: /*#__PURE__*/React.createElement(Link$1, null),
  editableProps: {
    Basic: [...editableProps.Basic]
  },
  advanceProps: []
};

export { Link as default };
