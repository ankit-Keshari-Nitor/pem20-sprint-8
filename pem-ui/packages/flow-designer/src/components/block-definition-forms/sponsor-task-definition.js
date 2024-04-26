import React, { useState } from 'react';
import { Form, Select, SelectItem, TextArea, TextInput, Checkbox, Button, Modal, Tabs, TabList, Tab, TabPanels, TabPanel, Grid, Column } from '@carbon/react';
import './sponsor-task-definition.scss';
import ExitValidation from '../exit-validation/exit-validation';

export default function SponsorTaskDefinitionForm({ selectedNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="activity-form" data-testid="test-form-render">
      <Tabs>
        <TabList aria-label="List of tabs" contained>
          <Tab>Define</Tab>
          <Tab>Exit Validation</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Form aria-label="approval form">
              <Grid className="define-grid grid-margin">
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
                  <Select id={`select-1`} labelText="Role">
                    <SelectItem value="" text="" />
                    <SelectItem value="AssignRole_Auto_Sponsor" text="AssignRole_Auto_Sponsor" />
                    <SelectItem value="AssignRole_Auto_Sponsor2" text="AssignRole_Auto_Sponsor2" />
                    <SelectItem value="Both" text="Both" />
                    <SelectItem value="Both1" text="Both1" />
                    <SelectItem value="Both441344" text="BothDefect441344" />
                    <SelectItem value="BothRole1" text="BothRole1" />
                    <SelectItem value="BothRole2" text="BothRole2" />
                  </Select>
                </Column>
                <Column className="col-margin" lg={16}>
                  <Checkbox labelText="Show to partner" id="checkbox-label-1" />
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
        Do you want to delete Sponsor task-01?
      </Modal>
    </div>
  );
}
