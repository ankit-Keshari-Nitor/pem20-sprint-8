/**
   PRIVATE LICENSE
   */
  
import { formFields } from '../form-fields/index.js';

const getFormFields = () => {
  let _formFields = {};
  formFields.forEach(formField => {
    _formFields[formField.config.type] = formField;
  });
  return _formFields;
};

export { getFormFields };
