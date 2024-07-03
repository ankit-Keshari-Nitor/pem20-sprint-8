import React from 'react';
import { Grid, Column, TextArea, TextInput, DatePicker, DatePickerInput, Button, Tooltip, RadioButtonGroup, RadioButton, NumberInput } from '@carbon/react';
import './../style.scss';
import { Information } from '@carbon/icons-react';

export default function RolloutDetails(props) {
  const { rolloutDetails, setRolloutDetails, handleAddClick } = props;

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
            value={rolloutDetails.name}
            onChange={(e) => setRolloutDetails((prev) => ({ ...prev, name: e.target.value }))}
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
            value={rolloutDetails.description}
            placeholder={'Enter Description'}
            onChange={(e) => setRolloutDetails((prev) => ({ ...prev, description: e.target.value }))}
          />
        </Column>
        {/*  Due Date */}
        <Column className="col-margin" lg={8}>
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
        <Column className="col-margin" lg={8}>
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
        <Column className="col-margin" lg={16}>
          <NumberInput
            id="alert_interval"
            data-testid="alert-interval"
            min={0}
            max={99}
            value={rolloutDetails.alertInterval}
            label={
              <>
                Alert Interval&nbsp;
                <Tooltip align="right" label="Specify the alert email frequency in days. Enter the alert interval value in the range 1 - 99 days.">
                  <Information />
                </Tooltip>
              </>
            }
            placeholder={'Enter days'}
            onChange={(e) =>
              setRolloutDetails((prev) => ({
                ...prev,
                alertInterval: e.target.value
              }))
            }
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
            <RadioButton labelText="Partners" value="partners" id="partners" checked />
            <RadioButton labelText="Internal Users" value="internal_users" id="internal_users" />
          </RadioButtonGroup>
        </Column>
        {/*  Partner, Groups and Attributes */}
        {rolloutDetails.rollingOutTo === 'partners' && (
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
    </>
  );
}
