import React from 'react';
import { TextInput as CarbonTextInput } from '@carbon/react';
import { FORM_FIELD_TYPE, editableProps, helperText } from '../constant';
import Label from './label';

const type = FORM_FIELD_TYPE.PASSWORD;

const Password = ({ field }) => {
  const { id, type, labelText, isRequired, ...rest } = field;

  return (
    <>
      <Label labelText={labelText} isRequired={isRequired} />
      <CarbonTextInput.PasswordInput data-testid={id} id={id} type={type} labelText="" {...rest} />
    </>
  );
};

export default Password;

// Config of Accordion for Left Palette & Right Palette
Password.config = {
  type,
  label: 'Password Input',
  group: 'basic-input',
  editableProps: {
    Basic: [...editableProps.Basic, helperText],
    Condition: [...editableProps.Condition]
  },
  advanceProps: []
};
