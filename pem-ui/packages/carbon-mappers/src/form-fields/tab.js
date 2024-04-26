import React from 'react';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@carbon/react';
import { FORM_FIELD_GROUPS, FORM_FIELD_LABEL, FORM_FIELD_TYPE, labelText } from '../constant';
import { NewTab } from '@carbon/icons-react';
import TabCanvas from '../../../page-designer/src/components/canvas/tab-canvas';

const type = FORM_FIELD_TYPE.TAB;

const CustomTab = ({ renderRow, row, currentPath, handleDrop, componentMapper, onFieldSelect, onFieldDelete, previewMode, onChangeHandle }) => {
  return (
    <Tabs data-testid={'test-tab'}>
      <TabList aria-label="List of tabs">
        {row.children.map((tabItem, idx) => {
          const { tabTitle } = tabItem;
          return (
            <Tab
              onClick={(e) => {
                !previewMode && onFieldSelect(e, tabItem, `${currentPath}-${idx}`);
              }}
            >
              {tabTitle}
            </Tab>
          );
        })}
      </TabList>
      <TabPanels>
        {row.children.map(({ children }, idx) => {
          return (
            <TabPanel>
              <TabCanvas
                layout={children}
                handleDrop={handleDrop}
                renderRow={renderRow}
                componentMapper={componentMapper}
                path={`${currentPath}-${idx}`}
                onFieldSelect={onFieldSelect}
                onFieldDelete={onFieldDelete}
                previewMode={previewMode}
                onChangeHandle={onChangeHandle}
              />
            </TabPanel>
          );
        })}
      </TabPanels>
    </Tabs>
  );
};

export default CustomTab;

// Config of Group for Left Palette & Right Palette
CustomTab.config = {
  type,
  label: FORM_FIELD_LABEL.TAB,
  group: FORM_FIELD_GROUPS.PANEL,
  icon: <NewTab />,
  editableProps: {
    Basic: [],
    Condition: []
  },
  advanceProps: []
};
