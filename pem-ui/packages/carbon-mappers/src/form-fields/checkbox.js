import React, { useState } from 'react';
import { Checkbox as CarbonCheckbox } from '@carbon/react';
import { FORM_FIELD_GROUPS, FORM_FIELD_LABEL, FORM_FIELD_TYPE, editableProps, readOnly } from '../constant';

import { CheckboxIcon } from './../icons';

const type = FORM_FIELD_TYPE.CHECKBOX;

const Checkbox = ({ field, id }) => {
  const { type, labelText, isRequired, ...rest } = field;
  const [isChecked, setIsChecked] = useState(false);

  return <CarbonCheckbox data-testid={id} id={id} type={type} labelText={labelText} checked={isChecked} onChange={(_, { checked }) => setIsChecked(checked)} {...rest} />;
};

export default Checkbox;

// Config of Accordion for Left Palette & Right Palette
Checkbox.config = {
  type,
  label: FORM_FIELD_LABEL.CHECKBOX,
  group: FORM_FIELD_GROUPS.SELECTION,
  icon: <CheckboxIcon />,
  editableProps: {
    Basic: [...editableProps.Basic],
    Condition: [...editableProps.Condition, readOnly]
  },
  advanceProps: []
};
