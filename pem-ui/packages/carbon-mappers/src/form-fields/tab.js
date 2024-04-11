import React from 'react';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@carbon/react';
import { FORM_FIELD_TYPE, editableProps } from '../constant';
import { NewTab } from '@carbon/icons-react';
import TabCanvas from '../../../page-designer/src/components/canvas/tab-canvas';

const type = FORM_FIELD_TYPE.TAB;

const CustomTab = ({ renderRow, row, currentPath, handleDrop, componentMapper, selectedField, deleteFormField }) => {
  return (
    <Tabs>
      <TabList aria-label="List of tabs">
        {row.children.map((tabItem, idx) => {
          const { tabTitle } = tabItem;
          return (
            <Tab
              onClick={(e) => {
                selectedField(e, tabItem, `${currentPath}-${idx}`);
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
                selectedField={selectedField}
                deleteFormField={deleteFormField}
              />
            </TabPanel>
          );
        })}
      </TabPanels>
    </Tabs>
  );

  // <Tabs>
  //   <TabList aria-label="List of tabs" activation="manual">
  //     <Tab>{row.component.labelText ? row.component.labelText : 'Title'}</Tab>
  //   </TabList>
  //   <TabPanels>
  //     <TabPanel>
  //       <TabCanvas
  //         layout={row.children}
  //         handleDrop={handleDrop}
  //         renderRow={renderRow}
  //         componentMapper={componentMapper}
  //         path={currentPath}
  //         selectedField={selectedField}
  //         deleteFormField={deleteFormField}
  //       />
  //     </TabPanel>
  //   </TabPanels>
  // </Tabs>
};

export default CustomTab;

// Config of Group for Left Palette & Right Palette
CustomTab.config = {
  type,
  label: 'Tab',
  group: 'panel',
  icon: <NewTab />,
  editableProps: {
    Basic: [...editableProps.Basic],
    Condition: []
  },
  advanceProps: []
};
