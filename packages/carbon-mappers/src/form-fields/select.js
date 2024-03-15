import React from 'react';
import { Select as CarbonSelect, SelectItem } from '@carbon/react';
import { FORM_FIELD_TYPE, editableProps, helperText, readOnly } from '../constant';
import Label from './label';

const type = FORM_FIELD_TYPE.SELECT;

const Select = ({ field }) => {
  const { id, type, labelText, isRequired, ...rest } = field;

  return (
    <>
      <Label labelText={labelText} isRequired={isRequired} />
      <CarbonSelect data-testid={id} id={id} labelText="" type={type} {...rest}>
        <SelectItem text="No Option" value="no-option" />
      </CarbonSelect>
    </>
  );
};

export default Select;

// Config of Accordion for Left Palette & Right Palette
Select.config = {
  type,
  label: 'Select',
  group: 'selection',
  editableProps: {
    Basic: [...editableProps.Basic, helperText],
    Condition: [...editableProps.Condition, readOnly]
  },
  advanceProps: []
};
