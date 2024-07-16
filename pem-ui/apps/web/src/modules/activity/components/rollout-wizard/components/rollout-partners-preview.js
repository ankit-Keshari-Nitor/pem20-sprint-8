import React, { useState } from 'react';
import { Grid, Column, Search, Select, SelectItem, Checkbox, Accordion, AccordionItem, Tabs, TabList, Tab, TabPanels, TabPanel, Button } from '@carbon/react';

import './../../style.scss';

import { CrossIcon } from '../../../icons';
import { TrashCan } from '@carbon/icons-react';

export default function RolloutPartnersPreview({ rolloutPartnersData, onClose, showPreview, selectedViewData, selectedViewType, handleRemovePartners }) {
  const [searchKey, setSearchKey] = useState('');
  const [selectFilter, setSelectFilter] = useState('all');

  const [isChecked, setIsChecked] = useState(false);
  const [selectedPartners, setSelectedPartners] = React.useState([]);
  const [selectedPartnersData, setSelectedPartnersData] = React.useState([]);
  const isRolloutDataAvl = rolloutPartnersData?.selectedPartnersData.length + rolloutPartnersData?.selectedAttributesData.length + rolloutPartnersData?.selectedGroupsData.length;

  const handleCheck = (item) => {
    let updatedSelectedPartners;
    let updatedSelectedPartnersData;

    if (!selectedPartners.includes(item.partnerUniqueId)) {
      updatedSelectedPartners = [...selectedPartners, item.partnerUniqueId];
      updatedSelectedPartnersData = [...selectedPartnersData, item];
    } else {
      updatedSelectedPartners = selectedPartners.filter((e) => e !== item.partnerUniqueId);
      updatedSelectedPartnersData = selectedPartnersData.filter((e) => e.partnerUniqueId !== item.partnerUniqueId);
    }

    setSelectedPartners(updatedSelectedPartners);
    setSelectedPartnersData(updatedSelectedPartnersData);

    // Update the "Select All" checkbox state
    setIsChecked(updatedSelectedPartners.length === rolloutPartnersData?.selectedPartnersData.length);
  };

  const handleSelectAll = () => {
    if (isChecked) {
      setSelectedPartners([]);
      setSelectedPartnersData([]);
      setIsChecked(false);
    } else {
      const keys = rolloutPartnersData?.selectedPartnersData.map((e) => e.partnerUniqueId);
      setSelectedPartners([...keys]);
      setSelectedPartnersData([...rolloutPartnersData?.selectedPartnersData]);
      setIsChecked(true);
    }
  };

  return (
    <>
      {showPreview ? (
        <Grid className="define-grid">
          <Column className="col-margin" lg={16}>
            <p id={`preview-group-list-label`} className="rollout-list-text">
              Preview
            </p>
          </Column>
          <Column className="col-margin" lg={8}>
            <Search
              size="lg"
              placeholder="Search selection"
              labelText=""
              closeButtonLabelText="Clear search input"
              id={`preview-search-selection`}
              onChange={(event) => setSearchKey(event.target.value)}
              onKeyDown={(event) => setSearchKey(event.target.value)}
              value={searchKey}
            />
          </Column>

          <Column className="col-margin" lg={8}>
            <Select id={`preview-select-filter`} labelText="" onChange={(e) => setSelectFilter(e.target.value)} value={selectFilter}>
              <SelectItem value="all" text="All" />
              <SelectItem value="partners" text="Partners" />
              <SelectItem value="attributes" text="Attributes" />
              <SelectItem value="group" text="Groups" />
            </Select>
          </Column>
          {isRolloutDataAvl > 0 && (
            <Column className="select-all-checkbox" lg={8}>
              <Checkbox id="preview-select_all-partners" labelText="Select All" checked={isChecked} onChange={handleSelectAll} />
            </Column>
          )}
          {selectedPartners.length > 0 && (
            <Column className="col-margin" lg={8}>
              <Button size="sm" className="new-button" renderIcon={TrashCan} onClick={() => handleRemovePartners(selectedPartners)}>
                Delete
              </Button>
            </Column>
          )}
          {rolloutPartnersData?.selectedPartnersData.length > 0 && (
            <>
              <Column className="col-margin" lg={16}>
                <p id={`preview-group-list-label`} className="rollout-list-text">
                  Partners
                </p>
              </Column>
              {rolloutPartnersData?.selectedPartnersData.map((item) => {
                return (
                  <Column className="col-margin" lg={16}>
                    <Checkbox
                      id={`preview-${item.partnerUniqueId}`}
                      labelText={item.nameOfCompany}
                      checked={selectedPartners.includes(item.partnerUniqueId)}
                      onChange={() => handleCheck(item)}
                    />
                  </Column>
                );
              })}
            </>
          )}
          {rolloutPartnersData?.selectedAttributesData.length > 0 && (
            <>
              <Column className="col-margin" lg={16}>
                <p id={`group-list-label`} className="rollout-list-text">
                  Attributes
                </p>
              </Column>
              {rolloutPartnersData?.selectedAttributesData.map((item) => {
                return (
                  <Column className="col-margin" lg={16}>
                    <Checkbox id={`preview-${item.attributeTypeKey}`} labelText={item.attrValue} />
                  </Column>
                );
              })}
            </>
          )}
          {rolloutPartnersData?.selectedGroupsData.length > 0 && (
            <>
              <Column className="col-margin" lg={16}>
                <p id={`group-list-label`} className="rollout-list-text">
                  Group
                </p>
              </Column>
              {rolloutPartnersData?.selectedGroupsData.map((item) => {
                return (
                  <Column className="col-margin" lg={16}>
                    <Checkbox id={`preview-${item.key}`} labelText={item.value} />
                  </Column>
                );
              })}
            </>
          )}
        </Grid>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1rem' }}>
            <div style={{ fontWeight: '600', fontSize: '18px' }}>
              {selectedViewData?.firstName} {selectedViewData?.lastName} Details
            </div>
            <div className="close-icon" aria-label="close" onClick={onClose}>
              <CrossIcon />
            </div>
          </div>
          <Tabs>
            <TabList aria-label="List of tabs">
              <Tab>Organization</Tab>
              <Tab>Administrators</Tab>
              <Tab>Users</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Accordion>
                  <AccordionItem title="Partner Organization Information">
                    <div style={{ marginLeft: '5rem' }}>
                      <div>
                        <strong>Partner Key</strong>
                      </div>
                      <div>{selectedViewData?.partnerKey ? selectedViewData?.partnerKey : 'None'}</div>
                      <div>
                        <strong>Partner Unique ID</strong>
                      </div>
                      <div>{selectedViewData?.partnerUniqueId ? selectedViewData?.partnerUniqueId : 'None'}</div>
                      <div>
                        <strong>Name of Company</strong>
                      </div>
                      <div>{selectedViewData?.nameOfCompany ? selectedViewData?.nameOfCompany : 'None'}</div>
                      <div>
                        <strong>Street address and PO Box </strong>
                      </div>
                      <div>{selectedViewData?.streetAddress ? selectedViewData?.streetAddress : 'None'}</div>
                      <div><strong>Zip / Postal Code</strong></div>
                      <div>{selectedViewData?.zipCode ? selectedViewData?.zipCode : 'None'}</div>
                      <div>
                        <strong>Headquaters Phone</strong>
                      </div>
                      <div>{selectedViewData?.headOfficePhone ? selectedViewData?.headOfficePhone : 'None'}</div>
                      <div>
                        <strong>Website</strong>
                      </div>
                      <div>{'None'}</div>
                      <div>
                        <strong>Invite Status</strong>
                      </div>
                      <div>{selectedViewData?.status?.display ? selectedViewData?.status?.display : 'None'}</div>
                    </div>
                  </AccordionItem>
                  <AccordionItem title="Account Information">
                    <div style={{ marginLeft: '5rem' }}>
                      <div>
                        <strong>User ID (Email)</strong>
                      </div>
                      <div>{selectedViewData?.userId ? selectedViewData?.userId : 'None'}</div>
                      <div><strong>Given name</strong></div>
                      <div>{selectedViewData?.firstName ? selectedViewData?.firstName : 'None'}</div>
                      <div><strong>Surname</strong></div>
                      <div>{selectedViewData?.lastName ? selectedViewData?.lastName : 'None'}</div>
                      <div><strong>Business role/Title </strong></div>
                      <div>{'None'}</div>
                      <div><strong>Alternate email</strong></div>
                      <div>{'None'}</div>
                      <div><strong>Phone (Office)</strong></div>
                      <div>{selectedViewData?.officePhone ? selectedViewData?.officePhone : 'None'}</div>
                      <div><strong>Phone (Mobile)</strong></div>
                      <div>{'None'}</div>
                      <div><strong>Other contact information</strong></div>
                      <div>{'None'}</div>
                    </div>
                  </AccordionItem>
                </Accordion>
              </TabPanel>
              <TabPanel>
                <div>
                  <div style={{ border: '1px solid red', background: '', marginInlineEnd: '20rem' }}>
                    <div style={{ marginLeft: '3.5rem', marginTop: '1.5rem' }}>
                      <div><strong>Given name</strong></div>
                      <div>{selectedViewData?.firstName ? selectedViewData?.firstName : 'None'}</div>
                      <div><strong>Surname</strong></div>
                      <div>{selectedViewData?.lastName ? selectedViewData?.lastName : 'None'}</div>
                      <div><strong>Business role/Title </strong></div>
                      <div>{'None'}</div>
                      <div><strong>Alternate email</strong></div>
                      <div>{'None'}</div>
                      <div><strong>Phone (Office)</strong></div>
                      <div>{selectedViewData?.officePhone ? selectedViewData?.officePhone : 'None'}</div>
                      <div><strong>Phone (Mobile)</strong></div>
                      <div>{'None'}</div>
                      <div><strong>Other contact info</strong></div>
                      <div>{'None'}</div>
                      <div><strong>Comments</strong></div>
                      <div>{'None'}</div>
                    </div>
                  </div>

                </div>
              </TabPanel>
              <TabPanel>
                <div>Users</div>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </>
      )}
    </>
  );
}
