import React, { useEffect, useState } from 'react';
import { Grid, Column, TextInput, Checkbox, Button } from '@carbon/react';
import './../../style.scss';
import * as RolloutService from '../../../services/rollout-service';

export default function RolloutGroupTab({ handleAddGroups }) {
  const [groupList, setGroupList] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [selectedGroups, setSelectedGroups] = React.useState([]);
  const [selectedGroupsData, setSelectedGroupsData] = React.useState([]);

  useEffect(() => {
    RolloutService.getGroupList().then((data) => {
      setGroupList(data);
    });
  });

  const handleCheck = (item) => {
    if (!selectedGroups.includes(item.key)) {
      setSelectedGroups([...selectedGroups, item.key]);
      setSelectedGroupsData([...selectedGroupsData, item]);
    } else {
      setSelectedGroups(selectedGroups.filter((e) => e !== item.key));
      setSelectedGroupsData(selectedGroupsData.filter((e) => e.key !== item.key));
    }
  };

  const handleSelectAll = () => {
    if (isChecked) {
      setSelectedGroups([]);
      setSelectedGroupsData([]);
      setIsChecked(false);
    } else {
      const keys = groupList.map((e) => e.key);
      setSelectedGroups([...keys]);
      setSelectedGroupsData([...groupList]);
      setIsChecked(true);
    }
  };

  return (
    <Grid className="define-grid">
      <Column className="col-margin" lg={16}>
        <TextInput id={`group-search`} type="text" placeholder="Search by group name" />
      </Column>
      <Column className="select-all-checkbox" lg={8}>
        <Checkbox id="select_all" labelText="select_all" checked={isChecked} onChange={handleSelectAll} />
      </Column>
      {selectedGroups.length > 0 && (
        <Column className="col-margin" lg={8}>
          <Button size="sm" onClick={() => handleAddGroups(selectedGroupsData)}>
            Add
          </Button>
        </Column>
      )}

      {groupList.map((item) => {
        return (
          <Column className="col-margin" lg={16}>
            <Checkbox id={item.key} labelText={item.value} checked={selectedGroups.includes(item.key)} onChange={() => handleCheck(item)} />
          </Column>
        );
      })}
    </Grid>
  );
}
