import React, { useEffect, useState } from 'react';
import { TextArea as CarbonTextArea } from '@carbon/react';
import {
  FORM_FIELD_TYPE,
  minProps,
  maxProps,
  readOnly,
  NameLabel,
  valueLabel,
  mapping,
  helperText,
  placeHolder,
  FORM_FIELD_LABEL,
  FORM_FIELD_GROUPS,
  isRequired,
  labelText,
  regexValidation,
  height,
  id
} from '../constant';
import { TextAreaIcon } from '../icons';

const type = FORM_FIELD_TYPE.TEXT_AREA;

const TextArea = ({ field, id, currentPath, onChangeHandle, previewMode }) => {
  const { labelText, label, height, readOnly, isRequired, value, min, max, ...rest } = field;
  const [fieldValue, setFieldValue] = useState();

  useEffect(() => {
    if (previewMode) {
      setFieldValue(value ? value : '');
    }
  }, [field, previewMode, value]);

  return (
    <CarbonTextArea
      id={id}
      rows={height}
      data-testid={id}
      labelText={labelText === undefined ? label : labelText}
      value={fieldValue}
      onChange={(e) => {
        previewMode && onChangeHandle(currentPath, e.target.value);
        setFieldValue(e.target.value);
      }}
      {...rest}
    />
  );
};

export default TextArea;

// Config of Text Area for Left Palette
TextArea.config = {
  type,
  label: FORM_FIELD_LABEL.TEXT_AREA,
  group: FORM_FIELD_GROUPS.BASIC_INPUT,
  icon: <TextAreaIcon />,
  editableProps: {
    Basic: [id, NameLabel, labelText, placeHolder, helperText, height, valueLabel, mapping, readOnly],
    Condition: []
  },
  advanceProps: [minProps, maxProps, regexValidation, isRequired]
};
