import React from 'react';
import { Grid, Column, TextInput, Checkbox, Select, SelectItem } from '@carbon/react';
import './style.scss';
import { ATTRIBUTE_LIST_DATA } from '../constants';

export default function RolloutAttributeTab() {
  return (
    <Grid className="define-grid">
      <Column className="col-margin" lg={8}>
        <Select id={`attribute-select`} labelText="Select an attribute type">
          <SelectItem value="" text="" />
          <SelectItem value="option-1" text="Option 1" />
          <SelectItem value="option-2" text="Option 2" />
        </Select>
      </Column>
      <Column className="col-margin" lg={8}>
        <TextInput id={`attribute-search`} type="text" placeholder="Search by attribute type" style={{ marginTop: '1.5rem' }} />
      </Column>
      <Column className="col-margin" lg={16}>
        <p id={`attribute-list-label`} className="rollout-list-text">Attribute List</p>
      </Column>
      {ATTRIBUTE_LIST_DATA.map((item) => {
        return (
          <Column className="col-margin" lg={16}>
            <Checkbox id={item.key} labelText={item.value} s />
          </Column>
        );
      })}
    </Grid>
  );
}

