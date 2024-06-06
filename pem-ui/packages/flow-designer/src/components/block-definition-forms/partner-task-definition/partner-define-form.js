/* eslint-disable react/prop-types */
import React from 'react';
import FormRenderer from '@data-driven-forms/react-form-renderer/form-renderer';
import { FORM_TEMPLATE, COMPONENT_MAPPER } from '../../../constants';
import { componentTypes, validatorTypes } from '@data-driven-forms/react-form-renderer';

export const SCHEMA = {
  fields: [
    {
      component: componentTypes.TEXT_FIELD,
      name: 'name',
      labelText: 'Name (required)',
      helperText: 'Name should not contain &,<,>,",\',.,{,}, characters.',
      isRequired: true,
      validate: [
        {
          type: validatorTypes.REQUIRED,
          message: 'Name is required'
        },
        {
          type: validatorTypes.PATTERN,
          pattern: /^[^&<>"'.{}]+$/i,
          message: 'Name should not contain &,<,>,",\',.,{,}, characters.'
        },
        {
          type: validatorTypes.MAX_LENGTH,
          threshold: 100,
          message: 'Name must be no longer then 100 characters'
        }
      ]
    },
    {
      component: componentTypes.TEXTAREA,
      name: 'description',
      labelText: 'Description',
      enableCounter: true,
      isRequired: true,
      maxCount: 100,
      validate: [
        {
          type: validatorTypes.MAX_LENGTH,
          threshold: 100,
          message: 'Description must be no longer then 100 characters'
        }
      ]
    },
    {
      component: componentTypes.TEXT_FIELD,
      name: 'estimate_days',
      labelText: 'Estimate (Days)',

    },
    {
      component: componentTypes.SELECT,
      name: 'role',
      labelText: 'Role (optional)',
      options: [
        {
          label: 'Select Role',
          value: ''
        },
        {
          label: 'AssignRole_Auto_Sponsor',
          value: 'AssignRole_Auto_Sponsor'
        },
        {
          label: 'AssignRole_Auto_Sponsor2',
          value: 'AssignRole_Auto_Sponsor2'
        },
        {
          label: 'Both',
          value: 'Both'
        },
        {
          label: 'Both1',
          value: 'Both1'
        },
        {
          label: 'Both441344',
          value: 'Both441344'
        },
        {
          label: 'BothRole1',
          value: 'BothRole1'
        },
        {
          label: 'BothRole2',
          value: 'BothRole2'
        }
      ]
    },

  ]
};

const PartnerDefineForm = ({ id, onCancelDefinitionForm, onSubmitDefinitionForm, selectedNode }) => {

  let initialValues = {};
  initialValues.name = selectedNode.id;

  return Object.keys(selectedNode?.data?.editableProps).length > 0 ? (
    <FormRenderer
      id={id}
      initialValues={selectedNode?.data?.editableProps}
      FormTemplate={FORM_TEMPLATE}
      componentMapper={COMPONENT_MAPPER}
      schema={SCHEMA}
      onSubmit={onSubmitDefinitionForm}
      onCancel={() => onCancelDefinitionForm()}
      onReset={() => console.log('Resetting')}
    />
  ) : (
    <FormRenderer
      id={id}
      initialValues={initialValues}
      FormTemplate={FORM_TEMPLATE}
      componentMapper={COMPONENT_MAPPER}
      schema={SCHEMA}
      onSubmit={onSubmitDefinitionForm}
      onCancel={() => onCancelDefinitionForm()}
      onReset={() => console.log('Resetting')}
    />
  );
};

export default PartnerDefineForm;
