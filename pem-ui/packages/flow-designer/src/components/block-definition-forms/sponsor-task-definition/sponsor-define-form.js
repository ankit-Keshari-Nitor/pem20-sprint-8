import { Column, Form, Grid, TextInput, TextArea, Select, SelectItem, Checkbox, Button } from '@carbon/react';
import React from 'react';

export default function SponsorDefineForm({ id, setOpen }) {
  return (
    <>
      <Form aria-label="approval form" data-testid={id}>
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
    </>
  );
}
