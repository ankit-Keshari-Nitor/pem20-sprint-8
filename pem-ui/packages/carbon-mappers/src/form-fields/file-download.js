import React from 'react';

import { FORM_FIELD_GROUPS, FORM_FIELD_LABEL, FORM_FIELD_TYPE, id, fileUploader, NameLabel, helperText, buttonLabel, isRequired, labelText } from '../constant';
import { FileAttachmentIcon } from './../icons';
import { Button } from '@carbon/react';
import './../style.scss';
const type = FORM_FIELD_TYPE.FILE_DOWNLOADER;

const FileDownload = ({ field }) => {
    const { id, labelText, label, helperText, buttonLabel, ...rest } = field;

    return (
        <div id={id} data-testid={id}>
            <span> {labelText === undefined ? label : labelText}</span>
            <Button className='filedownload-button'>
                {buttonLabel === undefined ? 'Download' : buttonLabel}
            </Button>
            <span>{helperText}</span>
        </div>
    );
};

export default FileDownload;

// Config of File DOWNLOADER for Left Palette & Right Palette
FileDownload.config = {
    type,
    label: FORM_FIELD_LABEL.FILE_DOWNLOADER,
    group: FORM_FIELD_GROUPS.BASIC_INPUT,
    icon: <FileAttachmentIcon />,
    editableProps: {
        Basic: [id, NameLabel, labelText, helperText, buttonLabel, fileUploader],
        Condition: []
    },
    advanceProps: [isRequired]
};
