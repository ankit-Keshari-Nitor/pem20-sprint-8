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

const type = formFieldType.FORM_FIELD_TYPE.LINK;
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
  return /*#__PURE__*/React.createElement(react.Link, _rollupPluginBabelHelpers.extends({
    "data-testid": id,
    id: id
  }, rest), field.labelText);
};

// Config of Link for Left Palette & Right Palette
Link.config = {
  type,
  label: 'Link',
  group: 'basic-input',
  icon: /*#__PURE__*/React.createElement(iconsReact.Link, null),
  editableProps: {
    Basic: [...fieldPropertyProps.editableProps.Basic]
  },
  advanceProps: []
};

exports.default = Link;
