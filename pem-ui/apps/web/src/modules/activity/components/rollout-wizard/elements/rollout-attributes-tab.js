import React, { useEffect, useState } from 'react';
import { Grid, Column, TextInput, Checkbox, Select, SelectItem, Button } from '@carbon/react';
import './../../style.scss';
import * as RolloutService from '../../../services/rollout-service';

export default function RolloutAttributeTab({ handleAddAttributes }) {
  const [attributeList, setAttributeList] = useState([]);
  const [selectedAttributeType, setSelectedAttributeType] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = React.useState([]);
  const [selectedAttributesData, setSelectedAttributesData] = React.useState([]);

  useEffect(() => {
    getAttributeData(selectedAttributeType);
  }, [selectedAttributeType]);

  const getAttributeData = (type) => {
    RolloutService.getAttributeList(type).then((data) => {
      setAttributeList(data);
    });
  };

  // TODO- Function to handle the select type input filled
  const handleOnChangeType = (e) => {
    setSelectedAttributeType(e.target.value);
    getAttributeData(e.target.value);
  };

  // TODO- Function to handle the search input filled
  const handleSearchInput = (e) => {
    console.log('e.target.value', e.target.value);
  };

  const handleCheck = (item) => {
    if (!selectedAttributes.includes(item.key)) {
      setSelectedAttributes([...selectedAttributes, item.key]);
      setSelectedAttributesData([...selectedAttributesData, item]);
    } else {
      setSelectedAttributes(selectedAttributes.filter((e) => e !== item.key));
      setSelectedAttributesData(selectedAttributesData.filter((e) => e.key !== item.key));
    }
  };

  const handleSelectAll = () => {
    if (isChecked) {
      setSelectedAttributes([]);
      setSelectedAttributesData([]);
      setIsChecked(false);
    } else {
      const keys = attributeList.map((e) => e.key);
      setSelectedAttributes([...keys]);
      setSelectedAttributesData([...attributeList]);
      setIsChecked(true);
    }
  };

  return (
    <Grid className="define-grid">
      <Column className="col-margin" lg={8}>
        <TextInput id={`attribute-search`} type="text" placeholder="Select by Attribute value" style={{ marginTop: '1.5rem' }} onChange={handleSearchInput} />
      </Column>
      <Column className="col-margin" lg={8}>
        <Select id={`attribute-select`} labelText="Select Attribute type" onChange={handleOnChangeType}>
          <SelectItem value="" text="" />
          <SelectItem value="option-1" text="Attribute 1" />
          <SelectItem value="option-2" text="Attribute 2" />
          <SelectItem value="option-3" text="Attribute 3" />
          <SelectItem value="option-4" text="Attribute 4" />
        </Select>
      </Column>

      {attributeList.length === 0 ? (
        <Column className="col-margin" lg={16}>
          <p id={`attribute-list-label`} className="no-data-display-text">
            No Data to Display
          </p>
        </Column>
      ) : (
        <>
          <Column className="select-all-checkbox" lg={8}>
            <Checkbox id="select_all" labelText="select_all" checked={isChecked} onChange={handleSelectAll} />
          </Column>
          {selectedAttributes.length > 0 && (
            <Column className="col-margin" lg={8}>
              <Button size="sm" onClick={() => handleAddAttributes(selectedAttributesData)}>
                Add
              </Button>
            </Column>
          )}
          {attributeList.map((item) => {
            return (
              <Column className="col-margin" lg={16}>
                <Checkbox id={item.key} labelText={item.value} checked={selectedAttributes.includes(item.key)} onChange={() => handleCheck(item)} />
              </Column>
            );
          })}
        </>
      )}
    </Grid>
  );
}
