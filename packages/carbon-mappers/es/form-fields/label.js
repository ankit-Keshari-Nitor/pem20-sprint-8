/**
   PRIVATE LICENSE
   */
  
import React from 'react';

var _span;
const Label = _ref => {
  let {
    labelText,
    isRequired
  } = _ref;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "cds--label",
    style: {
      color: isRequired ? 'red' : '#525252'
    }
  }, labelText, isRequired && (_span || (_span = /*#__PURE__*/React.createElement("span", null, "*")))));
};

export { Label as default };
