import React, { useState } from 'react';
import { Modal, Tabs, TabList, Tab, TabPanels, TabPanel } from '@carbon/react';

import '../style.scss';
import ExitValidationFrom from '../../exit-validation-form/exit-validation-form';
import PartnerDefineForm from './partner-define-form';

export default function PartnerTaskDefinitionForm({ selectedNode }) {
  const [defineFormValue, setDefineFormValue] = useState(null);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);

  const onSubmitDefinitionForm = (values, api) =>
    new Promise((resolve) =>
      setTimeout(() => {
        setDefineFormValue({ ...values });
        resolve('Yay');
      }, 1500)
    );

  const onCancelDefinitionForm = () => {
    setOpenCancelDialog(true);
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
            <PartnerDefineForm id={'partner-define-form'} onCancelDefinitionForm={onCancelDefinitionForm} onSubmitDefinitionForm={onSubmitDefinitionForm} />
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
