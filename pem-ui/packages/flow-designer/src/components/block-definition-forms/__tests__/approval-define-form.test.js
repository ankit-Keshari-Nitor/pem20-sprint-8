import { render, screen } from '@testing-library/react';
import { createContainer } from '../../../utils/test-helper';
import ApprovalDefineForm from '../approval-task-definition/approval-define-form';

let container;

describe('ApprovalDefineForm', () => {
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

    const checkTextInputLabel = screen.getByText('Name*');
    expect(checkTextInputLabel).toBeInTheDocument();
  });

  it('should render Description label', function () {
    // when;
    render(getComponent());

    // then
    const checkTextInput = screen.getAllByRole('textbox')[1];

    expect(checkTextInput).toBeInTheDocument();

    const checkTextInputLabel = screen.getByText('Description');
    expect(checkTextInputLabel).toBeInTheDocument();
  });

  it('should render Estimate label', function () {
    // when;
    render(getComponent());

    // then
    const checkTextInput = screen.getAllByRole('textbox')[2];

    expect(checkTextInput).toBeInTheDocument();

    const checkTextInputLabel = screen.getByText('Estimate (Days)*');
    expect(checkTextInputLabel).toBeInTheDocument();
  });

  it('should render Task to reopen label', function () {
    // when;
    render(getComponent());

    // then
    const checkSelectLabel = screen.getByText('Select Task to reopen up to when rejecting');
    expect(checkSelectLabel).toBeInTheDocument();
  });

  it('should render Role label', function () {
    // when;
    render(getComponent());

    // then
    const checkSelectLabel = screen.getByText('Role');
    expect(checkSelectLabel).toBeInTheDocument();
  });

  it('should render Show to partner label', function () {
    // when;
    render(getComponent());

    // then
    const checkCheckbox = screen.getAllByRole('checkbox')[0];

    expect(checkCheckbox).toBeInTheDocument();

    const checkCheckboxLabel = screen.getByText('Show to partner');
    expect(checkCheckboxLabel).toBeInTheDocument();
  });

  it('should render Auto approval warning label', function () {
    // when;
    render(getComponent());

    // then
    const checkCheckbox = screen.getAllByRole('checkbox')[1];

    expect(checkCheckbox).toBeInTheDocument();

    const checkCheckboxLabel = screen.getByText('Enable auto approval warning');
    expect(checkCheckboxLabel).toBeInTheDocument();
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
});

const getComponent = () => {
  return <ApprovalDefineForm id={'test-define-form-render'} />;
};
