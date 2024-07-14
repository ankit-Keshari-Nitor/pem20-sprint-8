import React, { useEffect, useState } from 'react';
import { Grid, Column, Checkbox, Select, SelectItem, Button, Search } from '@carbon/react';
import * as RolloutService from '../../../services/rollout-service';

import './../../style.scss';

export default function RolloutTradingTab({ handleAddPartners }) {
  const [selectedPartnerType, setSelectedPartnerType] = useState('');
  const [partnerList, setPartnerList] = useState([]);
  const [searchKey, setSearchKey] = useState('');

  const [isChecked, setIsChecked] = useState(false);
  const [selectedPartners, setSelectedPartners] = React.useState([]);
  const [selectedPartnersData, setSelectedPartnersData] = React.useState([]);

  useEffect(() => {
    getTradingPartnerList(selectedPartnerType, searchKey);
  }, [selectedPartnerType, searchKey]);

  useEffect(() => {
    if (searchKey !== '') {
      getTradingPartnerList(selectedPartnerType, searchKey);
    }
  }, [searchKey, selectedPartnerType]);

  const getTradingPartnerList = async (type, searchKey) => {
    const response = await RolloutService.getPartnerList(type, searchKey);
    setPartnerList(response);
  };

  const handleOnChangeType = (e) => {
    setSelectedPartnerType(e.target.value);
    getTradingPartnerList(e.target.value, searchKey);
  };

  const handleCheck = (item) => {
    if (!selectedPartners.includes(item.partnerUniqueId)) {
      setSelectedPartners([...selectedPartners, item.partnerUniqueId]);
      setSelectedPartnersData([...selectedPartnersData, item]);
    } else {
      setSelectedPartners(selectedPartners.filter((e) => e !== item.partnerUniqueId));
      setSelectedPartnersData(selectedPartnersData.filter((e) => e.partnerUniqueId !== item.partnerUniqueId));
    }
  };

  const handleSelectAll = () => {
    if (isChecked) {
      setSelectedPartners([]);
      setSelectedPartnersData([]);
      setIsChecked(false);
    } else {
      const keys = partnerList.map((e) => e.partnerUniqueId);
      setSelectedPartners([...keys]);
      setSelectedPartnersData([...partnerList]);
      setIsChecked(true);
    }
  };

  return (
    <Grid className="define-grid">
      <Column className="col-margin" lg={8}>
        <Search
          size="lg"
          placeholder="Search by partner"
          labelText=""
          closeButtonLabelText="Clear search input"
          id={`trading-partners-search`}
          onChange={(event) => setSearchKey(event.target.value)}
          onKeyDown={(event) => setSearchKey(event.target.value)}
          value={searchKey}
        />
      </Column>
      <Column className="col-margin" lg={8}>
        <Select id={`trading-partners-select`} labelText="" onChange={handleOnChangeType}>
          <SelectItem value="" text="None" />
          <SelectItem value="company-id" text="Company/Unique ID" />
          <SelectItem value="user-id" text="User ID (Email)" />
        </Select>
      </Column>
      {partnerList && partnerList.length === 0 ? (
        <Column className="col-margin" lg={16}>
          <p id={`attribute-list-label`} className="no-data-display-text">
            No Data to Display
          </p>
        </Column>
      ) : (
        <>
          <Column className="select-all-checkbox" lg={8}>
            <Checkbox id="select_all-partners" labelText="Select All" checked={isChecked} onChange={handleSelectAll} />
          </Column>
          {selectedPartners.length > 0 && (
            <Column className="col-margin" lg={8}>
              <Button size="sm" onClick={() => handleAddPartners(selectedPartnersData)}>
                Add
              </Button>
            </Column>
          )}
          {partnerList &&
            partnerList.map((item) => {
              return (
                <Column className="col-margin" lg={16}>
                  <Checkbox
                    id={item.partnerUniqueId}
                    labelText={item.firstName + '' + item.lastName}
                    checked={selectedPartners.includes(item.partnerUniqueId)}
                    onChange={() => handleCheck(item)}
                    className='partners-data-item'
                  />
                </Column>
              );
            })}
        </>
      )}
    </Grid>
  );
}
