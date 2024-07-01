/* eslint-disable react/prop-types */
import React from 'react';
import FormRenderer from '@data-driven-forms/react-form-renderer/form-renderer';
import {ACTIVITY_TASK_SCHEMA, COMPONENT_MAPPER, FORM_TEMPLATE } from '../../constants';

const ActivityTaskDefinition = ({ id, onSubmitDefinitionForm, activityDefinitionData, readOnly }) => {
  
  ACTIVITY_TASK_SCHEMA.fields = ACTIVITY_TASK_SCHEMA.fields.map((item) => ({ ...item, isReadOnly: readOnly }));
  
 
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
      onSubmit={(values)=>onSubmitDefinitionForm(values)}
      onCancel={() => onCancelDefinitionForm()}
    />
  );
};

export default ActivityTaskDefinition;
