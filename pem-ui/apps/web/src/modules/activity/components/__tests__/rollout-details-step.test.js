import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import RolloutDetails from '../rollout-wizard/elements/rollout-details-step';

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
    const checkDateInput = screen.getByLabelText(/Due Date/);
    expect(checkDateInput).toBeInTheDocument();
  });

  it('should render Alert Date label', function () {
    // when;
    render(getComponent());

    // then
    const checkDueDateInput = screen.getByLabelText(/Alert Date/);
    expect(checkDueDateInput).toBeInTheDocument();
  });

  it('should render Alert Interval label', function () {
    // when;
    render(getComponent());

    // then
    const checkAlertIntervalDateInput = screen.getByLabelText(/Alert Interval/);
    expect(checkAlertIntervalDateInput).toBeInTheDocument();
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
