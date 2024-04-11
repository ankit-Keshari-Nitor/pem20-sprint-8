import React from 'react';
import { Button as CarbonButton } from '@carbon/react';
import { FORM_FIELD_TYPE, editableProps } from '../constant';
import { ButtonIcon } from './../icons';

const type = FORM_FIELD_TYPE.BUTTON;

const Button = ({ field, id }) => {
  const { type, labelText, ...rest } = field;

  return (
    <CarbonButton data-testid={id} id={id} {...rest}>
      {field.labelText}
    </CarbonButton>
  );
};

export default Button;

// Config of Button for Left Palette & Right Palette
Button.config = {
  type,
  label: 'Button',
  group: 'action',
  icon: <ButtonIcon />,
  editableProps: {
    Basic: [...editableProps.Basic],
    Condition: [...editableProps.Condition]
  },
  advanceProps: []
};
