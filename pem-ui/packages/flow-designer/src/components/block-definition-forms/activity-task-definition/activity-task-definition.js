/* eslint-disable react/prop-types */
import React from 'react';
import FormRenderer from '@data-driven-forms/react-form-renderer/form-renderer';
import { FORM_TEMPLATE, COMPONENT_MAPPER } from '../../../constants';
import { componentTypes, validatorTypes } from '@data-driven-forms/react-form-renderer';
// import useActivitykStore from '../../../../../../apps/web/src/modules/activity/store';

export const SCHEMA = {
  fields: [
    {
      component: componentTypes.TEXT_FIELD,
      name: 'name',
      labelText: 'Name*',
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
      labelText: 'Description*',
      isRequired: true,
      validate: [
        {
          type: validatorTypes.REQUIRED,
          message: 'Description is required'
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

const ActivityTaskDefinition = ({ id, editDefinitionProp }) => {
//   const editDefinitionProp = useActivitykStore((state) => state.editDefinitionProps);

  const onSubmitDefinitionForm = (values) => {
    editDefinitionProp(values);
  };

  const onCancelDefinitionForm = () => {
    //setOpenCancelDialog(true);
  };
  return (
    <FormRenderer
      id={id}
      //   initialValues={selectedNode?.data?.editableProps}
      FormTemplate={FORM_TEMPLATE}
      componentMapper={COMPONENT_MAPPER}
      schema={SCHEMA}
      onSubmit={onSubmitDefinitionForm}
      onCancel={() => onCancelDefinitionForm()}
      onReset={() => console.log('Resetting')}
    />
  );
};

export default ActivityTaskDefinition;
