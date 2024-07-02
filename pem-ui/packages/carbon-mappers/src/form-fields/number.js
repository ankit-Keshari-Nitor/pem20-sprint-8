import React, { useEffect, useState } from 'react';
import { NumberInput as CarbonNumberInput } from '@carbon/react';
import {
  FORM_FIELD_TYPE,
  minProps,
  maxProps,
  readOnly,
  helperText,
  placeHolder,
  regexValidation,
  NameLabel,
  FORM_FIELD_LABEL,
  FORM_FIELD_GROUPS,
  isRequired,
  labelText,id,
  isDisabled
} from '../constant';
import { CharacterWholeNumber } from '@carbon/icons-react';

const type = FORM_FIELD_TYPE.NUMBER;

const NumberInput = ({ field, id, currentPath, onChangeHandle, previewMode }) => {
  const { labelText, helperText, disabled,label, value, isRequired, min, max, ...rest } = field;
  const [fieldValue, setFieldValue] = useState();

  useEffect(() => {
    if (previewMode) {
      setFieldValue(value ? value : '');
    }
  }, [field, previewMode, value]);

  return (
    <>
      <CarbonNumberInput
        type={FORM_FIELD_TYPE.TEXT}
        data-testid={id}
        id={id}
        label={labelText === undefined ? label : labelText}
        helperText={helperText}
        disabled={disabled}
        defaultValue={0}
        value={fieldValue}
        onChange={(e) => {
          previewMode && onChangeHandle(currentPath, e.target.value);
          setFieldValue(e.target.value);
        }}
        {...rest}
      />
    </>
  );
};

export default NumberInput;

// Config of NumberInput for Left Palette & Right Palette
NumberInput.config = {
  type,
  label: FORM_FIELD_LABEL.NUMBER,
  group: FORM_FIELD_GROUPS.BASIC_INPUT,
  icon: <CharacterWholeNumber />,
  editableProps: {
    Basic: [id,NameLabel, labelText, placeHolder, helperText, readOnly],
    Condition: []
  },
  advanceProps: [minProps, maxProps, regexValidation, isRequired]
};
