import React from 'react';
import { Select as CarbonSelect, SelectItem } from '@carbon/react';
import { FORM_FIELD_GROUPS, FORM_FIELD_LABEL, FORM_FIELD_TYPE, helperText, isDisabled, labelText, readOnly } from '../constant';
import { SelectIcon } from './../icons';

const type = FORM_FIELD_TYPE.SELECT;

const Select = ({ field, id }) => {
  const { type, labelText, isRequired, ...rest } = field;

  return (
    <>
      <CarbonSelect data-testid={id} id={id} labelText={labelText} type={type} {...rest}>
        <SelectItem text="No Option" value="no-option" />
      </CarbonSelect>
    </>
  );
};

export default Select;

// Config of Accordion for Left Palette & Right Palette
Select.config = {
  type,
  label: FORM_FIELD_LABEL.SELECT,
  group: FORM_FIELD_GROUPS.SELECTION,
  icon: <SelectIcon />,
  editableProps: {
    Basic: [labelText, helperText, isDisabled, readOnly],
    Condition: []
  },
  advanceProps: []
};
