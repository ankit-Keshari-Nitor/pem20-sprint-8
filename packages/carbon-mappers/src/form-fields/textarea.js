import React, { useEffect } from 'react';
import { TextArea as CarbonTextArea } from '@carbon/react';
import { FORM_FIELD_TYPE, editableProps, minProps, maxProps, readOnly, helperText } from '../constant';
import Label from './label';
import useMinMaxInput from '../custom-hooks/use-min-max-input';

const type = FORM_FIELD_TYPE.TEXT_AREA;

const TextArea = ({ field }) => {
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
      <CarbonTextArea data-testid={id} id={id} type={type} labelText="" value={value} invalid={isValid} invalidText={invalidText} onChange={valueChangeHandler} {...rest} />
    </>
  );
};

export default TextArea;

// Config of Text Area for Left Palette
TextArea.config = {
  type,
  label: 'Text Area',
  group: 'basic-input',
  editableProps: {
    Basic: [...editableProps.Basic, helperText],
    Condition: [...editableProps.Condition, readOnly]
  },
  advanceProps: [minProps, maxProps]
};
