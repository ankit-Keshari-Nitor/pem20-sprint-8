export const labelText = {
  propsName: 'labelText',
  label: 'Label (required)',
  value: 'Label Text',
  placeholder: 'Enter Text',
  type: 'TextInput',
  propsPanelColSize: 8,
};

export const isDisabled = {
  propsName: 'disabled',
  label: 'Disabled',
  value: false,
  type: 'Toggle'
};

export const isRequired = {
  propsName: 'isRequired',
  label: 'Required',
  value: {
    value: false,
    message: ''
  },
  type: 'Toggle',
  labelA: 'No',
  labelB: 'Yes',
  propsPanelColSize: 3,
};

export const helperText = {
  propsName: 'helperText',
  label: 'Help Text',
  value: '',
  placeholder: 'Enter text',
  type: 'TextInput',
  propsPanelColSize: 8,
};

export const hrefText = {
  propsName: 'hrefText',
  label: 'URL',
  value: '',
  type: 'TextInput',
  placeholder: 'https://',
  propsPanelColSize: 8,
};

export const readOnly = {
  propsName: 'readOnly',
  label: 'Read Only',
  value: false,
  type: 'Toggle',
  labelA: 'No',
  labelB: 'Yes',
  propsPanelColSize: 3,
};

export const minProps = {
  propsName: 'min',
  label: 'Min Length',
  value: {
    value: '0',
    message: ''
  },
  type: 'TextInput',
  invalid: false,
  invalidText: 'Only Numbers are allowed',
  regexPattern: /^[0-9]+$/,
  propsPanelColSize: 8,
};

export const maxProps = {
  propsName: 'max',
  label: 'Max Length',
  value: {
    value: '20',
    message: ''
  },
  type: 'TextInput',
  invalid: false,
  invalidText: 'Only Numbers are allowed',
  regexPattern: /^[0-9]+$/,
  propsPanelColSize: 8,
};

// New constant for Options type
export const options = {
  propsName: 'options',
  label: 'Options',
  value: [
    {
      label: '',
      id: '',
      value: ''
    }
  ],
  type: 'Options'
};

export const labelA = {
  propsName: 'labelA',
  label: 'False Text',
  value: 'Yes',
  type: 'TextInput',
  propsPanelColSize: 8,
};

export const labelB = {
  propsName: 'labelB',
  label: 'True Text',
  value: 'No',
  type: 'TextInput',
  propsPanelColSize: 8,
};

export const Id = {
  propsName: 'name',
  label: 'ID (required)',
  value: '',
  type: 'TextInput',
  invalid: false,
  invalidText: 'Id should be unique',
  propsPanelColSize: 8,
};

export const placeHolder = {
  propsName: 'placeHolder',
  label: 'Placeholder',
  value: '',
  placeholder: 'Enter text',
  type: 'TextInput',
  propsPanelColSize: 8,
};

export const valueLabel = {
  propsName: 'valueLabel',
  label: 'Value (required)',
  value: '',
  placeholder: 'Enter Value',
  type: 'TextInput',
  propsPanelColSize: 8,
};

export const regexValidation = {
  propsName: 'regexValidation',
  label: 'Regex',
  items: [
    {
      label: 'None',
      value: ''
    },
    {
      label: 'Lower- or Upper-case Alpha Numeric only',
      value: '/^(?=.*?[a-zA-Z])[a-zA-Z0-9]+$'
    },
    {
      label: 'Lower- or Upper-case Alpha Numeric and Numbers only',
      value: '/^(?=.*?d)[a-zA-Z0-9]+$'
    },
    {
      label: 'Email Address',
      value: '/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/'
    },
    {
      label: 'Integer Number with min and max values',
      value: '1'
    },
    {
      label: 'URL',
      value:
        '(https?://(?:www.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|www.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|https?://(?:www.|(?!www))[a-zA-Z0-9]+.[^s]{2,}|www.[a-zA-Z0-9]+.[^s]{2,})'
    },
    {
      label: 'Custom',
      value: 'customRegex'
    }
  ],
  value: {
    pattern: '',
    value: '',
    message: ''
  },
  type: 'Options',
  propsPanelColSize: 16,
};

export const mapping = {
  propsName: 'mapping',
  label: 'Mapping',
  value: '',
  placeholder: 'Enter text',
  type: 'mapping',
  propsPanelColSize: 8,
};

export const orientation = {
  propsName: 'orientation',
  label: 'Orientation',
  options: [
    { label: 'Vertical', value: 'vertical' },
    { label: 'Horizontal', value: 'horizontal' }
  ],
  type: 'radio',
  propsPanelColSize: 8,
};

export const height = {
  propsName: 'height',
  label: 'Height',
  value: '1',
  type: 'TextInput',
  propsPanelColSize: 8,
};

export const elementTyps = {
  propsName: 'elementTyps',
  label: 'Element Typs',
  value: '',
  type: 'select',
  propsPanelColSize: 8,
};

export const tableColumn = {
  propsName: 'tableColumns',
  label: 'Column Header',
  value: [],
  type: 'TextInput',
  propsPanelColSize: 8,
};

export const tableRows = {
  propsName: 'tableRows',
  label: 'Table Rows',
  value: [],
  type: 'TextInput',
  propsPanelColSize: 8,
};

export const selectRow = {
  propsName: 'selectablerows',
  label: 'Selectable Rows',
  value: false,
  type: 'Toggle',
  labelA: 'No',
  labelB: 'Yes'
};

export const pageSize = {
  propsName: 'pagesize',
  label: 'Page Size',
  value: '',
  type: 'TextInput',
  propsPanelColSize: 8,
};

export const buttonLabel = {
  propsName: 'buttonLabel',
  label: 'Button Label',
  value: '',
  type: 'TextInput',
  propsPanelColSize: 8,
};

export const fileUploader = {
  propsName: 'fileUploader',
  label: 'File Upload',
  value: '',
  type: 'FileUpload'
}

export const mulitipleAllow = {
  propsName: 'mulitipleAllow',
  label: 'Multiple Allow',
  value: false,
  type: 'Toggle',
  labelA: 'No',
  labelB: 'Yes'
};

export const decodeBase64 = {
  propsName: 'decodeBase64',
  label: 'Decode Base64',
  value: false,
  type: 'Toggle',
  labelA: 'No',
  labelB: 'Yes'
}

export const extensions = {
  propsName: 'extensions',
  label: 'Extensions',
  type: 'TextInput',
  invalid: false,
  invalidText: 'Only comma separated values are allowed',
  regexPattern: /^[a-zA-Z0-9,]+$/,
  propsPanelColSize: 8,
};



export const maxFileSize = {
  propsName: 'maxFileSize',
  label: 'Max File Size',
  type: 'TextInput',
  value: '100kb',
  invalid: false,
  invalidText: "Invalid size format. Use format like '500b', '500kb', or '500mb'.",
  regexPattern: /(\d+(\.\d+)?)(b|kb|mb)/i,
  propsPanelColSize: 8,
}

export const fontSize = {
  propsName: 'fontSize',
  label: 'Font Size',
  type: 'DropDown',
  options: [
    { label: '8px', value: '8px' },
    { label: '9px', value: '9px' },
    { label: '10px', value: '10px' },
    { label: '11px', value: '11px' },
    { label: '12px', value: '12px' },
    { label: '14px', value: '14px' },
    { label: '16px', value: '16px' },
    { label: '18px', value: '18px' },
    { label: '20px', value: '20px' },
    { label: '22px', value: '22px' },
    { label: '24px', value: '24px' },
    { label: '26px', value: '26px' },
    { label: '28px', value: '28px' },
    { label: '30px', value: '30px' },
    { label: '32px', value: '32px' },
    { label: '34px', value: '34px' },
    { label: '36px', value: '36px' },
  ],
}