import React from 'react';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@carbon/react';
import './../../style.scss';
import RolloutGroupTab from './rollout-group-tab';
import RolloutTradingTab from './rollout-trading-tab';
import RolloutAttributeTab from './rollout-attributes-tab';

export default function RolloutGap({ id, handleAddGroups, handleAddAttributes, handleAddPartners }) {
  return (
    <div data-testid={id} style={{ background: 'rgb(240 240 238)' }}>
      <Tabs>
        <TabList aria-label="List of tabs">
          <Tab>Group</Tab>
          <Tab>Attributes</Tab>
          <Tab>Trading Partners</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <RolloutGroupTab handleAddGroups={handleAddGroups} />
          </TabPanel>
          <TabPanel>
            <RolloutAttributeTab handleAddAttributes={handleAddAttributes} />
          </TabPanel>
          <TabPanel>
            <RolloutTradingTab handleAddPartners={handleAddPartners} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}
