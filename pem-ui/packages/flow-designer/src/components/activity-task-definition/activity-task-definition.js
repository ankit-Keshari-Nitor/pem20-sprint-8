/* eslint-disable react/prop-types */
import React from 'react';
import FormRenderer from '@data-driven-forms/react-form-renderer/form-renderer';
import { ACTIVITY_TASK_SCHEMA, COMPONENT_MAPPER, FORM_TEMPLATE } from '../../constants';

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
      schema={ACTIVITY_TASK_SCHEMA}
      onSubmit={onSubmitDefinitionForm}
      onCancel={() => onCancelDefinitionForm()}
    />
  );
};

export default ActivityTaskDefinition;
