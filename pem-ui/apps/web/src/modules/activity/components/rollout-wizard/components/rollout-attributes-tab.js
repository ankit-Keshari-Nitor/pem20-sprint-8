import React, { useEffect, useState } from 'react';
import { Grid, Column, Checkbox, Select, SelectItem, Button, Search } from '@carbon/react';
import * as RolloutService from '../../../services/rollout-service';
import './../../style.scss';

export default function RolloutAttributeTab({ handleAddAttributes }) {
  const [attributeTypeList, setAttributeTypeList] = useState([]);
  const [selectedAttributeType, setSelectedAttributeType] = useState('');
  const [attributeList, setAttributeList] = useState([]);
  const [searchKey, setSearchKey] = useState('');

  const [isChecked, setIsChecked] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = React.useState([]);
  const [selectedAttributesData, setSelectedAttributesData] = React.useState([]);

  // Function to get the attributes types list
  const getAttributeTypes = async () => {
    const response = await RolloutService.getAttributeTypeList();
    setAttributeTypeList(response);
    if (response && response.length > 0) {
      setSelectedAttributeType(response[0].attributeTypeKey);
      getAttributeListData(response[0].attributeTypeKey);
    }
  };

  // Function to get the attributes list
  const getAttributeListData = async (type, searchKey) => {
    if (type !== '') {
      const response = await RolloutService.getAttributeList(type, searchKey);
      setAttributeList([...response]);
    }
  };

  useEffect(() => {
    if (searchKey !== '') {
      getAttributeListData(selectedAttributeType, searchKey);
    }
  }, [searchKey, selectedAttributeType, getAttributeListData]);

  useEffect(() => {
    getAttributeTypes();
  }, []);
  
  // Function to handle the selected attribute type input field
  const handleOnChangeType = (e) => {
    setSelectedAttributeType(e.target.value);
    getAttributeListData(e.target.value, searchKey);
  };

  const handleCheck = (item) => {
    if (!selectedAttributes.includes(item.attributeValueKey)) {
      setSelectedAttributes([...selectedAttributes, item.attributeValueKey]);
      setSelectedAttributesData([...selectedAttributesData, item]);
    } else {
      setSelectedAttributes(selectedAttributes.filter((e) => e !== item.attributeValueKey));
      setSelectedAttributesData(selectedAttributesData.filter((e) => e.attributeValueKey !== item.attributeValueKey));
    }
  };

  const handleSelectAll = () => {
    console.log("Ankit");
    if (isChecked) {
      setSelectedAttributes([]);
      setSelectedAttributesData([]);
      setIsChecked(false);
    } else {
      const keys = attributeList.map((e) => e.attributeValueKey);
      setSelectedAttributes([...keys]);
      setSelectedAttributesData([...attributeList]);
      setIsChecked(true);
    }
  };

  return (
    <Grid className="define-grid">
      <Column className="col-margin" lg={8}>
        <Search
          size="lg"
          placeholder="Select by Attribute value"
          labelText=""
          closeButtonLabelText="Clear search input"
          id={`attribute-search`}
          onChange={(event) => setSearchKey(event.target.value)}
          onKeyDown={(event) => setSearchKey(event.target.value)}
          value={searchKey}
        />
      </Column>
      <Column className="col-margin" lg={8}>
        <Select id={`attribute-select`} labelText="" onChange={handleOnChangeType}>
          <SelectItem value={''} text={'Select Attribute Type'} />
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
            <Checkbox id="select_all-attribute" labelText="Select All" checked={isChecked} onChange={handleSelectAll} />
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
                  <Checkbox
                    id={item.attributeValueKey}
                    labelText={item?.attrValue}
                    checked={selectedAttributes.includes(item.attributeValueKey)}
                    onChange={() => handleCheck(item)}
                  />
                </Column>
              );
            })}
        </>
      )}
    </Grid>
  );
}
