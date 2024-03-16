/**
   PRIVATE LICENSE
   */
  
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _rollupPluginBabelHelpers = require('../_virtual/_rollupPluginBabelHelpers.js');
var React = require('react');
var react = require('@carbon/react');
var formFieldType = require('../constant/form-field-type.js');
var fieldPropertyProps = require('../constant/field-property-props.js');
var iconsReact = require('@carbon/icons-react');

const type = formFieldType.FORM_FIELD_TYPE.FILE_UPLOADER;
const FileUploader = _ref => {
  let {
    field
  } = _ref;
  const {
    id,
    ...rest
  } = field;
  return /*#__PURE__*/React.createElement(react.FileUploader, _rollupPluginBabelHelpers.extends({
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
  icon: /*#__PURE__*/React.createElement(iconsReact.Upload, null),
  editableProps: fieldPropertyProps.editableProps,
  advanceProps: []
};

exports.default = FileUploader;
