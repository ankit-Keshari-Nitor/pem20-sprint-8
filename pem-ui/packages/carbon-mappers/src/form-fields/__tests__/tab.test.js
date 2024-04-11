import { render, screen } from '@testing-library/react';
import CustomTab from '../tab';
import { FORM_FIELD_TYPE } from '../../constant';
import { createContainer } from '../../utils/test-helper';

let container;

describe('CustomTab', () => {
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
    expect(screen.getByTestId('test-tab')).toBeInTheDocument();

    const checkTab = screen.getByRole('tab');

    expect(checkTab).toBeInTheDocument();

    const checkTabLabel = screen.getByText('CustomTab Label');
    expect(checkTabLabel).toBeInTheDocument();
  });
});

const getComponent = (props) => {
  const defaultField = {
    id: 'test-tab',
    type: FORM_FIELD_TYPE.TAB,
    labelText: 'CustomTab Label',
    ...props
  };
  return <CustomTab field={defaultField} />;
};
