import { render, screen } from '@testing-library/react';
import { FORM_FIELD_TYPE } from '../../constant';
import Datepicker from '../datepicker';
import { createContainer } from '../../utils/test-helper';

let container;

describe('Datepicker', () => {
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
    expect(screen.getByTestId('test-datepicker')).toBeInTheDocument();

    const checkDatepickerLabel = screen.getByText('Datepicker Label');
    expect(checkDatepickerLabel).toBeInTheDocument();
  });

  it('should render required label', function () {
    // when
    render(getComponent({ isRequired: true }));

    // then
    const checkDatepickerLabel = screen.getByText('*');
    expect(checkDatepickerLabel).toBeInTheDocument();
  });

  it('should render helper text', function () {
    // when
    render(getComponent({ helperText: 'helperText' }));

    // then
    const checkDatepickerHelperText = screen.getByText('helperText');
    expect(checkDatepickerHelperText).toBeInTheDocument();
  });
});

const getComponent = (props) => {
  const defaultField = {
    id: 'test-datepicker',
    type: FORM_FIELD_TYPE.DATEPICKER,
    labelText: 'Datepicker Label',
    ...props
  };
  return <Datepicker field={defaultField} />;
};
