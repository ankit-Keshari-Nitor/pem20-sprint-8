import { Form, Grid, Column, TextInput, TextArea, Select, SelectItem, Checkbox, Button } from '@carbon/react';
import React from 'react';

export default function ApprovalDefineForm({ id, setOpen }) {
  return (
    <>
      <Form aria-label="approval form" data-testid={id}>
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
    </>
  );
}
