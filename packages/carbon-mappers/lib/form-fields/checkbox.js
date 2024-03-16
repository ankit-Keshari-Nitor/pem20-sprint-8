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
var label = require('./label.js');
var iconsReact = require('@carbon/icons-react');

const type = formFieldType.FORM_FIELD_TYPE.CHECKBOX;
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
  const [isChecked, setIsChecked] = React.useState(false);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(label.default, {
    labelText: labelText,
    isRequired: isRequired
  }), /*#__PURE__*/React.createElement(react.Checkbox, _rollupPluginBabelHelpers.extends({
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
  icon: /*#__PURE__*/React.createElement(iconsReact.CheckboxCheckedFilled, null),
  editableProps: {
    Basic: [...fieldPropertyProps.editableProps.Basic, fieldPropertyProps.helperText],
    Condition: [...fieldPropertyProps.editableProps.Condition, fieldPropertyProps.readOnly]
  },
  advanceProps: []
};

exports.default = Checkbox;
