import { formFields } from '../form-fields';

export const getFormFields = () => {
  let _formFields = {};
  formFields.forEach((formField) => {
    _formFields[formField.config.type] = formField;
  });

  return _formFields;
};

export const getFormField = (type) => {
  let _formFields = {};
  formFields.forEach((formField) => {
    _formFields[formField.config.type] = formField;
  });

  return _formFields[type];
};
