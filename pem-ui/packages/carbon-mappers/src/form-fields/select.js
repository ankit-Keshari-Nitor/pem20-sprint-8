import React from 'react';
import { Select as CarbonSelect, SelectItem } from '@carbon/react';
import { FORM_FIELD_GROUPS, FORM_FIELD_LABEL, FORM_FIELD_TYPE, id,options, helperText, NameLabel, placeHolder, labelText, readOnly, isRequired  } from '../constant';
import { SelectIcon } from './../icons';

const type = FORM_FIELD_TYPE.SELECT;

const Select = ({ field, id }) => {
  const { type, labelText, label, isRequired, options, ...rest } = field;

  return (
    <>
      <CarbonSelect data-testid={id} id={id} labelText={labelText === undefined ? label : labelText} {...rest}>
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

// Config of Select for Left Palette & Right Palette
Select.config = {
  type,
  label: FORM_FIELD_LABEL.SELECT,
  group: FORM_FIELD_GROUPS.SELECTION,
  icon: <SelectIcon />,
  editableProps: {
    Basic: [id,NameLabel, labelText, placeHolder, helperText, options, readOnly],
    Condition: []
  },
  advanceProps: [isRequired]
};
