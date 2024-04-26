import React, { useState } from 'react';
import { Form, Select, SelectItem, TextArea, TextInput, Checkbox, Button, Modal, Tabs, TabList, Tab, TabPanels, TabPanel, Column, Grid } from '@carbon/react';
import './approval-task-definition.scss';
import ExitValidation from '../exit-validation';

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
          <TabPanel>
            <Form aria-label="approval form">
              <Grid className="define-grid">
                <Column className="col-margin" lg={16}>
                  <TextInput id="one" labelText="Name*" />
                </Column>
                <Column className="col-margin" lg={16}>
                  <TextArea id="one" labelText="Description" />
                </Column>
                <Column className="col-margin" lg={16}>
                  <TextInput id="one" labelText="Estimate (Days)*" />
                </Column>
                <Column className="col-margin" lg={16}>
                  <Select id={`select-1`} labelText="Select Task to reopen up to when rejecting">
                    <SelectItem value="" text="" />
                    <SelectItem value="option-1" text="Option 1" />
                    <SelectItem value="option-2" text="Option 2" />
                  </Select>
                </Column>
                <Column className="col-margin" lg={16}>
                  <Select id={`select-1`} labelText="Role">
                    <SelectItem value="" text="" />
                    <SelectItem value="option-1" text="Option 1" />
                    <SelectItem value="option-2" text="Option 2" />
                  </Select>
                </Column>
                <Column className="col-margin" lg={16}>
                  <Checkbox labelText="Show to partner" id="checkbox-label-1" />
                </Column>
                <Column className="col-margin" lg={16}>
                  <Checkbox labelText="Enable auto approval warning" id="checkbox-label-1" />
                </Column>
              </Grid>
              <Grid>
                <Column lg={8}>
                  <Button type="button" kind="secondary" className="cancel-button" onClick={() => setOpen(true)}>
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
          <TabPanel>
            <ExitValidation />
          </TabPanel>
        </TabPanels>
      </Tabs>
      <Modal open={open} onRequestClose={() => setOpen(false)} isFullWidth modalHeading="Confirmation" primaryButtonText="Delete" secondaryButtonText="Cancel">
        Do you want to delete Approval Task Sponsor task-01?
      </Modal>
    </div>
  );
}
