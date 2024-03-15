import React, { useState } from 'react';
import { Checkbox as CarbonCheckbox } from '@carbon/react';
import { FORM_FIELD_TYPE, editableProps, helperText, readOnly } from '../constant';
import Label from './label';

const type = FORM_FIELD_TYPE.CHECKBOX;

const Checkbox = ({ field }) => {
  const { id, type, labelText, isRequired, ...rest } = field;
  const [isChecked, setIsChecked] = useState(false);

  return (
    <>
      <Label labelText={labelText} isRequired={isRequired} />
      <CarbonCheckbox data-testid={id} id={id} type={type} labelText="" checked={isChecked} onChange={(_, { checked }) => setIsChecked(checked)} {...rest} />
    </>
  );
};

export default Checkbox;

// Config of Accordion for Left Palette & Right Palette
Checkbox.config = {
  type,
  label: 'Checkbox',
  group: 'selection',
  editableProps: {
    Basic: [...editableProps.Basic, helperText],
    Condition: [...editableProps.Condition, readOnly]
  },
  advanceProps: []
};
