import React from 'react';
import { RadioButton as CarbonRadioButton, RadioButtonGroup } from '@carbon/react';
import { FORM_FIELD_TYPE, editableProps } from '../constant';
import Label from './label';

const type = FORM_FIELD_TYPE.RADIO;

const RadioButton = ({ field }) => {
  const { id, type, labelText, isRequired, ...rest } = field;

  return (
    <>
      <Label labelText={labelText} isRequired={isRequired} />
      <RadioButtonGroup name="">
        <CarbonRadioButton data-testid={id} id={id} labelText="" value={id} {...rest} />
      </RadioButtonGroup>
    </>
  );
};

export default RadioButton;

// Config of Accordion for Left Palette & Right Palette
RadioButton.config = {
  type,
  label: 'Radio Group',
  group: 'selection',
  editableProps: {
    Basic: [...editableProps.Basic],
    Condition: [...editableProps.Condition]
  },
  advanceProps: []
};
