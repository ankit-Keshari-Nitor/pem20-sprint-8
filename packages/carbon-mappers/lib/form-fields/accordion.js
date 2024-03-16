/**
   PRIVATE LICENSE
   */
  
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _rollupPluginBabelHelpers = require('../_virtual/_rollupPluginBabelHelpers.js');
var React = require('react');
var react = require('@carbon/react');
var formFieldType = require('../constant/form-field-type.js');
var fieldPropertyProps = require('../constant/field-property-props.js');
var iconsReact = require('@carbon/icons-react');

var _p;
const type = formFieldType.FORM_FIELD_TYPE.ACCORDION;
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
  return /*#__PURE__*/React.createElement(react.Accordion, _rollupPluginBabelHelpers.extends({
    "data-testid": id,
    id: id
  }, rest), /*#__PURE__*/React.createElement(react.AccordionItem, {
    title: labelText
  }, _p || (_p = /*#__PURE__*/React.createElement("p", null))));
};

// Config of Accordion for Left Palette & Right Palette
Accordion.config = {
  type,
  label: 'Accordion',
  group: 'panel',
  icon: /*#__PURE__*/React.createElement(iconsReact.Plan, null),
  editableProps: fieldPropertyProps.editableProps,
  advanceProps: []
};

exports.default = Accordion;
