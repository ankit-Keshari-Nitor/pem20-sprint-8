import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import RolloutDetails from '../rollout-details-step';

function createContainer() {
  const container = document.createElement('div');
  document.body.appendChild(container);
  return container;
}

let container;

describe('RolloutDetails Component', () => {
  beforeEach(() => {
    container = createContainer();
  });

  afterEach(function () {
    container.remove();
  });

  it('should Form render', () => {
    // when;
    render(getComponent());

    // then
    expect(screen.getByTestId('rollout-details-form')).toBeInTheDocument();
  });

  it('should render Name label', function () {
    // when;
    render(getComponent());

    // then
    const checkTextInput = screen.getAllByRole('textbox')[0];

    expect(checkTextInput).toBeInTheDocument();

    const checkTextInputLabel = screen.getByLabelText('Name (required)');
    expect(checkTextInputLabel).toBeInTheDocument();
  });

  it('should render Description label', function () {
    // when;
    render(getComponent());

    // then
    const checkTextInput = screen.getAllByRole('textbox')[1];

    expect(checkTextInput).toBeInTheDocument();

    const checkTextInputLabel = screen.getByLabelText('Description');
    expect(checkTextInputLabel).toBeInTheDocument();
  });

  it('should render Due Date label', function () {
    // when;
    render(getComponent());

    // then
    const checkDateInput = screen.getAllByRole('textbox')[1];

    expect(checkDateInput).toBeInTheDocument();

    const checkDateInputLabel = screen.getByLabelText('Due Date');
    expect(checkDateInputLabel).toBeInTheDocument();
  });

  it('should render Alert Date label', function () {
    // when;
    render(getComponent());

    // then
    const checkDueDateInput = screen.getAllByRole('textbox')[1];

    expect(checkDueDateInput).toBeInTheDocument();

    const checkDueDateInputLabel = screen.getByLabelText('Alert Date');
    expect(checkDueDateInputLabel).toBeInTheDocument();
  });

  it('should render Alert Interval label', function () {
    // when;
    render(getComponent());

    // then
    const checkAlertIntervalDateInput = screen.getAllByRole('textbox')[1];

    expect(checkAlertIntervalDateInput).toBeInTheDocument();

    const checkAlertIntervalDateInputLabel = screen.getByLabelText('Alert Interval');
    expect(checkAlertIntervalDateInputLabel).toBeInTheDocument();
  });

  it('should renderClick to check Context Data label', function () {
    // when;
    render(getComponent());

    // then
    const checkContextDataText = screen.getByText('Click to check Context Data');
    expect(checkContextDataText).toBeInTheDocument();
  });
});

const getComponent = () => {
  return <RolloutDetails id={'rollout-details-form'} />;
};
