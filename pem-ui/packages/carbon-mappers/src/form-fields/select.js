import React from 'react';
import { Select as CarbonSelect, SelectItem } from '@carbon/react';
import { FORM_FIELD_GROUPS, FORM_FIELD_LABEL, FORM_FIELD_TYPE, options, helperText, isDisabled, labelText, readOnly } from '../constant';
import { SelectIcon } from './../icons';

const type = FORM_FIELD_TYPE.SELECT;

const Select = ({ field, id }) => {
  const { type, labelText, isRequired, options, ...rest } = field;

  return (
    <>
      <CarbonSelect data-testid={id} id={id} labelText={labelText} {...rest}>
        {/*  <SelectItem text="No Option" value="no-option" /> */}
        {options &&
          options.map((element) => {
            return <SelectItem id={`${element?.id}`} value={element?.value} text={element?.label} />;
          })}
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
    Basic: [labelText, helperText, isDisabled, readOnly, options],
    Condition: []
  },
  advanceProps: []
};
