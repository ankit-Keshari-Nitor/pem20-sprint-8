import React from 'react';
import { TextInput as CarbonTextInput } from '@carbon/react';
import { FORM_FIELD_GROUPS, FORM_FIELD_LABEL, FORM_FIELD_TYPE, helperText, isDisabled, labelText, readOnly } from '../constant';
import { Password as PasswordIcon } from '@carbon/icons-react';

const type = FORM_FIELD_TYPE.PASSWORD;

const Password = ({ field, id }) => {
  const { type, labelText, isRequired, ...rest } = field;

  return <CarbonTextInput.PasswordInput data-testid={id} id={id} type={type} labelText={labelText} {...rest} />;
};

export default Password;

// Config of Accordion for Left Palette & Right Palette
Password.config = {
  type,
  label: FORM_FIELD_LABEL.PASSWORD,
  group: FORM_FIELD_GROUPS.BASIC_INPUT,
  icon: <PasswordIcon />,
  editableProps: {
    Basic: [labelText, helperText, isDisabled, readOnly],
    Condition: []
  },
  advanceProps: []
};
