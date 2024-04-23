import React from 'react';
import { Toggle as CarbonToggle } from '@carbon/react';
import { FORM_FIELD_GROUPS, FORM_FIELD_LABEL, FORM_FIELD_TYPE, isDisabled, labelText } from '../constant';
import { ToggleIcon } from './../icons';

const type = FORM_FIELD_TYPE.TOGGLE;

const Toggle = ({ field, id }) => {
  const { labelText, isRequired, min, max, ...rest } = field;

  return <CarbonToggle data-testid={id} id={id} labelText={labelText} labelA="Off" labelB="On" defaultToggled {...rest} />;
};

export default Toggle;

// Config of Button for Left Palette & Right Palette
Toggle.config = {
  type,
  label: FORM_FIELD_LABEL.TOGGLE,
  group: FORM_FIELD_GROUPS.ACTION,
  icon: <ToggleIcon />,
  editableProps: {
    Basic: [labelText, isDisabled],
    Condition: []
  },
  advanceProps: []
};
