/* eslint-disable react/prop-types */
import React from 'react';
import FormRenderer from '@data-driven-forms/react-form-renderer/form-renderer';
import { componentTypes, validatorTypes } from '@data-driven-forms/react-form-renderer';
import { COMPONENT_MAPPER, FORM_TEMPLATE } from '../../constants';

export const SCHEMA = {
  fields: [
    {
      component: componentTypes.TEXT_FIELD,
      name: 'name',
      'data-testid': 'activity-name',
      labelText: 'Name (required)',
      isRequired: true,
      validate: [
        {
          type: validatorTypes.REQUIRED,
          message: 'Name is required'
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
      component: componentTypes.TEXTAREA,
      name: 'contextData',
      labelText: 'Context Data (Optional)'
    },
    {
      component: componentTypes.CHECKBOX,
      name: 'encrypted',
      labelText: 'Encrypt'
    }
  ]
};

const ActivityTaskDefinition = ({ id, editDefinitionProp, activityDefinitionData }) => {
  const onSubmitDefinitionForm = (values) => {
    editDefinitionProp(values);
  };

  const onCancelDefinitionForm = () => {
    //setOpenCancelDialog(true);
  };
  return (
    <FormRenderer
      id={id}
      initialValues={activityDefinitionData}
      FormTemplate={FORM_TEMPLATE}
      componentMapper={COMPONENT_MAPPER}
      schema={SCHEMA}
      onSubmit={onSubmitDefinitionForm}
      onCancel={() => onCancelDefinitionForm()}
    />
  );
};

export default ActivityTaskDefinition;
