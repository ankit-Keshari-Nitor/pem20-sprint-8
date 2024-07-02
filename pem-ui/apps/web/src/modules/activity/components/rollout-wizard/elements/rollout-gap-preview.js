import React from 'react';
import { Grid, Column, TextInput, Checkbox } from '@carbon/react';
import './../../style.scss';

export default function Preview({ rolloutGapData }) {
  return (
    <Grid className="define-grid">
      <Column className="col-margin" lg={16}>
        <p id={`group-list-label`} className="rollout-list-text">
          Preview
        </p>
      </Column>
      <Column className="col-margin" lg={16}>
        <TextInput id={`group-search`} type="text" placeholder="Search by group name" />
      </Column>
      <Column className="col-margin" lg={16}>
        <p id={`group-list-label`} className="rollout-list-text">
          Group
        </p>
      </Column>
      {rolloutGapData?.selectedGroupsData.map((item) => {
        return (
          <Column className="col-margin" lg={16}>
            <Checkbox id={item.key} labelText={item.value} s />
          </Column>
        );
      })}
      <Column className="col-margin" lg={16}>
        <p id={`group-list-label`} className="rollout-list-text">
          Attributes
        </p>
      </Column>
      {rolloutGapData?.selectedAttributesData.map((item) => {
        return (
          <Column className="col-margin" lg={16}>
            <Checkbox id={item.key} labelText={item.value} s />
          </Column>
        );
      })}
      <Column className="col-margin" lg={16}>
        <p id={`group-list-label`} className="rollout-list-text">
          Partners
        </p>
      </Column>
      {rolloutGapData?.selectedPartnersData.map((item) => {
        return (
          <Column className="col-margin" lg={16}>
            <Checkbox id={item.key} labelText={item.value} s />
          </Column>
        );
      })}
    </Grid>
  );
}
