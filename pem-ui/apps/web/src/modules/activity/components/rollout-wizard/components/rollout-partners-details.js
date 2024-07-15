import React, { useState } from 'react';
import { Grid, Column } from '@carbon/react';
import { RightArrow } from '../../../icons';

import RolloutPartnersWizard from './rollout-partners-wizard';
import RolloutPartnersPreview from './rollout-partners-preview';

import './../../style.scss';

export default function RolloutPartnersDetails({ handleAddGroups, handleAddAttributes, handleAddPartners, rolloutPartnersData }) {
  const [showPreview, setShowPreview] = useState(true);
  const [selectedViewData, setSelectedViewData] = useState(null);
  const [selectedViewType, setSelectedViewType] = useState(null);

  const handleDetailsViewClick = (viewData, viewType) => {
    console.log('viewData, viewType', viewData, viewType);
    setSelectedViewData(viewData);
    setSelectedViewData(viewType);
  };

  return (
    <Grid className="partners-details-view-container">
      <Column lg={7} className="partners-details-view">
        <RolloutPartnersWizard
          handleAddGroups={handleAddGroups}
          handleAddAttributes={handleAddAttributes}
          handleAddPartners={handleAddPartners}
          handleDetailsViewClick={handleDetailsViewClick}
        />
      </Column>
      <Column lg={2} className="right-arrow-container">
        <RightArrow />
      </Column>
      <Column lg={7} className="partners-details-view">
        <RolloutPartnersPreview rolloutPartnersData={rolloutPartnersData} showPreview={showPreview} selectedViewData={selectedViewData} selectedViewType={selectedViewType} />
      </Column>
    </Grid>
  );
}
