/**
   PRIVATE LICENSE
   */
  
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var react = require('@carbon/react');
require('./props-panel.scss.js');

function PropsPanel(_ref) {
  let {
    selectedFiledProps,
    handleSchemaChanges
  } = _ref;
  const [editableProps, setEditableProps] = React.useState({});
  const [advanceProps, setAdvanceProps] = React.useState([]);
  React.useEffect(() => {
    setEditableProps(selectedFiledProps?.editableProps);
    setAdvanceProps(selectedFiledProps?.advanceProps);
  }, [selectedFiledProps]);
  return /*#__PURE__*/React.createElement("div", {
    className: "right-palette-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "palette-header"
  }, selectedFiledProps?.id), /*#__PURE__*/React.createElement(react.Accordion, {
    className: "custom-class"
  }, editableProps && Object.keys(editableProps).map((key, idx) => {
    return /*#__PURE__*/React.createElement(react.AccordionItem, {
      key: idx,
      title: key,
      open: true
    }, editableProps[key].map((item, idx) => {
      return key === 'Basic' ? /*#__PURE__*/React.createElement(react.TextInput, {
        key: idx,
        id: String(idx),
        className: "right-palette-form-item ",
        labelText: item.label,
        value: item.value,
        onChange: e => handleSchemaChanges(selectedFiledProps?.id, key, item.propsName, e.target.value)
      }) : /*#__PURE__*/React.createElement("ul", {
        key: idx
      }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(react.Toggle, {
        key: idx,
        id: 'toggle-' + String(idx) + '-' + selectedFiledProps?.id,
        className: "right-palette-form-item ",
        labelText: item.label,
        defaultToggled: item.value,
        toggled: item.value,
        onClick: e => handleSchemaChanges(selectedFiledProps?.id, key, item.propsName, !item.value),
        hideLabel: true
      })));
    }));
  }), advanceProps && advanceProps.length > 0 && /*#__PURE__*/React.createElement(react.AccordionItem, {
    key: 'advance',
    title: 'Advance'
  }, advanceProps.map((advncProps, idx) => {
    return /*#__PURE__*/React.createElement(react.TextInput, {
      key: idx,
      id: String(idx),
      className: "right-palette-form-item",
      labelText: advncProps.label,
      value: advncProps.value,
      onChange: e => {
        if (isNaN(e.target.value)) {
          e.preventDefault();
        } else {
          handleSchemaChanges(selectedFiledProps?.id, 'advance', advncProps.propsName, e.target.value);
        }
      }
    });
  }))));
}

exports.default = PropsPanel;
