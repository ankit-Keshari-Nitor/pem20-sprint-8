import React from 'react';
import { Form, Grid, Column, TextArea, TextInput, DatePicker, DatePickerInput, Link, Tooltip } from '@carbon/react';
import { useForm } from 'react-hook-form';
import './style.scss';
import { Information } from '@carbon/icons-react';

export default function RolloutDetails({ id, onSubmit }) {
  const {
    register,
    formState: { errors },
    handleSubmit
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      name: '',
      description: '',
      due_date: '',
      alert_date: '',
      alert_interval: ''
    }
  });

  return (
    <>
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
              invalidText={errors.description?.message}
              invalid={errors.description ? true : false}
              placeholder={'Enter Description'}
              {...register('description')}
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
                    <Tooltip align="top" label="Due date cannot be earlier than today.">
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
                      align="top"
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
                  <Tooltip align="top" label="Specify the alert email frequency in days. Enter the alert interval value in the range 1 - 99 days.">
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
            <Link href="#">Click to check Context Data</Link>
          </Column>
        </Grid>
      </Form>
    </>
  );
}
