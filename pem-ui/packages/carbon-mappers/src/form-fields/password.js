import React from 'react';
import { TextInput as CarbonTextInput } from '@carbon/react';
import { FORM_FIELD_TYPE, editableProps, helperText } from '../constant';
import { Password as PasswordIcon } from '@carbon/icons-react';
import Label from './label';

const type = FORM_FIELD_TYPE.PASSWORD;

const Password = ({ field , id}) => {
  const {type, labelText, isRequired, ...rest } = field;

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
  icon: <PasswordIcon />,
  editableProps: {
    Basic: [...editableProps.Basic, helperText],
    Condition: [...editableProps.Condition]
  },
  advanceProps: []
};
