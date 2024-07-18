import React, { useEffect, useState } from 'react';
import { Grid, Column, Checkbox, Select, SelectItem, Button, Search } from '@carbon/react';
import * as RolloutService from '../../../services/rollout-service';
import { Add } from '@carbon/icons-react';
import './../../style.scss';
import { capitalizeFirstLetter } from '../../../constants';

export default function RolloutPartnerTab({ rolloutPartnersData, handleAddPartners, handleDetailsViewClick }) {
  const [selectedPartnerType, setSelectedPartnerType] = useState('company-id');
  const [partnerList, setPartnerList] = useState([]);
  const [searchKey, setSearchKey] = useState('');

  const [isChecked, setIsChecked] = useState(false);
  const [selectedPartners, setSelectedPartners] = React.useState([]);
  const [selectedPartnersData, setSelectedPartnersData] = React.useState([]);

  useEffect(() => {
    const partnerUniqueIds = rolloutPartnersData.selectedPartnersData.map((item) => item.partnerUniqueId);
    if (partnerList.length === partnerUniqueIds.length && partnerUniqueIds.length > 0) {
      setIsChecked(true);
    } else {
      setIsChecked(false);
    }
    setSelectedPartners([...partnerUniqueIds]);
  }, [partnerList, rolloutPartnersData]);

  useEffect(() => {
    getTradingPartnerList(selectedPartnerType, searchKey);
  }, [selectedPartnerType, searchKey]);

  useEffect(() => {
    if (searchKey !== '') {
      getTradingPartnerList(selectedPartnerType, searchKey);
    }
  }, [searchKey, selectedPartnerType]);

  const getTradingPartnerList = async (type, searchKey) => {
    let param = {};
    if (type === 'user-id' && searchKey !== '') {
      param = { userId: `con:${searchKey}` };
    } else if (type === 'company-id' && searchKey !== '') {
      param = { searchText: searchKey };
    }
    const response = await RolloutService.getPartnerList(param);
    setPartnerList(response);
  };

  const handleOnChangeType = (e) => {
    setSelectedPartnerType(e.target.value);
    getTradingPartnerList(e.target.value, searchKey);
  };

  const handleCheck = (item) => {
    let updatedSelectedPartners;
    let updatedSelectedPartnersData;

    if (!selectedPartners.includes(item.partnerUniqueId)) {
      updatedSelectedPartners = [...selectedPartners, item.partnerUniqueId];
      updatedSelectedPartnersData = [...selectedPartnersData, item];
    } else {
      updatedSelectedPartners = selectedPartners.filter((e) => e !== item.partnerUniqueId);
      updatedSelectedPartnersData = selectedPartnersData.filter((e) => e.partnerUniqueId !== item.partnerUniqueId);
    }

    setSelectedPartners(updatedSelectedPartners);
    setSelectedPartnersData(updatedSelectedPartnersData);

    // Update the "Select All" checkbox state
    setIsChecked(updatedSelectedPartners.length === partnerList.length);
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
              <Button size="sm" className="new-button" renderIcon={Add} onClick={() => handleAddPartners(selectedPartnersData)}>
                Add
              </Button>
            </Column>
          )}
          {partnerList &&
            partnerList.map((item) => {
              return (
                <Column className="col-margin" lg={16}>
                  <div className="partners-data-item">
                    <Checkbox
                      id={item.partnerUniqueId}
                      labelText=""
                      checked={selectedPartners.includes(item.partnerUniqueId)}
                      onChange={() => handleCheck(item)}
                      className="checkbox-input"
                    />
                    <span
                      className="partner-checkbox-label"
                      onClick={() => {
                        handleDetailsViewClick(item, 'partner');
                      }}
                    >
                      {capitalizeFirstLetter(item.nameOfCompany)}
                    </span>
                  </div>
                </Column>
              );
            })}
        </>
      )}
    </Grid>
  );
}
