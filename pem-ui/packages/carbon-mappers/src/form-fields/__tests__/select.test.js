import { render, screen } from '@testing-library/react';
import { FORM_FIELD_TYPE } from '../../constant';
import Select from '../select';
import { createContainer } from '../../utils/test-helper';

let container;

describe('Select', () => {
  beforeEach(() => {
    container = createContainer();
  });

  afterEach(function () {
    container.remove();
  });

  it('should render', () => {
    // when;
    render(getComponent());

    // then
    expect(screen.getByTestId('test-select')).toBeInTheDocument();

    const checkSelect = screen.getByRole('option');

    expect(checkSelect).toBeInTheDocument();

    const checkSelectLabel = screen.getByText('Select Label');
    expect(checkSelectLabel).toBeInTheDocument();
  });

  it('should render required label', function () {
    // when
    render(getComponent({ isRequired: true }));

    // then
    const checkSelectLabel = screen.getByText('*');
    expect(checkSelectLabel).toBeInTheDocument();
  });

  it('should render helper text', function () {
    // when
    render(getComponent({ helperText: 'helperText' }));

    // then
    const checkSelectHelperText = screen.getByText('helperText');
    expect(checkSelectHelperText).toBeInTheDocument();
  });
});

const getComponent = (props) => {
  const defaultField = {
    id: 'test-select',
    type: FORM_FIELD_TYPE.SELECT,
    labelText: 'Select Label',
    ...props
  };
  return <Select field={defaultField} />;
};
