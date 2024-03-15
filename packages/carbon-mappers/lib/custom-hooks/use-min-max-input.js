/**
   PRIVATE LICENSE
   */
  
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');

const useMinMaxInput = () => {
  const [enteredValue, setEnteredValue] = React.useState("");
  const [inValid, setInvalid] = React.useState(false);
  const [invalidText, setInvalidText] = React.useState("");
  const [minValue, setMinValue] = React.useState();
  const [maxValue, setMaxValue] = React.useState();
  const valueChangeHandler = event => {
    setEnteredValue(event.target.value);
    valueIsValid(enteredValue, minValue, maxValue);
  };
  const minChangeHandler = min => {
    setMinValue(min);
    valueIsValid(enteredValue, min, maxValue);
  };
  const maxChangeHandler = max => {
    setMaxValue(max);
    valueIsValid(enteredValue, minValue, max);
  };
  function valueIsValid(value, min, max) {
    if (value.length > max || value.length < min) {
      if (value.length > max) {
        setInvalid(true);
        setInvalidText(`Input value must not be exceed ${max} characters!!`);
      }
      if (value.length < min) {
        setInvalid(true);
        setInvalidText(`Input value must not be less than ${min} characters!!`);
      }
    } else {
      setInvalid(false);
      setInvalidText("");
    }
  }
  return {
    value: enteredValue,
    isValid: inValid,
    invalidText: invalidText,
    valueChangeHandler,
    minChangeHandler,
    maxChangeHandler
  };
};

exports.default = useMinMaxInput;
