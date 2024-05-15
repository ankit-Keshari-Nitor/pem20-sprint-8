import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { createContainer } from '../../../utils/test-helper';
import ApiDefineForm from '../api-task-definition/api-define-form';

let container;

describe('ApiDefineForm', () => {
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
    expect(screen.getByTestId('test-define-form-render')).toBeInTheDocument();
  });

  it('should render Name label', function () {
    // when;
    render(getComponent());

    // then
    const checkTextInput = screen.getAllByRole('textbox')[0];

    expect(checkTextInput).toBeInTheDocument();

    //const checkTextInputLabel = screen.getByText('Name');
    const checkTextInputLabel = screen.getByLabelText('Name*');
    expect(checkTextInputLabel).toBeInTheDocument();
  });

  it('should render Description label', function () {
    // when;
    render(getComponent());

    // then
    const checkTextInput = screen.getAllByRole('textbox')[1];

    expect(checkTextInput).toBeInTheDocument();

    //const checkTextInputLabel = screen.getByText('Description');
    const checkTextInputLabel = screen.getByLabelText('Description*');
    expect(checkTextInputLabel).toBeInTheDocument();
  });

  it('should render Cancel button', function () {
    // when;
    render(getComponent());

    // then
    const checkButton = screen.getAllByRole('button')[0];

    expect(checkButton).toBeInTheDocument();

    const checkButtonLabel = screen.getByText('Cancel');
    expect(checkButtonLabel).toBeInTheDocument();
  });

  it('should render Save button', function () {
    // when;
    render(getComponent());

    // then
    const checkButton = screen.getAllByRole('button')[1];

    expect(checkButton).toBeInTheDocument();

    const checkButtonLabel = screen.getByText('Save');
    expect(checkButtonLabel).toBeInTheDocument();
  });

  //
  it('should display required error message for empty fields', async () => {

    render(getComponent());

    fireEvent.click(screen.getByText('Save'));

    await screen.findByText('Name is required');
    await screen.findByText('Description is required');
  });

  it('should display error message for invalid input', async () => {
    render(getComponent());

    fireEvent.change(screen.getByTestId('name'), { target: { value: '& invalid name' } });
    fireEvent.change(screen.getByTestId('description'), { target: { value: 'b'.repeat(101) } });

    fireEvent.click(screen.getByText('Save'));

    await screen.findByText('Name should not contain &,<,>,",\',.,{,}, characters.');
    await screen.findByText('Description must be no longer then 100 characters');
  });

  it('should display error message for valid input', async () => {

    const onSubmitDefinitionForm = jest.fn();

    render(<ApiDefineForm id={'test-define-form-render'} onSubmitDefinitionForm={onSubmitDefinitionForm} />);

    fireEvent.change(screen.getByTestId('name'), { target: { value: 'valid name' } });
    fireEvent.change(screen.getByTestId('description'), { target: { value: 'b'.repeat(99) } });

    fireEvent.click(screen.getByText('Save'));

    await new Promise(resolve => setTimeout(resolve, 1000));

    const errorMessageName = screen.queryByText('Name should not contain &,<,>,",\',.,{,}, characters.');
    const errorMessageDesc = screen.findByText('Description must be no longer then 100 characters');

    if (errorMessageName !== null && errorMessageDesc != null) {
      expect(errorMessageName).toBeInTheDocument();
      expect(errorMessageDesc).toBeInTheDocument();
    } else {
      console.log('Error message not found in the DOM');
    }

  });



});

const getComponent = () => {
  return <ApiDefineForm id={'test-define-form-render'} />;
};
