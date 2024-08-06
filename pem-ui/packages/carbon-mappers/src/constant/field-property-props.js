import { FORM_FIELD_TYPE } from './form-field-type';

const labelText = {
  propsName: 'labelText',
  label: 'Label',
  value: 'Label Text',
  placeholder: 'Enter Text',
  type: 'TextInput',
  size: { col: 8 }
};

const isDisabled = {
  propsName: 'disabled',
  label: 'Disabled',
  value: false,
  type: 'Toggle'
};

const isRequired = {
  propsName: 'isRequired',
  label: 'Required',
  value: {
    value: false,
    message: ''
  },
  type: 'Toggle',
  labelA: 'No',
  labelB: 'Yes',
  size: { col: 3 }
};

const helperText = {
  propsName: 'helperText',
  label: 'Help Text',
  value: '',
  placeholder: 'Enter text',
  type: 'TextInput',
  size: { col: 16 }
};

const hrefText = {
  propsName: 'hrefText',
  label: 'URL',
  value: '',
  type: 'TextInput',
  placeholder: 'https://',
  size: { col: 8 }
};

const readOnly = {
  propsName: 'readOnly',
  label: 'Read Only',
  value: false,
  type: 'Toggle',
  labelA: 'No',
  labelB: 'Yes',
  size: { col: 3 }
};

const minProps = {
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
  size: { col: 8 }
};

const maxProps = {
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
  size: { col: 8 }
};

// New constant for Options type
const options = {
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

const labelA = {
  propsName: 'labelA',
  label: 'False Text',
  value: 'Yes',
  type: 'TextInput',
  size: { col: 8 }
};

const labelB = {
  propsName: 'labelB',
  label: 'True Text',
  value: 'No',
  type: 'TextInput',
  size: { col: 8 }
};

const Id = {
  propsName: 'name',
  label: 'ID',
  value: '',
  type: 'TextInput',
  invalid: false,
  invalidText: 'Id should be unique',
  size: { col: 8 }
};

const placeHolder = {
  propsName: 'placeHolder',
  label: 'Placeholder',
  value: '',
  placeholder: 'Enter text',
  type: 'TextInput',
  size: { col: 16 }
};

const valueLabel = {
  propsName: 'value',
  label: 'Value',
  value: '',
  placeholder: 'Enter Value',
  type: 'TextInput',
  size: { col: 8 }
};

const regexValidation = {
  propsName: 'regexValidation',
  label: 'Regex Pattern',
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
  size: { col: 16 }
};

const regexValidationforPassword = {
  propsName: 'regexValidation',
  label: 'Regex Pattern',
  items: [
    {
      label: 'None',
      value: ''
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
  size: { col: 16 }
};

const mapping = {
  propsName: 'mapping',
  label: 'Mapping',
  value: '',
  placeholder: 'Enter text',
  type: 'mapping',
  size: { col: 16 }
};

const orientation = {
  propsName: 'orientation',
  label: 'Orientation',
  options: [
    { label: 'Vertical', value: 'vertical' },
    { label: 'Horizontal', value: 'horizontal' }
  ],
  type: 'radio',
  size: { col: 8 }
};

const height = {
  propsName: 'height',
  label: 'Height',
  value: '1',
  type: 'TextInput',
  size: { col: 8 }
};

const tableColumn = {
  propsName: 'tableColumns',
  label: 'Column Header',
  value: [],
  type: 'TextInput',
  size: { col: 8 }
};

const tableRows = {
  propsName: 'tableRows',
  label: 'Table Rows',
  value: [],
  type: 'TextInput',
  size: { col: 8 }
};

const selectRow = {
  propsName: 'selectablerows',
  label: 'Selectable Rows',
  value: false,
  type: 'Toggle',
  labelA: 'No',
  labelB: 'Yes',
  size: { col: 8 }
};

const pageSize = {
  propsName: 'pagesize',
  label: 'Page Size',
  value: '',
  type: 'TextInput',
  size: { col: 8 }
};

const buttonLabel = {
  propsName: 'buttonLabel',
  label: 'Button Label',
  value: '',
  type: 'TextInput',
  size: { col: 8 }
};

const fileUploader = {
  propsName: 'fileUploader',
  label: 'File Upload',
  value: '',
  type: 'FileUpload'
};

const mulitipleAllow = {
  propsName: 'mulitipleAllow',
  label: 'Multiple Allow',
  value: false,
  type: 'Toggle',
  labelA: 'No',
  labelB: 'Yes'
};

const decodeBase64 = {
  propsName: 'decodeBase64',
  label: 'Decode Base64',
  value: false,
  type: 'Toggle',
  labelA: 'No',
  labelB: 'Yes'
};

const extensions = {
  propsName: 'extensions',
  label: 'Extensions',
  type: 'TextInput',
  invalid: false,
  invalidText: 'Only comma separated values are allowed',
  regexPattern: /^[a-zA-Z0-9,]+$/,
  size: { col: 8 }
};

const maxFileSize = {
  propsName: 'maxFileSize',
  label: 'Max File Size',
  type: 'TextInput',
  value: '100kb',
  invalid: false,
  invalidText: "Invalid size format. Use format like '500b', '500kb', or '500mb'.",
  regexPattern: /(\d+(\.\d+)?)(b|kb|mb)/i,
  size: { col: 8 }
};

const fontSize = {
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
    { label: '36px', value: '36px' }
  ],
  size: { col: 8 }
};

const addTab = {
  propsName: 'addTabBtn',
  label: 'Add Tab',
  value: '',
  type: 'Button',
  size: { col: 8 }
};

const addColumnInGroup = {
  propsName: 'addColumnBtn',
  label: 'Add Column',
  value: '',
  type: 'Button',
  size: { col: 8 }
};

const minDate = {
  type: 'Date',
  propsName: 'minDate',
  label: 'Min Date',
  value: '',
  size: { col: 8 }
};

const maxDate = {
  type: 'Date',
  propsName: 'maxDate',
  label: 'Max Date',
  value: '',
  size: { col: 8 }
};

const dateFormat = {
  type: 'DropDown',
  label: 'Date Format',
  propsName: 'dateFormat',
  size: { col: 8 },
  value: 'mm/dd/yyyy',
  options: [
    { label: 'mm/dd/yyyy', value: 'm/d/Y' },
    { label: 'dd/mm/yyyy', value: 'd/m/Y' },
    { label: 'MMM,D,Y', value: 'M,d,Y' }
  ]
};

const dateValue = {
  type: 'Date',
  propsName: 'dateValue',
  label: 'Value',
  value: '',
  size: { col: 8 }
};

const textAreaHeight = {
  propsName: 'height',
  label: 'Default Height (in lines)',
  type: 'DropDown',
  value: '1',
  options: [
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' },
    { label: '5', value: '5' }
  ],
  size: { col: 8 }
};

const ElementTypeConfig = {
  [FORM_FIELD_TYPE.TEXT_INPUT]: {
    propsName: 'elementType',
    label: 'Element Type',
    options: [FORM_FIELD_TYPE.TEXT_INPUT, FORM_FIELD_TYPE.TEXT_AREA, FORM_FIELD_TYPE.PASSWORD, FORM_FIELD_TYPE.DATEPICKER, FORM_FIELD_TYPE.NUMBER],
    type: 'select',
    size: { col: 8 }
  },

  [FORM_FIELD_TYPE.INFO]: {
    propsName: 'elementType',
    label: 'Element Type',
    options: [FORM_FIELD_TYPE.INFO],
    type: 'select',
    size: { col: 8 }
  },

  [FORM_FIELD_TYPE.FILE_UPLOADER]: {
    propsName: 'elementType',
    label: 'Element Type',
    options: [FORM_FIELD_TYPE.FILE_UPLOADER, FORM_FIELD_TYPE.FILE_DOWNLOADER],
    type: 'select',
    size: { col: 8 }
  },

  [FORM_FIELD_TYPE.LINK]: {
    propsName: 'elementType',
    label: 'Element Type',
    options: [FORM_FIELD_TYPE.LINK],
    type: 'select',
    size: { col: 8 }
  },

  [FORM_FIELD_TYPE.TOGGLE]: {
    propsName: 'elementType',
    label: 'Element Type',
    options: [FORM_FIELD_TYPE.TOGGLE],
    type: 'select',
    size: { col: 8 }
  },

  [FORM_FIELD_TYPE.SELECT]: {
    propsName: 'elementType',
    label: 'Element Type',
    options: [FORM_FIELD_TYPE.SELECT, FORM_FIELD_TYPE.RADIOGROUP, FORM_FIELD_TYPE.CHECKBOXGROUP],
    type: 'select',
    size: { col: 8 }
  },

  [FORM_FIELD_TYPE.TEXT]: {
    propsName: 'elementType',
    label: 'Element Type',
    options: [FORM_FIELD_TYPE.TEXT],
    type: 'select',
    size: { col: 8 }
  },

  [FORM_FIELD_TYPE.DATATABLE]: {
    propsName: 'elementType',
    label: 'Element Type',
    options: [FORM_FIELD_TYPE.DATATABLE],
    type: 'select',
    size: { col: 8 }
  }
};

export const PropsPanelFields = {
  [FORM_FIELD_TYPE.TEXT_INPUT]: [ElementTypeConfig[FORM_FIELD_TYPE.TEXT_INPUT], Id, labelText, readOnly, isRequired, valueLabel, placeHolder, helperText, mapping],
  [FORM_FIELD_TYPE.TEXT_AREA]: [ElementTypeConfig[FORM_FIELD_TYPE.TEXT_INPUT], Id, labelText, readOnly, isRequired, textAreaHeight, valueLabel, placeHolder, helperText, mapping],
  [FORM_FIELD_TYPE.PASSWORD]: [ElementTypeConfig[FORM_FIELD_TYPE.TEXT_INPUT], Id, labelText, isRequired, placeHolder, helperText, mapping],
  [FORM_FIELD_TYPE.DATEPICKER]: [ElementTypeConfig[FORM_FIELD_TYPE.TEXT_INPUT], Id, labelText, readOnly, isRequired, dateFormat, dateValue, placeHolder, helperText],
  [FORM_FIELD_TYPE.NUMBER]: [ElementTypeConfig[FORM_FIELD_TYPE.TEXT_INPUT], Id, labelText, readOnly, isRequired, valueLabel, placeHolder, helperText, mapping],
  [FORM_FIELD_TYPE.INFO]: [ElementTypeConfig[FORM_FIELD_TYPE.INFO], Id, labelText],
  [FORM_FIELD_TYPE.FILE_DOWNLOADER]: [ElementTypeConfig[FORM_FIELD_TYPE.FILE_UPLOADER], Id, labelText, helperText, maxFileSize, extensions],
  [FORM_FIELD_TYPE.FILE_UPLOADER]: [ElementTypeConfig[FORM_FIELD_TYPE.FILE_UPLOADER], Id, labelText, helperText, buttonLabel, fileUploader],
  [FORM_FIELD_TYPE.LINK]: [ElementTypeConfig[FORM_FIELD_TYPE.LINK], Id, labelText, hrefText, helperText],
  [FORM_FIELD_TYPE.TOGGLE]: [ElementTypeConfig[FORM_FIELD_TYPE.TOGGLE], Id, labelText, helperText, labelA, labelB, readOnly],
  [FORM_FIELD_TYPE.SELECT]: [ElementTypeConfig[FORM_FIELD_TYPE.SELECT], Id, labelText, placeHolder, helperText, options, readOnly],
  [FORM_FIELD_TYPE.RADIOGROUP]: [ElementTypeConfig[FORM_FIELD_TYPE.SELECT], Id, labelText, helperText, options, orientation, readOnly],
  [FORM_FIELD_TYPE.CHECKBOXGROUP]: [ElementTypeConfig[FORM_FIELD_TYPE.SELECT], Id, labelText, helperText, options, orientation, readOnly],
  [FORM_FIELD_TYPE.TEXT]: [ElementTypeConfig[FORM_FIELD_TYPE.TEXT], Id, labelText, mapping, fontSize],
  [FORM_FIELD_TYPE.DATATABLE]: [ElementTypeConfig[FORM_FIELD_TYPE.DATATABLE], Id, labelText, helperText, selectRow, pageSize, tableColumn, tableRows]
};

export const propsPanelAdvanceFields = {
  [FORM_FIELD_TYPE.TEXT_INPUT]: [minProps, maxProps, regexValidation],
  [FORM_FIELD_TYPE.TEXT_AREA]: [minProps, maxProps, regexValidation],
  [FORM_FIELD_TYPE.NUMBER]: [minProps, maxProps],
  [FORM_FIELD_TYPE.PASSWORD]: [minProps, maxProps, regexValidationforPassword],
  [FORM_FIELD_TYPE.PASSWORD]: [[minDate, maxDate]],
  [FORM_FIELD_TYPE.INFO]: [],
  [FORM_FIELD_TYPE.FILE_DOWNLOADER]: [],
  [FORM_FIELD_TYPE.FILE_UPLOADER]: [],
  [FORM_FIELD_TYPE.LINK]: [],
  [FORM_FIELD_TYPE.TOGGLE]: [],
  [FORM_FIELD_TYPE.SELECT]: [],
  [FORM_FIELD_TYPE.RADIOGROUP]: [],
  [FORM_FIELD_TYPE.CHECKBOXGROUP]: [],
  [FORM_FIELD_TYPE.TEXT]: [],
  [FORM_FIELD_TYPE.DATATABLE]: []
};
