import React, { useState } from 'react';
import { Form, Select, SelectItem, TextArea, Checkbox, Button, Tabs, TabList, Tab, TabPanels, TabPanel, Column, Grid, Modal } from '@carbon/react';
import '../style.scss';
import ExitValidationFrom from '../../exit-validation-form';
import XsltDefineForm from './xslt-define-form';

export default function XsltTaskDefinitionForm({ selectedNode }) {
  const [openCancelDialog, setOpenCancelDialog] = useState(false);

  const onSubmitDefinitionForm = (data) => {
    console.log('onSubmitDefinitionForm', data);
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
            <Form aria-label="Api form">
              <Grid>
                <Column className="col-margin" lg={16}>
                  <TextArea labelText="Input*" rows={4} id="text-area-1" />
                </Column>
                <Column className="col-margin" lg={16}>
                  <Checkbox labelText="Escape Request" id="checkbox-label-1" />
                </Column>
                <Column className="col-margin" lg={16}>
                  <TextArea labelText="XSLT*" rows={4} id="text-area-1" />
                </Column>
                <Column className="col-margin" lg={16}>
                  <Select id={`select-1`} labelText="Output Format*">
                    <SelectItem value="" text="" />
                    <SelectItem value="option-1" text="Option 1" />
                    <SelectItem value="option-2" text="Option 2" />
                  </Select>
                </Column>
                <Column className="col-margin" lg={16}>
                  <TextArea labelText="Sample Output" rows={4} id="text-area-1" />
                </Column>
                <Column lg={8}>
                  <Button type="button" kind="secondary" className="cancel-button">
                    Cancel
                  </Button>
                </Column>
                <Column lg={8}>
                  <Button type="submit" kind="secondary" className="save-button">
                    Save
                  </Button>
                </Column>
              </Grid>
            </Form>
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
