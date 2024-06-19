import React from 'react';
import { RadioButton as CarbonRadioButton, RadioButtonGroup as CarbonRadioButtonGroup } from '@carbon/react';
import { FORM_FIELD_GROUPS, FORM_FIELD_LABEL, FORM_FIELD_TYPE, options, helperText, isRequired, labelText, readOnly } from '../constant';
import { RadioIcon } from './../icons';

const type = FORM_FIELD_TYPE.RADIOGROUP;

const RadioButtonGroup = ({ field, id, previewMode }) => {
  const { type, labelText, isRequired, options, helperText, ...rest } = field;

  return (
    <CarbonRadioButtonGroup data-testid={`${id}-${previewMode}`} id={`${id}-${previewMode}`} legendText={labelText} helperText={helperText}>
      {options &&
        options.map((element) => {
          return <CarbonRadioButton labelText={element?.label} id={`${element?.id}-${previewMode}`} value={element?.value} {...rest} />;
        })}
    </CarbonRadioButtonGroup>
  );
};

export default RadioButtonGroup;

// Config of Accordion for Left Palette & Right Palette
RadioButtonGroup.config = {
  type,
  label: FORM_FIELD_LABEL.RADIOGROUP,
  group: FORM_FIELD_GROUPS.SELECTION,
  icon: <RadioIcon />,
  editableProps: {
    Basic: [labelText, readOnly, options, helperText],
    Condition: []
  },
  advanceProps: [isRequired]
};
