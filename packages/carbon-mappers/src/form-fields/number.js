import React from 'react';
import { NumberInput as CarbonNumberInput } from '@carbon/react';
import { FORM_FIELD_TYPE, editableProps, minProps, maxProps, readOnly, helperText } from '../constant';
import Label from './label';

const type = FORM_FIELD_TYPE.NUMBER;

const NumberInput = ({ field }) => {
  const { id, type, labelText, isRequired, ...rest } = field;

  return (
    <>
      <Label labelText={labelText} isRequired={isRequired} />
      <CarbonNumberInput data-testid={id} id={id} type={type} label="" {...rest} />
    </>
  );
};

export default NumberInput;

// Config of Accordion for Left Palette & Right Palette
NumberInput.config = {
  type,
  label: 'Number',
  group: 'basic-input',
  editableProps: {
    Basic: [...editableProps.Basic, helperText],
    Condition: [...editableProps.Condition, readOnly]
  },
  advanceProps: [minProps, maxProps]
};
