import React from 'react';
import { NumberInput as CarbonNumberInput } from '@carbon/react';
import { FORM_FIELD_TYPE, minProps, maxProps, readOnly, helperText, FORM_FIELD_LABEL, FORM_FIELD_GROUPS, labelText, isDisabled } from '../constant';
import { CharacterWholeNumber } from '@carbon/icons-react';

const type = FORM_FIELD_TYPE.NUMBER;

const NumberInput = ({ field, id }) => {
  const { type, labelText, isRequired, ...rest } = field;

  return (
    <>
      <CarbonNumberInput data-testid={id} id={id} type={type} label={labelText} {...rest} />
    </>
  );
};

export default NumberInput;

// Config of Accordion for Left Palette & Right Palette
NumberInput.config = {
  type,
  label: FORM_FIELD_LABEL.NUMBER,
  group: FORM_FIELD_GROUPS.BASIC_INPUT,
  icon: <CharacterWholeNumber />,
  editableProps: {
    Basic: [labelText, helperText, isDisabled, readOnly],
    Condition: []
  },
  advanceProps: [minProps, maxProps]
};
