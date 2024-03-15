import React from 'react';
import { FileUploader as CarbonFileUploader } from '@carbon/react';
import { FORM_FIELD_TYPE, editableProps } from '../constant';

const type = FORM_FIELD_TYPE.FILE_UPLOADER;

const FileUploader = ({ field }) => {
  const { id, ...rest } = field;

  return (
    <CarbonFileUploader
      data-testid={id}
      id={id}
      labelTitle="Upload files"
      labelDescription="Max file size is 500mb. Only .jpg files are supported."
      buttonLabel="Add file"
      buttonKind="primary"
      size="md"
      filenameStatus="edit"
      accept={['.jpg', '.png']}
      multiple={true}
      disabled={false}
      iconDescription="Delete file"
      name=""
      {...rest}
    />
  );
};

export default FileUploader;

// Config of Accordion for Left Palette & Right Palette
FileUploader.config = {
  type,
  label: 'File Uploader',
  group: 'basic-input',
  editableProps: editableProps,
  advanceProps: []
};
