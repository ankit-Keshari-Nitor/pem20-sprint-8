import React, { useState } from 'react';
import { Column, Select, SelectItem } from '@carbon/react';

export default function ActivityVersions({ activityDefKey, versions = [], readOnly, selectedVersion, onVersionSelection }) {
  const [currentValue, setCurrentValue] = useState(selectedVersion);

  return (
    <Column lg={3} md={3} sm={2} id="versions">
      <Select
        id={'activity-version'}
        value={currentValue}
        onSelect={(event) => {
          setCurrentValue(event.target.value);
          if (onVersionSelection) {
            onVersionSelection(event.target.value);
          }
        }}
      >
        {versions.map((item) => {
          return <SelectItem value={item} text={`Ver ${item}`}></SelectItem>;
        })}
      </Select>
    </Column>
  );
}
