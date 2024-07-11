import React, { useEffect, useState } from 'react';
import { Grid, Column, TextInput, Checkbox, Select, SelectItem, Button } from '@carbon/react';
import './../../style.scss';
import * as RolloutService from '../../../services/rollout-service';

export default function RolloutAttributeTab({ handleAddAttributes }) {
  const [attributeTypeList, setAttributeTypeList] = useState([]);
  const [selectedAttributeType, setSelectedAttributeType] = useState('');

  const [attributeList, setAttributeList] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = React.useState([]);
  const [selectedAttributesData, setSelectedAttributesData] = React.useState([]);

  useEffect(() => {
    getAttributeTypes();
  }, []);

  useEffect(() => {
    getAttributeData(selectedAttributeType);
  }, [selectedAttributeType]);

  // Function to get the attributes types list
  const getAttributeTypes = async () => {
    const response = await RolloutService.getAttributeTypeList();
    setAttributeTypeList(response);
    if (response && response.length > 0) {
      setSelectedAttributeType(response[0].attributeTypeKey);
    }
  };

  // Function to get the attributes list
  const getAttributeData = async (type) => {
    const response = await RolloutService.getAttributeList(type);
    setAttributeTypeList(response);
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
        <TextInput id={`attribute-search`} type="text" placeholder="Select by Attribute value" style={{ marginTop: '0.5rem' }} onChange={handleSearchInput} />
      </Column>
      <Column className="col-margin" lg={8}>
        <Select id={`attribute-select`} labelText="" onChange={handleOnChangeType}>
          {attributeTypeList?.map((attributeType) => {
            return <SelectItem value={attributeType?.attributeTypeKey} text={attributeType?.name} />;
          })}
        </Select>
      </Column>
      {attributeList && attributeList.length === 0 ? (
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
          {attributeList && selectedAttributes.length > 0 && (
            <Column className="col-margin" lg={8}>
              <Button size="sm" onClick={() => handleAddAttributes(selectedAttributesData)}>
                Add
              </Button>
            </Column>
          )}
          {attributeList &&
            attributeList.map((item) => {
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
