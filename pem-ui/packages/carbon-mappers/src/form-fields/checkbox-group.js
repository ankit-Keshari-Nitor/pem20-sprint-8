import React, { useState, useEffect } from 'react';
import { CheckboxGroup as CarbonCheckboxGroup, Checkbox as CarbonCheckbox } from '@carbon/react';
import { FORM_FIELD_GROUPS, FORM_FIELD_LABEL, FORM_FIELD_TYPE, helperText, id, orientation, NameLabel, options, isRequired, labelText, readOnly } from '../constant';

import { CheckboxIcon } from './../icons';

const type = FORM_FIELD_TYPE.CHECKBOXGROUP;

const CheckboxGroup = ({ field, id, currentPath, onChangeHandle, previewMode }) => {
  const { type, labelText, value, label, orientation, readOnly, options, isRequired, helperText, ...rest } = field;
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    if (previewMode && value !== undefined) {
      setIsChecked(value);
    }
  }, [field, previewMode, value]);

  return (
    <CarbonCheckboxGroup readOnly={readOnly} orientation={orientation} data-testid={`${id}-${previewMode}`} id={`${id}-${previewMode}`} legendText={labelText === undefined ? label : labelText} helperText={helperText}>
      {options &&
        options.map((element) => {
          return <CarbonCheckbox labelText={element?.label} id={`${element?.id}-${previewMode}`} value={element?.value} {...rest} />;
        })}
    </CarbonCheckboxGroup>
  );
};

export default CheckboxGroup;

// Config of Checkbox Group for Left Palette & Right Palette
CheckboxGroup.config = {
  type,
  label: FORM_FIELD_LABEL.CHECKBOXGROUP,
  group: FORM_FIELD_GROUPS.SELECTION,
  icon: <CheckboxIcon />,
  editableProps: {
    Basic: [id, NameLabel, labelText, helperText, options, orientation, readOnly],
    Condition: []
  },
  advanceProps: [isRequired]
};
