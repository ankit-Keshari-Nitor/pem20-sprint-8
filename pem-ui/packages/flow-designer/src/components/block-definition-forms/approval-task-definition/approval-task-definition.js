import React, { useState } from 'react';
import { Modal, Tabs, TabList, Tab, TabPanels, TabPanel } from '@carbon/react';
import './approval-task-definition.scss';
import ExitValidationFrom from '../../exit-validation-form';
import ApprovalDefineForm from './approval-define-form';

export default function ApprovalTaskDefinitionForm({ selectedNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="form">
      <Tabs>
        <TabList aria-label="List of tabs" contained>
          <Tab>Define</Tab>
          <Tab>Exit Validation</Tab>
        </TabList>
        <TabPanels>
          {/* Define Form */}
          <TabPanel>
            <ApprovalDefineForm id={'approval-define-form'} setOpen={setOpen} />
          </TabPanel>
          {/* Exit Validation Form */}
          <TabPanel>
            <ExitValidationFrom />
          </TabPanel>
        </TabPanels>
      </Tabs>
      <Modal open={open} onRequestClose={() => setOpen(false)} isFullWidth modalHeading="Confirmation" primaryButtonText="Delete" secondaryButtonText="Cancel">
        Do you want to delete Approval Task Sponsor task-01?
      </Modal>
    </div>
  );
}
