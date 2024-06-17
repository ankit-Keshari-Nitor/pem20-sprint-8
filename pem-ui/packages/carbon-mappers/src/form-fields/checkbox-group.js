import React, { useState, useEffect } from 'react';
import { CheckboxGroup as CarbonCheckboxGroup, Checkbox as CarbonCheckbox } from '@carbon/react';
import { FORM_FIELD_GROUPS, FORM_FIELD_LABEL, FORM_FIELD_TYPE, helperText, options, isRequired, labelText, readOnly } from '../constant';

import { CheckboxIcon } from './../icons';

const type = FORM_FIELD_TYPE.CHECKBOXGROUP;

const CheckboxGroup = ({ field, id, currentPath, onChangeHandle, previewMode }) => {
  const { type, labelText, value, options, isRequired, helperText, ...rest } = field;
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    if (previewMode && value !== undefined) {
      setIsChecked(value);
    }
  }, [field, previewMode, value]);

  return (
    <CarbonCheckboxGroup data-testid={`${id}-${previewMode}`} id={`${id}-${previewMode}`} legendText={labelText} helperText={helperText}>
      {options &&
        options.map((element) => {
          return <CarbonCheckbox labelText={element?.label} id={`${element?.id}-${previewMode}`} value={element?.value} {...rest} />;
        })}
    </CarbonCheckboxGroup>
  );
};

export default CheckboxGroup;

// Config of Accordion for Left Palette & Right Palette
CheckboxGroup.config = {
  type,
  label: FORM_FIELD_LABEL.CHECKBOXGROUP,
  group: FORM_FIELD_GROUPS.SELECTION,
  icon: <CheckboxIcon />,
  editableProps: {
    Basic: [labelText, readOnly, options, helperText],
    Condition: []
  },
  advanceProps: [isRequired]
};
