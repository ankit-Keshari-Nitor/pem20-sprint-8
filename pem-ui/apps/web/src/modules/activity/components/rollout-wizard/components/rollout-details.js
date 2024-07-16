import React from 'react';
import { Information } from '@carbon/icons-react';
import { Grid, Column, TextArea, TextInput, DatePicker, DatePickerInput, Button, Tooltip, RadioButtonGroup, RadioButton, Tag } from '@carbon/react';

import './../../style.scss';

export default function RolloutDetails(props) {
  const { rolloutDetails, setRolloutDetails, handleAddClick, formErrors, rolloutPartnersData } = props;
  const rolloutPartnersDataLength =
    rolloutPartnersData.selectedGroupsData.length + rolloutPartnersData.selectedAttributesData.length + rolloutPartnersData.selectedPartnersData.length;

  return (
    <>
      <Grid className="define-grid">
        {/* Name */}
        <Column className="col-margin" lg={12}>
          <TextInput
            id="name"
            required
            pattern="/^[^&<>'.{}]+$/i"
            data-testid="name"
            labelText="Name (required)"
            placeholder={'Enter Name'}
            invalidText={'Name is required.'}
            invalid={formErrors.name}
            value={rolloutDetails.name}
            onChange={(e) => setRolloutDetails((prev) => ({ ...prev, name: e.target.value }))}
          />
        </Column>
        {/* Description */}
        <Column className="col-margin" lg={12}>
          <TextArea
            id="description"
            data-testid="description"
            labelText="Description"
            rows={3}
            enableCounter={true}
            counterMode="character"
            maxCount={100}
            minLength={10}
            rules={{ required: false, minLength: 20, maxLength: 100 }}
            invalidText={'Description must be at least 20 characters long.'}
            invalid={formErrors.description}
            value={rolloutDetails.description}
            placeholder={'Enter Description'}
            onChange={(e) => setRolloutDetails((prev) => ({ ...prev, description: e.target.value }))}
          />
        </Column>
        {/*   Click to check Context Data Button */}
        <Column className="col-margin" lg={16}>
          <Button kind="tertiary" size="md">
            View Context Data
          </Button>
        </Column>
        {/*  Due Date */}
        <Column className="col-margin" lg={4}>
          <DatePicker
            datePickerType="single"
            value={rolloutDetails.dueDate}
            minDate={new Date().setDate(new Date().getDate())}
            onChange={(e) =>
              setRolloutDetails((prev) => ({
                ...prev,
                dueDate: e.target.value
              }))
            }
          >
            <DatePickerInput
              id="due_date"
              data-testid="due-date"
              labelText={
                <>
                  Due Date&nbsp;
                  <Tooltip align="right" label="Due date cannot be earlier than today.">
                    <Information />
                  </Tooltip>
                </>
              }
              placeholder="mm/dd/yyyy"
              size="md"
            />
          </DatePicker>
        </Column>
        {/*  Alert Date */}
        <Column className="col-margin" lg={4}>
          <DatePicker
            datePickerType="single"
            value={rolloutDetails.alertDate}
            minDate={new Date().setDate(new Date().getDate() + 2)}
            onChange={(e) =>
              setRolloutDetails((prev) => ({
                ...prev,
                alertDate: e.target.value
              }))
            }
          >
            <DatePickerInput
              id="alert_date"
              data-testid="alert-date"
              labelText={
                <>
                  Alert Date&nbsp;
                  <Tooltip
                    align="right"
                    label="Alert date cannot be today or earlier than today. Cannot be same or later than due date. Email alert notifications are sent to partners."
                  >
                    <Information />
                  </Tooltip>
                </>
              }
              placeholder="mm/dd/yyyy"
              size="md"
            />
          </DatePicker>
        </Column>
        {/*   Alert Interval */}
        <Column className="col-margin" lg={4}>
          <TextInput
            id="alert_interval"
            data-testid="alert-interval"
            labelText={
              <>
                Alert Interval&nbsp;
                <Tooltip align="right" label="Specify the alert email frequency in days. Enter the alert interval value in the range 1 - 99 days.">
                  <Information />
                </Tooltip>
              </>
            }
            placeholder={'Enter days'}
            invalidText={'Alert interval days should be between 1 and 99.'}
            invalid={formErrors.alertInterval}
            value={rolloutDetails.alertInterval}
            onChange={(e) =>
              setRolloutDetails((prev) => ({
                ...prev,
                alertInterval: e.target.value
              }))
            }
          />
        </Column>
        {/*   Rolling out to */}
        <Column className="col-margin" lg={12}>
          <RadioButtonGroup
            legendText="Rolling out to"
            data-testid="rolling-out"
            name="rolling-out"
            onChange={(value) => {
              setRolloutDetails((prev) => ({ ...prev, rollingOutTo: value }));
            }}
            value={rolloutDetails.rollingOutTo}
            //defaultChecked={true}
          >
            <RadioButton labelText="Partners" value="partners" id="partners" />
            <RadioButton labelText="Internal Users" value="internal_users" id="internal_users" checked />
          </RadioButtonGroup>
        </Column>
        {/*  Partner, Groups and Attributes */}
        {rolloutDetails.rollingOutTo === 'partners' && (
          <Column className="partners_rollout-container" lg={12}>
            {rolloutPartnersDataLength === 0 ? (
              <>
                <TextArea
                  id="partners_rollout"
                  data-testid="partners_rollout"
                  labelText="Partner, Groups and Attributes (required)"
                  invalidText={'Partner, Groups and Attributes are required'}
                  invalid={formErrors.partnersDetails}
                  required
                  placeholder={'Click on add button to Partners, Attributes and Groups '}
                  rows={3}
                />
              </>
            ) : (
              <div className="partners_tags">
                {rolloutPartnersData.selectedPartnersData.length > 0 && (
                  <>
                    {rolloutPartnersData.selectedPartnersData.map((item) => {
                      return (
                        <Tag className="some-class" type="blue" id={`tag-${item.partnerUniqueId}`} onClose={() => console.log('test')}>
                          {item.firstName + ' ' + item.lastName}
                        </Tag>
                      );
                    })}
                  </>
                )}
                {rolloutPartnersData.selectedAttributesData.length > 0 && (
                  <>
                    {rolloutPartnersData.selectedAttributesData.map((item) => {
                      return (
                        <Tag className="some-class" type="blue" id={`tag-${item.attributeTypeKey}`} onClose={() => console.log('test')}>
                          {item.attrValue}
                        </Tag>
                      );
                    })}
                  </>
                )}
                {rolloutPartnersData.selectedGroupsData.length > 0 && (
                  <>
                    {rolloutPartnersData.selectedGroupsData.map((item) => {
                      return (
                        <Tag className="some-class" type="blue" id={`tag-${item.key}`} onClose={() => console.log('test')}>
                          {item.value}
                        </Tag>
                      );
                    })}
                  </>
                )}
              </div>
            )}
            <Button className="add-button" kind="secondary" onClick={handleAddClick}>
              Add
            </Button>
          </Column>
        )}
      </Grid>
    </>
  );
}
