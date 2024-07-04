import React, { useState } from 'react';
import { FileUploaderDropContainer, FileUploaderItem } from '@carbon/react';
import { FORM_FIELD_GROUPS, FORM_FIELD_LABEL, FORM_FIELD_TYPE, id, maxFileSize, NameLabel, helperText, accept, isRequired, labelText } from '../constant';
import { FileAttachmentIcon } from './../icons';

const type = FORM_FIELD_TYPE.FILE_UPLOADER;

const FileUploader = ({ field, id, }) => {
  const { labelText, label, maxFileSize, accept, ...rest } = field;

  const [file, setFile] = useState();
  const [error, setError] = useState('');

  function convertToBytes(sizeStr = '') {
    // Regular expression to match the size string
    const sizePattern = /(\d+(\.\d+)?)(b|kb|mb)/i;
    const match = sizeStr !== '' ? sizeStr.match(sizePattern) : false;

    if (!match) {
      throw new Error("Invalid size format. Use format like '500b', '500kb', or '500mb'.");
    }

    const value = parseFloat(match[1]);
    const unit = match[3].toLowerCase();

    let bytes;

    switch (unit) {
      case 'b':
        bytes = value;
        break;
      case 'kb':
        bytes = value * 1024;
        break;
      case 'mb':
        bytes = value * 1024 * 1024;
        break;
      default:
        throw new Error("Unsupported unit. Use 'b', 'kb', or 'mb'.");
    }

    return bytes;
  }

  const onAddFiles = (event, files) => {
    const file = event.target.files || files.addedFiles;

    const newFile = [
      {
        name: file[0].name,
        filesize: file[0].size,
        status: 'edit',
        iconDescription: 'Delete icon',
        invalidFileType: file[0].invalidFileType
      }
    ];
    setFile(newFile[0]);
    onUploadFiles(newFile[0]);

  }

  const onUploadFiles = (fileUpload) => {
    if (fileUpload.filesize <= convertToBytes(maxFileSize)) {
      setError('');
      const updatedFile = {
        ...fileUpload,
        status: 'edit',
        iconDescription: 'Delete Icon',
        invalid: true,
        errorSubject: 'InValid ',
        errorBody: ('Error', { fileName: fileUpload.name, fileType: accept.join(',') })
      };
      setFile(updatedFile);
    } else {
      setError('File size exceeds the maximum limit');
    }
  }

  const onDeleteFile = function (...args) {
    setFile();

  };

  return (
    <div>
      {file === undefined ?
        <>
          <FileUploaderDropContainer
            labelText={labelText === undefined ? label : labelText}
            name={NameLabel}
            filenameStatus='edit'
            onChange={onAddFiles}
            onAddFiles={onAddFiles}
            accept={accept}
          />
          {error && <p className="error-text">{error}</p>}
        </>

        :
        <div>
          <p className="cds--label-description">{labelText === undefined ? label : labelText}</p>
          <FileUploaderItem
            errorBody="500kb max file size. Select a new file and try again."
            errorSubject="File size exceeds limit"
            iconDescription="Delete file"
            name={file.name}
            onDelete={onDeleteFile}
            size="md"
            status="edit"
          />
        </div>
      }
    </div >
  );
};

export default FileUploader;

// Config of File Uploader for Left Palette & Right Palette
FileUploader.config = {
  type,
  label: FORM_FIELD_LABEL.FILE_UPLOADER,
  group: FORM_FIELD_GROUPS.BASIC_INPUT,
  icon: <FileAttachmentIcon />,
  editableProps: {
    Basic: [id, NameLabel, labelText, helperText, maxFileSize, accept],
    Condition: []
  },
  advanceProps: [isRequired]
};
