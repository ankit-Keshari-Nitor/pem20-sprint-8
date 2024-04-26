import React, { useState } from 'react';
import { Modal, Tabs, TabList, Tab, TabPanels, TabPanel } from '@carbon/react';

import './attribute-task-definition.scss';
import ExitValidationFrom from '../../exit-validation-form';
import AttributeDefineForm from './attribute-define-form';

export default function AttributeTaskDefinitionForm({ selectedNode }) {
  const [open, setOpen] = useState(false);
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
            <AttributeDefineForm id={'attribute-define-form'} setOpen={setOpen} />
          </TabPanel>
          {/* Exit Validation Form */}
          <TabPanel>
            <ExitValidationFrom />
          </TabPanel>
        </TabPanels>
      </Tabs>
      <Modal open={open} onRequestClose={() => setOpen(false)} isFullWidth modalHeading="Confirmation" primaryButtonText="Delete" secondaryButtonText="Cancel">
        Do you want to delete Attribute Task-01?
      </Modal>
    </div>
  );
}
