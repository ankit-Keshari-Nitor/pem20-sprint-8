import React, { useEffect } from 'react';
import { TextInput as CarbonTextInput } from '@carbon/react';
import { FORM_FIELD_TYPE, editableProps, minProps, maxProps, readOnly, helperText } from '../constant';
import Label from './label';
import useMinMaxInput from '../custom-hooks/use-min-max-input';

const type = FORM_FIELD_TYPE.TEXT_INPUT;

const TextInput = ({ field }) => {
  const { id, type, labelText, isRequired, min, max, ...rest } = field;
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
    <>
      <Label labelText={labelText} isRequired={isRequired} />
      <CarbonTextInput data-testid={id} id={id} type={type} labelText="" value={value} invalid={isValid} invalidText={invalidText} onChange={valueChangeHandler} {...rest} />
    </>
  );
};

export default TextInput;

// Config of Accordion for Left Palette & Right Palette
TextInput.config = {
  type,
  label: 'Text Input',
  group: 'basic-input',
  editableProps: {
    Basic: [...editableProps.Basic, helperText],
    Condition: [...editableProps.Condition, readOnly]
  },
  advanceProps: [minProps, maxProps]
};
