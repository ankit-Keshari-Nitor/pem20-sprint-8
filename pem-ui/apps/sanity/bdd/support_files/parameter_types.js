import { defineParameterType } from '@cucumber/cucumber';

const customParameterTypes = {};

const customDefineParameterType = function (parameterConfig) {
  defineParameterType(parameterConfig);
  customParameterTypes[parameterConfig.name] = parameterConfig;
};

const handleCustomParameterTypes = function (type, data) {
  if (customParameterTypes.hasOwnProperty(type)) {
    return customParameterTypes[type].transformer(data);
  }
  return data;
};
const registerTypesWithArray = (types) => {
  Object.entries(types).forEach(([name, typeArray]) =>
    customDefineParameterType({
      name: name,
      regexp: new RegExp(typeArray.filter((k) => !Number(k)).join('|')),
      transformer: (type) => {
        if (typeArray.indexOf(type) > -1) {
          return type;
        }
        throw new Error(`${name} can only be ${typeArray.filter((k) => !Number(k)).join('|')}`);
      }
    })
  );
};

const registerTypesWithObject = (types) => {
  Object.entries(types).forEach(([name, typeObject]) =>
    customDefineParameterType({
      name: name,
      regexp: new RegExp(Object.keys(typeObject).join('|')),
      transformer: (type) => {
        if (typeObject.hasOwnProperty(type)) {
          return { type: type, ...typeObject[type] };
        }
        throw new Error(`${name} can only be ${Object.keys(typeObject).join('|')}, but recieved ${type}`);
      }
    })
  );
};

const userTypes = {
  SYSTEM_ADMIN: {
    userId: 'admin',
    password: 'password'
  },
  COMPANY_ADMIN: {
    userId: 'admin',
    password: 'password'
  },
  BUSINESSUNIT_ADMIN: {
    userId: 'admin',
    password: 'password'
  }
};

registerTypesWithArray({
  elementStatus: 'enabled|disabled|visible|hidden|readOnly'.split('|'),
  notificationType: 'success|information|warning|error'.split('|')
});

registerTypesWithObject({
  appUser: {
    SYSTEM_ADMIN: {
      userId: 'admin',
      password: 'password'
    },
    COMPANY_ADMIN: {
      userId: 'admin',
      password: 'password'
    },
    BUSINESSUNIT_ADMIN: {
      userId: 'admin',
      password: 'password'
    }
  },
  modalType: {
    confirm: {
      label: 'Confirm'
    },
    information: {
      label: 'Information'
    },
    warning: {
      label: 'Warning'
    },
    error: {
      label: 'Error'
    }
  },
  formFieldType: {
    TextInput: {
      label: 'label.cds--label',
      control: 'input[type="text"].cds--text-input',
      field: '.cds--form-item',
      message: 'div[id="<fieldId>-error-msg"]'
    },
    Password: {
      label: 'label.cds--label',
      control: 'input[type="password"].cds--text-input',
      field: '.cds--form-item',
      message: 'div[id="<fieldId>-error-msg"]'
    },
    NumberInput: {
      label: 'label.cds--label',
      control: 'input[type="number"]',
      field: '.cds--form-item',
      message: 'div[id="<fieldId>-error-msg"]'
    },
    Select: {
      label: 'label.cds--label',
      control: 'select.cds--select-input',
      field: '.cds--form-item',
      message: 'div[id="<fieldId>-error-msg"]'
    },
    RadioGroup: {
      label: 'legend.cds--label',
      control: '.cds--radio-button-wrapper',
      field: '.cds--form-item',
      message: '',
      options: ''
    },
    Radio: {
      label: 'label.cds--radio-button__label',
      control: 'input[type="text"].cds--text-input',
      field: '.cds--form-item',
      message: ''
    },
    CheckboxGroup: {
      label: 'legend.cds--label',
      control: '.cds--form-item',
      field: 'fieldset.cds--checkbox-group',
      message: '',
      options: ''
    },
    Checkbox: {
      label: 'label.cds--checkbox-label',
      control: 'input[type="checkbox"]',
      field: 'fieldset.cds--checkbox-group .cds--form-item',
      message: ''
    },
    Combobox: {
      label: 'label.cds--label',
      control: 'input[type="text"][role="combobox"].cds--text-input',
      field: '.cds--list-box__wrapper',
      message: '',
      option: '.cds--list-box__menu .cds--list-box__menu-item'
    }
  }
});

export { customParameterTypes, handleCustomParameterTypes };
