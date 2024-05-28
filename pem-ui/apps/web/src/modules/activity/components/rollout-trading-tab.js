import React from 'react';
import { Grid, Column, TextInput, Checkbox, Select, SelectItem } from '@carbon/react';
import './style.scss';
import { PARTNER_LIST_DATA } from '../constants';

export default function RolloutTradingTab() {
  return (
    <Grid className="define-grid">
      <Column className="col-margin" lg={8}>
        <Select id={`trading-partners-select`} labelText="Select an trading partners">
          <SelectItem value="" text="" />
          <SelectItem value="option-1" text="Option 1" />
          <SelectItem value="option-2" text="Option 2" />
        </Select>
      </Column>
      <Column className="col-margin" lg={8}>
        <TextInput id={`trading-partners-search`} type="text" placeholder="Search by trading partners" style={{ marginTop: '1.5rem' }} />
      </Column>
      <Column className="col-margin" lg={16}>
        <p id={`partner-list-label`} className="rollout-list-text">Partner List</p>
      </Column>
      {PARTNER_LIST_DATA.map((item) => {
        return (
          <Column className="col-margin" lg={16}>
            <Checkbox id={item.key} labelText={item.value} s />
          </Column>
        );
      })}
    </Grid>
  );
}
