import React from 'react';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@carbon/react';
import { FORM_FIELD_TYPE } from '../constant';
import { NewTab } from '@carbon/icons-react';
import TabCanvas from '../../../page-designer/src/components/canvas/tab-canvas';

const type = FORM_FIELD_TYPE.TAB;

const CustomTab = ({ renderRow, row, currentPath, handleDrop, componentMapper, selectedField, deleteFormField }) => {
  return (
    <Tabs>
      <TabList aria-label="List of tabs" activation="manual">
        <Tab>Tab-1</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <TabCanvas
            layout={row.children}
            handleDrop={handleDrop}
            renderRow={renderRow}
            componentMapper={componentMapper}
            path={currentPath}
            selectedField={selectedField}
            deleteFormField={deleteFormField}
          />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default CustomTab;

// Config of Group for Left Palette & Right Palette
CustomTab.config = {
  type,
  label: 'Tab',
  group: 'panel',
  icon: <NewTab />,
  editableProps: {
    Basic: [],
    Condition: []
  },
  advanceProps: []
};
