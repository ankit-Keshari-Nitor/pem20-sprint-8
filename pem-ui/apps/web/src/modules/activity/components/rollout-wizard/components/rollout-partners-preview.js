import React, { useState } from 'react';
import { Grid, Column, Search, Checkbox, Select, SelectItem } from '@carbon/react';

import './../../style.scss';

export default function RolloutPartnersPreview({ rolloutPartnersData, showPreview, selectedViewData, selectedViewType }) {
  const [searchKey, setSearchKey] = useState('');
  const [selectFilter, setSelectFilter] = useState('all');

  return (
    <>
      {showPreview ? (
        <Grid className="define-grid">
          <Column className="col-margin" lg={16}>
            <p id={`group-list-label`} className="rollout-list-text">
              Preview
            </p>
          </Column>
          <Column className="col-margin" lg={8}>
            <Search
              size="lg"
              placeholder="Search selection"
              labelText=""
              closeButtonLabelText="Clear search input"
              id={`preview-search-selection`}
              onChange={(event) => setSearchKey(event.target.value)}
              onKeyDown={(event) => setSearchKey(event.target.value)}
              value={searchKey}
            />
          </Column>
          <Column className="col-margin" lg={8}>
            <Select id={`preview-select-filter`} labelText="" onChange={setSelectFilter} value={selectFilter}>
              <SelectItem value="all" text="All" />
              <SelectItem value="option-1" text="Option 1" />
              <SelectItem value="option-2" text="Option 2" />
            </Select>
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
                <Checkbox id={`preview-${item.attributeTypeKey}`} labelText={item.attrValue} />
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
      ) : (
        //TODO
        <>Implement the Details View of Partners/Attribute/Group</>
      )}
    </>
  );
}
