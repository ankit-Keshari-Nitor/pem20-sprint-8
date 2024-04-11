import React from 'react';
import { FORM_FIELD_TYPE } from '../constant';
import { GroupIcon } from './../icons';

const type = FORM_FIELD_TYPE.GROUP;

const Group = ({ renderRow, row, currentPath }) => {
  return (
    <div className="group" data-testid={'group-id'} id={'group-id '}>
      {renderRow(row, currentPath, renderRow)}
    </div>
  );
};

export default Group;

// Config of Group for Left Palette & Right Palette
Group.config = {
  type,
  label: 'Group',
  group: 'panel',
  icon: <GroupIcon />,
  editableProps: {
    Basic: [],
    Condition: []
  },
  advanceProps: []
};
