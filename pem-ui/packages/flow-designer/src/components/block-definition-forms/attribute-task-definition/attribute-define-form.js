import { Form, Grid, Column, TextInput, TextArea, Select, SelectItem, Button } from '@carbon/react';
import React from 'react';

export default function AttributeDefineForm({ id, setOpen }) {
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
            <Select id={`select-1`} labelText="Attribut Type*">
              <SelectItem value="" text="" />
              <SelectItem value="Attribute2 with values" text="Attribute2 with values" />
              <SelectItem value="USA_states_ACD" text="USA_states_ACD" />
              <SelectItem value="AttributeTask_Scenarious" text="AttributeTask_Scenarious" />
              <SelectItem value="All_Map_Del" text="All_Map_Del" />
              <SelectItem value="Regions_ACD" text="Regions_ACD" />
              <SelectItem value="Attribute_Admin_Edit" text="Attribute_Admin_Edit" />
              <SelectItem value="Sposnortask" text="Sposnortask" />
            </Select>
          </Column>
          <Column className="col-margin" lg={16}>
            <Select id={`select-1`} labelText="Attribut Value*">
              <SelectItem value="" text="" />
              <SelectItem value="East" text="East" />
              <SelectItem value="North" text="North" />
              <SelectItem value="South" text="South" />
              <SelectItem value="ValueDelete" text="ValueDelete" />
              <SelectItem value="West" text="West" />
              <SelectItem value="PartnerCount-1" text="PartnerCount-1" />
              <SelectItem value="PartnerCount-2" text="PartnerCount-2" />
            </Select>
          </Column>
        </Grid>
        <Grid className="buttons-wrapper-grid">
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
