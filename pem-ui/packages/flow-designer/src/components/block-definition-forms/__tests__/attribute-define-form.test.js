import { render, screen } from '@testing-library/react';
import { createContainer } from '../../../utils/test-helper';
import AttributeDefineForm from '../attribute-task-definition/attribute-define-form';

let container;

describe('AttributeDefineForm', () => {
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

  it('should render Attribut type label', function () {
    // when;
    render(getComponent());

    // then
    const checkSelectLabel = screen.getByText('Attribut Type*');
    expect(checkSelectLabel).toBeInTheDocument();
  });

  it('should render Attribut value label', function () {
    // when;
    render(getComponent());

    // then
    const checkSelectLabel = screen.getByText('Attribut Value*');
    expect(checkSelectLabel).toBeInTheDocument();
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
  return <AttributeDefineForm id={'test-define-form-render'} />;
};
