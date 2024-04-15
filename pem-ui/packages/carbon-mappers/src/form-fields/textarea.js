import React, { useEffect } from 'react';
import { TextArea as CarbonTextArea } from '@carbon/react';
import { FORM_FIELD_TYPE, editableProps, minProps, maxProps, readOnly, helperText, FORM_FIELD_LABEL, FORM_FIELD_GROUPS } from '../constant';
import useMinMaxInput from '../custom-hooks/use-min-max-input';
import { TextAreaIcon } from '../icons';

const type = FORM_FIELD_TYPE.TEXT_AREA;

const TextArea = ({ field, id }) => {
  const { labelText, isRequired, min, max, ...rest } = field;
  const { value, isValid, invalidText, valueChangeHandler, minChangeHandler, maxChangeHandler } = useMinMaxInput();

  useEffect(() => {
    if (min !== undefined) {
      minChangeHandler(min);
    }
    if (max !== undefined) {
      maxChangeHandler(max);
    }
  }, [min, max, minChangeHandler, maxChangeHandler]);

  return <CarbonTextArea id={id} data-testid={id} labelText={labelText} value={value} invalid={isValid} onChange={valueChangeHandler} {...rest} />;
};

export default TextArea;

// Config of Text Area for Left Palette
TextArea.config = {
  type,
  label: FORM_FIELD_LABEL.TEXT_AREA,
  group: FORM_FIELD_GROUPS.BASIC_INPUT,
  icon: <TextAreaIcon />,
  editableProps: {
    Basic: [...editableProps.Basic, helperText],
    Condition: [...editableProps.Condition, readOnly]
  },
  advanceProps: [minProps, maxProps]
};
