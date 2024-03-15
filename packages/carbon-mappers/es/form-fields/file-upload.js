/**
   PRIVATE LICENSE
   */
  
import { extends as _extends } from '../_virtual/_rollupPluginBabelHelpers.js';
import React from 'react';
import { FileUploader as FileUploader$1 } from '@carbon/react';
import { FORM_FIELD_TYPE } from '../constant/form-field-type.js';
import { editableProps } from '../constant/field-property-props.js';

const type = FORM_FIELD_TYPE.FILE_UPLOADER;
const FileUploader = _ref => {
  let {
    field
  } = _ref;
  const {
    id,
    ...rest
  } = field;
  return /*#__PURE__*/React.createElement(FileUploader$1, _extends({
    "data-testid": id,
    id: id,
    labelTitle: "Upload files",
    labelDescription: "Max file size is 500mb. Only .jpg files are supported.",
    buttonLabel: "Add file",
    buttonKind: "primary",
    size: "md",
    filenameStatus: "edit",
    accept: ['.jpg', '.png'],
    multiple: true,
    disabled: false,
    iconDescription: "Delete file",
    name: ""
  }, rest));
};

// Config of Accordion for Left Palette & Right Palette
FileUploader.config = {
  type,
  label: 'File Uploader',
  group: 'basic-input',
  editableProps: editableProps,
  advanceProps: []
};

export { FileUploader as default };
