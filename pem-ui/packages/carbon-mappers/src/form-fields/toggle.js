import React from 'react';
import { Toggle as CarbonToggle } from '@carbon/react';
import { FORM_FIELD_GROUPS, FORM_FIELD_LABEL, FORM_FIELD_TYPE, PropsPanelFields, propsPanelAdvanceFields } from '../constant';
import { ToggleIcon } from './../icons';

const type = FORM_FIELD_TYPE.TOGGLE;

const Toggle = ({ field, id: uniqueId, previewMode }) => {
  const { labelText, isRequired, label, min, max, labelA, labelB, id, ...rest } = field;

  return (
    <CarbonToggle
      data-testid={id}
      key={`${uniqueId}-${previewMode}`}
      id={`${uniqueId}-${previewMode}`}
      labelText={labelText === undefined ? label : labelText}
      labelA={labelA ? labelA : 'No'}
      labelB={labelB ? labelB : 'Yes'}
      {...rest}
    />
  );
};

export default Toggle;

// Config of Toggle for Left Palette & Right Palette
Toggle.config = {
  type,
  label: FORM_FIELD_LABEL.TOGGLE,
  group: FORM_FIELD_GROUPS.ACTION,
  icon: <ToggleIcon />,
  editableProps: {
    Basic: PropsPanelFields[type],
    Condition: []
  },
  advanceProps: propsPanelAdvanceFields[type]
};
