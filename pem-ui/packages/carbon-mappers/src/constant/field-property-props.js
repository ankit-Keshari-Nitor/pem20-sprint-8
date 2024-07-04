export const labelText = {
  propsName: 'labelText',
  label: 'Label',
  value: 'Label Text',
  type: 'TextInput'
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
  labelB: 'Yes'
};

export const helperText = {
  propsName: 'helperText',
  label: 'Help Text',
  value: '',
  type: 'TextInput'
};

export const hrefText = {
  propsName: 'hrefText',
  label: 'URL',
  value: '',
  type: 'TextInput'
};

export const readOnly = {
  propsName: 'readOnly',
  label: 'Read-only',
  value: false,
  type: 'Toggle',
  labelA: 'No',
  labelB: 'Yes'
};

export const minProps = {
  propsName: 'min',
  label: 'Min Length',
  value: {
    value: '',
    message: ''
  },
  type: 'TextInput'
};

export const maxProps = {
  propsName: 'max',
  label: 'Max Length',
  value: {
    value: '',
    message: ''
  },
  type: 'TextInput'
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
  type: 'TextInput'
};

export const labelB = {
  propsName: 'labelB',
  label: 'True Text',
  value: 'No',
  type: 'TextInput'
};

export const NameLabel = {
  propsName: 'name',
  label: 'Name',
  value: '',
  type: 'TextInput',
  invalid: false,
  invalidText: 'Name should be unique'
};

export const placeHolder = {
  propsName: 'placeHolder',
  label: 'Placeholder Text',
  value: '',
  type: 'TextInput'
};

export const valueLabel = {
  propsName: 'Default Value',
  label: 'Value',
  value: '',
  type: 'TextInput'
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
      label: 'Custom Regular Expression',
      value: 'customRegex'
    }
  ],
  value: {
    pattern: '',
    value: '',
    message: ''
  },
  type: 'Options'
};

export const mapping = {
  propsName: 'mapping',
  label: 'Mapping',
  value: '',
  type: 'mapping'
};

export const orientation = {
  propsName: 'orientation',
  label: 'Orientation',
  options: [
    { label: 'Vertical', value: 'vertical' },
    { label: 'Horizontal', value: 'horizontal' }
  ],
  type: 'radio'
};

export const height = {
  propsName: 'height',
  label: 'Height',
  value: '1',
  type: 'TextInput'
};

export const id = {
  propsName: 'id',
  label: 'ID',
  value: '',
  type: 'text'
};

export const tableColumn = {
  propsName: 'tableColumns',
  label: 'Column Header',
  value: [],
  type: 'TextInput'
};

export const tableRows = {
  propsName: 'tableRows',
  label: 'Table Rows',
  value: [],
  type: 'TextInput'
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
  type: 'TextInput'
};
