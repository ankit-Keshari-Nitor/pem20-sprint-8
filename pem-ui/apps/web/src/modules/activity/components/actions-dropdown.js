import React from 'react';
import { Dropdown } from '@carbon/react';

export default function ActivityDropdown({ id = "", items = [], onChange, selectedItem }) { // Destructure props properly
  return (
    <Dropdown
      id={`action-dropdown-${id}`}
      items={Array.isArray(items) ? items : []} // Ensure items is an array
      label="Choose an action"
      itemToString={(item) => (item ? item.label : '')}
      onChange={onChange}
      selectedItem={selectedItem}
    />
  );
}