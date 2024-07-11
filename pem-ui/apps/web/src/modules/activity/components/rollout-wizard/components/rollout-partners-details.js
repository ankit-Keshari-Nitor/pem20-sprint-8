import React from 'react';
import { Grid, Column } from '@carbon/react';
import { RightArrow } from '../../../icons';

import RolloutPartnersWizard from './rollout-partners-wizard';
import RolloutPartnersPreview from './rollout-partners-preview';

import './../../style.scss';

export default function RolloutPartnersDetails({ handleAddGroups, handleAddAttributes, handleAddPartners, rolloutPartnersData }) {
  return (
    <Grid className="partners-details-view-container">
      <Column lg={7} className="partners-details-view">
        <RolloutPartnersWizard handleAddGroups={handleAddGroups} handleAddAttributes={handleAddAttributes} handleAddPartners={handleAddPartners} />
      </Column>
      <Column lg={2} className="right-arrow-container">
        <RightArrow />
      </Column>
      <Column lg={7} className="partners-details-view">
        <RolloutPartnersPreview rolloutPartnersData={rolloutPartnersData} />
      </Column>
    </Grid>
  );
}
