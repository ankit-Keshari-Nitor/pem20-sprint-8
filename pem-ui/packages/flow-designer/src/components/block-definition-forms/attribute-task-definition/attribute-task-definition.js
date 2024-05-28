import React, { useState } from 'react';
import { Modal, Tabs, TabList, Tab, TabPanels, TabPanel } from '@carbon/react';

import '../style.scss';
import ExitValidationFrom from '../../exit-validation-form';
import AttributeDefineForm from './attribute-define-form';
import useTaskStore from '../../../store';

export default function AttributeTaskDefinitionForm({ selectedNode }) {
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const edit = useTaskStore((state) => state.editTaskNodePros);
  const onSubmitDefinitionForm = (values) => {
    edit(selectedNode, 'editableProps', values);
  };

  return (
    <div className="activity-form">
      <Tabs>
        <TabList aria-label="List of tabs" contained>
          <Tab>Define</Tab>
          <Tab>Exit Validation</Tab>
        </TabList>
        <TabPanels>
          {/* Define Form */}
          <TabPanel>
            <AttributeDefineForm
              id={'attribute-define-form'}
              selectedNode={selectedNode}
              setOpenCancelDialog={setOpenCancelDialog}
              onSubmitDefinitionForm={onSubmitDefinitionForm}
            />
          </TabPanel>
          {/* Exit Validation Form */}
          <TabPanel>
            <ExitValidationFrom />
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
