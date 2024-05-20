import React, { useState, useEffect } from 'react';
import { DatePicker as CarbonDatePicker, DatePickerInput } from '@carbon/react';
import { FORM_FIELD_GROUPS, FORM_FIELD_LABEL, FORM_FIELD_TYPE, helperText, isDisabled, isRequired, labelText } from '../constant';
import { DatepickerIcon } from './../icons';

const type = FORM_FIELD_TYPE.DATEPICKER;

const DatePicker = ({ field, id, currentPath, onChangeHandle, previewMode }) => {
  const { type, labelText, value, isRequired, ...rest } = field;
  const [fieldValue, setFieldValue] = useState();
  useEffect(() => {
    if (previewMode) {
      setFieldValue(value ? value : '');
    }
  }, [field, previewMode, value]);

  return (
    <>
      <CarbonDatePicker
        data-testid={id}
        id={id}
        datePickerType="single"
        value={fieldValue}
        onChange={(e) => {
          previewMode && onChangeHandle(currentPath, e);
          setFieldValue(e);
        }}
      >
        <DatePickerInput id={id} type={type} labelText="" placeholder="mm/dd/yyyy" {...rest} />
      </CarbonDatePicker>
    </>
  );
};

export default DatePicker;

// Config of Accordion for Left Palette & Right Palette
DatePicker.config = {
  type,
  label: FORM_FIELD_LABEL.DATEPICKER,
  group: FORM_FIELD_GROUPS.BASIC_INPUT,
  icon: <DatepickerIcon />,
  editableProps: {
    Basic: [labelText, helperText, isDisabled],
    Condition: []
  },
  advanceProps: [isRequired]
};
