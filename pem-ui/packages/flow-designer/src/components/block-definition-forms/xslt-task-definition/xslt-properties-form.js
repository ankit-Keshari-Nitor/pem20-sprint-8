/* eslint-disable react/prop-types */
import React from 'react';
import FormRenderer from '@data-driven-forms/react-form-renderer/form-renderer';
import { FORM_TEMPLATE, COMPONENT_MAPPER } from '../../../constants';
import { componentTypes, validatorTypes } from '@data-driven-forms/react-form-renderer';

export const SCHEMA = {
  fields: [
    {
      component: componentTypes.TEXTAREA,
      name: 'input',
      labelText: 'Input*',
      helperText: 'Provide a valid XML code and click the mapping button (...) to update the input XML with additional mapped parameters.',
      isRequired: true,
      validate: [
        {
          type: validatorTypes.REQUIRED,
          message: 'Input is required'
        },
        {
          type: validatorTypes.MAX_LENGTH,
          threshold: 100,
          message: 'XSLT must be no longer then 100 characters'
        }
      ]
    },
    {
      component: componentTypes.CHECKBOX,
      name: 'escape_input',
      labelText: 'Escape Input'
    },
    {
      component: componentTypes.TEXTAREA,
      name: 'xslt',
      labelText: 'XSLT*',
      isRequired: true,
      validate: [
        {
          type: validatorTypes.REQUIRED,
          message: 'XSLT is required'
        },
        {
          type: validatorTypes.MAX_LENGTH,
          threshold: 100,
          message: 'XSLT must be no longer then 100 characters'
        }
      ]
    },
    {
      component: componentTypes.SELECT,
      name: 'output_format',
      labelText: 'Output Format',
      options: [
        {
          label: 'XML',
          value: 'xml'
        }
      ]
    },
    {
      component: componentTypes.TEXTAREA,
      name: 'output',
      labelText: 'Sample Output'
    },
  ]
};

const XsltPropertyForm = ({ id, setOpenCancelDialog, onSubmitPropertyForm }) => (
  <FormRenderer
    id={id}
    FormTemplate={FORM_TEMPLATE}
    componentMapper={COMPONENT_MAPPER}
    schema={SCHEMA}
    onSubmit={onSubmitPropertyForm}
    onCancel={() => console.log('Cancelling')}
    onReset={() => console.log('Resetting')}
  />
);

export default XsltPropertyForm;
