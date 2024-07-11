import React from 'react';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@carbon/react';
import { PartnersTabIcon, AttributesTabIcon, GroupsTabIcon } from '../../../icons';

import RolloutGroupTab from './rollout-group-tab';
import RolloutTradingTab from './rollout-partners-tab';
import RolloutAttributeTab from './rollout-attributes-tab';

import './../../style.scss';

export default function RolloutPartnersWizard({ id, handleAddGroups, handleAddAttributes, handleAddPartners }) {
  return (
    <div data-testid={id}>
      <Tabs>
        <TabList aria-label="List of tabs">
          <Tab>
            <PartnersTabIcon />
            <span className="partners-tab-title">Partners</span>
          </Tab>
          <Tab>
            <AttributesTabIcon />
            <span className="partners-tab-title">Attributes</span>
          </Tab>
          <Tab>
            <GroupsTabIcon />
            <span className="partners-tab-title">Group</span>
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <RolloutTradingTab handleAddPartners={handleAddPartners} />
          </TabPanel>
          <TabPanel>
            <RolloutAttributeTab handleAddAttributes={handleAddAttributes} />
          </TabPanel>
          <TabPanel>
            <RolloutGroupTab handleAddGroups={handleAddGroups} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}
