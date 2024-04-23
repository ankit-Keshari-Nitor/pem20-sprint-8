import React from 'react';
import { FileUploader as CarbonFileUploader } from '@carbon/react';
import { FORM_FIELD_GROUPS, FORM_FIELD_LABEL, FORM_FIELD_TYPE, isDisabled, labelText } from '../constant';
import { FileAttachmentIcon } from './../icons';

const type = FORM_FIELD_TYPE.FILE_UPLOADER;

const FileUploader = ({ field, id }) => {
  const { ...rest } = field;

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
  label: FORM_FIELD_LABEL.FILE_UPLOADER,
  group: FORM_FIELD_GROUPS.BASIC_INPUT,
  icon: <FileAttachmentIcon />,
  editableProps: {
    Basic: [labelText, isDisabled],
    Condition: []
  },
  advanceProps: []
};
