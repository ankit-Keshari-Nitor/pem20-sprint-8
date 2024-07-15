import React, { useEffect, useState } from 'react';
import { Modal, Tabs, TabList, Tab, TabPanels, TabPanel } from '@carbon/react';
import FormRenderer from '@data-driven-forms/react-form-renderer/form-renderer';

import './block-definition-form.scss';
import useTaskStore from '../../store';
import { COMPONENT_MAPPER, FORM_TEMPLATE, INITIAL_QUERY, NODE_TYPE } from '../../constants';
import ConditionalBuilder from '../condition-builder';

export default function BlockDefinitionForm({ id, selectedNode, selectedTaskNode = null, schema, readOnly }) {
  schema.fields = schema.fields.map((item) => ({ ...item, isReadOnly: readOnly }));
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const editTask = useTaskStore((state) => state.editTaskNodePros);
  const editDialog = useTaskStore((state) => state.editDialogNodePros);
  let initialValues = {};
  initialValues.name = selectedNode.id;

  const [query, setQuery] = useState(INITIAL_QUERY);
  const [errorMessage, setErrorMessage] = useState(selectedNode?.data?.exitValidationMessage);

  useEffect(() => {
    setQuery(selectedNode?.data?.exitValidationQuery);
    setErrorMessage(selectedNode?.data?.exitValidationMessage);
  }, [selectedNode]);

  const onSubmitDefinitionForm = (values) => {
    if (selectedNode.type === NODE_TYPE.API || selectedNode.type === NODE_TYPE.DIALOG || selectedNode.type === NODE_TYPE.XSLT) {
      editDialog(selectedNode, selectedTaskNode, 'editableProps', values);
    } else {
      editTask(selectedNode, 'editableProps', values);
    }
  };

  const onCancelDefinitionForm = () => {
    setOpenCancelDialog(true);
  };

  const onSubmitExitValidationForm = (modifiedQuery, errorMessage) => {
    if (selectedNode.type === NODE_TYPE.API || selectedNode.type === NODE_TYPE.DIALOG || selectedNode.type === NODE_TYPE.XSLT) {
      editDialog(selectedNode, selectedTaskNode, 'exitValidationQuery', query);
      editDialog(selectedNode, selectedTaskNode, 'validateExitValidationQuery', modifiedQuery);
      editDialog(selectedNode, selectedTaskNode, 'exitValidationMessage', errorMessage);
    } else {
      editTask(selectedNode, 'exitValidationQuery', query);
      editTask(selectedNode, 'validateExitValidationQuery', modifiedQuery);
      editTask(selectedNode, 'exitValidationMessage', errorMessage);
    }
  };

  return (
    <div>
      <Tabs>
        <TabList aria-label="List of tabs" contained>
          <Tab>Define</Tab>
          <Tab>Exit Validation</Tab>
        </TabList>
        <TabPanels>
          {/* Define Form */}
          <TabPanel>
            {Object.keys(selectedNode?.data?.editableProps).length > 0 ? (
              <FormRenderer
                id={id}
                initialValues={selectedNode?.data?.editableProps}
                FormTemplate={FORM_TEMPLATE}
                componentMapper={COMPONENT_MAPPER}
                schema={schema}
                onSubmit={onSubmitDefinitionForm}
                onCancel={setOpenCancelDialog}
              />
            ) : (
              <FormRenderer
                id={id}
                initialValues={initialValues}
                FormTemplate={FORM_TEMPLATE}
                componentMapper={COMPONENT_MAPPER}
                schema={schema}
                onSubmit={onSubmitDefinitionForm}
                onCancel={setOpenCancelDialog}
              />
            )}
          </TabPanel>
          {/* Exit Validation Form */}
          <TabPanel>
            <ConditionalBuilder
              setOpenCancelDialog={onCancelDefinitionForm}
              onSubmitExitValidationForm={onSubmitExitValidationForm}
              readOnly={readOnly}
              query={query}
              setQuery={setQuery}
              errorMessage={errorMessage}
              setErrorMessage={setErrorMessage}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
      <Modal
        open={openCancelDialog}
        onRequestClose={() => setOpenCancelDialog(false)}
        isFullWidth
        modalHeading="Confirmation"
        primaryButtonText="Exit"
        secondaryButtonText="Cancel"
      >
        <p
          style={{
            padding: '0px 0px 1rem 1rem'
          }}
        >
          Your changes are not saved. Do you want to exit without saving changes?{' '}
        </p>
      </Modal>
    </div>
  );
}
