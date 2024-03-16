/**
   PRIVATE LICENSE
   */
  
'use strict';

var index = require('../form-fields/index.js');

const getFormFields = () => {
  let _formFields = {};
  index.formFields.forEach(formField => {
    _formFields[formField.config.type] = formField;
  });
  return _formFields;
};

exports.getFormFields = getFormFields;
