import React from 'react';
import { DatePicker as CarbonDatePicker, DatePickerInput } from '@carbon/react';
import { FORM_FIELD_GROUPS, FORM_FIELD_LABEL, FORM_FIELD_TYPE, editableProps, helperText } from '../constant';
import Label from './label';
import { DatepickerIcon } from './../icons';

const type = FORM_FIELD_TYPE.DATEPICKER;

const DatePicker = ({ field, id }) => {
  const { type, labelText, isRequired, ...rest } = field;

  return (
    <>
      <Label labelText={labelText} isRequired={isRequired} />
      <CarbonDatePicker data-testid={id} id={id} datePickerType="single">
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
    Basic: [...editableProps.Basic, helperText],
    Condition: [...editableProps.Condition]
  },
  advanceProps: []
};
