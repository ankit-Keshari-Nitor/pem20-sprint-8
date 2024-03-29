import React from 'react';
import { GroupObjects } from '@carbon/icons-react';
import { FORM_FIELD_TYPE } from '../constant';

const type = FORM_FIELD_TYPE.GROUP;

const Group = ({ renderRow, row, currentPath }) => {
  //const { ...rest } = field;
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
  icon: <GroupObjects />,
  editableProps: {
    Basic: [],
    Condition: []
  },
  advanceProps: []
};
