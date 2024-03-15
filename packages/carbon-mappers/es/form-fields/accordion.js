/**
   PRIVATE LICENSE
   */
  
import { extends as _extends } from '../_virtual/_rollupPluginBabelHelpers.js';
import React from 'react';
import { Accordion as Accordion$1, AccordionItem } from '@carbon/react';
import { FORM_FIELD_TYPE } from '../constant/form-field-type.js';
import { editableProps } from '../constant/field-property-props.js';

var _p;
const type = FORM_FIELD_TYPE.ACCORDION;
const Accordion = _ref => {
  let {
    field
  } = _ref;
  const {
    id,
    type,
    labelText,
    ...rest
  } = field;
  return /*#__PURE__*/React.createElement(Accordion$1, _extends({
    "data-testid": id,
    id: id
  }, rest), /*#__PURE__*/React.createElement(AccordionItem, {
    title: labelText
  }, _p || (_p = /*#__PURE__*/React.createElement("p", null))));
};

// Config of Accordion for Left Palette & Right Palette
Accordion.config = {
  type,
  label: 'Accordion',
  group: 'panel',
  editableProps: editableProps,
  advanceProps: []
};

export { Accordion as default };
