import React, { useEffect, useState } from 'react';
import { Grid, Column, TextInput, Checkbox, Select, SelectItem } from '@carbon/react';
import './style.scss';
import * as RolloutService from '../../../services/rollout-service';

export default function RolloutTradingTab() {
  const [selectedPartnerType, setSelectedPartnerType] = useState('');
  const [partnerList, setPartnerList] = useState([]);

  useEffect(() => {
    getTradingPartnerList(selectedPartnerType);
  }, [selectedPartnerType]);

  const getTradingPartnerList = (type) => {
    RolloutService.getPartnerList(type).then((data) => {
      setPartnerList(data);
    });
  };

  // TODO- Function to handle the select type input filled
  const handleOnChangeType = (e) => {
    setSelectedPartnerType(e.target.value);
    getTradingPartnerList(e.target.value);
  };

  // TODO- Function to handle the search input filled
  const handleSearchInput = (e) => {
    console.log('e.target.value', e.target.value);
  };

  return (
    <Grid className="define-grid">
      <Column className="col-margin" lg={8}>
        <Select id={`trading-partners-select`} labelText="Select an trading partners" onChange={handleOnChangeType}>
          <SelectItem value="" text="" />
          <SelectItem value="option-1" text="Partner 1" />
          <SelectItem value="option-2" text="Partner 2" />
          <SelectItem value="option-3" text="Partner 3" />
          <SelectItem value="option-4" text="Partner 4" />
        </Select>
      </Column>
      <Column className="col-margin" lg={8}>
        <TextInput id={`trading-partners-search`} type="text" placeholder="Search by trading partners" style={{ marginTop: '1.5rem' }} onChange={handleSearchInput} />
      </Column>
      <Column className="col-margin" lg={16}>
        <p id={`partner-list-label`} className="rollout-list-text">
          Partner List
        </p>
      </Column>
      {partnerList.length === 0 ? (
        <Column className="col-margin" lg={16}>
          <p id={`attribute-list-label`} className="no-data-display-text">
            No Data to Display
          </p>
        </Column>
      ) : (
        <>
          {partnerList.map((item) => {
            return (
              <Column className="col-margin" lg={16}>
                <Checkbox id={item.key} labelText={item.value} s />
              </Column>
            );
          })}
        </>
      )}
    </Grid>
  );
}
