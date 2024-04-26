import React, { useEffect, useState } from 'react';
import { TextInput as CarbonTextInput } from '@carbon/react';
import { FORM_FIELD_TYPE, minProps, maxProps, readOnly, helperText, FORM_FIELD_LABEL, FORM_FIELD_GROUPS, isRequired, labelText, isDisabled } from '../constant';
import { TextInputIcon } from './../icons';

const type = FORM_FIELD_TYPE.TEXT_INPUT;

const TextInput = ({ field, id, currentPath, onChangeHandle, previewMode }) => {
  const { labelText, helperText, disabled, value, isRequired, min, max, ...rest } = field;
  const [fieldValue, setFieldValue] = useState();

  useEffect(() => {
    if (previewMode) {
      setFieldValue(value ? value : '');
    }
  }, [field]);
  return (
    <>
      <CarbonTextInput
        type={FORM_FIELD_TYPE.TEXT}
        data-testid={id}
        id={id}
        labelText={labelText}
        helperText={helperText}
        disabled={disabled}
        defaultValue={''}
        value={fieldValue}
        onChange={(e) => {
          previewMode && onChangeHandle(currentPath, e.target.value);
          setFieldValue(e.target.value);
        }}
        {...rest}
      />
      {/* <div style={rest.isRequiredInvalid ? { display: 'block', color: '#da1e28', fontSize: '0.75rem' } : { display: 'none' }}>This field is required!!</div> */}
    </>
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
    Basic: [labelText, helperText, isDisabled, readOnly],
    Condition: []
  },
  advanceProps: [minProps, maxProps, isRequired]
};
