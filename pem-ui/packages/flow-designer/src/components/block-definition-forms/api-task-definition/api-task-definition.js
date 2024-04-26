import React from 'react';
import { Form, Link, Select, SelectItem, TextArea, FileUploader, TextInput, Checkbox, Button, Tabs, TabList, Tab, TabPanels, TabPanel, Column, Grid } from '@carbon/react';
import './api-task-definition.scss';
import ExitValidationFrom from '../../exit-validation-form';
import { ElippsisIcon } from '../../../icons';
import ApiDefineForm from './api-define-form';

export default function ApiTaskDefinitionForm({ selectedNode }) {
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
            <ApiDefineForm id={'api-define-from'} />
          </TabPanel>
          {/* Properties Form */}
          <TabPanel>
            <Form aria-label="Api form">
              <Grid>
                <Column className="col-margin" lg={8}>
                  <Select id={`select-1`} labelText="API Configuration*">
                    <SelectItem value="" text="" />
                    <SelectItem value="option-1" text="Option 1" />
                    <SelectItem value="option-2" text="Option 2" />
                  </Select>
                  <Button size="md" kind="secondary" hasIconOnly renderIcon={ElippsisIcon}>
                    .
                  </Button>
                </Column>
                <Column className="col-margin" lg={8}>
                  <Checkbox labelText="Host Prefix" id="checkbox-label-1" />
                </Column>
                <Column className="col-margin" lg={16}>
                  <TextInput id="one" labelText="URL" placeholder="Enter URL" />
                  <Button size="md" kind="secondary" hasIconOnly renderIcon={ElippsisIcon}>
                    .
                  </Button>
                </Column>
                <Column className="col-margin" lg={8}>
                  <Select id={`select-1`} labelText="Request Method">
                    <SelectItem value="" text="" />
                    <SelectItem value="option-1" text="Option 1" />
                    <SelectItem value="option-2" text="Option 2" />
                  </Select>
                </Column>
                <Column className="col-margin" lg={8}>
                  <Link href="#">Click to edit headers</Link>
                </Column>
                <Column className="col-margin" lg={8}>
                  <Select id={`select-1`} labelText="Input Output Format">
                    <SelectItem value="" text="" />
                    <SelectItem value="option-1" text="Option 1" />
                    <SelectItem value="option-2" text="Option 2" />
                  </Select>
                </Column>
                <Column className="col-margin" lg={8}>
                  <Checkbox labelText="Escape Request" id="checkbox-label-1" />
                </Column>
                <Column className="col-margin" lg={16}>
                  <div className="show-code-container">
                    <div className="show-code-title-container">
                      <span className="show-code-title">Show Code</span>
                    </div>
                  </div>
                </Column>
                <Column className="col-margin" lg={3}>
                  <FileUploader
                    labelDescription="File Attachment"
                    buttonLabel="..."
                    buttonKind="secondary"
                    size="md"
                    filenameStatus="edit"
                    accept={['.jpg', '.png']}
                    multiple={true}
                    disabled={false}
                    name=""
                  />
                </Column>
                <Column className="col-margin" lg={11}>
                  <Button size="md" kind="secondary">
                    Select from available files or upload new files
                  </Button>
                </Column>
                <Column className="col-margin" lg={16}>
                  <TextArea labelText="Sample Response" rows={4} id="text-area-1" />
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
    </div>
  );
}
