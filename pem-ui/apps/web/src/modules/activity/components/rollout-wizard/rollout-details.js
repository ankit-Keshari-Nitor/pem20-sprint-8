import React, { useState } from 'react';
import { Form, Grid, Column, TextArea, TextInput, DatePicker, DatePickerInput, Button, Tooltip, RadioButtonGroup, RadioButton } from '@carbon/react';
import './../style.scss';
import { Information } from '@carbon/icons-react';

export default function RolloutDetails({ id, handleAddClick, register, handleSubmit, errors, onSubmit }) {
  const [isPartners, setIsPartners] = useState(true);

  const onChangeRollingOut = (value) => {
    value === 'partners' ? setIsPartners(true) : setIsPartners(false);
  };

  return (
    <Form aria-label="rollout-details-form" name="rollout-details-form" data-testid={id} onSubmit={handleSubmit(onSubmit)}>
      <Grid className="define-grid">
        <Column className="col-margin" lg={16}>
          <TextInput
            id="name"
            data-testid="name"
            labelText="Name (required)"
            invalidText={errors.name?.message}
            invalid={errors.name ? true : false}
            placeholder={'Enter Name'}
            {...register('name', {
              required: 'Name is required',
              pattern: { value: /^[^&<>"'.{}]+$/i, message: 'Name should not contain &,<,>,",\',.,{,}, characters.' },
              maxLength: { value: 100, message: 'Name must be no longer then 100 characters' }
            })}
          />
        </Column>
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
            invalidText={errors.description?.message}
            invalid={errors.description ? true : false}
            placeholder={'Enter Description'}
            {...register('description', {
              minLength: { value: 20, message: 'Description must be no lesser then 20 characters' },
              maxLength: { value: 100, message: 'Description must be no longer then 100 characters' }
            })}
          />
        </Column>
        <Column className="col-margin" lg={8}>
          <DatePicker datePickerType="single">
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
              {...register('due_date')}
            />
          </DatePicker>
        </Column>
        <Column className="col-margin" lg={8}>
          <DatePicker datePickerType="single">
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
              {...register('alert_date')}
            />
          </DatePicker>
        </Column>
        <Column className="col-margin" lg={16}>
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
            invalidText={errors.alert_interval?.message}
            invalid={errors.alert_interval ? true : false}
            placeholder={'Enter days'}
            {...register('alert_interval', {
              pattern: { value: /^\d+$/i, message: 'Alert Interval should be only number.' }
            })}
          />
        </Column>
        <Column className="col-margin" lg={16}>
          <Button kind="tertiary" size="md">
            Click to check Context Data
          </Button>
        </Column>
        <Column className="col-margin" lg={16}>
          <RadioButtonGroup legendText="Rolling out to" data-testid="rolling-out" name="rolling-out" onChange={onChangeRollingOut}>
            <RadioButton labelText="Partners" value="partners" id="partners" {...register('rolling_out')} />
            <RadioButton labelText="Internal Users" value="internal_users" id="internal_users" {...register('rolling_out')} />
          </RadioButtonGroup>
        </Column>
        {isPartners && (
          <Column className="partners_rollout-container" lg={16}>
            <TextArea
              id="partners_rollout"
              data-testid="partners_rollout"
              labelText="Partner, Groups and Attributes (required)"
              invalidText={errors.partners_rollout?.message}
              invalid={errors.partners_rollout ? true : false}
              placeholder={'Partners and Groups, Attributes'}
              {...register('partners_rollout', {
                required: 'Partners and Groups, Attributes is required'
              })}
            />
            <Button className="add-button" kind="secondary" onClick={handleAddClick}>
              Add
            </Button>
          </Column>
        )}
        <Column className="col-margin" lg={16}>
          <Button size="md" type="submit">
            Save
          </Button>
        </Column>
      </Grid>
    </Form>
  );
}
