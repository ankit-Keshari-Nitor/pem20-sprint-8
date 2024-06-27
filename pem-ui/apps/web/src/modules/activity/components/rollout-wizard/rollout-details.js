import React, { useState } from 'react';
import { Grid, Column, TextArea, TextInput, DatePicker, DatePickerInput, Button, Tooltip, RadioButtonGroup, RadioButton, NumberInput } from '@carbon/react';
import './../style.scss';
import { Information } from '@carbon/icons-react';

export default function RolloutDetails({ handleAddClick }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [alertDate, setAlertDate] = useState(new Date());
  const [alertInterval, setAlertInterval] = useState(0);
  const [rollingOut, setRollingOut] = useState('partners');

  const [openAddModal, setOpenAddModal] = useState(false);
  const [rolloutGapData, setRolloutGapData] = useState({ selectedGroupsData: [], selectedAttributesData: [], selectedPartnersData: [] });


  // Handler for actual delete API call
  const getActivityDetails = async (id) => {
    try {
      const responseMsg = await ActivityService.getActivityDetails(id);
      if (responseMsg) {
        return responseMsg;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Failed to get activity details:', error);
      return null;
    }
  };

  // Function to handle the Next/rollout Button Click
  const handleBackToDetails = () => {
    setOpenAddModal(false);
    setOpenRolloutModal(true);
  };

  const handleAddGroups = (selectedGroupsData) => {
    setRolloutGapData((prev) => ({ ...prev, selectedGroupsData: [...selectedGroupsData] }));
  };

  const handleAddAttributes = (selectedAttributesData) => {
    setRolloutGapData((prev) => ({ ...prev, selectedAttributesData: [...selectedAttributesData] }));
  };

  const handleAddPartners = (selectedPartnersData) => {
    setRolloutGapData((prev) => ({ ...prev, selectedPartnersData: [...selectedPartnersData] }));
  };

  return (
    <>
    <Grid className="define-grid">
      {/* Name */}
      <Column className="col-margin" lg={16}>
        <TextInput
          id="name"
          required
          pattern="/^[^&<>'.{}]+$/i"
          data-testid="name"
          labelText="Name (required)"
          placeholder={'Enter Name'}
          invalidText={'Test'}
          invalid={false}
          onChange={(e) => setName(e.target.value)}
        />
      </Column>
      {/* Description */}
      <Column className="col-margin" lg={16}>
        <TextArea
          id="description"
          data-testid="description"
          labelText="Description"
          rows={5}
          rules={{ required: false, minLength: 20, maxLength: 100 }}
          enableCounter={true}
          counterMode="character"
          maxCount={100}
          minLength={10}
          invalidText={'Test'}
          invalid={false}
          placeholder={'Enter Description'}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Column>
      {/*  Due Date */}
      <Column className="col-margin" lg={8}>
        <DatePicker datePickerType="single" value={dueDate} minDate={new Date().setDate(new Date().getDate())} onChange={setDueDate}>
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
      <Column className="col-margin" lg={8}>
        <DatePicker datePickerType="single" value={alertDate} minDate={new Date().setDate(new Date().getDate() + 2)} onChange={setAlertDate}>
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
      <Column className="col-margin" lg={16}>
        <NumberInput
          id="alert_interval"
          data-testid="alert-interval"
          min={0}
          max={99}
          value={alertInterval}
          label={
            <>
              Alert Interval&nbsp;
              <Tooltip align="right" label="Specify the alert email frequency in days. Enter the alert interval value in the range 1 - 99 days.">
                <Information />
              </Tooltip>
            </>
          }
          placeholder={'Enter days'}
          onChange={(e) => setAlertInterval(e.target.value)}
        />
      </Column>
      {/*   Click to check Context Data Button */}
      <Column className="col-margin" lg={16}>
        <Button kind="tertiary" size="md">
          Click to check Context Data
        </Button>
      </Column>
      {/*   Rolling out to */}
      <Column className="col-margin" lg={16}>
        <RadioButtonGroup legendText="Rolling out to" data-testid="rolling-out" name="rolling-out" onChange={setRollingOut} value={rollingOut} defaultChecked={true}>
          <RadioButton labelText="Partners" value="partners" id="partners" />
          <RadioButton labelText="Internal Users" value="internal_users" id="internal_users" />
        </RadioButtonGroup>
      </Column>
      {/*  Partner, Groups and Attributes */}
      {rollingOut === 'partners' && (
        <Column className="partners_rollout-container" lg={16}>
          <TextArea
            id="partners_rollout"
            data-testid="partners_rollout"
            labelText="Partner, Groups and Attributes (required)"
            invalidText={'Test'}
            invalid={false}
            required
            placeholder={'Partners and Groups, Attributes'}
          />
          <Button className="add-button" kind="secondary" onClick={handleAddClick}>
            Add
          </Button>
        </Column>
      )}
    </Grid>

    {/* Modal for Add Partners and Groups, Attributes */}
    {openAddModal && (
      <WrapperModal
        isOpen={openAddModal}
        modalHeading={activityDetails?.name}
        secondaryButtonText={'Back to Details'}
        primaryButtonText={'Save'}
        onPrimaryButtonClick={handleSubmitClick}
        onSecondaryButtonClick={handleBackToDetails}
        onRequestClose={() => setOpenAddModal(false)}
      >
        <RolloutTest handleAddGroups={handleAddGroups} handleAddAttributes={handleAddAttributes} handleAddPartners={handleAddPartners} rolloutGapData={rolloutGapData} />
      </WrapperModal>
    )}
    </>
  );
}
