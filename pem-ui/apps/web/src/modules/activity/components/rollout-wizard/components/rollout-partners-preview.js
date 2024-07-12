import React from 'react';
import { Grid, Column, TextInput, Checkbox } from '@carbon/react';

import './../../style.scss';

export default function RolloutPartnersPreview({ rolloutPartnersData }) {
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
          Partners
        </p>
      </Column>
      {rolloutPartnersData?.selectedPartnersData.map((item) => {
        return (
          <Column className="col-margin" lg={16}>
            <Checkbox id={`preview-${item.partnerUniqueId}`} labelText={item.firstName + '' + item.lastName} />
          </Column>
        );
      })}
      <Column className="col-margin" lg={16}>
        <p id={`group-list-label`} className="rollout-list-text">
          Attributes
        </p>
      </Column>
      {rolloutPartnersData?.selectedAttributesData.map((item) => {
        return (
          <Column className="col-margin" lg={16}>
            <Checkbox id={`preview-${item.attributeTypeKey}`}  labelText={item.attrValue}  />
          </Column>
        );
      })}
      <Column className="col-margin" lg={16}>
        <p id={`group-list-label`} className="rollout-list-text">
          Group
        </p>
      </Column>
      {rolloutPartnersData?.selectedGroupsData.map((item) => {
        return (
          <Column className="col-margin" lg={16}>
            <Checkbox id={`preview-${item.key}`} labelText={item.value} />
          </Column>
        );
      })}
    </Grid>
  );
}
