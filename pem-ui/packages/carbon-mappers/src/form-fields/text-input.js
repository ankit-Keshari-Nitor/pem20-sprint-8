import React, { useEffect } from 'react';
import { TextInput as CarbonTextInput } from '@carbon/react';
import { FORM_FIELD_TYPE, editableProps, minProps, maxProps, readOnly, helperText, FORM_FIELD_LABEL, FORM_FIELD_GROUPS } from '../constant';
import useMinMaxInput from '../custom-hooks/use-min-max-input';
import { TextInputIcon } from './../icons';

const type = FORM_FIELD_TYPE.TEXT_INPUT;

const TextInput = ({ field, id }) => {
  console.log('field', field);
  const { labelText, helperText, disabled, isRequired, min, max, ...rest } = field;
  const { value, isValid, invalidText, valueChangeHandler, minChangeHandler, maxChangeHandler } = useMinMaxInput();

  useEffect(() => {
    if (min !== undefined) {
      minChangeHandler(min);
    }
    if (max !== undefined) {
      maxChangeHandler(max);
    }
  }, [min, max, minChangeHandler, maxChangeHandler]);

  return (
    <CarbonTextInput
      type={FORM_FIELD_TYPE.TEXT}
      data-testid={id}
      id={id}
      labelText={labelText}
      helperText={helperText}
      disabled={disabled}
      value={value}
      invalid={isValid}
      // invalidText={invalidText}
      onChange={valueChangeHandler}
      {...rest}
    />
  );
};

export default TextInput;

// Config of Accordion for Left Palette & Right Palette
TextInput.config = {
  type,
  label: FORM_FIELD_LABEL.TEXT_INPUT,
  group: FORM_FIELD_GROUPS.BASIC_INPUT,
  icon: <TextInputIcon />,
  editableProps: {
    Basic: [...editableProps.Basic, helperText],
    Condition: [...editableProps.Condition, readOnly]
  },
  advanceProps: [minProps, maxProps]
};
