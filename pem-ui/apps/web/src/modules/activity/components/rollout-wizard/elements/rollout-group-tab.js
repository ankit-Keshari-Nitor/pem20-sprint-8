import React, { useEffect, useState } from 'react';
import { Grid, Column, TextInput, Checkbox } from '@carbon/react';
import './style.scss';
import * as RolloutService from '../../../services/rollout-service';

export default function RolloutGroupTab() {
  const [groupList, setGroupList] = useState([]);

  useEffect(() => {
    RolloutService.getGroupList().then((data) => {
      setGroupList(data);
    });
  });

  return (
    <Grid className="define-grid">
      <Column className="col-margin" lg={16}>
        <TextInput id={`group-search`} type="text" placeholder="Search by group name" />
      </Column>
      <Column className="col-margin" lg={16}>
        <p id={`group-list-label`} className="rollout-list-text">
          Group List
        </p>
      </Column>
      {groupList.map((item) => {
        return (
          <Column className="col-margin" lg={16}>
            <Checkbox id={item.key} labelText={item.value} s />
          </Column>
        );
      })}
    </Grid>
  );
}
