import React from 'react';
import RolloutGap from './elements/rollout-gap';
import { Grid, Column } from '@carbon/react';
import Preview from './elements/rollout-gap-preview';
import { RightArrow } from '../../icons';

export default function RolloutGapDetails({ handleAddGroups, handleAddAttributes, handleAddPartners, rolloutGapData }) {
  return (
    <Grid className="define-grid">
      <Column lg={8}>
        <RolloutGap handleAddGroups={handleAddGroups} handleAddAttributes={handleAddAttributes} handleAddPartners={handleAddPartners} />
      </Column>
      <Column lg={1} className="right-arrow-container">
        <RightArrow />
      </Column>
      <Column lg={7}>
        <Preview rolloutGapData={rolloutGapData} />
      </Column>
    </Grid>
  );
}
