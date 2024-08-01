import React, { useState } from 'react';
import { Column, Select, SelectItem } from '@carbon/react';

export default function ActivityVersions({ activityDefKey, versionData = [], readOnly, selectedVersion, onVersionSelection }) {
  const [currentValue, setCurrentValue] = useState(selectedVersion);

  return (
    <Column lg={3} md={3} sm={2} id="versionData">
      <Select
        hideLabel={true}
        id={'activity-version'}
        value={currentValue}
        onSelect={(event) => {
          setCurrentValue(event.target.value);
          if (onVersionSelection) {
            onVersionSelection(event.target.value);
          }
        }}
      >
        {versionData.map((item) => {
          return <SelectItem value={item.activityDefnVersionKey} text={`Ver ${item.version}`}></SelectItem>;
        })}
      </Select>
    </Column>
  );
}
