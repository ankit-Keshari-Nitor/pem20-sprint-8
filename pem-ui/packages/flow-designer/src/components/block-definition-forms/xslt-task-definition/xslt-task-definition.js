import React, { useState } from 'react';
import { Form, Select, SelectItem, TextArea, Checkbox, Button, Tabs, TabList, Tab, TabPanels, TabPanel, Column, Grid, Modal } from '@carbon/react';
import '../style.scss';
import ExitValidationFrom from '../../exit-validation-form';
import XsltDefineForm from './xslt-define-form';
import XsltPropertyForm from './xslt-properties-form';

export default function XsltTaskDefinitionForm({ selectedNode }) {
  const [openCancelDialog, setOpenCancelDialog] = useState(false);

  const onSubmitDefinitionForm = (data) => {
    console.log('onSubmitDefinitionForm', data);
  };

  const onSubmitPropertyForm = (data) => {
    console.log('onSubmitPropertyForm', data);
  };

  return (
    <div className="activity-form">
      <Tabs>
        <TabList aria-label="List of tabs" contained>
          <Tab>Define</Tab>
          <Tab>Properties</Tab>
          <Tab>Exit Validation</Tab>
        </TabList>
        <TabPanels>
          {/* Define Form */}
          <TabPanel>
            <XsltDefineForm id={'xslt-define-Form'} setOpenCancelDialog={setOpenCancelDialog} onSubmitDefinitionForm={onSubmitDefinitionForm} />
          </TabPanel>
          {/* Properties Form */}
          <TabPanel>
            <XsltPropertyForm id={'xslt-property-Form'} setOpenCancelDialog={setOpenCancelDialog} onSubmitPropertyForm={onSubmitPropertyForm} />
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
