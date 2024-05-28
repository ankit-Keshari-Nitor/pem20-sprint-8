import React from 'react';
import { Grid, Column, TextInput, Checkbox } from '@carbon/react';
import './style.scss';
import { GROUP_LIST_DATA } from '../constants';

export default function RolloutGroupTab() {
  return (
    <Grid className="define-grid">
      <Column className="col-margin" lg={16}>
        <TextInput id={`group-search`} type="text" placeholder="Search by group name" />
      </Column>
      <Column className="col-margin" lg={16}>
        <p id={`group-list-label`} className="rollout-list-text">
          Group List
        </p>
      </Column>
      {GROUP_LIST_DATA.map((item) => {
        return (
          <Column className="col-margin" lg={16}>
            <Checkbox id={item.key} labelText={item.value} s />
          </Column>
        );
      })}
    </Grid>
  );
}
