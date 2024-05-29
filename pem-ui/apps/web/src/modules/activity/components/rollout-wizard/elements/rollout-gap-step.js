import React from 'react';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@carbon/react';
import './style.scss';
import RolloutGroupTab from './rollout-group-tab';
import RolloutTradingTab from './rollout-trading-tab';
import RolloutAttributeTab from './rollout-attributes-tab';

export default function RolloutGapDetails({ id }) {
  return (
    <div data-testid={id}>
      <Tabs>
        <TabList aria-label="List of tabs">
          <Tab>Group</Tab>
          <Tab>Attributes</Tab>
          <Tab>Trading Partners</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <RolloutGroupTab />
          </TabPanel>
          <TabPanel>
            <RolloutAttributeTab />
          </TabPanel>
          <TabPanel>
            <RolloutTradingTab />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}
