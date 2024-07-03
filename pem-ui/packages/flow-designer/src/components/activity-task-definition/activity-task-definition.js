/* eslint-disable react/prop-types */
import React from 'react';
import FormRenderer from '@data-driven-forms/react-form-renderer/form-renderer';
import { ACTIVITY_TASK_SCHEMA, COMPONENT_MAPPER, FORM_TEMPLATE } from '../../constants';

const ActivityTaskDefinition = ({ id, onSubmitDefinitionForm, setShowActivityDefineDrawer, activityDefinitionData, readOnly }) => {
  ACTIVITY_TASK_SCHEMA.fields = ACTIVITY_TASK_SCHEMA.fields.map((item) => ({ ...item, isReadOnly: readOnly }));

  const initialValues = {
    name: activityDefinitionData.definition?.name,
    description: activityDefinitionData.definition?.description,
    encrypted: activityDefinitionData.version.encrypted | false,
    contextData: activityDefinitionData.version.contextData
  };

  return (
    <FormRenderer
      id={id}
      initialValues={initialValues}
      FormTemplate={FORM_TEMPLATE}
      componentMapper={COMPONENT_MAPPER}
      schema={ACTIVITY_TASK_SCHEMA}
      onSubmit={(values) => onSubmitDefinitionForm(values)}
      onCancel={() => setShowActivityDefineDrawer(false)}
    />
  );
};

export default ActivityTaskDefinition;
